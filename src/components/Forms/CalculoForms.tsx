import React from 'react';
import { TipoCalculo, Cliente } from '../../types';

interface CalculoFormsProps {
  tipoCalculoAtivo: TipoCalculo;
  clienteAtivo: Cliente | null;
  onInputChange: (key: string, value: unknown) => void;
  valores: Record<string, unknown>;
}

export function CalculoForms({ tipoCalculoAtivo, clienteAtivo, onInputChange, valores }: CalculoFormsProps) {
  const idade = clienteAtivo ? new Date().getFullYear() - new Date(clienteAtivo.dataNascimento).getFullYear() : 65;

  // MÓDULO 1: Liquidação de Sentença
  if (tipoCalculoAtivo === 'liquidacao') {
    return (
      <>
        <div className="space-y-1 md:col-span-2">
          <label className="text-slate-400 font-medium block">RMI a Corrigir (R$)</label>
          <input 
            type="number" 
            step="0.01"
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.salario || ''}
            onChange={(e) => onInputChange('salario', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Quantidade de Competências</label>
          <input 
            type="number" 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.meses || ''}
            onChange={(e) => onInputChange('meses', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Índice de Correção</label>
          <select 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.indice || 'INPC'}
            onChange={(e) => onInputChange('indice', e.target.value)}
          >
            <option value="INPC">INPC</option>
            <option value="IPCA-E">IPCA-E</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Juros Monetários (%)</label>
          <input 
            type="number" 
            step="0.1"
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.juros || ''}
            onChange={(e) => onInputChange('juros', Number(e.target.value))}
          />
        </div>
      </>
    );
  }

  // MÓDULO 2: Planejamento Previdenciário RGPS
  if (tipoCalculoAtivo === 'planejamento') {
    return (
      <>
        <div className="space-y-1 md:col-span-2">
          <label className="text-slate-400 font-medium block">Média Aritmética de Contribuições (R$)</label>
          <input 
            type="number" 
            step="0.1"
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.mediaSalarial || ''}
            onChange={(e) => onInputChange('mediaSalarial', Number(e.target.value))}
          />
          <span className="text-[10px] text-slate-500 block pt-1">Considera-se 100% das contribuições apuradas no CNIS desde julho de 1994, conforme a EC 103/19.</span>
        </div>
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1 text-[11px] md:col-span-2">
          <span className="text-[#C5A059] font-bold block uppercase tracking-wider text-[9px]">Prontuário Ativo do Segurado:</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-300">
            <div>IDADE: <strong>{idade} anos</strong></div>
            <div>GÊNERO: <strong>{clienteAtivo ? (clienteAtivo.genero === 'F' ? 'Fem' : 'Masc') : 'Masc'}</strong></div>
            <div>TEMPO: <strong>{clienteAtivo ? clienteAtivo.tempoAnos : 20} anos</strong></div>
            <div>CARÊNCIA: <strong>{clienteAtivo ? clienteAtivo.carencia : 180} meses</strong></div>
          </div>
        </div>
      </>
    );
  }

  // MÓDULO 3: Revisão de Benefício RGPS
  if (tipoCalculoAtivo === 'revisao') {
    return (
      <>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">RMI Concedida Original (R$)</label>
          <input 
            type="number" 
            step="0.1"
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.rmiOriginal || ''}
            onChange={(e) => onInputChange('rmiOriginal', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Data do Recebimento Inicial (Aposentadoria)</label>
          <input 
            type="date" 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.dataConcessao || ''}
            onChange={(e) => onInputChange('dataConcessao', e.target.value)}
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-slate-400 font-medium">Tese de Revisão Jurisprudencial</label>
          <select 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.tipoRevisao || 'vida_toda'}
            onChange={(e) => onInputChange('tipoRevisao', e.target.value)}
          >
            <option value="vida_toda">Revisão da Vida Toda (Inclusão PBC completo pré-1994)</option>
            <option value="teto">Revisão dos Tetos (Ajuste das datas nas Emendas Ecs 20 e 41)</option>
          </select>
        </div>
      </>
    );
  }

  // MÓDULO 4: Cálculo de Atrasados INSS
  if (tipoCalculoAtivo === 'atrasados') {
    return (
      <>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Valor Estimado do Benefício Mensal (R$)</label>
          <input 
            type="number" 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.parcelaMensal || ''}
            onChange={(e) => onInputChange('parcelaMensal', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Tempo total de inadimplência (Meses)</label>
          <input 
            type="number" 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.mesesAtraso || ''}
            onChange={(e) => onInputChange('mesesAtraso', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-slate-400 font-medium flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox" 
              checked={valores.jurosMora as boolean || false}
              onChange={(e) => onInputChange('jurosMora', e.target.checked)}
              className="accent-[#C5A059] scale-110 shrink-0"
            />
            <span>Aplicar incidência de Juros de Mora de 0.5% a.m.?</span>
          </label>
        </div>
      </>
    );
  }

  // MÓDULO 5: BPC / LOAS
  if (tipoCalculoAtivo === 'bpc') {
    return (
      <>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Tipo de Requerente</label>
          <select 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.tipoBeneficiario || 'idoso'}
            onChange={(e) => onInputChange('tipoBeneficiario', e.target.value)}
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
            value={valores.idade || idade}
            onChange={(e) => onInputChange('idade', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Membros no Grupo Familiar</label>
          <input 
            type="number" 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.numeroMembrosFamilia || ''}
            onChange={(e) => onInputChange('numeroMembrosFamilia', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Renda Familiar Mensal Bruta (R$)</label>
          <input 
            type="number" 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.rendaFamiliarBruta || ''}
            onChange={(e) => onInputChange('rendaFamiliarBruta', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-slate-400 font-medium flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox" 
              checked={valores.laudoMedicoVulnerabilidade as boolean || false}
              onChange={(e) => onInputChange('laudoMedicoVulnerabilidade', e.target.checked)}
              className="accent-[#C5A059] scale-110"
            />
            <span>Há laudo atestando barreira de longo prazo / vulnerabilidade socioeconômica extrema?</span>
          </label>
        </div>
      </>
    );
  }

  // MÓDULO 6: Restabelecimento
  if (tipoCalculoAtivo === 'restabelecimento') {
    return (
      <>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">RMI Benefício Interrompido (R$)</label>
          <input 
            type="number" 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.rmiBeneficio || ''}
            onChange={(e) => onInputChange('rmiBeneficio', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Meses Transcorridos desde o Corte</label>
          <input 
            type="number" 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.mesesSuspensao || ''}
            onChange={(e) => onInputChange('mesesSuspensao', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-slate-400 font-medium">Motivo do Cancelamento pelo INSS</label>
          <input 
            type="text" 
            placeholder="e.g. Inaptidão declarada em perícia de rotina de pente fino"
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2.5 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.motivoCorte || ''}
            onChange={(e) => onInputChange('motivoCorte', e.target.value)}
          />
        </div>
      </>
    );
  }

  // MÓDULO 7: RPPS União
  if (tipoCalculoAtivo === 'rpps_uniao') {
    return (
      <>
        <div className="space-y-1 md:col-span-2">
          <label className="text-slate-400 font-medium">Remuneração Recebida na Ativa (R$)</label>
          <input 
            type="number" 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2.5 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.salarioBase || ''}
            onChange={(e) => onInputChange('salarioBase', Number(e.target.value))}
          />
          <span className="text-[10px] text-slate-500 block pt-1">O cálculo aplicará a tabela progressiva oficial estabelecida pelo Governo Federal (7.5% até 22%), conforme faixas salariais.</span>
        </div>
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1 text-[11px] md:col-span-2">
          <span className="text-[#C5A059] font-bold block uppercase tracking-wider text-[9px]">Dados do Servidor:</span>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div>IDADE: <strong>{idade} anos</strong></div>
            <div>GÊNERO: <strong>{clienteAtivo ? (clienteAtivo.genero === 'F' ? 'Fem' : 'Masc') : 'Masc'}</strong></div>
          </div>
        </div>
      </>
    );
  }

  // MÓDULO 8: RPPS Estados e Municípios
  if (tipoCalculoAtivo === 'rpps_est_mun') {
    return (
      <>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Salário Ativo do Servidor (R$)</label>
          <input 
            type="number" 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.salarioBase || ''}
            onChange={(e) => onInputChange('salarioBase', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Alíquota Previdenciária Local Fixada (%)</label>
          <input 
            type="number" 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.aliquotaDeclarada || ''}
            onChange={(e) => onInputChange('aliquotaDeclarada', Number(e.target.value))}
          />
        </div>
      </>
    );
  }

  // MÓDULO 9: Complementação Previdenciária
  if (tipoCalculoAtivo === 'complementacao') {
    return (
      <>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Último Salário Ativo (R$)</label>
          <input 
            type="number" 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.salarioAtivoDoServidor || ''}
            onChange={(e) => onInputChange('salarioAtivoDoServidor', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Aposentadoria Estimada pelo RGPS (Limitada ao Teto) (R$)</label>
          <input 
            type="number" 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.aposentadoriaEfetivaRGPS || ''}
            onChange={(e) => onInputChange('aposentadoriaEfetivaRGPS', Number(e.target.value))}
          />
        </div>
      </>
    );
  }

  // MÓDULO 10: Contribuições Previdenciárias em Atraso
  if (tipoCalculoAtivo === 'atraso_contribuicao') {
    return (
      <>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Salário-Base de Referência Pretendido (R$)</label>
          <input 
            type="number" 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.salarioDeReferência || ''}
            onChange={(e) => onInputChange('salarioDeReferência', Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-slate-400 font-medium">Quantidade total de parcelas (Meses atrasados)</label>
          <input 
            type="number" 
            className="w-full bg-[#03060C] border border-slate-800 text-[#e2e8f0] p-2 rounded-lg outline-none focus:border-[#C5A059]"
            value={valores.mesesAtrasados || ''}
            onChange={(e) => onInputChange('mesesAtrasados', Number(e.target.value))}
          />
        </div>
      </>
    );
  }

  return null;
}
