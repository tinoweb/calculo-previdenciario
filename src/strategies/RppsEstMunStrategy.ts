import { CalculationStrategy, CalculationParams, CalculationResult } from './CalculationStrategy';
import { calcularRppsEstMun } from '../calc-engines';
import { TipoCalculo } from '../types';
import { ValidationService } from '../services/validationService';

export class RppsEstMunStrategy implements CalculationStrategy {
  tipo: TipoCalculo = 'rpps_est_mun';

  validar(params: CalculationParams): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const salarioValidacao = ValidationService.validarValorNumerico(
      params.salarioBase as number,
      0,
      undefined,
      'Salário Base'
    );
    errors.push(...salarioValidacao.errors);

    const aliquotaValidacao = ValidationService.validarValorNumerico(
      params.aliquotaDeclarada as number,
      0,
      30,
      'Alíquota'
    );
    errors.push(...aliquotaValidacao.errors);

    return { isValid: errors.length === 0, errors };
  }

  calcular(params: CalculationParams): CalculationResult {
    const resultado = calcularRppsEstMun(
      params.salarioBase as number,
      params.aliquotaDeclarada as number
    );

    return {
      resultado,
      tituloCalculo: 'RPPS Estadual / Municipal',
      valorFinal: resultado.salarioLiquido,
      memoria: resultado.memoria
    };
  }
}
