import { CalculationStrategy, CalculationParams, CalculationResult } from './CalculationStrategy';
import { calcularPlanejamentoRGPS } from '../calc-engines';
import { TipoCalculo } from '../types';
import { ValidationService } from '../services/validationService';

export class PlanejamentoStrategy implements CalculationStrategy {
  tipo: TipoCalculo = 'planejamento';

  validar(params: CalculationParams): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const mediaValidacao = ValidationService.validarValorNumerico(
      params.mediaSalarial as number,
      0,
      undefined,
      'Média Salarial'
    );
    errors.push(...mediaValidacao.errors);

    return { isValid: errors.length === 0, errors };
  }

  calcular(params: CalculationParams): CalculationResult {
    const resultado = calcularPlanejamentoRGPS(
      params.genero as 'M' | 'F',
      params.idade as number,
      params.tempoAnos as number,
      params.carencia as number,
      params.mediaSalarial as number
    );

    return {
      resultado,
      tituloCalculo: 'Planejamento RGPS - Transição',
      valorFinal: resultado.rmiCalculada,
      memoria: resultado.memoria
    };
  }
}
