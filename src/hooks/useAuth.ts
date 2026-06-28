import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useAuth() {
  const [usuarioNome, setUsuarioNome] = useLocalStorage<string>(
    'prev_adv_nome',
    'Usuário'
  );
  const [usuarioEmail, setUsuarioEmail] = useLocalStorage<string>(
    'prev_adv_email',
    'usuario@exemplo.com'
  );
  const [estaLogado, setEstaLogado] = useLocalStorage<boolean>('prev_esta_logado', false);

  const login = useCallback((email: string, nome?: string) => {
    setUsuarioEmail(email);
    if (nome) setUsuarioNome(nome);
    setEstaLogado(true);
  }, [setUsuarioEmail, setUsuarioNome, setEstaLogado]);

  const logout = useCallback(() => {
    setEstaLogado(false);
  }, [setEstaLogado]);

  return {
    usuarioNome,
    usuarioEmail,
    estaLogado,
    login,
    logout,
    setUsuarioNome,
    setUsuarioEmail
  };
}
