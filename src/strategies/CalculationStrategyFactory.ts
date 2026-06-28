import { CalculationStrategy } from './CalculationStrategy';
import { TipoCalculo } from '../types';
import { LiquidacaoStrategy } from './LiquidacaoStrategy';
import { PlanejamentoStrategy } from './PlanejamentoStrategy';
import { RevisaoStrategy } from './RevisaoStrategy';
import { AtrasadosStrategy } from './AtrasadosStrategy';
import { BpcStrategy } from './BpcStrategy';
import { RestabelecimentoStrategy } from './RestabelecimentoStrategy';
import { RppsUniaoStrategy } from './RppsUniaoStrategy';
import { RppsEstMunStrategy } from './RppsEstMunStrategy';
import { ComplementacaoStrategy } from './ComplementacaoStrategy';
import { ContribAtrasoStrategy } from './ContribAtrasoStrategy';

export class CalculationStrategyFactory {
  private static strategies: Map<TipoCalculo, CalculationStrategy> = new Map([
    ['liquidacao', new LiquidacaoStrategy()],
    ['planejamento', new PlanejamentoStrategy()],
    ['revisao', new RevisaoStrategy()],
    ['atrasados', new AtrasadosStrategy()],
    ['bpc', new BpcStrategy()],
    ['restabelecimento', new RestabelecimentoStrategy()],
    ['rpps_uniao', new RppsUniaoStrategy()],
    ['rpps_est_mun', new RppsEstMunStrategy()],
    ['complementacao', new ComplementacaoStrategy()],
    ['atraso_contribuicao', new ContribAtrasoStrategy()]
  ]);

  static getStrategy(tipo: TipoCalculo): CalculationStrategy {
    const strategy = this.strategies.get(tipo);
    if (!strategy) {
      throw new Error(`Estratégia de cálculo não encontrada para o tipo: ${tipo}`);
    }
    return strategy;
  }

  static registerStrategy(tipo: TipoCalculo, strategy: CalculationStrategy): void {
    this.strategies.set(tipo, strategy);
  }
}
