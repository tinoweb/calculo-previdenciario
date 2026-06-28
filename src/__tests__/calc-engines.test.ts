import { describe, it, expect } from 'vitest';
import {
  calcularLiquidacao,
  calcularPlanejamentoRGPS,
  calcularRevisaoRGPS,
  calcularAtrasados,
  calcularBpcLoas,
  calcularRestabelecimento,
  calcularRppsUniao,
  calcularRppsEstMun,
  calcularComplementacao,
  calcularContribAtraso
} from '../calc-engines';

describe('Motores de Cálculo Previdenciário', () => {
  describe('calcularLiquidacao', () => {
    it('deve calcular liquidação de sentença corretamente', () => {
      const resultado = calcularLiquidacao('12/2022', 3500, 36, 'INPC', 0.5);
      
      expect(resultado).toHaveProperty('competencias');
      expect(resultado).toHaveProperty('resumo');
      expect(resultado).toHaveProperty('memoria');
      expect(resultado.competencias).toHaveLength(36);
      expect(resultado.resumo.totalGeral).toBeGreaterThan(0);
    });

    it('deve calcular com IPCA-E', () => {
      const resultado = calcularLiquidacao('12/2022', 3500, 12, 'IPCA-E', 0.5);
      expect(resultado.competencias).toHaveLength(12);
    });
  });

  describe('calcularPlanejamentoRGPS', () => {
    it('deve calcular planejamento para homem', () => {
      const resultado = calcularPlanejamentoRGPS('M', 65, 20, 180, 5500);
      
      expect(resultado).toHaveProperty('requisitos');
      expect(resultado).toHaveProperty('coeficientePercentual');
      expect(resultado).toHaveProperty('rmiCalculada');
      expect(resultado.requisitos.atendeIdade).toBe(true);
      expect(resultado.requisitos.atendeTempo).toBe(true);
    });

    it('deve calcular planejamento para mulher', () => {
      const resultado = calcularPlanejamentoRGPS('F', 62, 15, 180, 4500);
      
      expect(resultado.requisitos.atendeIdade).toBe(true);
      expect(resultado.requisitos.atendeTempo).toBe(true);
    });

    it('deve identificar quando não atende requisitos', () => {
      const resultado = calcularPlanejamentoRGPS('M', 50, 10, 100, 3000);
      
      expect(resultado.requisitos.atendeIdade).toBe(false);
      expect(resultado.requisitos.atendeTempo).toBe(false);
    });
  });

  describe('calcularRevisaoRGPS', () => {
    it('deve calcular revisão vida toda', () => {
      const resultado = calcularRevisaoRGPS(3200, '2018-05-10', 'vida_toda');
      
      expect(resultado).toHaveProperty('decaiu');
      expect(resultado).toHaveProperty('rmiProposta');
      expect(resultado).toHaveProperty('diferencaMensal');
      expect(resultado.rmiProposta).toBeGreaterThan(resultado.rmiOriginal);
    });

    it('deve calcular revisão do teto', () => {
      const resultado = calcularRevisaoRGPS(3200, '2018-05-10', 'teto');
      expect(resultado.rmiProposta).toBeGreaterThan(3200);
    });

    it('deve identificar decadência', () => {
      const resultado = calcularRevisaoRGPS(3200, '2010-01-01', 'vida_toda');
      expect(resultado.decaiu).toBe(true);
    });
  });

  describe('calcularAtrasados', () => {
    it('deve calcular atrasados com juros', () => {
      const resultado = calcularAtrasados(2900, 24, true);
      
      expect(resultado).toHaveProperty('totalOriginal');
      expect(resultado).toHaveProperty('totalCorrigido');
      expect(resultado).toHaveProperty('totalGeral');
      expect(resultado.totalGeral).toBeGreaterThan(resultado.totalOriginal);
    });

    it('deve calcular atrasados sem juros', () => {
      const resultado = calcularAtrasados(2900, 24, false);
      expect(resultado.jurosTotal).toBe(0);
    });

    it('deve verificar limite JEF', () => {
      const resultado = calcularAtrasados(2900, 24, true);
      expect(resultado).toHaveProperty('excedeJEF');
      expect(resultado).toHaveProperty('limiteJEF');
    });
  });

  describe('calcularBpcLoas', () => {
    it('deve aprovar BPC para idoso com renda baixa', () => {
      const resultado = calcularBpcLoas('idoso', 66, 4, 1200, true);
      
      expect(resultado).toHaveProperty('rendaPerCapita');
      expect(resultado).toHaveProperty('parecerVeredito');
      expect(resultado.atendeLimiteRendaEstrito).toBe(true);
    });

    it('deve aprovar BPC para deficiente com laudo', () => {
      const resultado = calcularBpcLoas('deficiente', 40, 3, 800, true);
      expect(resultado.atendeLimiteRendaEstrito).toBe(true);
    });

    it('deve reprovar BPC para idoso com renda alta', () => {
      const resultado = calcularBpcLoas('idoso', 66, 2, 5000, true);
      expect(resultado.atendeLimiteRendaEstrito).toBe(false);
    });
  });

  describe('calcularRestabelecimento', () => {
    it('deve calcular restabelecimento', () => {
      const resultado = calcularRestabelecimento(2600, 8, 'Indeferimento em revisão médica');
      
      expect(resultado).toHaveProperty('acumuladoDevidoOriginal');
      expect(resultado).toHaveProperty('acumuladoAtualizado');
      expect(resultado).toHaveProperty('probabilidadeRecuperacao');
      expect(resultado.acumuladoAtualizado).toBeGreaterThan(resultado.acumuladoDevidoOriginal);
    });

    it('deve identificar alta probabilidade para CadÚnico', () => {
      const resultado = calcularRestabelecimento(2600, 8, 'Problema com CadÚnico');
      expect(resultado.probabilidadeRecuperacao).toBe('ALTA');
    });
  });

  describe('calcularRppsUniao', () => {
    it('deve calcular contribuição RPPS União', () => {
      const resultado = calcularRppsUniao(14500, 'M', 65);
      
      expect(resultado).toHaveProperty('descontoTotal');
      expect(resultado).toHaveProperty('aliquotaEfetiva');
      expect(resultado).toHaveProperty('salarioLiquido');
      expect(resultado.salarioLiquido).toBeLessThan(14500);
      expect(resultado.atendeIdadeServidor).toBe(true);
    });

    it('deve aplicar alíquotas progressivas', () => {
      const resultado = calcularRppsUniao(14500, 'M', 65);
      expect(resultado.detalheFaixas).toBeDefined();
      expect(resultado.detalheFaixas.length).toBeGreaterThan(0);
    });
  });

  describe('calcularRppsEstMun', () => {
    it('deve calcular contribuição RPPS Estadual/Municipal', () => {
      const resultado = calcularRppsEstMun(8200, 14);
      
      expect(resultado).toHaveProperty('desconto');
      expect(resultado).toHaveProperty('salarioLiquido');
      expect(resultado.salarioLiquido).toBeLessThan(8200);
    });
  });

  describe('calcularComplementacao', () => {
    it('deve calcular complementação previdenciária', () => {
      const resultado = calcularComplementacao(16000, 8218.64);
      
      expect(resultado).toHaveProperty('deficitSuprir');
      expect(resultado).toHaveProperty('contribuicaoMensalProposta');
      expect(resultado.deficitSuprir).toBeGreaterThan(0);
    });

    it('deve calcular deficit corretamente', () => {
      const resultado = calcularComplementacao(16000, 8218.64);
      expect(resultado.deficitSuprir).toBeCloseTo(7781.36, 2);
    });
  });

  describe('calcularContribAtraso', () => {
    it('deve calcular contribuição em atraso', () => {
      const resultado = calcularContribAtraso(4800, 12);
      
      expect(resultado).toHaveProperty('principalTotal');
      expect(resultado).toHaveProperty('multaTotal');
      expect(resultado).toHaveProperty('jurosTotal');
      expect(resultado).toHaveProperty('totalDevidoAtrasado');
      expect(resultado.totalDevidoAtrasado).toBeGreaterThan(resultado.principalTotal);
    });

    it('deve aplicar multa de 10%', () => {
      const resultado = calcularContribAtraso(4800, 12);
      expect(resultado.multaTotal).toBeGreaterThan(0);
    });

    it('deve limitar ao teto do INSS', () => {
      const resultado = calcularContribAtraso(10000, 12);
      expect(resultado.principalTotal).toBeLessThan(10000 * 12 * 0.20);
    });
  });
});
