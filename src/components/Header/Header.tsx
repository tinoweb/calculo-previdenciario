import React from 'react';
import { Scale, Unlock, LogOut } from 'lucide-react';

interface HeaderProps {
  usuarioNome: string;
  usuarioEmail: string;
  estaLogado: boolean;
  telaAtiva: string;
  onDashboardClick: () => void;
  onLoginClick: () => void;
  onTesteClick: () => void;
  onLogout: () => void;
}

export const Header = React.memo(function Header({
  usuarioNome,
  usuarioEmail,
  estaLogado,
  telaAtiva,
  onDashboardClick,
  onLoginClick,
  onTesteClick,
  onLogout
}: HeaderProps) {
  return (
    <header className="border-b border-[#C5A059]/20 bg-[#090F1E]/95 sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-tr from-[#0F1E36] to-[#0A1424] border border-[#C5A059]/30 flex items-center justify-center">
          <Scale className="w-5.5 h-5.5 text-[#C5A059]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] tracking-wider text-[#C5A059] font-mono font-bold uppercase py-0.5 px-1.5 rounded bg-[#C5A059]/10 border border-[#C5A059]/20">
              Escritório Jurídico
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-md sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            PrevCalculus <span className="text-xs text-[#C5A059] font-light">Sistemas Previdenciários</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {estaLogado ? (
          <div className="flex items-center gap-3 text-xs">
            <div className="hidden md:block text-right">
              <span className="block text-slate-100 font-medium">{usuarioNome}</span>
              <span className="text-[10px] text-slate-500">{usuarioEmail}</span>
            </div>
            
            <div className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] font-bold text-[10px] uppercase tracking-wide">
              <Unlock className="w-2.5 h-2.5" />
              <span>Grátis</span>
            </div>

            <div className="h-4 w-[1px] bg-slate-800" />
            
            <button 
              id="btn-back-dash"
              onClick={onDashboardClick} 
              className={`py-1.5 px-3 rounded font-semibold text-xs transition-all ${telaAtiva === 'dashboard' ? 'bg-[#C5A059] text-[#060B16]' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'}`}
            >
              Painel
            </button>

            <button 
              id="btn-logout"
              onClick={onLogout} 
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
              onClick={onLoginClick} 
              className="py-1.5 px-4 bg-transparent hover:bg-slate-900 border border-[#C5A059]/30 text-white font-semibold rounded transition"
            >
              Entrar
            </button>
            <button 
              id="btn-teste-header"
              onClick={onTesteClick} 
              className="py-1.5 px-4 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 text-[#060B16] font-bold rounded transition shadow-lg shadow-[#C5A059]/20"
            >
              Teste Grátis
            </button>
          </div>
        )}
      </div>
    </header>
  );
});
