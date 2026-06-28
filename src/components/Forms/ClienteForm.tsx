import React, { useState } from 'react';
import { Cliente } from '../../types';
import { ClienteFactory, ClienteParams } from '../../factories/ClienteFactory';
import { ValidationService } from '../../services/validationService';

interface ClienteFormProps {
  onSubmit: (cliente: Cliente) => void;
  onCancel: () => void;
}

export function ClienteForm({ onSubmit, onCancel }: ClienteFormProps) {
  const [novoCliNome, setNovoCliNome] = useState('');
  const [novoCliCpf, setNovoCliCpf] = useState('');
  const [novoCliGenero, setNovoCliGenero] = useState<'M' | 'F'>('M');
  const [novoCliNasc, setNovoCliNasc] = useState('1965-05-15');
  const [novoCliCarencia, setNovoCliCarencia] = useState(185);
  const [novoCliTempoAnos, setNovoCliTempoAnos] = useState(25);
  const [novoCliTempoMeses, setNovoCliTempoMeses] = useState(4);
  const [novoCliTempoDias, setNovoCliTempoDias] = useState(10);
  const [erros, setErros] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErros([]);

    // Validações
    const nomeValidacao = ValidationService.validarNome(novoCliNome);
    const cpfValidacao = ValidationService.validarCPF(novoCliCpf);
    const dataValidacao = ValidationService.validarDataNascimento(novoCliNasc);
    const carenciaValidacao = ValidationService.validarCarencia(novoCliCarencia);
    const tempoValidacao = ValidationService.validarTempoContribuicao(novoCliTempoAnos, novoCliTempoMeses, novoCliTempoDias);

    const todosErros = [
      ...nomeValidacao.errors,
      ...cpfValidacao.errors,
      ...dataValidacao.errors,
      ...carenciaValidacao.errors,
      ...tempoValidacao.errors
    ];

    if (todosErros.length > 0) {
      setErros(todosErros);
      return;
    }

    try {
      const params: ClienteParams = {
        nome: novoCliNome,
        cpf: novoCliCpf,
        genero: novoCliGenero,
        dataNascimento: novoCliNasc,
        carencia: novoCliCarencia,
        tempoAnos: novoCliTempoAnos,
        tempoMeses: novoCliTempoMeses,
        tempoDias: novoCliTempoDias
      };

      const novoCliente = ClienteFactory.create(params);
      onSubmit(novoCliente);
      
      // Reset form
      setNovoCliNome('');
      setNovoCliCpf('');
      setNovoCliNasc('1965-05-15');
      setNovoCliCarencia(185);
      setNovoCliTempoAnos(25);
      setNovoCliTempoMeses(4);
      setNovoCliTempoDias(10);
    } catch (error) {
      setErros([error instanceof Error ? error.message : 'Erro ao criar cliente']);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#050A14] border border-slate-800 rounded-xl p-3.5 mt-3 space-y-3.5 animate-fade-in text-xs">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-900">
        <span className="text-[#C5A059] font-bold uppercase tracking-widest text-[9px]">Nova Conta de Segurado</span>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-white">X</button>
      </div>

      {erros.length > 0 && (
        <div className="bg-red-950/40 border border-red-900/50 rounded-lg p-2 text-red-300 text-[10px]">
          {erros.map((erro, idx) => (
            <div key={idx}>• {erro}</div>
          ))}
        </div>
      )}

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
  );
}
