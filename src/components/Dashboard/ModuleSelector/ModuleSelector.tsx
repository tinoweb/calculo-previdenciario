import React from 'react';
import { Calculator } from 'lucide-react';
import { TipoCalculo } from '../../../types';

interface ModuleSelectorProps {
  tipoCalculoAtivo: TipoCalculo;
  onTipoChange: (tipo: TipoCalculo) => void;
}

export const ModuleSelector = React.memo(function ModuleSelector({ tipoCalculoAtivo, onTipoChange }: ModuleSelectorProps) {
  const modulos = [
    { id: 'liquidacao' as TipoCalculo, label: '1. Liquidação de Sentença' },
    { id: 'planejamento' as TipoCalculo, label: '2. Planejamento RGPS' },
    { id: 'revisao' as TipoCalculo, label: '3. Revisão de Benefício' },
    { id: 'atrasados' as TipoCalculo, label: '4. Cálculo de Atrasados' },
    { id: 'bpc' as TipoCalculo, label: '5. BPC / LOAS' },
    { id: 'restabelecimento' as TipoCalculo, label: '6. Restabelecimento' },
    { id: 'rpps_uniao' as TipoCalculo, label: '7. RPPS União' },
    { id: 'rpps_est_mun' as TipoCalculo, label: '8. RPPS Estados/Mun.' },
    { id: 'complementacao' as TipoCalculo, label: '9. Complementação' },
    { id: 'atraso_contribuicao' as TipoCalculo, label: '10. Contrib. em Atraso' }
  ];

  return (
    <div className="bg-[#080E1C] border border-[#C5A059]/15 rounded-2xl p-4 shadow-xl space-y-3.5">
      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-300">
        <Calculator className="w-4.5 h-4.5 text-[#C5A059]" />
        <span>Selecione o Módulo Previdenciário Requerido:</span>
      </div>

      <div className="flex flex-wrap gap-1.5" id="botoes-modulos-grid">
        {modulos.map((btn) => {
          const ativo = tipoCalculoAtivo === btn.id;
          return (
            <button
              key={btn.id}
              id={`modulo-btn-${btn.id}`}
              onClick={() => onTipoChange(btn.id)}
              className={`py-2 px-3 text-left rounded-lg text-xs font-semibold cursor-pointer transition ${ativo ? 'bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#060B16] font-bold shadow-lg shadow-[#C5A059]/10' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'}`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});
