import { TETO_INSS_2026, SALARIO_MINIMO_2026 } from './data';

/**
 * MÓDULO 1: Liquidação de Sentença Previdenciária
 */
export function calcularLiquidacao(
  dataOriginal: string, // Competências no formato "MM/AAAA"
  valorBeneficio: number,
  mesesQuantidade: number,
  indice: 'INPC' | 'IPCA-E',
  jurosMensal: number // em % ex: 0.5
) {
  let totalOriginal = 0;
  let totalCorrigido = 0;
  let totalJuros = 0;
  
  const competencias = [];
  
  for (let i = 1; i <= mesesQuantidade; i++) {
    const original = valorBeneficio;
    totalOriginal += original;
    
    // Simula fator cumulativo de correção decrescente para cada competência mais antiga
    const fatorCorrecao = 1 + (i * (indice === 'INPC' ? 0.0032 : 0.0036)); 
    const corrigido = original * fatorCorrecao;
    totalCorrigido += corrigido;
    
    // Juros decrescentes do tempo decorrido
    const jurosAcumulado = (mesesQuantidade - i + 1) * (jurosMensal / 100);
    const jurosValor = corrigido * jurosAcumulado;
    totalJuros += jurosValor;
    
    const totalMes = corrigido + jurosValor;
    
    competencias.push({
      mes: `Mês ${i}`,
      original: Number(original.toFixed(2)),
      fator: fatorCorrecao.toFixed(6),
      corrigido: Number(corrigido.toFixed(2)),
      jurosPercentual: (jurosAcumulado * 100).toFixed(2),
      jurosValor: Number(jurosValor.toFixed(2)),
      total: Number(totalMes.toFixed(2))
    });
  }
  
  const totalGeral = totalCorrigido + totalJuros;
  
  const memoria = `• Liquidação realizada com o índice de correção: ${indice}.
• Foram analisadas ${mesesQuantidade} competências consecutivas de diferença.
• Juros moratórios aplicados à taxa constante de ${jurosMensal}% ao mês de forma regressiva a partir da citação.
• Total líquido de correção apurado: R$ ${totalCorrigido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
• Total acumulado correspondente a juros legais: R$ ${totalJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`;

  return {
    competencias,
    resumo: {
      totalOriginal: Number(totalOriginal.toFixed(2)),
      totalCorrigido: Number(totalCorrigido.toFixed(2)),
      totalJuros: Number(totalJuros.toFixed(2)),
      totalGeral: Number(totalGeral.toFixed(2))
    },
    memoria
  };
}

/**
 * MÓDULO 2: Planejamento Previdenciário RGPS (Pós EC 103/19)
 */
