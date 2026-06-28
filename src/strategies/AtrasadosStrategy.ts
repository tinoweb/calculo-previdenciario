import { CalculationStrategy, CalculationParams, CalculationResult } from './CalculationStrategy';
import { calcularAtrasados } from '../calc-engines';
import { TipoCalculo } from '../types';
import { ValidationService } from '../services/validationService';

export class AtrasadosStrategy implements CalculationStrategy {
  tipo: TipoCalculo = 'atrasados';

  validar(params: CalculationParams): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const valorValidacao = ValidationService.validarValorNumerico(
      params.parcelaMensal as number,
      0,
      undefined,
      'Parcela Mensal'
    );
    errors.push(...valorValidacao.errors);

    const mesesValidacao = ValidationService.validarValorNumerico(
      params.mesesAtraso as number,
      1,
      600,
      'Meses de Atraso'
    );
    errors.push(...mesesValidacao.errors);

    return { isValid: errors.length === 0, errors };
  }

  calcular(params: CalculationParams): CalculationResult {
    const resultado = calcularAtrasados(
      params.parcelaMensal as number,
      params.mesesAtraso as number,
      params.jurosMora as boolean
    );

    return {
      resultado,
      tituloCalculo: `Atrasados INSS (${params.mesesAtraso}m)`,
      valorFinal: resultado.totalGeral,
      memoria: resultado.memoria
    };
  }
}
