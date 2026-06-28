/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { Cliente, TipoCalculo, PlanoTier, CalculoRegistro } from './types';
import { PLANOS_INFO, TETO_INSS_2026, SALARIO_MINIMO_2026 } from './data';
import { useAuth } from './hooks/useAuth';
import { useClientes } from './hooks/useClientes';
import { useCalculos } from './hooks/useCalculos';
import { CalculationStrategyFactory } from './strategies/CalculationStrategyFactory';
import { PrevidenciarioApiService } from './services/apiService';
import { Header } from './components/Header/Header';
import { LandingPage } from './components/LandingPage/LandingPage';
import { LoginPage } from './components/LoginPage/LoginPage';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { Toast, ToastType } from './components/Common/Toast';

export default function App() {
  const {
    usuarioNome,
    usuarioEmail,
    planoAtivo,
    estaLogado,
    login,
    logout,
    atualizarPlano
  } = useAuth();

  const {
    clientes,
    adicionarCliente,
    removerCliente,
    toggleFavorito
  } = useClientes();

  const {
    calculos,
    adicionarCalculo,
    removerCalculo,
    removerCalculosPorCliente
  } = useCalculos();

  const [telaAtiva, setTelaAtiva] = useState<'landing' | 'login' | 'dashboard'>(() => {
    return estaLogado ? 'dashboard' : 'landing';
  });

  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<string>(() => {
    return clientes[0]?.id || '';
  });

  const [tipoCalculoAtivo, setTipoCalculoAtivo] = useState<TipoCalculo>('planejamento');
  const [calcResultado, setCalcResultado] = useState<unknown>(null);
  const [parecerIATexto, setParecerIATexto] = useState<string>('');
  const [parecerIAStatus, setParecerIAStatus] = useState<'ocioso' | 'gerando' | 'sucesso' | 'erro'>('ocioso');

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  }, []);

  const clienteAtivo = clientes.find(c => c.id === clienteSelecionadoId) || clientes[0];

  // Handlers de navegação
  const handlePlanoSelect = useCallback((plano: PlanoTier) => {
    atualizarPlano(plano);
    login('demo@prevcalculus.com', 'Usuário Demo');
    setTelaAtiva('dashboard');
    showToast(`Plano ${plano.toUpperCase()} ativado com sucesso!`);
  }, [atualizarPlano, login, showToast]);

  const handleLogin = useCallback((email: string, senha: string) => {
    login(email, senha);
    setTelaAtiva('dashboard');
    showToast('Login realizado com sucesso!');
  }, [login, showToast]);

  const handleTesteRapido = useCallback(() => {
    atualizarPlano('prata');
    login('teste@prevcalculus.com', 'Teste');
    setTelaAtiva('dashboard');
    showToast('Conta teste ativada!');
  }, [atualizarPlano, login, showToast]);

  const handleLogout = useCallback(() => {
    logout();
    setTelaAtiva('landing');
    showToast('Logout realizado.', 'info');
  }, [logout, showToast]);

  // Handlers de clientes
  const handleClienteSelect = useCallback((id: string) => {
    setClienteSelecionadoId(id);
    setCalcResultado(null);
    setParecerIATexto('');
    setParecerIAStatus('ocioso');
  }, []);

  const handleClienteDelete = useCallback((id: string, nome: string) => {
    if (confirm(`Deseja realmente remover o cliente "${nome}"?`)) {
      removerCliente(id);
      removerCalculosPorCliente(id);
      showToast(`Cliente "${nome}" removido.`, 'warning');
    }
  }, [removerCliente, removerCalculosPorCliente, showToast]);

  const handleClienteAdd = useCallback((cliente: Cliente) => {
    adicionarCliente(cliente);
    setClienteSelecionadoId(cliente.id);
    showToast(`Cliente "${cliente.nome}" cadastrado!`);
  }, [adicionarCliente, showToast]);

  // Handler de cálculo usando Strategy Pattern
  const executarCalculoAtivo = useCallback(() => {
    if (!clienteAtivo) {
      showToast('Selecione um cliente primeiro.', 'error');
      return;
    }

    try {
      const strategy = CalculationStrategyFactory.getStrategy(tipoCalculoAtivo);
      
      // Montar parâmetros baseados no tipo de cálculo
      const params: Record<string, unknown> = {};
      
      // Parâmetros comuns do cliente
      if (tipoCalculoAtivo === 'planejamento' || tipoCalculoAtivo === 'rpps_uniao') {
        params.genero = clienteAtivo.genero;
        params.idade = new Date().getFullYear() - new Date(clienteAtivo.dataNascimento).getFullYear();
      }

      if (tipoCalculoAtivo === 'planejamento') {
        params.tempoAnos = clienteAtivo.tempoAnos;
        params.carencia = clienteAtivo.carencia;
        params.mediaSalarial = 5500; // Valor padrão, deveria vir de input
      }

      // Validar parâmetros
      const validacao = strategy.validar(params);
      if (!validacao.isValid) {
        showToast(`Erro de validação: ${validacao.errors.join(', ')}`, 'error');
        return;
      }

      // Executar cálculo
      const resultado = strategy.calcular(params);
      setCalcResultado(resultado);

      // Salvar no histórico
      const novoRegistro: CalculoRegistro = {
        id: `calc-user-${Date.now()}`,
        clienteId: clienteAtivo.id,
        clienteNome: clienteAtivo.nome,
        dataCriacao: new Date().toISOString().split('T')[0],
        tipo: tipoCalculoAtivo,
        titulo: resultado.tituloCalculo,
        valorCalculado: resultado.valorFinal,
        detalhes: resultado.memoria
      };

      adicionarCalculo(novoRegistro);
      showToast('Cálculo realizado com sucesso!');

    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Erro ao realizar cálculo', 'error');
    }
  }, [clienteAtivo, tipoCalculoAtivo, adicionarCalculo, showToast]);

  // Handler de geração de parecer com IA
  const handleGerarParecerIA = useCallback(async () => {
    if (planoAtivo !== 'ouro') {
      showToast('Parecer IA exclusivo do Plano Ouro', 'warning');
      return;
    }

    if (!clienteAtivo || !calcResultado) {
      showToast('Execute um cálculo primeiro', 'error');
      return;
    }

    setParecerIAStatus('gerando');
    setParecerIATexto('');

    try {
      const response = await PrevidenciarioApiService.generateParecer({
        client: {
          nome: clienteAtivo.nome,
          genero: clienteAtivo.genero,
          dataNascimento: clienteAtivo.dataNascimento,
          idade: new Date().getFullYear() - new Date(clienteAtivo.dataNascimento).getFullYear(),
          tempoContribuicaoAnos: clienteAtivo.tempoAnos,
          tempoContribuicaoMeses: clienteAtivo.tempoMeses,
          tempoContribuicaoDias: clienteAtivo.tempoDias,
          carencia: clienteAtivo.carencia
        },
        modulo: tipoCalculoAtivo,
        calculoDet: calcResultado
      });

      if (response.data) {
        setParecerIATexto(response.data.parecer);
        setParecerIAStatus('sucesso');
        showToast('Parecer gerado com sucesso!');
      } else {
        throw new Error(response.error || 'Erro ao gerar parecer');
      }
    } catch (error) {
      setParecerIAStatus('erro');
      setParecerIATexto('Não foi possível gerar o parecer. Tente novamente.');
      showToast('Erro ao gerar parecer com IA', 'error');
    }
  }, [planoAtivo, clienteAtivo, calcResultado, tipoCalculoAtivo, showToast]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#060B16] text-[#e2e8f0] font-sans flex flex-col relative antialiased selection:bg-[#C5A059]/30 selection:text-white pb-10" id="root-div">
        {/* Background Decorativo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-100px] w-[600px] h-[600px] rounded-full bg-[#C5A059]/5 blur-[150px] pointer-events-none" />

        {/* Header */}
        <Header
          usuarioNome={usuarioNome}
          usuarioEmail={usuarioEmail}
          planoAtivo={planoAtivo}
          estaLogado={estaLogado}
          telaAtiva={telaAtiva}
          onDashboardClick={() => setTelaAtiva('dashboard')}
          onLoginClick={() => setTelaAtiva('login')}
          onTesteClick={() => setTelaAtiva('login')}
          onLogout={handleLogout}
        />

        {/* Toast Notification */}
        {toast && (
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-4">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          </div>
        )}

        {/* Conteúdo Principal */}
        {telaAtiva === 'landing' && (
          <LandingPage
            onPlanoSelect={handlePlanoSelect}
            onLoginClick={() => setTelaAtiva('login')}
          />
        )}

        {telaAtiva === 'login' && (
          <LoginPage
            onLogin={handleLogin}
            onTesteRapido={handleTesteRapido}
          />
        )}

        {telaAtiva === 'dashboard' && (
          <Dashboard
            usuarioNome={usuarioNome}
            planoAtivo={planoAtivo}
            clientes={clientes}
            clienteSelecionadoId={clienteSelecionadoId}
            tipoCalculoAtivo={tipoCalculoAtivo}
            onClienteSelect={handleClienteSelect}
            onClienteDelete={handleClienteDelete}
            onClienteToggleFavorito={toggleFavorito}
            onClienteAdd={handleClienteAdd}
            onTipoChange={setTipoCalculoAtivo}
            onCalcular={executarCalculoAtivo}
          >
            {/* Formulários de cálculo seriam implementados aqui */}
            <div className="text-center text-slate-400 text-xs py-8">
              Formulários de cálculo a serem implementados
            </div>
          </Dashboard>
        )}
      </div>
    </ErrorBoundary>
  );
}
