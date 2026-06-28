import { CalculationStrategy, CalculationParams, CalculationResult } from './CalculationStrategy';
import { calcularContribAtraso } from '../calc-engines';
import { TipoCalculo } from '../types';
import { ValidationService } from '../services/validationService';

export class ContribAtrasoStrategy implements CalculationStrategy {
  tipo: TipoCalculo = 'atraso_contribuicao';

  validar(params: CalculationParams): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const salarioValidacao = ValidationService.validarValorNumerico(
      params.salarioDeReferência as number,
      0,
      undefined,
      'Salário de Referência'
    );
    errors.push(...salarioValidacao.errors);

    const mesesValidacao = ValidationService.validarValorNumerico(
      params.mesesAtrasados as number,
      1,
      600,
      'Meses Atrasados'
    );
    errors.push(...mesesValidacao.errors);

    return { isValid: errors.length === 0, errors };
  }

  calcular(params: CalculationParams): CalculationResult {
    const resultado = calcularContribAtraso(
      params.salarioDeReferência as number,
      params.mesesAtrasados as number
    );

    return {
      resultado,
      tituloCalculo: 'Guia GPS em Atraso',
      valorFinal: resultado.totalDevidoAtrasado,
      memoria: resultado.memoria
    };
  }
}
