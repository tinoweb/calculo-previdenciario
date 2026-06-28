import { CalculationStrategy, CalculationParams, CalculationResult } from './CalculationStrategy';
import { calcularRppsUniao } from '../calc-engines';
import { TipoCalculo } from '../types';
import { ValidationService } from '../services/validationService';

export class RppsUniaoStrategy implements CalculationStrategy {
  tipo: TipoCalculo = 'rpps_uniao';

  validar(params: CalculationParams): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const salarioValidacao = ValidationService.validarValorNumerico(
      params.salarioBase as number,
      0,
      undefined,
      'Salário Base'
    );
    errors.push(...salarioValidacao.errors);

    const idadeValidacao = ValidationService.validarValorNumerico(
      params.idade as number,
      0,
      120,
      'Idade'
    );
    errors.push(...idadeValidacao.errors);

    return { isValid: errors.length === 0, errors };
  }

  calcular(params: CalculationParams): CalculationResult {
    const resultado = calcularRppsUniao(
      params.salarioBase as number,
      params.genero as 'M' | 'F',
      params.idade as number
    );

    return {
      resultado,
      tituloCalculo: 'Contr. RPPS União Progressiva',
      valorFinal: resultado.salarioLiquido,
      memoria: resultado.memoria
    };
  }
}
