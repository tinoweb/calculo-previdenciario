import React from 'react';
import { FileCheck2, CheckCircle2 } from 'lucide-react';
import { TipoCalculo, Cliente } from '../../../types';

interface CalculationPanelProps {
  tipoCalculoAtivo: TipoCalculo;
  clienteAtivo: Cliente | null;
  onCalcular: () => void;
  children: React.ReactNode;
  calcResultado: unknown;
}

export const CalculationPanel = React.memo(function CalculationPanel({ tipoCalculoAtivo, clienteAtivo, onCalcular, children, calcResultado }: CalculationPanelProps) {
  const resultado = calcResultado as { resultado?: unknown; tituloCalculo?: string; valorFinal?: number; memoria?: string } | null;

  return (
    <div className="lg:col-span-8 space-y-6" id="central-calculos-col">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-left" id="campos-formulario-prev">
          {children}
        </div>

        <button
          onClick={onCalcular}
          className="w-full py-3 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 text-[#060B16] font-bold text-sm rounded-lg uppercase tracking-wider shadow-lg transition"
        >
          Executar Cálculo Previdenciário
        </button>
      </div>

      {/* Exibição do Resultado */}
      {resultado && (
        <div className="bg-[#080E1C] border border-green-900/50 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-green-900/30 pb-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Resultado do Cálculo</h3>
              <p className="text-[10px] text-slate-400">{resultado.tituloCalculo}</p>
            </div>
          </div>

          {resultado.valorFinal !== undefined && (
            <div className="bg-green-950/20 border border-green-900/30 rounded-lg p-4">
              <span className="text-xs text-slate-400 block mb-1">Valor Calculado:</span>
              <span className="text-2xl font-bold text-green-400">
                R$ {resultado.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {resultado.memoria && (
            <div className="bg-slate-900/50 rounded-lg p-4">
              <span className="text-xs text-slate-400 block mb-2">Memória de Cálculo:</span>
              <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">
                {resultado.memoria}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
