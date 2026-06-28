import React from 'react';
import { Cliente, TipoCalculo } from '../../types';
import { ClientList } from './ClientList/ClientList';
import { ModuleSelector } from './ModuleSelector/ModuleSelector';
import { CalculationPanel } from './CalculationPanel/CalculationPanel';

interface DashboardProps {
  usuarioNome: string;
  clientes: Cliente[];
  clienteSelecionadoId: string;
  tipoCalculoAtivo: TipoCalculo;
  onClienteSelect: (id: string) => void;
  onClienteDelete: (id: string, nome: string) => void;
  onClienteToggleFavorito: (id: string) => void;
  onClienteAdd: (cliente: Cliente) => void;
  onTipoChange: (tipo: TipoCalculo) => void;
  onCalcular: () => void;
  calcResultado: unknown;
  children: React.ReactNode;
}

export function Dashboard({
  usuarioNome,
  clientes,
  clienteSelecionadoId,
  tipoCalculoAtivo,
  onClienteSelect,
  onClienteDelete,
  onClienteToggleFavorito,
  onClienteAdd,
  onTipoChange,
  onCalcular,
  calcResultado,
  children
}: DashboardProps) {
  const clienteAtivo = clientes.find(c => c.id === clienteSelecionadoId) || clientes[0];

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6" id="dashboard-layout">
      <div className="p-4 p-5 rounded-2xl bg-gradient-to-r from-[#070F1E] via-[#0A1424] to-[#0D1B2E] border border-[#C5A059]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div className="space-y-1.5">
          <span className="text-[10px] text-[#C5A059] font-bold tracking-widest uppercase block">Workspace Ativo</span>
          <h2 className="text-white text-md sm:text-xl font-bold">Painel de Acompanhamento {usuarioNome}</h2>
          <p className="text-xs text-slate-400">Selecione ou cadastre um segurado abaixo na base para carregar os prontuários e executar os cálculos.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-slate-400">Versão Gratuita - Sem Limites</span>
          <span className="text-[10px] text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono">
            Clientes: {clientes.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ClientList
          clientes={clientes}
          clienteSelecionadoId={clienteSelecionadoId}
          onClienteSelect={onClienteSelect}
          onClienteDelete={onClienteDelete}
          onClienteToggleFavorito={onClienteToggleFavorito}
          onClienteAdd={onClienteAdd}
          planoAtivo="gratuito"
          limiteClientes={9999}
        />

        <div className="lg:col-span-8 space-y-6">
          <ModuleSelector
            tipoCalculoAtivo={tipoCalculoAtivo}
            onTipoChange={onTipoChange}
          />

          <CalculationPanel
            tipoCalculoAtivo={tipoCalculoAtivo}
            clienteAtivo={clienteAtivo}
            onCalcular={onCalcular}
            calcResultado={calcResultado}
          >
            {children}
          </CalculationPanel>
        </div>
      </div>
    </main>
  );
}
