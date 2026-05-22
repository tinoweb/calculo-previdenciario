/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  FileText, 
  Calculator, 
  TrendingUp, 
  UserCheck, 
  Users, 
  HelpCircle, 
  Settings, 
  AlertCircle, 
  Unlock, 
  Sparkles, 
  Plus, 
  Trash2, 
  Star, 
  Search, 
  ChevronRight, 
  Printer, 
  CheckCircle2, 
  ArrowLeft, 
  Lock, 
  LogOut, 
  BadgeDollarSign, 
  FileCheck2,
  Calendar,
  DollarSign,
  Heart,
  Briefcase,
  Layers,
  Sparkle
} from 'lucide-react';

import { Cliente, TipoCalculo, CalculoRegistro, PlanoTier } from './types';
import { 
  CLIENTES_PRESETS, 
  CALCULOS_PRESETS, 
  PLANOS_INFO, 
  SALARIO_MINIMO_2026, 
  TETO_INSS_2026, 
  HISTORICO_TETO_INSS 
} from './data';

import {
  calcularLiquidacao,
  calcularPlanejamentoRGPS,
  calcularRevisaoRGPS,
  calcularAtrasados,
  calcularBpcLoas,
  calcularRestabelecimento,
  calcularRppsUniao,
  calcularRppsEstMun,
  calcularComplementacao,
  calcularContribAtraso
} from './calc-engines';

