import { Cliente, CalculoRegistro } from './types';

// Salários Mínimos Oficiais do Brasil (Projeção 2026 + Anteriores)
export const SALARIO_MINIMO_2026 = 1512.00;
export const TETO_INSS_2026 = 8218.64;

export const HISTORICO_TETO_INSS = [
  { ano: 2026, teto: 8218.64, minimo: 1512.00 },
  { ano: 2025, teto: 7854.12, minimo: 1412.00 },
  { ano: 2024, teto: 7786.02, minimo: 1412.00 },
  { ano: 2023, teto: 7507.49, minimo: 1320.00 },
  { ano: 2022, teto: 7087.22, minimo: 1212.00 },
  { ano: 2021, teto: 6433.57, minimo: 1100.00 },
  { ano: 2020, teto: 6101.06, minimo: 1045.00 },
  { ano: 2019, teto: 5839.45, minimo: 998.00 }
];

export const CLIENTES_PRESETS: Cliente[] = [
  {
    id: "cli-1",
    nome: "Dr. Alexandre Torres Albuquerque",
    cpf: "123.456.789-00",
    genero: "M",
    dataNascimento: "1962-04-12", // Idade em 2026: ~64 anos
    carencia: 242,
    tempoAnos: 22,
    tempoMeses: 8,
    tempoDias: 14,
    favorito: true,
    cadastradoEm: "2026-02-15"
  },
  {
    id: "cli-2",
    nome: "Dra. Mariana Costa Ferreira",
    cpf: "987.654.321-11",
    genero: "F",
    dataNascimento: "1966-07-22", // Idade em 2026: ~59 anos
    carencia: 198,
    tempoAnos: 16,
    tempoMeses: 4,
    tempoDias: 3,
    favorito: true,
    cadastradoEm: "2026-03-01"
  },
  {
    id: "cli-3",
    nome: "Gerson Wagner da Silva",
    cpf: "456.123.789-22",
    genero: "M",
    dataNascimento: "1958-11-05", // Idade em 2026: 67 anos
    carencia: 185,
    tempoAnos: 15,
    tempoMeses: 5,
    tempoDias: 12,
    favorito: false,
    cadastradoEm: "2026-05-10"
  },
  {
    id: "cli-4",
    nome: "Maria das Dores Souza",
    cpf: "321.654.987-44",
    genero: "F",
    dataNascimento: "1960-01-25", // Idade em 2026: 66 anos
    carencia: 160,
    tempoAnos: 13,
    tempoMeses: 2,
    tempoDias: 20,
    favorito: false,
    cadastradoEm: "2026-05-20"
  }
];

export const CALCULOS_PRESETS: CalculoRegistro[] = [
  {
    id: "calc-1",
    clienteId: "cli-1",
    clienteNome: "Dr. Alexandre Torres Albuquerque",
    dataCriacao: "2026-03-22",
    tipo: "planejamento",
    titulo: "Planejamento RGPS - Transição por Pontos",
    valorCalculado: 4850.32,
    detalhes: "Média salarial apurada: R$ 6.200,00. Coeficiente EC 103/19: 64% (22 anos contribuição). Carência validada (242 de 180 necessárias). Requisitos completados para aposentadoria estimada em meados de 2027.",
  },
  {
    id: "calc-2",
    clienteId: "cli-2",
    clienteNome: "Dra. Mariana Costa Ferreira",
    dataCriacao: "2026-04-10",
    tipo: "liquidacao",
    titulo: "Atrasados INSS - Revisão de Aposentadoria",
    valorCalculado: 32420.15,
    detalhes: "Memória de Cálculo: Diferenças mensais corrigidas pelo INPC de 08/2021 a 02/2026 com acréscimo de juros legais simplificados de 0.5% ao mês. Sem ultrapassar limite de JEF de 60 salários mínimos.",
  }
];

export const PLANOS_INFO = [
  {
    tier: 'bronze' as const,
    nome: 'Plano Bronze',
    preco: 'R$ 149/mês',
    limiteClientes: 5,
    limiteCalculos: 10,
    destaque: false,
    caracteristicas: [
      'Acesso a cálculos básicos do RGPS',
      'Até 5 clientes cadastrados',
      'Até 10 relatórios e memórias salvos',
      'Correção monetária padrão',
      'Suporte via e-mail corporativo'
    ]
  },
  {
    tier: 'prata' as const,
    nome: 'Plano Prata (Mais Popular)',
    preco: 'R$ 299/mês',
    limiteClientes: 30,
    limiteCalculos: 99,
    destaque: true,
    caracteristicas: [
      'Acesso completo a todos os 10 módulos RGPS/RPPS',
      'Até 30 clientes cadastrados',
      'Até 99 históricos e memórias salvas',
      'Gráficos de contribuição interativos',
      'Relatórios e pareceres simplificados',
      'Suporte prioritário via WhatsApp'
    ]
  },
  {
    tier: 'ouro' as const,
    nome: 'Plano Ouro Premium',
    preco: 'R$ 499/mês',
    limiteClientes: 9999, // ilimitado
    limiteCalculos: 9999, // ilimitado
    destaque: false,
    caracteristicas: [
      'Clientes e cálculos COMPLETAMENTE ilimitados',
      'Adequação completa multiusuário / Escritório',
      'Suíte de Pareceres Técnicos com Inteligência Artificial Gemini',
      'Exportação para Relatório Executivo PDF/Doc',
      'Análise de Direito Adquirido e Simulação Atuarial RPPS Inteligente',
      'Treinamento e gerente de contas focado'
    ]
  }
];
