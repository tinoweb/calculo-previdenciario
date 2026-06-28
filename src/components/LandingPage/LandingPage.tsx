import React from 'react';
import { Sparkle, FileText, Calculator, TrendingUp, BadgeDollarSign, UserCheck, Scale, Layers, Calendar } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  const modulos = [
    { t: "Liquidação de Sentença", d: "Apure parcelas judiciais vencidas com correção INPC/IPCA-E e juros regressivos.", icon: FileText },
    { t: "Planejamento RGPS (EC 103/19)", d: "Simule regras de transição por pontos, pedágios, direito adquirido e coeficiente de RMI.", icon: Calculator },
    { t: "Revisão de Benefício RGPS", d: "Estime a viabilidade de teses clássicas como Revisão da Vida Toda e Revisão do Teto.", icon: TrendingUp },
    { t: "Atrasados INSS", d: "Calcule montantes acumulados desde a DER e verifique limites do rito nos JEFs.", icon: BadgeDollarSign },
    { t: "Análise BPC/LOAS", d: "Valide o critério de per capita de renda e miserabilidade para idosos e deficientes.", icon: UserCheck },
    { t: "Restabelecimento de Auxílio", d: "Estime indenização de períodos suspensos por perícias administrativas de alta.", icon: Scale },
    { t: "RPPS União & Estados/Muni", d: "Calcule alíquotas progressivas federais e regras específicas locais com precisão.", icon: Layers },
    { t: "Contribuições em Atraso", d: "Compute o recolhimento de autônomos com multa regulamentar e juros de mora.", icon: Calendar }
  ];

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-10 flex flex-col gap-12" id="landing-page">
      {/* Hero Banner Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/40 text-[#C5A059] text-xs font-semibold">
          <Sparkle className="w-3.5 h-3.5" />
          <span>Ferramenta Gratuita de Cálculos Jurídicos</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          A Solução Definitiva em <br />
          <span className="bg-gradient-to-r from-[#C5A059] via-[#E4C58E] to-[#C5A059] bg-clip-text text-transparent">
            Cálculos Previdenciários Brasileiros
          </span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Ferramenta gratuita para advogados previdenciaristas. Execute revisões do RGPS/RPPS, liquidações de sentença, cálculos de atrasados, etc., com relatórios analíticos precisos.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button 
            id="btn-hero-teste"
            onClick={onLoginClick} 
            className="py-3 px-8 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#060B16] hover:brightness-110 font-bold text-sm rounded-lg transition-transform active:scale-97 shadow-xl shadow-[#C5A059]/20"
          >
            Começar Agora - É Grátis
          </button>
        </div>
      </div>

      {/* Seção das Principais Diferenciais e Módulos */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-center text-white tracking-wide uppercase">Cálculos Disponíveis no Navegador</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modulos.map((mod, index) => (
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

      {/* Seção de Benefícios Gratuitos */}
      <div className="space-y-6 py-6">
        <div className="text-center space-y-2">
          <h3 className="text-md font-mono text-[#C5A059] font-black uppercase tracking-wider">100% Gratuito</h3>
          <p className="text-lg sm:text-2xl font-bold text-white tracking-normal">Todos os recursos disponíveis sem custo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-900 bg-[#080E1C] shadow-xl space-y-4">
            <div className="text-3xl">📊</div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wide">10 Módulos de Cálculo</h4>
            <p className="text-slate-400 text-xs">Acesso completo a todos os módulos previdenciários</p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-900 bg-[#080E1C] shadow-xl space-y-4">
            <div className="text-3xl">💾</div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wide">Armazenamento Local</h4>
            <p className="text-slate-400 text-xs">Seus dados ficam salvos no seu navegador</p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-900 bg-[#080E1C] shadow-xl space-y-4">
            <div className="text-3xl">🤖</div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wide">Parecer com IA</h4>
            <p className="text-slate-400 text-xs">Geração de pareceres jurídicos com inteligência artificial</p>
          </div>
        </div>
      </div>
    </main>
  );
}