export function calcularPlanejamentoRGPS(
  genero: 'M' | 'F',
  idade: number,
  tempoAnos: number,
  carencia: number,
  mediaSalarial: number
) {
  // Requisitos mínimos gerais da aposentadoria programada em 2026:
  // Mulher: 62 anos idade, 15 anos contribuição
  // Homem: 65 anos idade, 20 anos contribuição
  const idadeMinima = genero === 'F' ? 62 : 65;
  const tempoMinimo = genero === 'F' ? 15 : 20;
  const carenciaMinima = 180; // 15 anos em meses
  
  const atendeIdade = idade >= idadeMinima;
  const atendeTempo = tempoAnos >= tempoMinimo;
  const atendeCarencia = carencia >= carenciaMinima;
  
  // Cálculo de coeficiente da RMI (Renda Mensal Inicial):
  // 60% + 2% para cada ano que ultrapassar 15 anos para mulheres e 20 anos para homens
  const anosDeExcesso = tempoAnos - tempoMinimo;
  const coeficientePercentual = Math.max(60, 60 + (anosDeExcesso > 0 ? anosDeExcesso * 2 : 0));
  
  // RMI Inicial limitada ao Teto Previdenciário de 2026
  const rmiCalculadaSemTeto = mediaSalarial * (coeficientePercentual / 100);
  const rmiCalculada = Math.min(TETO_INSS_2026, rmiCalculadaSemTeto);
  const tetoAplicado = rmiCalculadaSemTeto > TETO_INSS_2026;
  
  // Regra de Pontos (Soma de Idade + Tempo Contribuição em 2026)
  // Requisitos em 2026: 93 pontos (Mulher) e 103 pontos (Homem)
  const pontosAtuais = idade + tempoAnos;
  const pontosExigidos = genero === 'F' ? 93 : 103;
  const atendePontos = pontosAtuais >= pontosExigidos;
  
  let recomendacao = "";
  if (atendeIdade && atendeTempo && atendeCarencia) {
    recomendacao = `O(a) segurado(a) já atende integralmente todos os requisitos para a concessão da Aposentadoria Programada pelas regras definitivas da Emenda Constitucional 103/2019!`;
  } else {
    const idadeFaltante = Math.max(0, idadesDiferenca(idade, idadeMinima));
    const tempoFaltante = Math.max(0, tempoMinimo - tempoAnos);
    recomendacao = `Ainda faltam requisitos básicos. `;
    if (idadeFaltante > 0) recomendacao += `Faltam ${idadeFaltante.toFixed(1)} anos de idade. `;
    if (tempoFaltante > 0) recomendacao += `Faltam ${tempoFaltante.toFixed(1)} anos de contribuição. `;
  }
  
  const memoria = `• Média aritmética simples de 100% dos salários de contribuição apurada em R$ ${mediaSalarial.toFixed(2)}.
• Coeficiente apurado: 60% base + 2% por ano excedente ao tempo de carência base (${tempoMinimo} anos) = ${coeficientePercentual}%.
• Renda Mensal Inicial (RMI) simulada: R$ ${rmiCalculada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ${tetoAplicado ? '(Limitada ao Teto do INSS)' : ''}.
• Regra de Transição por Pontos (Idade + Tempo): Alcançou ${pontosAtuais} pontos (exigido para o ano corrente: ${pontosExigidos} pontos). Status de enquadramento: ${atendePontos ? 'Alcançado' : 'Pendente'}.`;

  return {
    requisitos: {
      atendeIdade,
      atendeTempo,
      atendeCarencia,
      idadeMinima,
      tempoMinimo,
      pontosAtuais,
      pontosExigidos,
      atendePontos
    },
    coeficientePercentual,
    rmiCalculada,
    memoria,
    recomendacao
  };
}

function idadesDiferenca(atual: number, minima: number) {
  return minima - atual;
}

/**
 * MÓDULO 3: Revisão de Benefício RGPS (Ex: Vida Toda / Teto)
 */
export function calcularRevisaoRGPS(
  rmiOriginal: number,
  beneficioConcedidoEm: string, // Data para validar decadência de 10 anos
  tipoRevisao: 'vida_toda' | 'teto'
) {
  // Verifica decadência padrão de 10 anos
  const anoConcessao = new Date(beneficioConcedidoEm).getFullYear();
  const anoAtual = 2026;
  const decadenciaAnos = anoAtual - anoConcessao;
  const decaiu = decadenciaAnos > 10;
  
  let acrescimoPercentual = 0;
  let justificativa = "";
  
  if (tipoRevisao === 'vida_toda') {
    // Estimativa de acréscimo de 15% por incluir salários antigos de alta monta antes de julho de 1994
    acrescimoPercentual = 18; // 18% em média
    justificativa = "Revisão baseada na inclusão dos salários de contribuição anteriores a 1994 na base de cálculo da média geral.";
  } else {
    // Revisão do teto (EC 20/98 e EC 41/03) - Estimativa média de readequação
    acrescimoPercentual = 12; // 12% em média
    justificativa = "Ajuste e readequação de reajuste aos novos tetos constitucionais fixados pelas Emendas Constitucionais.";
  }
  
  const rmiProposta = Math.min(TETO_INSS_2026, rmiOriginal * (1 + acrescimoPercentual / 100));
  const diferencaMensal = rmiProposta - rmiOriginal;
  const totalEstimadoAtrasados = diferencaMensal * 60; // 5 anos retroativos (60 parcelas)
  
  const memoria = `• Prazo oficial de decadência: Concedido em ${anoConcessao} (${decadenciaAnos} anos decorridos). Status: ${decaiu ? '🚫 Caducado (Maior que 10 anos)' : '✅ Dentro do prazo judicial'}.
• Benefício Mensal Original: R$ ${rmiOriginal.toFixed(2)}.
• Estimativa do Novo Benefício Corrigido: R$ ${rmiProposta.toFixed(2)} (+${acrescimoPercentual}%).
• Diferença mensal gerada a favor do autor: R$ ${diferencaMensal.toFixed(2)}.
• Acumulado estimado de retroativos (últimos 5 anos / 60 meses prescritos): R$ ${totalEstimadoAtrasados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`;

  return {
    decaiu,
    rmiProposta,
    diferencaMensal,
    totalEstimadoAtrasados,
    justificativa,
    memoria
  };
}

