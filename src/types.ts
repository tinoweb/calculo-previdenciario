export type PlanoTier = 'bronze' | 'prata' | 'ouro';

export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  genero: 'M' | 'F';
  dataNascimento: string;
  carencia: number; // Número de contribuições pagas (carência)
  tempoAnos: number;
  tempoMeses: number;
  tempoDias: number;
  favorito: boolean;
  cadastradoEm: string;
}

export type TipoCalculo =
  | 'liquidacao'
  | 'planejamento'
  | 'revisao'
  | 'atrasados'
  | 'bpc'
  | 'restabelecimento'
  | 'rpps_uniao'
  | 'rpps_est_mun'
  | 'complementacao'
  | 'atraso_contribuicao';

export interface CalculoSalarioCompetencia {
  competencia: string; // Ex: "05/2022"
  valorOriginal: number;
  valorCorrigido?: number;
  fatorId: string;
}

export interface CalculoRegistro {
  id: string;
  clienteId: string;
  clienteNome: string;
  dataCriacao: string;
  tipo: TipoCalculo;
  titulo: string;
  valorCalculado: number;
  detalhes: string; // Memória de cálculo resumida em texto
  parecerIA?: string;
}
