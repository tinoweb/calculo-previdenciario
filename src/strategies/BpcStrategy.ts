import { CalculationStrategy, CalculationParams, CalculationResult } from './CalculationStrategy';
import { calcularBpcLoas } from '../calc-engines';
import { TipoCalculo } from '../types';
import { ValidationService } from '../services/validationService';
import { SALARIO_MINIMO_2026 } from '../data';

export class BpcStrategy implements CalculationStrategy {
  tipo: TipoCalculo = 'bpc';

  validar(params: CalculationParams): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const idadeValidacao = ValidationService.validarValorNumerico(
      params.idade as number,
      0,
      120,
      'Idade'
    );
    errors.push(...idadeValidacao.errors);

    const familiaValidacao = ValidationService.validarValorNumerico(
      params.numeroMembrosFamilia as number,
      1,
      50,
      'Número de Membros da Família'
    );
    errors.push(...familiaValidacao.errors);

    const rendaValidacao = ValidationService.validarValorNumerico(
      params.rendaFamiliarBruta as number,
      0,
      undefined,
      'Renda Familiar Bruta'
    );
    errors.push(...rendaValidacao.errors);

    return { isValid: errors.length === 0, errors };
  }

  calcular(params: CalculationParams): CalculationResult {
    const resultado = calcularBpcLoas(
      params.tipoBeneficiario as 'idoso' | 'deficiente',
      params.idade as number,
      params.numeroMembrosFamilia as number,
      params.rendaFamiliarBruta as number,
      params.laudoMedicoVulnerabilidade as boolean
    );

    return {
      resultado,
      tituloCalculo: `BPC LOAS - ${params.tipoBeneficiario === 'idoso' ? 'Idoso' : 'Deficiente'}`,
      valorFinal: SALARIO_MINIMO_2026,
      memoria: resultado.memoria
    };
  }
}