export default function App() {
  // Estado do usuário e assinaturas (simulado SaaS)
  const [usuarioNome, setUsuarioNome] = useState<string>(() => {
    return localStorage.getItem('prev_adv_nome') || 'Dr. Eduardo Vasconcelos';
  });
  const [usuarioEmail, setUsuarioEmail] = useState<string>(() => {
    return localStorage.getItem('prev_adv_email') || 'eduardo.adv@previdencia.com';
  });
  const [planoAtivo, setPlanoAtivo] = useState<PlanoTier>(() => {
    return (localStorage.getItem('prev_plano_ativo') as PlanoTier) || 'prata';
  });
  const [estaLogado, setEstaLogado] = useState<boolean>(() => {
    return localStorage.getItem('prev_esta_logado') === 'true';
  });

  // Navegação: 'landing' (padrão se deslogado), 'dashboard', ou 'calc-modulo'
  const [telaAtiva, setTelaAtiva] = useState<string>(() => {
    const logado = localStorage.getItem('prev_esta_logado') === 'true';
    return logado ? 'dashboard' : 'landing';
  });

  // Clientes e Histórico de Cálculos persistidos localmente
  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const salvos = localStorage.getItem('prev_clientes');
    if (salvos) {
      try { return JSON.parse(salvos); } catch (_) {}
    }
    return CLIENTES_PRESETS;
  });

  const [calculos, setCalculos] = useState<CalculoRegistro[]>(() => {
    const salvos = localStorage.getItem('prev_calculos');
    if (salvos) {
      try { return JSON.parse(salvos); } catch (_) {}
    }
    return CALCULOS_PRESETS;
  });

  // Cadastro de Novo Cliente no Dashboard
  const [buscaCliente, setBuscaCliente] = useState('');
  const [novoCliNome, setNovoCliNome] = useState('');
  const [novoCliCpf, setNovoCliCpf] = useState('');
  const [novoCliGenero, setNovoCliGenero] = useState<'M' | 'F'>('M');
  const [novoCliNasc, setNovoCliNasc] = useState('1965-05-15');
  const [novoCliCarencia, setNovoCliCarencia] = useState(185);
  const [novoCliTempoAnos, setNovoCliTempoAnos] = useState(25);
  const [novoCliTempoMeses, setNovoCliTempoMeses] = useState(4);
  const [novoCliTempoDias, setNovoCliTempoDias] = useState(10);
  const [mostrarFormNovoCliente, setMostrarFormNovoCliente] = useState(false);

  // Seleções ativas de cálculo e inputs
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<string>('cli-1');
  const [tipoCalculoAtivo, setTipoCalculoAtivo] = useState<TipoCalculo>('planejamento');
  
  // Resgata o cliente ativo
  const clienteAtivo = clientes.find(c => c.id === clienteSelecionadoId) || clientes[0];

  // ESTADO DE CÁLCULO GERAL: Modulo Ativo
  const [calcResultado, setCalcResultado] = useState<any>(null);
  const [parecerIAStatus, setParecerIAStatus] = useState<'ocioso' | 'gerando' | 'sucesso' | 'erro'>('ocioso');
  const [parecerIATexto, setParecerIATexto] = useState<string>('');
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  // INPUTS DE TODOS OS FORMULÁRIOS DE CÁLCULO
  const [inLiquidacaoSalario, setInLiquidacaoSalario] = useState<number>(3500);
  const [inLiquidacaoMeses, setInLiquidacaoMeses] = useState<number>(36);
  const [inLiquidacaoIndice, setInLiquidacaoIndice] = useState<'INPC' | 'IPCA-E'>('INPC');
  const [inLiquidacaoJuros, setInLiquidacaoJuros] = useState<number>(0.5);

  const [inPlanejamentoMedia, setInPlanejamentoMedia] = useState<number>(5500);

  const [inRevisaoOriginal, setInRevisaoOriginal] = useState<number>(3200);
  const [inRevisaoData, setInRevisaoData] = useState<string>('2018-05-10');
  const [inRevisaoTipo, setInRevisaoTipo] = useState<'vida_toda' | 'teto'>('vida_toda');

  const [inAtrasadosValor, setInAtrasadosValor] = useState<number>(2900);
  const [inAtrasadosMeses, setInAtrasadosMeses] = useState<number>(24);
  const [inAtrasadosJuros, setInAtrasadosJuros] = useState<boolean>(true);

  const [inBpcTipo, setInBpcTipo] = useState<'idoso' | 'deficiente'>('idoso');
  const [inBpcIdade, setInBpcIdade] = useState<number>(66);
  const [inBpcFamilia, setInBpcFamilia] = useState<number>(4);
  const [inBpcRendaBruta, setInBpcRendaBruta] = useState<number>(1200);
  const [inBpcVulnerabilidade, setInBpcVulnerabilidade] = useState<boolean>(true);

  const [inRestabOriginal, setInRestabOriginal] = useState<number>(2600);
  const [inRestabMeses, setInRestabMeses] = useState<number>(8);
  const [inRestabMotivo, setInRestabMotivo] = useState<string>('Indeferimento em revisão médica de alta de benefício temporário');

  const [inRppsUniaoSalario, setInRppsUniaoSalario] = useState<number>(14500);
  
  const [inRppsEstMunSalario, setInRppsEstMunSalario] = useState<number>(8200);
  const [inRppsEstMunAliquota, setInRppsEstMunAliquota] = useState<number>(14);

  const [inCompSalarioAtivo, setInCompSalarioAtivo] = useState<number>(16000);
  const [inCompAposentadoriaRgps, setInCompAposentadoriaRgps] = useState<number>(8218.64);

  const [inAtrasoBaseSalario, setInAtrasoBaseSalario] = useState<number>(4800);
  const [inAtrasoMeses, setInAtrasoMeses] = useState<number>(12);

  // Histórico de simulações e login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [recuperandoSenha, setRecuperandoSenha] = useState(false);

  // Sync state changes para o LocalStorage
  useEffect(() => {
    localStorage.setItem('prev_clientes', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem('prev_calculos', JSON.stringify(calculos));
  }, [calculos]);

  useEffect(() => {
    localStorage.setItem('prev_plano_ativo', planoAtivo);
    localStorage.setItem('prev_adv_nome', usuarioNome);
    localStorage.setItem('prev_adv_email', usuarioEmail);
    localStorage.setItem('prev_esta_logado', estaLogado ? 'true' : 'false');
  }, [estaLogado, planoAtivo, usuarioNome, usuarioEmail]);

  // Executa o cálculo automático conforme os parâmetros
  const executarCalculoAtivo = () => {
    if (!clienteAtivo) {
      setMensagemErro("Por favor, selecione ou cadastre um cliente primeiro no painel.");
      return;
    }

    // Validação de limite por plano Bronze/Prata/Ouro
    const limiteCalculos = PLANOS_INFO.find(p => p.tier === planoAtivo)?.limiteCalculos || 10;
    if (calculos.length >= limiteCalculos && planoAtivo === 'bronze') {
      setMensagemErro(`Aviso: O limite de cálculos do seu plano Bronze (${limiteCalculos}) foi alcançado. Faça upgrade para o Plano Prata ou Ouro.`);
      return;
    }

    try {
      let resultado: any = null;
      let tituloCalculo = "";
      let valorFinal = 0;

      switch (tipoCalculoAtivo) {
        case 'liquidacao':
          resultado = calcularLiquidacao("12/2022", inLiquidacaoSalario, inLiquidacaoMeses, inLiquidacaoIndice, inLiquidacaoJuros);
          tituloCalculo = `Sentença Judicial (${inLiquidacaoIndice})`;
          valorFinal = resultado.resumo.totalGeral;
          break;
        case 'planejamento':
          resultado = calcularPlanejamentoRGPS(
            clienteAtivo.genero,
            Number((new Date().getFullYear() - new Date(clienteAtivo.dataNascimento).getFullYear())),
            clienteAtivo.tempoAnos,
            clienteAtivo.carencia,
            inPlanejamentoMedia
          );
          tituloCalculo = `Planejamento RGPS - Transição`;
          valorFinal = resultado.rmiCalculada;
          break;
        case 'revisao':
          resultado = calcularRevisaoRGPS(inRevisaoOriginal, inRevisaoData, inRevisaoTipo);
          tituloCalculo = inRevisaoTipo === 'vida_toda' ? `Revisão Vida Toda` : `Revisão do Teto`;
          valorFinal = resultado.totalEstimadoAtrasados;
          break;
        case 'atrasados':
          resultado = calcularAtrasados(inAtrasadosValor, inAtrasadosMeses, inAtrasadosJuros);
          tituloCalculo = `Atrasados INSS (${inAtrasadosMeses}m)`;
          valorFinal = resultado.totalGeral;
          break;
        case 'bpc':
          resultado = calcularBpcLoas(inBpcTipo, inBpcIdade, inBpcFamilia, inBpcRendaBruta, inBpcVulnerabilidade);
          tituloCalculo = `BPC LOAS - ${inBpcTipo === 'idoso' ? 'Idoso' : 'Deficiente'}`;
          valorFinal = SALARIO_MINIMO_2026;
          break;
        case 'restabelecimento':
          resultado = calcularRestabelecimento(inRestabOriginal, inRestabMeses, inRestabMotivo);
          tituloCalculo = `Restabelecimento de Benefício`;
          valorFinal = resultado.acumuladoAtualizado;
          break;
        case 'rpps_uniao':
          resultado = calcularRppsUniao(
            inRppsUniaoSalario,
            clienteAtivo.genero,
            Number((new Date().getFullYear() - new Date(clienteAtivo.dataNascimento).getFullYear()))
          );
          tituloCalculo = `Contr. RPPS União Progressiva`;
          valorFinal = resultado.salarioLiquido;
          break;
        case 'rpps_est_mun':
          resultado = calcularRppsEstMun(inRppsEstMunSalario, inRppsEstMunAliquota);
          tituloCalculo = `RPPS Estadual / Municipal`;
          valorFinal = resultado.salarioLiquido;
          break;
        case 'complementacao':
          resultado = calcularComplementacao(inCompSalarioAtivo, inCompAposentadoriaRgps);
          tituloCalculo = `Complementação de Aposentadoria`;
          valorFinal = resultado.deficitSuprir;
          break;
        case 'atraso_contribuicao':
          resultado = calcularContribAtraso(inAtrasoBaseSalario, inAtrasoMeses);
          tituloCalculo = `Guia Guia GPS em Atraso`;
          valorFinal = resultado.totalDevidoAtrasado;
          break;
      }

      setCalcResultado(resultado);
      setMensagemErro(null);

      // Salva o cálculo no histórico de forma automática
      const novoRegistro: CalculoRegistro = {
        id: `calc-user-${Date.now()}`,
        clienteId: clienteAtivo.id,
        clienteNome: clienteAtivo.nome,
        dataCriacao: new Date().toISOString().split('T')[0],
        tipo: tipoCalculoAtivo,
        titulo: tituloCalculo,
        valorCalculado: Number(valorFinal.toFixed(2)),
        detalhes: resultado.memoria
      };

      setCalculos(prev => [novoRegistro, ...prev]);
      setMensagemSucesso("Cálculo realizado com sucesso! Ele foi adicionado ao seu histórico de simulações.");
      
      // Limpa alertas após tempo
      setTimeout(() => setMensagemSucesso(null), 4000);

    } catch (err: any) {
      setMensagemErro("Erro ao realizar cálculo matemático: " + err.message);
    }
  };

  // Chama a IA do Gemini via as Cloud Run Functions configuradas para gerar parecer jurídico formal em português
  const handleGerarParecerIA = async () => {
    if (!clienteAtivo || !calcResultado) {
      setMensagemErro("Por favor, selecione um cliente e execute o cálculo previdenciário primeiro.");
      return;
    }

    // Exclusividade do Plano Ouro
    if (planoAtivo !== 'ouro') {
      setMensagemErro("🚫 O recurso inovador de Parecer Técnico Automático com Inteligência Artificial Gemini 3.5 é exclusivo do Plano Ouro Premium. Mude de assinatura abaixo para desbloquear!");
      return;
    }

    setParecerIAStatus('gerando');
    setParecerIATexto('');
    setMensagemErro(null);

    try {
      const response = await fetch('/api/generate-parecer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client: {
            nome: clienteAtivo.nome,
            genero: clienteAtivo.genero,
            dataNascimento: clienteAtivo.dataNascimento,
            idade: Number((new Date().getFullYear() - new Date(clienteAtivo.dataNascimento).getFullYear())),
            tempoContribuicaoAnos: clienteAtivo.tempoAnos,
            tempoContribuicaoMeses: clienteAtivo.tempoMeses,
            tempoContribuicaoDias: clienteAtivo.tempoDias,
            carencia: clienteAtivo.carencia
          },
          modulo: tipoCalculoAtivo,
          calculoDet: calcResultado
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro de resposta da API do servidor");
      }

      setParecerIATexto(data.parecer || "Não foi possível gerar as considerações técnicas.");
      setParecerIAStatus('sucesso');
    } catch (err: any) {
      console.error(err);
      setParecerIAStatus('erro');
      setMensagemErro("Aviso Gemini IA: " + err.message + " | Demonstração simulada de parecer exibida abaixo.");
      
      // Fallback rico simulado em caso de falta de chave API para que o sistema continue funcional e informativo!
      setParecerIATexto(`### PARECER TÉCNICO PREVIDENCIÁRIO IA (Simulação Fallback)
**Interessado(a):** ${clienteAtivo.nome}
**Vínculo Técnico:** Regime Geral de Previdência Social (${tipoCalculoAtivo.toUpperCase()})

#### 1. Resumo da Situação Geral e Requisitos
Com base no histórico analisado, constatamos o tempo de filiação de **${clienteAtivo.tempoAnos} anos, ${clienteAtivo.tempoMeses} meses e ${clienteAtivo.tempoDias} dias**, o que atesta recolhimento regular acima da carência para diversos fins preventivos.

#### 2. Viabilidade Técnica Previdenciária
*   **Fundamento Constitucional:** Adequação conforme a Emenda Constitucional de Reforma da Previdência 103/2019.
*   **Correção e Teto:** O teto de 2026 de R$ ${TETO_INSS_2026.toFixed(2)} foi respeitado nos cálculos, aplicando-se índices oficiais históricos vigentes.

#### 3. Recomendações Profissionais Fundamentadas
Recomenda-se providenciar junto ao cliente a carteira de trabalho digital atualizada, certidão de tempo de contribuição (CTC) caso haja atividades em RPPS, e o extrato CNIS detalhado para sanar eventuais pendências de indicadores de forma célere na via judicial.`);
    }
  };

  // Cadastra um novo cliente advogado previdenciarista
  const handleCadastrarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoCliNome.trim() || !novoCliCpf.trim()) {
      setMensagemErro("Por favor, informe Nome e CPF legítimos para o cliente.");
      return;
    }

    // Regra de limite de clientes do plano Bronze
    const limiteClientes = PLANOS_INFO.find(p => p.tier === planoAtivo)?.limiteClientes || 5;
    if (clientes.length >= limiteClientes && planoAtivo === 'bronze') {
      setMensagemErro(`Aviso: O limite de clientes do seu plano Bronze (${limiteClientes} clientes) foi alcançado. Faça upgrade para salvar mais.`);
      return;
    }

    const novoCliente: Cliente = {
      id: `cli-user-${Date.now()}`,
      nome: novoCliNome.trim(),
      cpf: novoCliCpf.trim(),
      genero: novoCliGenero,
      dataNascimento: novoCliNasc,
      carencia: Number(novoCliCarencia) || 0,
      tempoAnos: Number(novoCliTempoAnos) || 0,
      tempoMeses: Number(novoCliTempoMeses) || 0,
      tempoDias: Number(novoCliTempoDias) || 0,
      favorito: false,
      cadastradoEm: new Date().toISOString().split('T')[0]
    };

    setClientes(prev => [novoCliente, ...prev]);
    setClienteSelecionadoId(novoCliente.id);
    
    // Reset form
    setNovoCliNome('');
    setNovoCliCpf('');
    setMostrarFormNovoCliente(false);
    setMensagemSucesso(`Cliente "${novoCliente.nome}" cadastrado com sucesso!`);
    setTimeout(() => setMensagemSucesso(null), 3000);
  };

  // Deleta um cliente cadastrado
  const handleDeletarCliente = (id: string, nome: string) => {
    if (confirm(`Deseja realmente remover o cliente "${nome}" da base de escritórios? Todos os cálculos associados a ele no histórico eletrônico serão limpos.`)) {
      setClientes(prev => prev.filter(c => c.id !== id));
      setCalculos(prev => prev.filter(c => c.clienteId !== id));
      setMensagemSucesso("Cliente e históricos removidos regularmente.");
      setTimeout(() => setMensagemSucesso(null), 3000);
    }
  };

  // Alterna status de favorito
  const handleToggleFavorito = (id: string) => {
    setClientes(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, favorito: !c.favorito };
      }
      return c;
    }));
  };

  // Deleta um cálculo específico
  const handleDeleteCalculo = (id: string) => {
    setCalculos(prev => prev.filter(c => c.id !== id));
  };

  // Simulação de login de escritório advocatício
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginSenha.trim()) {
      setMensagemErro("Informe seu e-mail e senha.");
      return;
    }

    setEstaLogado(true);
    setUsuarioEmail(loginEmail);
    setTelaAtiva('dashboard');
    setMensagemSucesso("Login realizado com sucesso! Bem-vindo doutor(a) ao PrevCalculus.");
    setTimeout(() => setMensagemSucesso(null), 4000);
  };

  const handleLogout = () => {
    setEstaLogado(false);
    setTelaAtiva('landing');
  };

  // Filtra clientes por busca
  const clientesFiltrados = clientes.filter(c => 
    c.nome.toLowerCase().includes(buscaCliente.toLowerCase()) ||
    c.cpf.includes(buscaCliente)
  );

  return (
    <div className="min-h-screen bg-[#060B16] text-[#e2e8f0] font-sans flex flex-col relative antialiased selection:bg-[#C5A059]/30 selection:text-white pb-10" id="root-div">
      
      {/* Background Decorativo - Brilho Dourado e Azul sutil premium em conformidade com as regras de design */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-100px] w-[600px] h-[600px] rounded-full bg-[#C5A059]/5 blur-[150px] pointer-events-none" />

      {/* HEADER PRINCIPAL - PREMIUM GOLD & DARK BLUE */}
      <header className="border-b border-[#C5A059]/20 bg-[#090F1E]/95 sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-tr from-[#0F1E36] to-[#0A1424] border border-[#C5A059]/30 flex items-center justify-center">
            <Scale className="w-5.5 h-5.5 text-[#C5A059]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] tracking-wider text-[#C5A059] font-mono font-bold uppercase py-0.5 px-1.5 rounded bg-[#C5A059]/10 border border-[#C5A059]/20">Escritório Jurídico</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h1 className="text-md sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              PrevCalculus <span className="text-xs text-[#C5A059] font-light">Sistemas Previdenciários</span>
            </h1>
          </div>
        </div>

        {/* Informações da Assinatura e Navegação Rápida */}
        <div className="flex items-center gap-3">
          {estaLogado ? (
            <div className="flex items-center gap-3 text-xs">
              <div className="hidden md:block text-right">
                <span className="block text-slate-100 font-medium">{usuarioNome}</span>
                <span className="text-[10px] text-slate-500">{usuarioEmail}</span>
              </div>
              
              <div className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] font-bold text-[10px] uppercase tracking-wide">
                <Unlock className="w-2.5 h-2.5" />
                <span>Plano {planoAtivo}</span>
              </div>

              <div className="h-4 w-[1px] bg-slate-800" />
              
              <button 
                id="btn-back-dash"
                onClick={() => setTelaAtiva('dashboard')} 
                className={`py-1.5 px-3 rounded font-semibold text-xs transition-all ${telaAtiva === 'dashboard' ? 'bg-[#C5A059] text-[#060B16]' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'}`}
              >
                Painel
              </button>

              <button 
                id="btn-logout"
                onClick={handleLogout} 
                className="p-1.5 rounded bg-red-950/40 border border-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors" 
                title="Sair do Sistema"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <button 
                id="btn-entrar-header"
                onClick={() => setTelaAtiva('login')} 
                className="py-1.5 px-4 bg-transparent hover:bg-slate-900 border border-[#C5A059]/30 text-white font-semibold rounded transition"
              >
                Entrar
              </button>
              <button 
                id="btn-teste-header"
                onClick={() => { setTelaAtiva('login'); setRecuperandoSenha(false); }} 
                className="py-1.5 px-4 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 text-[#060B16] font-bold rounded transition shadow-lg shadow-[#C5A059]/20"
              >
                Teste Grátis
              </button>
            </div>
          )}
        </div>
      </header>

      {/* FEEDBACK DE SUCESSO / ERRO */}
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-4">
        {mensagemSucesso && (
          <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-900/50 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in" id="success-bar">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{mensagemSucesso}</span>
          </div>
        )}
        {mensagemErro && (
          <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-900/50 text-xs text-red-300 flex items-start gap-2.5 animate-fade-in" id="error-bar">
            <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
            <span className="flex-1">{mensagemErro}</span>
          </div>
        )}
      </div>

      {/* TELA DE DESTINO: 1. LANDING PAGE */}
      {telaAtiva === 'landing' && (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-10 flex flex-col gap-12" id="landing-page">
          
          {/* Hero Banner Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/40 text-[#C5A059] text-xs font-semibold">
              <Sparkle className="w-3.5 h-3.5" />
              <span>Plataforma Premium de Cálculos Jurídicos</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              A Solução Definitiva em <br />
              <span className="bg-gradient-to-r from-[#C5A059] via-[#E4C58E] to-[#C5A059] bg-clip-text text-transparent">Cálculos Previdenciários Brasileiros</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              O PrevCalculus foi desenhado especificamente para advogados previdenciaristas. Execute revisões do RGPS/RPPS, liquidações de sentença, cálculos de atrasados, etc., com relatórios analíticos ricos e inteligência jurídica Gemini 3.5.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button 
                id="btn-hero-teste"
                onClick={() => { setPlanoAtivo('ouro'); setEstaLogado(true); setTelaAtiva('dashboard'); }} 
                className="py-3 px-8 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#060B16] hover:brightness-110 font-bold text-sm rounded-lg transition-transform active:scale-97 shadow-xl shadow-[#C5A059]/20"
              >
                Experimentar Versão Ouro Grátis
              </button>
              <button 
                id="btn-hero-login"
                onClick={() => setTelaAtiva('login')} 
                className="py-3 px-8 bg-[#090F1E] hover:bg-slate-900 border border-slate-800 text-white font-semibold text-sm rounded-lg transition"
              >
                Área do Advogado
              </button>
            </div>
          </div>

          {/* Seção das Principais Diferenciais e Módulos */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-center text-white tracking-wide uppercase">Cálculos Disponíveis no Navegador</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { t: "Liquidação de Sentença", d: "Apure parcelas judiciais vencidas com correção INPC/IPCA-E e juros regressivos.", icon: FileText },
                { t: "Planejamento RGPS (EC 103/19)", d: "Simule regras de transição por pontos, pedágios, direito adquirido e coeficiente de RMI.", icon: Calculator },
                { t: "Revisão de Benefício RGPS", d: "Estime a viabilidade de teses clássicas como Revisão da Vida Toda e Revisão do Teto.", icon: TrendingUp },
                { t: "Atrasados INSS", d: "Calcule montantes acumulados desde a DER e verifique limites do rito nos JEFs.", icon: BadgeDollarSign },
                { t: "Análise BPC/LOAS", d: "Valide o critério de per capita de renda e miserabilidade para idosos e deficientes.", icon: UserCheck },
                { t: "Restabelecimento de Auxílio", d: "Estime indenização de períodos suspensos por perícias administrativas de alta.", icon: Scale },
                { t: "RPPS União & Estados/Muni", d: "Calcule alíquotas progressivas federais e regras específicas locais com precisão.", icon: Layers },
                { t: "Contribuições em Atraso", d: "Compute o recolhimento de autônomos com multa regulamentar e juros de mora.", icon: Calendar }
              ].map((mod, index) => (
                <div key={index} className="p-5 rounded-xl border border-[#C5A059]/10 bg-[#0A1121]/80 shadow-md space-y-3 hover:border-[#C5A059]/30 transition duration-300">
                  <div className="p-2.5 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/20 w-fit">
                    <mod.icon className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">{mod.t}</h4>
                  <p className="text-slate-400 text-xs leading-normal">{mod.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PLANOS BRONZE, PRATA E OURO */}
          <div className="space-y-8 py-6">
            <div className="text-center space-y-2">
              <h3 className="text-md font-mono text-[#C5A059] font-black uppercase tracking-wider">Planos & Assinaturas</h3>
              <p className="text-lg sm:text-2xl font-bold text-white tracking-normal">Escolha a Assinatura Ideal para o Porte do Seu Escritório</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANOS_INFO.map((plano, i) => (
                <div 
                  key={i} 
                  className={`p-6 rounded-2xl border ${plano.destaque ? 'border-[#C5A059] bg-[#0A1326]' : 'border-slate-900 bg-[#080E1C]'} shadow-xl relative flex flex-col justify-between space-y-6`}
                >
                  {plano.destaque && (
                    <div className="absolute top-0 right-1/2 translate-y-[-50%] translate-x-[50%] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#060B16] font-bold text-[10px] tracking-wider uppercase py-1 px-3 rounded-full">
                      Recomendado
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">{plano.nome}</span>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-xl sm:text-2xl font-black text-white">{plano.preco}</span>
                    </div>
                    <p className="text-slate-500 text-[10px] mt-1.5 font-mono">Permite até {plano.limiteClientes === 9999 ? 'Ilimitados' : plano.limiteClientes} clientes cadastrados na nuvem.</p>
                  </div>

                  <ul className="space-y-2.5 text-xs">
                    {plano.caracteristicas.map((feat, fIdx) => (
                      <li key={fIdx} className="text-slate-300 flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    id={`btn-selecionar-plano-${plano.tier}`}
                    onClick={() => {
                      setPlanoAtivo(plano.tier);
                      setEstaLogado(true);
                      setTelaAtiva('dashboard');
                      setMensagemSucesso(`Assinatura ativada: ${plano.nome}. Modos habilitados com sucesso!`);
                      setTimeout(() => setMensagemSucesso(null), 3500);
                    }}
                    className={`w-full py-2.5 font-bold text-xs rounded-lg uppercase tracking-wide transition ${plano.destaque ? 'bg-[#C5A059] hover:bg-[#D4AF37] text-[#060B16]' : 'bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200'}`}
                  >
                    Ativar {plano.nome.split(' (')[0]}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* TELA DE DESTINO: 2. LOGIN E CADASTRO */}
      {telaAtiva === 'login' && (
        <main className="flex-1 w-full max-w-sm mx-auto px-4 py-12 flex flex-col justify-center gap-6" id="login-layout">
          <div className="bg-[#080E1C] border border-[#C5A059]/20 rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#C5A059] to-[#D4AF37]" />
            
            <div className="text-center space-y-1.5 pl-2">
              <Scale className="w-8 h-8 text-[#C5A059] mx-auto" />
              <h2 className="text-md font-bold uppercase tracking-wide text-white">Acesso do Advogado PrevCalculus</h2>
              <p className="text-slate-400 text-xs text-center">Informe suas credenciais ou inicie uma conta demonstrativa imediata para testar.</p>
            </div>

            {recuperandoSenha ? (
              // Formulário Recuperação de Senha
              <form onSubmit={(e) => {
                e.preventDefault();
                alert(`Um e-mail para redefinição emergencial de senha foi supostamente encaminhado para o endereço ${loginEmail || 'informado'} nos termos LGPD.`);
                setRecuperandoSenha(false);
              }} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 text-[11px] uppercase tracking-wide font-medium block">E-mail Cadastrado</label>
                  <input 
                    type="email" 
                    placeholder="e.g. eduardo@advocacia.com"
                    required
                    className="w-full bg-[#03060C] border border-slate-800 text-slate-100 text-xs rounded-lg p-2.5 outline-none focus:border-[#C5A059]"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-2 bg-[#C5A059] text-[#060B16] font-bold text-xs rounded-lg uppercase transition-colors"
                >
                  Recuperar Senha
                </button>
                <button 
                  type="button" 
                  onClick={() => setRecuperandoSenha(false)} 
                  className="w-full text-slate-400 text-[11px] text-center block pt-1 hover:underline"
                >
                  Retornar ao formulário de acesso
                </button>
              </form>
            ) : (
              // Formulário Login Padrão
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 text-[11px] uppercase tracking-wide font-medium block">E-mail Profissional</label>
                  <input 
                    type="email" 
                    placeholder="e.g. eduardo.adv@previdencia.com"
                    required
                    className="w-full bg-[#03060C] border border-slate-800 focus:border-[#C5A059]/60 text-slate-100 text-xs rounded-lg p-2.5 outline-none transition-colors"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-400 text-[11px] uppercase tracking-wide font-medium">Senha Profissional</label>
                    <button 
                      type="button" 
                      onClick={() => setRecuperandoSenha(true)} 
                      className="text-[#C5A059] text-[10px] hover:underline"
                    >
                      Esqueci a Senha
                    </button>
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#03060C] border border-slate-800 focus:border-[#C5A059]/60 text-slate-100 text-xs rounded-lg p-2.5 outline-none transition-colors"
                    value={loginSenha}
                    onChange={(e) => setLoginSenha(e.target.value)}
                  />
                </div>

                <div className="text-[10px] text-slate-500 bg-[#0A1221] border border-slate-900 rounded-lg p-2">
                  💡 <strong>Ambiente Demonstrativo Seguro:</strong> Você pode inserir qualquer endereço de e-mail e senha para realizar o login e iniciar simulações!
                </div>

                <button 
                  id="btn-login-submit"
                  type="submit" 
                  className="w-full py-2.5 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 text-[#060B16] font-bold text-xs rounded-lg uppercase tracking-wider shadow-lg transition"
                >
                  Entrar no Sistema
                </button>

                <div className="text-center pt-2">
                  <span className="text-[11px] text-slate-400">Novo por aqui? </span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setPlanoAtivo('prata');
                      setEstaLogado(true);
                      setTelaAtiva('dashboard');
                    }}
                    className="text-[#C5A059] font-bold text-[11px] hover:underline"
                  >
                    Ativar Conta Teste Grátis Rapido
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      )}

      {/* TELA DE DESTINO: 3. DASHBOARD INTEGRADO */}
      {telaAtiva === 'dashboard' && (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6" id="dashboard-layout">
          
          {/* Header Resumo da Advocacia e fita de Alerta de Limites por Plano */}
          <div className="p-4 p-5 rounded-2xl bg-gradient-to-r from-[#070F1E] via-[#0A1424] to-[#0D1B2E] border border-[#C5A059]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
            <div className="space-y-1.5">
              <span className="text-[10px] text-[#C5A059] font-bold tracking-widest uppercase block">Workspace Ativo</span>
              <h2 className="text-white text-md sm:text-xl font-bold">Painel de Acompanhamento {usuarioNome}</h2>
              <p className="text-xs text-slate-400">Selecione ou cadastre um segurado abaixo na base para carregar os prontuários e executar os cálculos.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-slate-400">Limitações do seu plano <strong className="text-white uppercase">{planoAtivo}</strong>:</span>
              <span className="text-[10px] text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono">
                Clientes: {clientes.length} de {PLANOS_INFO.find(p => p.tier === planoAtivo)?.limiteClientes || 5}
              </span>
              <span className="text-[10px] text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono">
                Cálculos: {calculos.length} de {PLANOS_INFO.find(p => p.tier === planoAtivo)?.limiteCalculos || 10}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COLUNA ESQUERDA (4 COLS): Base de Clientes do Advogado */}
            <div className="lg:col-span-4 bg-[#080E1C] border border-[#C5A059]/10 rounded-2xl p-4 shadow-xl space-y-4 flex flex-col justify-between" id="base-clientes-col">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-900">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#C5A059]" />
                    Segurados Cadastrados ({clientesFiltrados.length})
                  </h3>
                  <button 
                    id="btn-trigger-form-cliente"
                    onClick={() => setMostrarFormNovoCliente(!mostrarFormNovoCliente)} 
                    className="p-1 rounded bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 hover:bg-[#C5A059]/20 transition-colors"
                    title="Cadastrar Novo Cliente"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Form para Adicionar Cliente */}
                {mostrarFormNovoCliente && (
                  <form onSubmit={handleCadastrarCliente} className="bg-[#050A14] border border-slate-800 rounded-xl p-3.5 mt-3 space-y-3.5 animate-fade-in text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-900">
                      <span className="text-[#C5A059] font-bold uppercase tracking-widest text-[9px]">Nova Conta de Segurado</span>
                      <button type="button" onClick={() => setMostrarFormNovoCliente(false)} className="text-slate-400 hover:text-white">X</button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 text-[10px] uppercase font-bold">Nome Completo</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Nome completo do segurado(a)"
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-lg outline-none transition-colors focus:border-[#C5A059]"
                        value={novoCliNome}
                        onChange={(e) => setNovoCliNome(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-slate-400 text-[10px] uppercase font-bold">CPF</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. 111.222.333-44"
                          className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-lg outline-none transition-colors focus:border-[#C5A059]"
                          value={novoCliCpf}
                          onChange={(e) => setNovoCliCpf(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 text-[10px] uppercase font-bold text-slate-400">Nascimento</label>
                        <input 
                          type="date" 
                          className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-1.5 rounded-lg text-xs outline-none focus:border-[#C5A059]"
                          value={novoCliNasc}
                          onChange={(e) => setNovoCliNasc(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-slate-400 text-[10px] uppercase font-bold">Gênero</label>
                        <select 
                          className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={novoCliGenero}
                          onChange={(e) => setNovoCliGenero(e.target.value as 'M' | 'F')}
                        >
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 text-[10px] uppercase font-bold">Meses de Carência</label>
                        <input 
                          type="number" 
                          className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={novoCliCarencia}
                          onChange={(e) => setNovoCliCarencia(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 text-[10px] uppercase font-bold block">Tempo Total de Contribuição</label>
                      <div className="grid grid-cols-3 gap-2">
                        <input 
                          type="number" 
                          placeholder="Anos"
                          className="bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-lg outline-none text-center"
                          value={novoCliTempoAnos}
                          onChange={(e) => setNovoCliTempoAnos(Number(e.target.value))}
                        />
                        <input 
                          type="number" 
                          placeholder="Meses" 
                          className="bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-lg outline-none text-center"
                          value={novoCliTempoMeses}
                          onChange={(e) => setNovoCliTempoMeses(Number(e.target.value))}
                        />
                        <input 
                          type="number" 
                          placeholder="Dias" 
                          className="bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-lg outline-none text-center"
                          value={novoCliTempoDias}
                          onChange={(e) => setNovoCliTempoDias(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-2 bg-[#C5A059] text-[#060B16] font-bold rounded-lg uppercase tracking-wide hover:bg-[#D4AF37] transition"
                    >
                      Cadastrar Segurado
                    </button>
                  </form>
                )}

                {/* Filtro de Busca de Clientes */}
                <div className="relative mt-2">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Filtrar por nome ou CPF..."
                    className="w-full bg-[#03060C] border border-slate-900 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-300 placeholder:text-slate-600 outline-none focus:border-[#C5A059]/40"
                    value={buscaCliente}
                    onChange={(e) => setBuscaCliente(e.target.value)}
                  />
                </div>

                {/* Listagem de Clientes Cadastrados */}
                <div className="space-y-2 mt-3 max-h-[360px] overflow-y-auto pr-1">
                  {clientesFiltrados.length === 0 ? (
                    <p className="text-slate-500 text-xs text-center py-6 block italic">Nenhum cliente previdenciário localizado.</p>
                  ) : (
                    clientesFiltrados.map((cli) => {
                      const ativo = cli.id === clienteSelecionadoId;
                      return (
                        <div 
                          key={cli.id} 
                          id={`cliente-card-${cli.id}`}
                          onClick={() => {
                            setClienteSelecionadoId(cli.id);
                            // Reseta resultado de cálculos anteriores ao trocar segurado
                            setCalcResultado(null);
                            setParecerIATexto('');
                            setParecerIAStatus('ocioso');
                          }}
                          className={`p-3 rounded-lg border text-left cursor-pointer transition flex items-start justify-between gap-2.5 ${ativo ? 'border-[#C5A059] bg-[#0F1D33]' : 'border-slate-900 bg-[#060A13] hover:border-slate-800 hover:bg-slate-900/60'}`}
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-white block truncate max-w-[190px]">{cli.nome}</span>
                              {cli.favorito && <Star className="w-3 h-3 text-[#C5A059] fill-[#C5A059]" />}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900">{cli.cpf}</span>
                              <span className="text-[10px] text-slate-500">
                                🎂 {new Date().getFullYear() - new Date(cli.dataNascimento).getFullYear()} anos ({cli.genero === 'F' ? 'Fem' : 'Masc'})
                              </span>
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono">
                              💼 {cli.tempoAnos}a, {cli.tempoMeses}m e {cli.tempoDias}d total
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => handleToggleFavorito(cli.id)}
                              className="text-slate-500 hover:text-[#C5A059] p-1 rounded hover:bg-slate-900"
                              title="Marcar favorito"
                            >
                              <Star className={`w-3.5 h-3.5 ${cli.favorito ? 'text-[#C5A059] fill-[#C5A059]' : ''}`} />
                            </button>
                            <button 
                              onClick={() => handleDeletarCliente(cli.id, cli.nome)}
                              className="text-slate-600 hover:text-red-400 p-1 rounded hover:bg-slate-900"
                              title="Remover segurado"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Box Informativo para o Advogado */}
              <div className="bg-[#050A14] border border-slate-900 rounded-xl p-3 text-[10px] space-y-1.5 text-slate-500">
                <span className="font-bold text-[#C5A059] block uppercase tracking-wider text-[9px]">Anotações Técnicas da Semana</span>
                <p className="leading-relaxed">
                  Lembre-se: O Teto do INSS foi reajustado para o patamar de <strong>R$ {TETO_INSS_2026.toFixed(2)}</strong> em 2026, com o salário mínimo nacional fixado em <strong>R$ {SALARIO_MINIMO_2026.toFixed(2)}</strong>. Revise carência e tempo antes de simular.
                </p>
              </div>
            </div>

            {/* COLUNA DIREITA (8 COLS): CENTRAL DE CÁLCULO E FORMULÁRIOS VIGENTES */}
            <div className="lg:col-span-8 space-y-6" id="central-calculos-col">
              
              {/* Seleção do Módulo de Cálculo */}
              <div className="bg-[#080E1C] border border-[#C5A059]/15 rounded-2xl p-4 shadow-xl space-y-3.5">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-300">
                  <Calculator className="w-4.5 h-4.5 text-[#C5A059]" />
                  <span>Selecione o Módulo Previdenciário Requerido:</span>
                </div>

                <div className="flex flex-wrap gap-1.5" id="botoes-modulos-grid">
                  {[
                    { id: 'liquidacao', label: '1. Liquidação de Sentença' },
                    { id: 'planejamento', label: '2. Planejamento RGPS' },
                    { id: 'revisao', label: '3. Revisão de Benefício' },
                    { id: 'atrasados', label: '4. Cálculo de Atrasados' },
                    { id: 'bpc', label: '5. BPC / LOAS' },
                    { id: 'restabelecimento', label: '6. Restabelecimento' },
                    { id: 'rpps_uniao', label: '7. RPPS União' },
                    { id: 'rpps_est_mun', label: '8. RPPS Estados/Mun.' },
                    { id: 'complementacao', label: '9. Complementação' },
                    { id: 'atraso_contribuicao', label: '10. Contrib. em Atraso' }
                  ].map((btn) => {
                    const ativo = tipoCalculoAtivo === btn.id;
                    return (
                      <button
                        key={btn.id}
                        id={`modulo-btn-${btn.id}`}
                        onClick={() => {
                          setTipoCalculoAtivo(btn.id as TipoCalculo);
                          setCalcResultado(null);
                          setParecerIATexto('');
                          setParecerIAStatus('ocioso');
                        }}
                        className={`py-2 px-3 text-left rounded-lg text-xs font-semibold cursor-pointer transition ${ativo ? 'bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#060B16] font-bold shadow-lg shadow-[#C5A059]/10' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'}`}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PAINEL DE INPUTS DOS MÓDULOS */}
              <div className="bg-[#080E1C] border border-[#C5A059]/10 rounded-2xl p-5 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-[#C5A059]" />
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">Ficha de Simulação Ativa</h3>
                      <p className="text-[10px] text-slate-400">Preencha os dados e execute o processador de cálculos.</p>
                    </div>
                  </div>

                  {clienteAtivo && (
                    <div className="text-right text-[11px] bg-slate-900/60 border border-slate-800 py-1 px-3 rounded-lg inline-block">
                      <span>Análise ativa para: </span>
                      <strong className="text-white">{clienteAtivo.nome}</strong>
                    </div>
                  )}
                </div>

                {/* FORMULÁRIO DINÂMICO CONFORME MÓDULO SELECIONADO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-left" id="campos-formulario-prev">
                  
                  {/* MÓDULO 1: Liquidação de Sentença */}
                  {tipoCalculoAtivo === 'liquidacao' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">RMI a Corrigir (R$)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inLiquidacaoSalario}
                          onChange={(e) => setInLiquidacaoSalario(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Quantidade de Competências (Meses de atraso)</label>
                        <input 
                          type="number" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inLiquidacaoMeses}
                          onChange={(e) => setInLiquidacaoMeses(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Índice Corretivo do INSS</label>
                        <select 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inLiquidacaoIndice}
                          onChange={(e) => setInLiquidacaoIndice(e.target.value as 'INPC' | 'IPCA-E')}
                        >
                          <option value="INPC">INPC (Oficial de benefícios previdenciários)</option>
                          <option value="IPCA-E">IPCA-E (Liquidações de débitos gerais)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Juros Monetários Legais (% ao mês)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inLiquidacaoJuros}
                          onChange={(e) => setInLiquidacaoJuros(Number(e.target.value))}
                        />
                      </div>
                    </>
                  )}

                  {/* MÓDULO 2: Planejamento Previdenciário RGPS */}
                  {tipoCalculoAtivo === 'planejamento' && (
                    <>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-slate-400 font-medium block">Média Aritmética de Contribuições (R$)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inPlanejamentoMedia}
                          onChange={(e) => setInPlanejamentoMedia(Number(e.target.value))}
                        />
                        <span className="text-[10px] text-slate-500 block pt-1">Considera-se 100% das contribuições apuradas no CNIS desde julho de 1994, conforme a EC 103/19.</span>
                      </div>
                      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1 text-[11px] md:col-span-2">
                        <span className="text-[#C5A059] font-bold block uppercase tracking-wider text-[9px]">Prontuário Ativo do Segurado:</span>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-300">
                          <div>IDADE: <strong>{clienteAtivo ? (new Date().getFullYear() - new Date(clienteAtivo.dataNascimento).getFullYear()) : 65} anos</strong></div>
                          <div>GÊNERO: <strong>{clienteAtivo ? (clienteAtivo.genero === 'F' ? 'Fem' : 'Masc') : 'Masc'}</strong></div>
                          <div>TEMPO: <strong>{clienteAtivo ? clienteAtivo.tempoAnos : 20} anos</strong></div>
                          <div>CARÊNCIA: <strong>{clienteAtivo ? clienteAtivo.carencia : 180} meses</strong></div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* MÓDULO 3: Revisão de Benefício RGPS */}
                  {tipoCalculoAtivo === 'revisao' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">RMI Concedida Original (R$)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inRevisaoOriginal}
                          onChange={(e) => setInRevisaoOriginal(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Data do Recebimento Inicial (Aposentadoria)</label>
                        <input 
                          type="date" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inRevisaoData}
                          onChange={(e) => setInRevisaoData(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-slate-400 font-medium">Tese de Revisão Jurisprudencial</label>
                        <select 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inRevisaoTipo}
                          onChange={(e) => setInRevisaoTipo(e.target.value as 'vida_toda' | 'teto')}
                        >
                          <option value="vida_toda">Revisão da Vida Toda (Inclusão PBC completo pré-1994)</option>
                          <option value="teto">Revisão dos Tetos (Ajuste das datas nas Emendas Ecs 20 e 41)</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* MÓDULO 4: Cálculo de Atrasados INSS */}
                  {tipoCalculoAtivo === 'atrasados' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Valor Estimado do Benefício Mensal (R$)</label>
                        <input 
                          type="number" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inAtrasadosValor}
                          onChange={(e) => setInAtrasadosValor(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Tempo total de inadimplência (Meses)</label>
                        <input 
                          type="number" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inAtrasadosMeses}
                          onChange={(e) => setInAtrasadosMeses(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-slate-400 font-medium flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={inAtrasadosJuros}
                            onChange={(e) => setInAtrasadosJuros(e.target.checked)}
                            className="accent-[#C5A059] scale-110 shrink-0"
                          />
                          <span>Aplicar incidência de Juros de Mora de 0.5% a.m.?</span>
                        </label>
                      </div>
                    </>
                  )}

                  {/* MÓDULO 5: BPC / LOAS */}
                  {tipoCalculoAtivo === 'bpc' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Tipo de Requerente</label>
                        <select 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inBpcTipo}
                          onChange={(e) => setInBpcTipo(e.target.value as 'idoso' | 'deficiente')}
                        >
                          <option value="idoso">Idoso (65 anos ou mais)</option>
                          <option value="deficiente">Pessoa com Deficiência (Barreiras de longo prazo)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Idade Declarada</label>
                        <input 
                          type="number" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inBpcIdade}
                          onChange={(e) => setInBpcIdade(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Membros no Grupo Familiar</label>
                        <input 
                          type="number" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inBpcFamilia}
                          onChange={(e) => setInBpcFamilia(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Renda Familiar Mensal Bruta (R$)</label>
                        <input 
                          type="number" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inBpcRendaBruta}
                          onChange={(e) => setInBpcRendaBruta(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-slate-400 font-medium flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={inBpcVulnerabilidade}
                            onChange={(e) => setInBpcVulnerabilidade(e.target.checked)}
                            className="accent-[#C5A059] scale-110"
                          />
                          <span>Há laudo atestando barreira de longo prazo / vulnerabilidade socioeconômica extrema?</span>
                        </label>
                      </div>
                    </>
                  )}

                  {/* MÓDULO 6: Restabelecimento */}
                  {tipoCalculoAtivo === 'restabelecimento' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">RMI Benefício Interrompido (R$)</label>
                        <input 
                          type="number" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inRestabOriginal}
                          onChange={(e) => setInRestabOriginal(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Meses Transcorridos desde o Corte</label>
                        <input 
                          type="number" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inRestabMeses}
                          onChange={(e) => setInRestabMeses(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-slate-400 font-medium">Motivo do Cancelamento pelo INSS</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Inaptidão declarada em perícia de rotina de pente fino"
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2.5 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inRestabMotivo}
                          onChange={(e) => setInRestabMotivo(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* MÓDULO 7: RPPS União */}
                  {tipoCalculoAtivo === 'rpps_uniao' && (
                    <>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-slate-400 font-mediumBlock">Remuneração Recebida na Ativa (R$)</label>
                        <input 
                          type="number" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2.5 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inRppsUniaoSalario}
                          onChange={(e) => setInRppsUniaoSalario(Number(e.target.value))}
                        />
                        <span className="text-[10px] text-slate-500 block pt-1">O cálculo aplicará a tabela progressiva oficial estabelecida pelo Governo Federal (7.5% até 22%), conforme faixas salariais.</span>
                      </div>
                    </>
                  )}

                  {/* MÓDULO 8: RPPS Estados e Municípios */}
                  {tipoCalculoAtivo === 'rpps_est_mun' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Salário Ativo do Servidor (R$)</label>
                        <input 
                          type="number" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inRppsEstMunSalario}
                          onChange={(e) => setInRppsEstMunSalario(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Alíquota Previdenciária Local Fixada (%)</label>
                        <input 
                          type="number" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inRppsEstMunAliquota}
                          onChange={(e) => setInRppsEstMunAliquota(Number(e.target.value))}
                        />
                      </div>
                    </>
                  )}

                  {/* MÓDULO 9: Complementação Previdenciária */}
                  {tipoCalculoAtivo === 'complementacao' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Último Salário Ativo (R$)</label>
                        <input 
                          type="number" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inCompSalarioAtivo}
                          onChange={(e) => setInCompSalarioAtivo(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Aposentadoria Estimada pelo RGPS (Limitada ao Teto) (R$)</label>
                        <input 
                          type="number" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inCompAposentadoriaRgps}
                          onChange={(e) => setInCompAposentadoriaRgps(Number(e.target.value))}
                        />
                      </div>
                    </>
                  )}

                  {/* MÓDULO 10: Contribuições Previdenciárias em Atraso */}
                  {tipoCalculoAtivo === 'atraso_contribuicao' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Salário-Base de Referência Pretendido (R$)</label>
                        <input 
                          type="number" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inAtrasoBaseSalario}
                          onChange={(e) => setInAtrasoBaseSalario(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Quantidade total de parcelas (Meses atrasados)</label>
                        <input 
                          type="number" 
                          className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
                          value={inAtrasoMeses}
                          onChange={(e) => setInAtrasoMeses(Number(e.target.value))}
                        />
                      </div>
                    </>
                  )}

                </div>

                {/* BOTÃO DE DISPARO DA CENTRAL DE CÁLCULO */}
                <button 
                  id="btn-processar-calculo"
                  onClick={executarCalculoAtivo}
                  className="w-full py-3 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#060B16] font-bold uppercase text-xs tracking-wider rounded-xl hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-[#C5A059]/10"
                >
                  🚀 Executar Processamento e Gerar Memória de Cálculo
                </button>
              </div>

              {/* CARD DE RESULTADOS TÉCNICOS E MEMÓRIA DE CÁLCULO */}
              {calcResultado && (
                <div className="bg-[#091020] border border-[#C5A059]/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden animate-fade-in" id="resultado-calculo-box">
                  <div className="absolute top-0 right-0 py-1.5 px-3 bg-[#C5A059] text-[#060B16] font-bold text-[9px] uppercase tracking-wider rounded-bl-xl shadow-lg">
                    Cálculo Concluído
                  </div>

                  <div className="border-b border-[#C5A059]/10 pb-4 mb-4">
                    <h3 className="text-[#C5A059] font-bold text-xs uppercase tracking-widest">Resumo Atuarial Apurado</h3>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl">
                        <span className="text-[10px] text-slate-500 uppercase block font-bold">Valor Base / Original</span>
                        <span className="text-sm font-semibold text-slate-300 font-mono">
                          R$ {
                            calcResultado.resumo ? calcResultado.resumo.totalOriginal.toLocaleString('pt-BR') :
                            calcResultado.acumuladoDevidoOriginal ? calcResultado.acumuladoDevidoOriginal.toLocaleString('pt-BR') :
                            calcResultado.principalTotal ? calcResultado.principalTotal.toLocaleString('pt-BR') :
                            tipoCalculoAtivo === 'bpc' ? SALARIO_MINIMO_2026.toLocaleString('pt-BR') :
                            tipoCalculoAtivo === 'rpps_uniao' ? inRppsUniaoSalario.toLocaleString('pt-BR') :
                            '0,00'
                          }
                        </span>
                      </div>

                      <div className="p-3 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl relative">
                        <span className="text-[10px] text-[#C5A059] uppercase block font-bold">Montante Consolidado</span>
                        <span className="text-md font-bold text-[#E4C58E] font-mono">
                          R$ {
                            calcResultado.resumo ? calcResultado.resumo.totalGeral.toLocaleString('pt-BR') :
                            calcResultado.totalGeral ? calcResultado.totalGeral.toLocaleString('pt-BR') :
                            calcResultado.totalDevidoAtrasado ? calcResultado.totalDevidoAtrasado.toLocaleString('pt-BR') :
                            calcResultado.rmiCalculada ? calcResultado.rmiCalculada.toLocaleString('pt-BR') :
                            calcResultado.acumuladoAtualizado ? calcResultado.acumuladoAtualizado.toLocaleString('pt-BR') :
                            calcResultado.descontoTotal ? calcResultado.descontoTotal.toLocaleString('pt-BR') :
                            calcResultado.salarioLiquido ? calcResultado.salarioLiquido.toLocaleString('pt-BR') :
                            calcResultado.deficitSuprir ? calcResultado.deficitSuprir.toLocaleString('pt-BR') :
                            tipoCalculoAtivo === 'bpc' ? SALARIO_MINIMO_2026.toLocaleString('pt-BR') :
                            '0,00'
                          }
                        </span>
                      </div>

                      <div className="p-3 bg-slate-950/60 border border-[#C5A059]/10 rounded-xl">
                        <span className="text-[10px] text-slate-500 uppercase block font-bold">Encargos de Mora / Juros</span>
                        <span className="text-sm font-semibold text-rose-400 font-mono">
                          R$ {
                            calcResultado.resumo ? calcResultado.resumo.totalJuros.toLocaleString('pt-BR') :
                            calcResultado.jurosTotal ? calcResultado.jurosTotal.toLocaleString('pt-BR') :
                            calcResultado.multaTotal ? (calcResultado.multaTotal + calcResultado.jurosTotal).toLocaleString('pt-BR') :
                            '0,00'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* MEMÓRIA DE CÁLCULO E TEXTOS */}
                  <div className="space-y-3.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Memória Técnica e Parâmetros Utilizados</span>
                    <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-line text-left">
                      {calcResultado.memoria}
                    </div>

                    {calcResultado.requisitos && (
                      <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-900 text-xs text-slate-300">
                        <strong className="text-[#C5A059] uppercase text-[10px] block tracking-wider font-extrabold">Revisão de Regras de Enquadramento:</strong>
                        <ul className="mt-1.5 space-y-1">
                          <li>• Idade Mínima ({calcResultado.requisitos.idadeMinima} anos): <strong>{calcResultado.requisitos.atendeIdade ? '✅ Atingido' : '❌ Pendente'}</strong></li>
                          <li>• Tempo de Contribuição Mínimo ({calcResultado.requisitos.tempoMinimo} anos): <strong>{calcResultado.requisitos.atendeTempo ? '✅ Atingido' : '❌ Pendente'}</strong></li>
                          <li>• Carência Mínima (180 meses): <strong>{calcResultado.requisitos.atendeCarencia ? '✅ Atingido' : '❌ Pendente'}</strong></li>
                          <li>• Regra Especial de Pontos ({calcResultado.requisitos.pontosExigidos} pts em 2026): O candidato alcançou <strong>{calcResultado.requisitos.pontosAtuais}</strong> pontos. Status: <strong>{calcResultado.requisitos.atendePontos ? '✅ Elegível' : '❌ Pendente'}</strong>.</li>
                        </ul>
                        <div className="mt-2.5 p-2 bg-[#C5A059]/10 text-slate-200 rounded border border-[#C5A059]/20 font-bold text-[11px] leading-normal">{calcResultado.recomendacao}</div>
                      </div>
                    )}

                    {tipoCalculoAtivo === 'bpc' && (
                      <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-900 text-xs">
                        <strong className="text-[#C5A059] uppercase text-[10px] block">Parecer de Admissibilidade do BPC:</strong>
                        <p className="mt-1 text-slate-300 leading-relaxed">
                          • Renda familiar per capita calculada: R$ {calcResultado.rendaPerCapita.toFixed(2)} por membro. <br />
                          • Limite assistencial padrão (1/4 do mínimo): R$ {calcResultado.limitePadraoLoas.toFixed(2)}. <br />
                          • Diagnóstico Objetivo: <strong>{calcResultado.parecerVeredito}</strong>
                        </p>
                      </div>
                    )}

                    {/* GRÁFICO PREVIDENCIÁRIO EM SVG CUSTOMIZADO - PREMIUM DESIGN */}
                    <div className="p-4 bg-slate-950/80 border border-slate-900 rounded-xl mt-3 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#C5A059] font-bold uppercase tracking-wider text-[9px]">Histórico Consolidado e Distribuição de Receitas</span>
                        <span className="text-[10px] text-slate-500">Curva de Evolução Corrigida IPCA-E/INPC</span>
                      </div>
                      
                      {/* Gráfico SVG Simulado Fluído com Alinhamento */}
                      <div className="relative h-28 w-full bg-gradient-to-t from-slate-950 to-[#0A1221] rounded-lg border border-slate-900 p-2 flex items-end justify-between overflow-hidden">
                        
                        {/* Linhas de Grade de Fundo */}
                        <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-15">
                          <hr className="border-slate-800 w-full" />
                          <hr className="border-slate-800 w-full" />
                          <hr className="border-slate-800 w-full" />
                        </div>

                        {/* Colunas do Gráfico */}
                        {[
                          { m: "Jan", v: 45, c: "bg-slate-800" },
                          { m: "Fev", v: 55, c: "bg-slate-700" },
                          { m: "Mar", v: 62, c: "bg-indigo-900" },
                          { m: "Abr", v: 70, c: "bg-[#C5A059]/60" },
                          { m: "Mai", v: 85, c: "bg-gradient-to-t from-[#C5A059] to-[#D4AF37]" }
                        ].map((bar, bIdx) => (
                          <div key={bIdx} className="flex flex-col items-center gap-1.5 z-10 w-12 group/bar">
                            <span className="text-[8px] font-mono text-[#C5A059] opacity-0 group-hover/bar:opacity-100 transition-opacity">R$ {(bar.v * 90).toFixed(0)}</span>
                            <div 
                              className={`w-4 rounded-t transition-all duration-500 hover:brightness-125 ${bar.c}`}
                              style={{ height: `${bar.v}px` }}
                            />
                            <span className="text-[9px] text-slate-600 font-mono">{bar.m}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* BOTÕES DE IMPRESSÃO E PARECER INTELIGENTE COMPLETO */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-3">
                      <button 
                        id="btn-imprimir-memoria"
                        onClick={() => window.print()}
                        className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-200 font-bold flex items-center justify-center gap-2 transition active:scale-[0.98]"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Imprimir Memória de Cálculo</span>
                      </button>

                      <button 
                        id="btn-ia-parecer"
                        onClick={handleGerarParecerIA}
                        disabled={parecerIAStatus === 'gerando'}
                        className="flex-1 py-2.5 bg-[#09152B] hover:bg-[#0E2244] disabled:bg-slate-900 disabled:text-slate-600 border border-[#C5A059]/40 rounded-xl text-xs text-white font-bold flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg shadow-indigo-950/50"
                      >
                        {parecerIAStatus === 'gerando' ? (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent border-indigo-400 animate-spin" />
                            <span>IA Formulando Considerações...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
                            <span>Gerar Parecer IA (Exclusivo Ouro)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* TEXTO DO PARECER DA IA GEMINI */}
                    {parecerIATexto && (
                      <div className="mt-4 p-4.5 rounded-xl bg-gradient-to-b from-[#0A1121] to-[#040812] border border-[#C5A059]/40 text-left animate-fade-in" id="parecer-ia-texto-container">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#E4C58E] pb-2 border-b border-[#C5A059]/10 mb-2.5">
                          <Sparkle className="w-4 h-4 text-[#C5A059] animate-pulse" />
                          <span>ANÁLISE INTEGRAL GERADA PELA IA GEMINI 3.5</span>
                        </div>
                        <div className="text-slate-300 text-xs sm:text-xs leading-relaxed whitespace-pre-line prose max-w-none text-left font-sans">
                          {parecerIATexto}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* HISTÓRICO DE SIMULAÇÕES DO ESCRITÓRIO */}
              <div className="bg-[#080E1C] border border-slate-900 rounded-2xl p-4 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-white flex items-center gap-2">
                    <TrendingUp className="w-4.5 h-4.5 text-[#C5A059]" />
                    Histórico Geral de Cálculos do Escritório ({calculos.length})
                  </h3>
                  <button 
                    id="btn-limpar-historico"
                    onClick={() => {
                      if (confirm("Deseja realmente limpar todo o histórico de simulações do escritório?")) {
                        setCalculos([]);
                      }
                    }} 
                    className="text-[10px] text-slate-500 hover:text-red-400 font-mono"
                  >
                    Limpar Tudo
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
                  {calculos.length === 0 ? (
                    <p className="text-slate-500 text-xs text-center py-6 block italic">Nenhum cálculo cadastrado no prontuário ainda.</p>
                  ) : (
                    calculos.map((reg) => (
                      <div 
                        key={reg.id} 
                        id={`registro-calculo-${reg.id}`}
                        className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl flex items-start justify-between gap-3 text-xs text-left"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#C5A059] font-mono">[{reg.tipo.toUpperCase()}]</span>
                            <span className="text-white font-medium">{reg.titulo}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Prontuário: <span className="text-slate-350">{reg.clienteNome}</span> | Cadastrado em: <span className="font-mono">{reg.dataCriacao}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">{reg.detalhes}</p>
                        </div>

                        <div className="flex flex-col items-end justify-between h-full gap-2 shrink-0">
                          <span className="font-mono text-emerald-400 font-bold bg-[#C5A059]/10 border border-[#C5A059]/20 px-2 py-0.5 rounded text-[10px]">
                            R$ {reg.valorCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <button 
                            onClick={() => handleDeleteCalculo(reg.id)}
                            className="text-slate-600 hover:text-red-400 p-1 rounded"
                            title="Remover Registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* PAINEL DE CONTROLE DE UPGRADE CONTA MULTIUSUÁRIO */}
          <section className="bg-gradient-to-br from-[#0B1E36] to-[#0A1424] border border-[#C5A059]/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A059]/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-bold uppercase tracking-wider">
                  <Star className="w-3 h-3 fill-[#C5A059]" />
                  <span>Sua Assinatura: {planoAtivo.toUpperCase()}</span>
                </div>
                <h3 className="text-white text-md sm:text-lg font-bold">Eleve o Porte de Atendimento do seu escritório de advocacia!</h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">
                  Selecione outro plano abaixo para experimentar e testar instantaneamente as limitações do Plano Bronze, Prata ou habilitar relatórios estruturados com IA no Plano Ouro!
                </p>
              </div>

              {/* Botões alternantes rápidos de planos do SaaS */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0" id="quick-plano-triggers">
                <button 
                  id="upgrade-plano-bronze"
                  onClick={() => { setPlanoAtivo('bronze'); setMensagemSucesso("Plano Bronze simulado."); }}
                  className={`py-2 px-4 rounded-xl text-xs font-bold font-mono transition-colors ${planoAtivo === 'bronze' ? 'bg-[#C5A059] text-[#060B16]' : 'bg-slate-900 border border-slate-800 text-slate-450 hover:bg-slate-800 text-slate-300'}`}
                >
                  🥉 BRONZE
                </button>
                <button 
                  id="upgrade-plano-prata"
                  onClick={() => { setPlanoAtivo('prata'); setMensagemSucesso("Plano Prata simulado!"); }}
                  className={`py-2 px-4 rounded-xl text-xs font-bold font-mono transition-colors ${planoAtivo === 'prata' ? 'bg-[#C5A059] text-[#060B16]' : 'bg-slate-900 border border-slate-800 text-slate-350 hover:bg-slate-800 text-slate-300'}`}
                >
                  🥈 PRATA
                </button>
                <button 
                  id="upgrade-plano-ouro"
                  onClick={() => { setPlanoAtivo('ouro'); setMensagemSucesso("Plano Ouro Ativado! Inteligência Jurídica integrada liberada."); }}
                  className={`py-2 px-4 rounded-xl text-xs font-bold font-mono transition-colors ${planoAtivo === 'ouro' ? 'bg-[#C5A059] text-[#060B16]' : 'bg-slate-900 border border-slate-800 text-slate-350 hover:bg-slate-800 text-slate-300'}`}
                >
                  👑 GOLD OURO
                </button>
              </div>
            </div>
          </section>

        </main>
      )}

      {/* FOOTER EXCLUSIVO PARA O ESCRITÓRIO PREVIDENCIARISTA */}
      <footer className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-12 pt-6 border-t border-slate-900 text-slate-600 text-[10px] text-center space-y-2">
        <p>© 2026 PrevCalculus Premium - Tecnologia e Engenharia Atuarial de Benefícios Previdenciários.</p>
        <p className="text-slate-700">Desenvolvido em conformidade com as diretivas de cálculos da Previdência Social Brasileira (RGPS/RPPS), respeitando o teto legislativo nacional de R$ {TETO_INSS_2026.toFixed(2)} vigente.</p>
      </footer>
    </div>
  );
}
