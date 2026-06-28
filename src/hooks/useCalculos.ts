import { useState, useCallback } from 'react';
import { CalculoRegistro } from '../types';
import { CALCULOS_PRESETS } from '../data';
import { useLocalStorage } from './useLocalStorage';

export function useCalculos() {
  const [calculos, setCalculos] = useLocalStorage<CalculoRegistro[]>('prev_calculos', CALCULOS_PRESETS);

  const adicionarCalculo = useCallback((calculo: CalculoRegistro) => {
    setCalculos(prev => [calculo, ...prev]);
  }, [setCalculos]);

  const removerCalculo = useCallback((id: string) => {
    setCalculos(prev => prev.filter(c => c.id !== id));
  }, [setCalculos]);

  const removerCalculosPorCliente = useCallback((clienteId: string) => {
    setCalculos(prev => prev.filter(c => c.clienteId !== clienteId));
  }, [setCalculos]);

  const buscarCalculosPorCliente = useCallback((clienteId: string) => {
    return calculos.filter(c => c.clienteId === clienteId);
  }, [calculos]);

  return {
    calculos,
    adicionarCalculo,
    removerCalculo,
    removerCalculosPorCliente,
    buscarCalculosPorCliente
  };
}
