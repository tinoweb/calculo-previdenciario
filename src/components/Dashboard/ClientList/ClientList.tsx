import React, { useState } from 'react';
import { Users, Plus, Search, Star, Trash2 } from 'lucide-react';
import { Cliente } from '../../../types';
import { ClienteForm } from '../../Forms/ClienteForm';

interface ClientListProps {
  clientes: Cliente[];
  clienteSelecionadoId: string;
  onClienteSelect: (id: string) => void;
  onClienteDelete: (id: string, nome: string) => void;
  onClienteToggleFavorito: (id: string) => void;
  onClienteAdd: (cliente: Cliente) => void;
  planoAtivo: string;
  limiteClientes: number;
}

export function ClientList({
  clientes,
  clienteSelecionadoId,
  onClienteSelect,
  onClienteDelete,
  onClienteToggleFavorito,
  onClienteAdd,
  planoAtivo,
  limiteClientes
}: ClientListProps) {
  const [buscaCliente, setBuscaCliente] = useState('');
  const [mostrarFormNovoCliente, setMostrarFormNovoCliente] = useState(false);

  const clientesFiltrados = clientes.filter(c => 
    c.nome.toLowerCase().includes(buscaCliente.toLowerCase()) ||
    c.cpf.includes(buscaCliente)
  );

  const handleCadastrarCliente = (cliente: Cliente) => {
    onClienteAdd(cliente);
    setMostrarFormNovoCliente(false);
  };

  return (
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

        {mostrarFormNovoCliente && (
          <ClienteForm
            onSubmit={handleCadastrarCliente}
            onCancel={() => setMostrarFormNovoCliente(false)}
          />
        )}

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
                  onClick={() => onClienteSelect(cli.id)}
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
                      onClick={() => onClienteToggleFavorito(cli.id)}
                      className="text-slate-500 hover:text-[#C5A059] p-1 rounded hover:bg-slate-900"
                      title="Marcar favorito"
                    >
                      <Star className={`w-3.5 h-3.5 ${cli.favorito ? 'text-[#C5A059] fill-[#C5A059]' : ''}`} />
                    </button>
                    <button 
                      onClick={() => onClienteDelete(cli.id, cli.nome)}
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

      <div className="bg-[#050A14] border border-slate-900 rounded-xl p-3 text-[10px] space-y-1.5 text-slate-500">
        <span className="font-bold text-[#C5A059] block uppercase tracking-wider text-[9px]">Anotações Técnicas da Semana</span>
        <p className="leading-relaxed">
          Lembre-se: O Teto do INSS foi reajustado para o patamar de <strong>R$ 8.218,64</strong> em 2026, com o salário mínimo nacional fixado em <strong>R$ 1.512,00</strong>. Revise carência e tempo antes de simular.
        </p>
      </div>
    </div>
  );
}