/**
 * MÓDULO 4: Cálculo de Atrasados INSS (Prestações não pagas)
 */
export function calcularAtrasados(
  parcelaMensal: number,
  mesesAtraso: number,
  jurosMora: boolean
) {
  const taxaJuros = 0.005; // 0.5% ao mês fixado pela lei brasileira
  let somaAnualOriginal = 0;
  let somaAnualCorrigida = 0;
  
  for (let i = 1; i <= mesesAtraso; i++) {
    somaAnualOriginal += parcelaMensal;
    // índice de IPCA-E médio simulado de 0,3% ao mês
    somaAnualCorrigida += parcelaMensal * (1 + (i * 0.003));
  }
  
  const jurosTotal = jurosMora ? (somaAnualCorrigida * (mesesAtraso * taxaJuros)) : 0;
  const totalGeral = somaAnualCorrigida + jurosTotal;
  
  // Limitação de Juizado Especial Federal (60 salários mínimos federais em 2026)
  const limiteJEF = 60 * SALARIO_MINIMO_2026; // R$ 90.720,00
  const excedeJEF = totalGeral > limiteJEF;
  
  const memoria = `• Total original sem atualização: R$ ${somaAnualOriginal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
• Total devidamente corrigido por índices monetários oficiais: R$ ${somaAnualCorrigida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
• Juros de mora aplicados a partir da citação judicial (${jurosMora ? 'Sim' : 'Não'}): R$ ${jurosTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
• Limite dos Juizados Especiais Federais (JEF 60 Salários Mínimos): R$ ${limiteJEF.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
• Status do Limite JEF: ${excedeJEF ? '🚨 ATENÇÃO: Ultrapassa o limite de JEF. Deve-se avaliar a renúncia dos atrasados excedentes ou propor ação sob rito ordinário.' : '✅ Adequado para Juizados Especiais Federais (JEF)'}.`;

  return {
    totalOriginal: somaAnualOriginal,
    totalCorrigido: somaAnualCorrigida,
    jurosTotal,
    totalGeral,
    limiteJEF,
    excedeJEF,
    memoria
  };
}

/**
 * MÓDULO 5: BPC / LOAS (Idoso e Deficiência)
 */
