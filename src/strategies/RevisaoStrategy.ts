import { CalculationStrategy, CalculationParams, CalculationResult } from './CalculationStrategy';
import { calcularRevisaoRGPS } from '../calc-engines';
import { TipoCalculo } from '../types';
import { ValidationService } from '../services/validationService';

export class RevisaoStrategy implements CalculationStrategy {
  tipo: TipoCalculo = 'revisao';

  validar(params: CalculationParams): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const rmiValidacao = ValidationService.validarValorNumerico(
      params.rmiOriginal as number,
      0,
      undefined,
      'RMI Original'
    );
    errors.push(...rmiValidacao.errors);

    const dataValidacao = ValidationService.validarDataNascimento(params.dataConcessao as string);
    errors.push(...dataValidacao.errors);

    return { isValid: errors.length === 0, errors };
  }

  calcular(params: CalculationParams): CalculationResult {
    const resultado = calcularRevisaoRGPS(
      params.rmiOriginal as number,
      params.dataConcessao as string,
      params.tipoRevisao as 'vida_toda' | 'teto'
    );

    return {
      resultado,
      tituloCalculo: params.tipoRevisao === 'vida_toda' ? 'Revisão Vida Toda' : 'Revisão do Teto',
      valorFinal: resultado.totalEstimadoAtrasados,
      memoria: resultado.memoria
    };
  }
}
