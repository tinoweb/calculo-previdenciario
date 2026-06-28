import { CalculationStrategy, CalculationParams, CalculationResult } from './CalculationStrategy';
import { calcularComplementacao } from '../calc-engines';
import { TipoCalculo } from '../types';
import { ValidationService } from '../services/validationService';

export class ComplementacaoStrategy implements CalculationStrategy {
  tipo: TipoCalculo = 'complementacao';

  validar(params: CalculationParams): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const salarioValidacao = ValidationService.validarValorNumerico(
      params.salarioAtivoDoServidor as number,
      0,
      undefined,
      'Salário Ativo do Servidor'
    );
    errors.push(...salarioValidacao.errors);

    const aposentadoriaValidacao = ValidationService.validarValorNumerico(
      params.aposentadoriaEfetivaRGPS as number,
      0,
      undefined,
      'Aposentadoria Efetiva RGPS'
    );
    errors.push(...aposentadoriaValidacao.errors);

    return { isValid: errors.length === 0, errors };
  }

  calcular(params: CalculationParams): CalculationResult {
    const resultado = calcularComplementacao(
      params.salarioAtivoDoServidor as number,
      params.aposentadoriaEfetivaRGPS as number
    );

    return {
      resultado,
      tituloCalculo: 'Complementação de Aposentadoria',
      valorFinal: resultado.deficitSuprir,
      memoria: resultado.memoria
    };
  }
}
