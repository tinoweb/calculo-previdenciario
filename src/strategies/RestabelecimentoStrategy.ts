import { CalculationStrategy, CalculationParams, CalculationResult } from './CalculationStrategy';
import { calcularRestabelecimento } from '../calc-engines';
import { TipoCalculo } from '../types';
import { ValidationService } from '../services/validationService';

export class RestabelecimentoStrategy implements CalculationStrategy {
  tipo: TipoCalculo = 'restabelecimento';

  validar(params: CalculationParams): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const rmiValidacao = ValidationService.validarValorNumerico(
      params.rmiBeneficio as number,
      0,
      undefined,
      'RMI do Benefício'
    );
    errors.push(...rmiValidacao.errors);

    const mesesValidacao = ValidationService.validarValorNumerico(
      params.mesesSuspensao as number,
      1,
      600,
      'Meses de Suspensão'
    );
    errors.push(...mesesValidacao.errors);

    if (!params.motivoCorte || typeof params.motivoCorte !== 'string' || params.motivoCorte.trim().length === 0) {
      errors.push('Motivo do corte é obrigatório');
    }

    return { isValid: errors.length === 0, errors };
  }

  calcular(params: CalculationParams): CalculationResult {
    const resultado = calcularRestabelecimento(
      params.rmiBeneficio as number,
      params.mesesSuspensao as number,
      params.motivoCorte as string
    );

    return {
      resultado,
      tituloCalculo: 'Restabelecimento de Benefício',
      valorFinal: resultado.acumuladoAtualizado,
      memoria: resultado.memoria
    };
  }
}
