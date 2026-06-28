import { describe, it, expect } from 'vitest';
import { ValidationService } from '../services/validationService';

describe('ValidationService', () => {
  describe('validarCPF', () => {
    it('deve validar CPF válido', () => {
      const resultado = ValidationService.validarCPF('123.456.789-09');
      expect(resultado.isValid).toBe(true);
      expect(resultado.errors).toHaveLength(0);
    });

    it('deve rejeitar CPF inválido', () => {
      const resultado = ValidationService.validarCPF('111.111.111-11');
      expect(resultado.isValid).toBe(false);
      expect(resultado.errors.length).toBeGreaterThan(0);
    });

    it('deve rejeitar CPF com formato incorreto', () => {
      const resultado = ValidationService.validarCPF('123456789');
      expect(resultado.isValid).toBe(false);
    });

    it('deve rejeitar CPF vazio', () => {
      const resultado = ValidationService.validarCPF('');
      expect(resultado.isValid).toBe(false);
      expect(resultado.errors).toContain('CPF é obrigatório');
    });
  });

  describe('validarNome', () => {
    it('deve validar nome válido', () => {
      const resultado = ValidationService.validarNome('João Silva');
      expect(resultado.isValid).toBe(true);
    });

    it('deve rejeitar nome muito curto', () => {
      const resultado = ValidationService.validarNome('Jo');
      expect(resultado.isValid).toBe(false);
    });

    it('deve rejeitar nome vazio', () => {
      const resultado = ValidationService.validarNome('');
      expect(resultado.isValid).toBe(false);
    });

    it('deve rejeitar nome muito longo', () => {
      const resultado = ValidationService.validarNome('A'.repeat(101));
      expect(resultado.isValid).toBe(false);
    });
  });

  describe('validarDataNascimento', () => {
    it('deve validar data válida', () => {
      const resultado = ValidationService.validarDataNascimento('1990-01-01');
      expect(resultado.isValid).toBe(true);
    });

    it('deve rejeitar data futura', () => {
      const dataFutura = new Date();
      dataFutura.setFullYear(dataFutura.getFullYear() + 1);
      const resultado = ValidationService.validarDataNascimento(dataFutura.toISOString().split('T')[0]);
      expect(resultado.isValid).toBe(false);
    });

    it('deve rejeitar data muito antiga', () => {
      const resultado = ValidationService.validarDataNascimento('1800-01-01');
      expect(resultado.isValid).toBe(false);
    });

    it('deve rejeitar data inválida', () => {
      const resultado = ValidationService.validarDataNascimento('invalid-date');
      expect(resultado.isValid).toBe(false);
    });
  });

  describe('validarEmail', () => {
    it('deve validar email válido', () => {
      const resultado = ValidationService.validarEmail('teste@email.com');
      expect(resultado.isValid).toBe(true);
    });

    it('deve rejeitar email inválido', () => {
      const resultado = ValidationService.validarEmail('email-invalido');
      expect(resultado.isValid).toBe(false);
    });

    it('deve rejeitar email vazio', () => {
      const resultado = ValidationService.validarEmail('');
      expect(resultado.isValid).toBe(false);
    });
  });

  describe('validarValorNumerico', () => {
    it('deve validar valor numérico válido', () => {
      const resultado = ValidationService.validarValorNumerico(100, 0);
      expect(resultado.isValid).toBe(true);
    });

    it('deve rejeitar valor abaixo do mínimo', () => {
      const resultado = ValidationService.validarValorNumerico(-10, 0);
      expect(resultado.isValid).toBe(false);
    });

    it('deve rejeitar valor acima do máximo', () => {
      const resultado = ValidationService.validarValorNumerico(200, 0, 100);
      expect(resultado.isValid).toBe(false);
    });

    it('deve rejeitar NaN', () => {
      const resultado = ValidationService.validarValorNumerico(NaN, 0);
      expect(resultado.isValid).toBe(false);
    });
  });

  describe('validarCarencia', () => {
    it('deve validar carência válida', () => {
      const resultado = ValidationService.validarCarencia(180);
      expect(resultado.isValid).toBe(true);
    });

    it('deve rejeitar carência negativa', () => {
      const resultado = ValidationService.validarCarencia(-10);
      expect(resultado.isValid).toBe(false);
    });
  });

  describe('validarTempoContribuicao', () => {
    it('deve validar tempo de contribuição válido', () => {
      const resultado = ValidationService.validarTempoContribuicao(20, 6, 15);
      expect(resultado.isValid).toBe(true);
    });

    it('deve rejeitar meses inválidos', () => {
      const resultado = ValidationService.validarTempoContribuicao(20, 15, 0);
      expect(resultado.isValid).toBe(false);
    });

    it('deve rejeitar dias inválidos', () => {
      const resultado = ValidationService.validarTempoContribuicao(20, 0, 35);
      expect(resultado.isValid).toBe(false);
    });
  });

  describe('validarSenha', () => {
    it('deve validar senha válida', () => {
      const resultado = ValidationService.validarSenha('senha123');
      expect(resultado.isValid).toBe(true);
    });

    it('deve rejeitar senha muito curta', () => {
      const resultado = ValidationService.validarSenha('12345');
      expect(resultado.isValid).toBe(false);
    });

    it('deve rejeitar senha vazia', () => {
      const resultado = ValidationService.validarSenha('');
      expect(resultado.isValid).toBe(false);
    });
  });
});
