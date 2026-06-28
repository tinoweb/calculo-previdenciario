import { CalculationStrategy, CalculationParams, CalculationResult } from './CalculationStrategy';
import { calcularLiquidacao } from '../calc-engines';
import { TipoCalculo } from '../types';
import { ValidationService } from '../services/validationService';

export class LiquidacaoStrategy implements CalculationStrategy {
  tipo: TipoCalculo = 'liquidacao';

  validar(params: CalculationParams): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const salarioValidacao = ValidationService.validarValorNumerico(
      params.salario as number,
      0,
      undefined,
      'RMI a Corrigir'
    );
    errors.push(...salarioValidacao.errors);

    const mesesValidacao = ValidationService.validarValorNumerico(
      params.meses as number,
      1,
      600,
      'Quantidade de Competências'
    );
    errors.push(...mesesValidacao.errors);

    const jurosValidacao = ValidationService.validarValorNumerico(
      params.juros as number,
      0,
      100,
      'Juros Monetários'
    );
    errors.push(...jurosValidacao.errors);

    return { isValid: errors.length === 0, errors };
  }

  calcular(params: CalculationParams): CalculationResult {
    const resultado = calcularLiquidacao(
      '12/2022',
      params.salario as number,
      params.meses as number,
      params.indice as 'INPC' | 'IPCA-E',
      params.juros as number
    );

    return {
      resultado,
      tituloCalculo: `Sentença Judicial (${params.indice as string})`,
      valorFinal: resultado.resumo.totalGeral,
      memoria: resultado.memoria
    };
  }
}