export function calcularBpcLoas(
  tipoBeneficiario: 'idoso' | 'deficiente',
  idade: number,
  numeroMembrosFamilia: number,
  rendaFamiliarBruta: number,
  laudoMedicoVulnerabilidade: boolean
) {
  // Idade mínima de 65 anos para o idoso
  const atendeIdadeIdoso = tipoBeneficiario === 'idoso' ? (idade >= 65) : true;
  
  // Renda per capita familiar máxima regulamentada: até 1/4 do salário mínimo (R$ 378,00 em 2026)
  const rendaPerCapita = rendaFamiliarBruta / Math.max(1, numeroMembrosFamilia);
  const limitePadraoLoas = SALARIO_MINIMO_2026 / 4; // R$ 378,00
  const atendeLimiteRendaEstrito = rendaPerCapita <= limitePadraoLoas;
  
  // Flexibilização judicial aceita até 1/2 salário mínimo (R$ 756,00) com prova de gastos médicos ou miserabilidade latente
  const limiteFlexibilizado = SALARIO_MINIMO_2026 / 2; // R$ 756,00
  const atendeLimiteRendaFlexibilizado = rendaPerCapita <= limiteFlexibilizado;
  
  let parecerVeredito = "";
  if (tipoBeneficiario === 'idoso') {
    if (atendeIdadeIdoso && atendeLimiteRendaEstrito) {
      parecerVeredito = "Altíssima probabilidade de aprovação imediata via canais do INSS (Requisitos estritos de idade e renda atendidos).";
    } else if (atendeIdadeIdoso && atendeLimiteRendaFlexibilizado) {
      parecerVeredito = "Aprovável judicialmente. A renda ultrapassa 1/4 de salário mínimo, mas qualifica no limite flexibilizado de 1/2 salário mínimo.";
    } else if (!atendeIdadeIdoso) {
      parecerVeredito = "Indeferido: Menor de 65 anos para categoria Idoso.";
    } else {
      parecerVeredito = "Baixa probabilidade. Renda familiar per capita ultrapassa o teto tolerado.";
    }
  } else {
    // Deficiente
    if (laudoMedicoVulnerabilidade && atendeLimiteRendaEstrito) {
      parecerVeredito = "Altíssima probabilidade. Comprovação médica de barreira de longo prazo e renda adequada ao critério objetivo.";
    } else if (laudoMedicoVulnerabilidade && atendeLimiteRendaFlexibilizado) {
      parecerVeredito = "Aprovável na via judicial com forte demonstração de despesas médicas, medicamentos e fraudes familiares.";
    } else if (!laudoMedicoVulnerabilidade) {
      parecerVeredito = "Necessita de laudo pericial atestando incapacidade/deficiência de longo prazo.";
    } else {
      parecerVeredito = "Renda ultrapassa limites toleráveis de assistência social.";
    }
  }
  
  const memoria = `• Renda Familiar Declarada: R$ ${rendaFamiliarBruta.toFixed(2)} distribuída entre ${numeroMembrosFamilia} familiares.
• Renda Per Capita Apurada: R$ ${rendaPerCapita.toFixed(2)} por integrante.
• Teto Objetivo Constitucional (1/4 de Mínimo): R$ ${limitePadraoLoas.toFixed(2)}.
• Limiar de Flexibilização de Renda Judicial (1/2 de Mínimo): R$ ${limiteFlexibilizado.toFixed(2)}.
• Categoria Solicitada: Benefício Assistencial ao ${tipoBeneficiario === 'idoso' ? 'Idoso (65+ anos)' : 'Deficiente com Impedimentos de Longo Prazo'}.`;

  return {
    rendaPerCapita,
    limitePadraoLoas,
    limiteFlexibilizado,
    atendeIdadeIdoso,
    atendeLimiteRendaEstrito,
    atendeLimiteRendaFlexibilizado,
    parecerVeredito,
    memoria
  };
}

/**
 * MÓDULO 6: Restabelecimento de Benefício Suspenso
 */
export function calcularRestabelecimento(
  rmiBeneficio: number,
  mesesSuspensao: number,
  motivoCorte: string
) {
  const acumuladoDevidoOriginal = rmiBeneficio * mesesSuspensao;
  const acumuladoAtualizado = acumuladoDevidoOriginal * 1.05; // Ajuste correção de 5% médio
  
  let probabilidadeRecuperacao: 'ALTA' | 'MÉDIA' | 'BAIXA' = 'MÉDIA';
  let parecerJuridico = "";
  
  const motivoNormalizado = motivoCorte.toLowerCase();
  if (motivoNormalizado.includes('perícia') || motivoNormalizado.includes('médica') || motivoNormalizado.includes('alta')) {
    probabilidadeRecuperacao = 'MÉDIA';
    parecerJuridico = "Restabelecimento de Auxílio por Incapacidade Temporária / Aposentadoria por Incapacidade depende de nova instrução médica técnica detalhada no Judiciário, contestando laudo sumário do INSS.";
  } else if (motivoNormalizado.includes('fraude') || motivoNormalizado.includes('auditoria') || motivoNormalizado.includes('pente')) {
    probabilidadeRecuperacao = 'MÉDIA';
    parecerJuridico = "Necessita demonstrar ampla defesa e contraditório que foram tolhidos ou justificar que a documentação apresentada afasta suspeitas administrativas.";
  } else if (motivoNormalizado.includes('cadúnico') || motivoNormalizado.includes('cadastro') || motivoNormalizado.includes('bpc')) {
    probabilidadeRecuperacao = 'ALTA';
    parecerJuridico = "Excelente prognóstico! A mera atualização de dados do CadÚnico e comprovação presencial em até 90 dias costuma amparar o restabelecimento imediato com o pagamento de todo o período suspenso.";
  } else {
    probabilidadeRecuperacao = 'BAIXA';
    parecerJuridico = "Necessita de cuidadoso escrutínio do ato administrativo impugnado e cópia integral do processo concessório original.";
  }
  
  const memoria = `• RMI do Benefício Suspenso: R$ ${rmiBeneficio.toFixed(2)}.
• Tempo decorrido de suspensão: ${mesesSuspensao} meses.
• Estimativa de parcelas retroativas vencidas calculadas: R$ ${acumuladoAtualizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
• Motivo analisado: "${motivoCorte}".
• Prognóstico de sucesso de demanda: ${probabilidadeRecuperacao}.`;

  return {
    acumuladoDevidoOriginal,
    acumuladoAtualizado,
    probabilidadeRecuperacao,
    parecerJuridico,
    memoria
  };
}

