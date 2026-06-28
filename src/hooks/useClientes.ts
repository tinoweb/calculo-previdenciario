import { useState, useCallback } from 'react';
import { Cliente } from '../types';
import { CLIENTES_PRESETS } from '../data';
import { useLocalStorage } from './useLocalStorage';

export function useClientes() {
  const [clientes, setClientes] = useLocalStorage<Cliente[]>('prev_clientes', CLIENTES_PRESETS);

  const adicionarCliente = useCallback((cliente: Cliente) => {
    setClientes(prev => [cliente, ...prev]);
  }, [setClientes]);

  const removerCliente = useCallback((id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  }, [setClientes]);

  const atualizarCliente = useCallback((id: string, atualizacao: Partial<Cliente>) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...atualizacao } : c));
  }, [setClientes]);

  const toggleFavorito = useCallback((id: string) => {
    setClientes(prev => prev.map(c => 
      c.id === id ? { ...c, favorito: !c.favorito } : c
    ));
  }, [setClientes]);

  const buscarCliente = useCallback((id: string) => {
    return clientes.find(c => c.id === id);
  }, [clientes]);

  return {
    clientes,
    adicionarCliente,
    removerCliente,
    atualizarCliente,
    toggleFavorito,
    buscarCliente
  };
}
