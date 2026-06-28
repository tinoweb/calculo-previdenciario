import { TipoCalculo } from '../types';

export interface CalculationParams {
  [key: string]: unknown;
}

export interface CalculationResult {
  resultado: unknown;
  tituloCalculo: string;
  valorFinal: number;
  memoria: string;
}

export interface CalculationStrategy {
  tipo: TipoCalculo;
  calcular(params: CalculationParams): CalculationResult;
  validar(params: CalculationParams): { isValid: boolean; errors: string[] };
}