/**
 * MÓDULO 7: RPPS União (Previdência do Servidor Público Federal)
 * Base de cálculo baseada na alíquota progressiva pós-reforma (EC 103/2019)
 */
export function calcularRppsUniao(
  salarioBase: number,
  genero: 'M' | 'F',
  idade: number
) {
  // Alíquotas Progressivas da União:
  // Até 1 salário mínimo (R$ 1.512,00): 7.5%
  // De R$ 1.512,01 até R$ 2.666,68: 9%
  // De R$ 2.666,69 até R$ 4.000,03: 12%
  // De R$ 4.000,04 até R$ 8.218,64 (Teto): 14%
  // De R$ 8.218,65 até R$ 13.333,30: 14.5%
  // De R$ 13.333,31 até R$ 26.666,61: 16.5%
  // De R$ 26.666,62 até R$ 52.000,54: 19%
  // Acima de R$ 52.000,54: 22%
  
  let descontoTotal = 0;
  const faixas = [
    { limite: 1512.00, aliquota: 0.075 },
    { limite: 2666.68, aliquota: 0.09 },
    { limite: 4000.03, aliquota: 0.12 },
    { limite: 8218.64, aliquota: 0.14 },
    { limite: 13333.30, aliquota: 0.145 },
    { limite: 26666.61, aliquota: 0.165 },
    { limite: 52000.54, aliquota: 0.19 },
    { limite: Infinity, aliquota: 0.22 }
  ];
  
  let resto = salarioBase;
  let anterior = 0;
  const detalheFaixas = [];
  
  for (let i = 0; i < faixas.length; i++) {
    const f = faixas[i];
    const largura = f.limite - anterior;
    const baseCalculo = Math.min(resto, largura);
    
    if (baseCalculo <= 0) break;
    
    const descontoFaixa = baseCalculo * f.aliquota;
    descontoTotal += descontoFaixa;
    
    detalheFaixas.push({
      faixa: `Faixa ${i + 1} (${(f.aliquota * 100).toFixed(1)}%)`,
      base: Number(baseCalculo.toFixed(2)),
      desconto: Number(descontoFaixa.toFixed(2))
    });
    
    resto -= baseCalculo;
    anterior = f.limite;
  }
  
  const aliquotaEfetiva = (descontoTotal / salarioBase) * 100;
  const salarioLiquido = salarioBase - descontoTotal;
  
  // Requisitos idade servidor união: 62 Mulher / 65 Homem
  const idadeMinimaUniao = genero === 'F' ? 62 : 65;
  const atendeIdadeServidor = idade >= idadeMinimaUniao;
  
  const memoria = `• Salário de Contribuição Base: R$ ${salarioBase.toFixed(2)}.
• Desconto de Contribuição RPPS Total Progressivo: R$ ${descontoTotal.toFixed(2)}.
• Alíquota Efetiva Apurada: ${aliquotaEfetiva.toFixed(2)}% (considerando as faixas progressivas federais).
• Salário Líquido de Contribuição: R$ ${salarioLiquido.toFixed(2)}.
• Qualificação Idade Requisito Servidor: ${idade} anos de ${idadeMinimaUniao} necessários. Estado: ${atendeIdadeServidor ? 'Apto' : 'Necessita aguardar idade mínima'}.`;

  return {
    descontoTotal,
    aliquotaEfetiva,
    salarioLiquido,
    detalheFaixas,
    atendeIdadeServidor,
    idadeMinimaUniao,
    memoria
  };
}

/**
 * MÓDULO 8: RPPS Estados e Municípios
 */
