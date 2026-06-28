import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import { PlanoTier } from '../../types';

interface LoginPageProps {
  onLogin: (email: string, senha: string) => void;
  onTesteRapido: () => void;
}

export function LoginPage({ onLogin, onTesteRapido }: LoginPageProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [recuperandoSenha, setRecuperandoSenha] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginSenha.trim()) {
      alert('Informe seu e-mail e senha.');
      return;
    }
    onLogin(loginEmail, loginSenha);
  };

  const handleRecuperarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Um e-mail para redefinição emergencial de senha foi supostamente encaminhado para o endereço ${loginEmail || 'informado'} nos termos LGPD.`);
    setRecuperandoSenha(false);
  };

  return (
    <main className="flex-1 w-full max-w-sm mx-auto px-4 py-12 flex flex-col justify-center gap-6" id="login-layout">
      <div className="bg-[#080E1C] border border-[#C5A059]/20 rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#C5A059] to-[#D4AF37]" />
        
        <div className="text-center space-y-1.5 pl-2">
          <Scale className="w-8 h-8 text-[#C5A059] mx-auto" />
          <h2 className="text-md font-bold uppercase tracking-wide text-white">Acesso do Advogado PrevCalculus</h2>
          <p className="text-slate-400 text-xs text-center">Informe suas credenciais ou inicie uma conta demonstrativa imediata para testar.</p>
        </div>

        {recuperandoSenha ? (
          <form onSubmit={handleRecuperarSenha} className="space-y-4">
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
                onClick={onTesteRapido}
                className="text-[#C5A059] font-bold text-[11px] hover:underline"
              >
                Ativar Conta Teste Grátis Rapido
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
