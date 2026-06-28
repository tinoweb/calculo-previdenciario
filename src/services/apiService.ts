export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export class ApiService {
  private static baseUrl = '/api';

  static async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'Erro na requisição',
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        status: 500,
      };
    }
  }

  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'Erro na requisição',
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        status: 500,
      };
    }
  }
}

export interface GenerateParecerRequest {
  client: {
    nome: string;
    genero: 'M' | 'F';
    dataNascimento: string;
    idade: number;
    tempoContribuicaoAnos: number;
    tempoContribuicaoMeses: number;
    tempoContribuicaoDias: number;
    carencia: number;
  };
  modulo: string;
  calculoDet: unknown;
}

export interface GenerateParecerResponse {
  parecer: string;
}

export class PrevidenciarioApiService extends ApiService {
  static async generateParecer(
    request: GenerateParecerRequest
  ): Promise<ApiResponse<GenerateParecerResponse>> {
    return this.post<GenerateParecerResponse>('/generate-parecer', request);
  }

  static async simularIndices(competências: Array<{ competencia: string; valorOriginal: number }>) {
    return this.post('/simular-indices', { competências });
  }
}