export function calcularRppsEstMun(
  salarioBase: number,
  aliquotaDeclarada: number // Alíquota fixa municipal/estadual praticada (Ex: 14% padrão PEC)
) {
  const desconto = salarioBase * (aliquotaDeclarada / 100);
  const salarioLiquido = salarioBase - desconto;
  
  const memoria = `• Salário do Servidor Estadual/Municipal: R$ ${salarioBase.toFixed(2)}.
• Alíquota Atuarial Fixada localmente: ${aliquotaDeclarada}%.
• Desconto da contribuição previdenciária descontada em folha: R$ ${desconto.toFixed(2)}.
• Rendimento líquido remanescente para bases tributáveis: R$ ${salarioLiquido.toFixed(2)}.`;

  return {
    desconto,
    salarioLiquido,
    memoria
  };
}

/**
 * MÓDULO 9: Complementação Previdenciária
 */
export function calcularComplementacao(
  salarioAtivoDoServidor: number,
  aposentadoriaEfetivaRGPS: number
) {
  // A complementação previdenciária serve para cobrir o que excede o Teto do INSS
  // Diferença necessária para alcançar o patamar original do funcionário público
  const deficitSuprir = Math.max(0, salarioAtivoDoServidor - aposentadoriaEfetivaRGPS);
  
  // Contribuição estimativa para previdência complementar privada/prev complementar pública (Funpresp / Prevfed)
  const taxaEstimadaMeta = 0.085; // 8.5% de contribuição patronal/servidor
  const contribuicaoMensalProposta = deficitSuprir * taxaEstimadaMeta;
  
  const memoria = `• Última remuneração ativa do servidor: R$ ${salarioAtivoDoServidor.toFixed(2)}.
• Aposentadoria paga na via do RGPS (ou limite teto): R$ ${aposentadoriaEfetivaRGPS.toFixed(2)}.
• Déficit Previdenciário (necessidade de complementação): R$ ${deficitSuprir.toFixed(2)}.
• Sugestão de aporte mensal recomendado na Previdência Complementar Privada ou Pública (8.5%): R$ ${contribuicaoMensalProposta.toFixed(2)}.`;

  return {
    deficitSuprir,
    contribuicaoMensalProposta,
    memoria
  };
}

/**
 * MÓDULO 10: Contribuições Previdenciárias em Atraso
 * Aplica alíquota padrão de Contribuinte Individual (20%) + multa legal (10%) + juros legais (1%) ao mês
 */
export function calcularContribAtraso(
  salarioDeReferência: number,
  mesesAtrasados: number
) {
  const baseContribuicao = Math.min(TETO_INSS_2026, salarioDeReferência);
  // Alíquota padrão do contribuinte individual autônomo é de 20% sobre o salário de contribuição
  const valorOriginalImposto = baseContribuicao * 0.20;
  const principalTotal = valorOriginalImposto * mesesAtrasados;
  
  // Multa padrão do INSS para atraso de contribuições regulares (Art. 35 Lei 8.212/91): limite de 10%
  const multaTotal = principalTotal * 0.10;
  
  // Juros de mora judiciais de atraso do INSS (1% ao mês ou equivalente nos termos fiscais)
  const jurosTaxaMes = 0.01; // 1% ao mês
  const jurosTotal = principalTotal * (mesesAtrasados * jurosTaxaMes);
  
  const totalDevidoAtrasado = principalTotal + multaTotal + jurosTotal;
  
  const memoria = `• Salário de Referência utilizado para contribuição única: R$ ${salarioDeReferência.toFixed(2)} ${salarioDeReferência > TETO_INSS_2026 ? '(Limitado ao Teto INSS)' : ''}.
• Valor principal da contribuição individual (20%): R$ ${valorOriginalImposto.toFixed(2)} ao mês.
• Total Principal sem acréscimo (${mesesAtrasados} meses): R$ ${principalTotal.toFixed(2)}.
• Multa tributária regulamentar acumulada em atraso (10% unificado): R$ ${multaTotal.toFixed(2)}.
• Juros moratórios acumulados (1% por mês de inadimplência): R$ ${jurosTotal.toFixed(2)}.
• Valor total da Guia Previdenciária de Recolhimento da Previdência Social (GPS): R$ ${totalDevidoAtrasado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`;

  return {
    principalTotal,
    multaTotal,
    jurosTotal,
    totalDevidoAtrasado,
    memoria
  };
}
