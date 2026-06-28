import { Cliente } from '../types';
import { ValidationService } from '../services/validationService';

export interface ClienteParams {
  nome: string;
  cpf: string;
  genero: 'M' | 'F';
  dataNascimento: string;
  carencia: number;
  tempoAnos: number;
  tempoMeses: number;
  tempoDias: number;
}

export class ClienteFactory {
  static create(params: ClienteParams): Cliente {
    // Validações
    const nomeValidacao = ValidationService.validarNome(params.nome);
    if (!nomeValidacao.isValid) {
      throw new Error(`Erro ao criar cliente: ${nomeValidacao.errors.join(', ')}`);
    }

    const cpfValidacao = ValidationService.validarCPF(params.cpf);
    if (!cpfValidacao.isValid) {
      throw new Error(`Erro ao criar cliente: ${cpfValidacao.errors.join(', ')}`);
    }

    const dataValidacao = ValidationService.validarDataNascimento(params.dataNascimento);
    if (!dataValidacao.isValid) {
      throw new Error(`Erro ao criar cliente: ${dataValidacao.errors.join(', ')}`);
    }

    const carenciaValidacao = ValidationService.validarCarencia(params.carencia);
    if (!carenciaValidacao.isValid) {
      throw new Error(`Erro ao criar cliente: ${carenciaValidacao.errors.join(', ')}`);
    }

    const tempoValidacao = ValidationService.validarTempoContribuicao(
      params.tempoAnos,
      params.tempoMeses,
      params.tempoDias
    );
    if (!tempoValidacao.isValid) {
      throw new Error(`Erro ao criar cliente: ${tempoValidacao.errors.join(', ')}`);
    }

    return {
      id: `cli-user-${Date.now()}`,
      nome: params.nome.trim(),
      cpf: params.cpf.trim(),
      genero: params.genero,
      dataNascimento: params.dataNascimento,
      carencia: params.carencia,
      tempoAnos: params.tempoAnos,
      tempoMeses: params.tempoMeses,
      tempoDias: params.tempoDias,
      favorito: false,
      cadastradoEm: new Date().toISOString().split('T')[0]
    };
  }

  static createFromExisting(cliente: Cliente): Cliente {
    return { ...cliente };
  }
}
