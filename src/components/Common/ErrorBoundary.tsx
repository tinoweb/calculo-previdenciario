import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  readonly state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060B16] text-[#e2e8f0] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#080E1C] border border-red-900/50 rounded-2xl p-6 shadow-xl">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-950/50 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl font-bold text-white">Ocorreu um erro inesperado</h2>
              <p className="text-slate-400 text-sm">
                {this.state.error?.message || 'Algo deu errado ao processar sua solicitação.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-[#C5A059] text-[#060B16] font-bold rounded-lg hover:bg-[#D4AF37] transition"
              >
                Recarregar Página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
