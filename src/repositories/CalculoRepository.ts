import { CalculoRegistro } from '../types';

export interface ICalculoRepository {
  salvar(calculo: CalculoRegistro): Promise<void>;
  buscarPorId(id: string): Promise<CalculoRegistro | null>;
  buscarTodos(): Promise<CalculoRegistro[]>;
  buscarPorClienteId(clienteId: string): Promise<CalculoRegistro[]>;
  deletar(id: string): Promise<void>;
  deletarPorClienteId(clienteId: string): Promise<void>;
}

export class CalculoRepository implements ICalculoRepository {
  private readonly storageKey = 'prev_calculos';

  async salvar(calculo: CalculoRegistro): Promise<void> {
    const calculos = await this.buscarTodos();
    const index = calculos.findIndex(c => c.id === calculo.id);
    
    if (index >= 0) {
      calculos[index] = calculo;
    } else {
      calculos.unshift(calculo);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(calculos));
  }

  async buscarPorId(id: string): Promise<CalculoRegistro | null> {
    const calculos = await this.buscarTodos();
    return calculos.find(c => c.id === id) || null;
  }

  async buscarTodos(): Promise<CalculoRegistro[]> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar cálculos:', error);
      return [];
    }
  }

  async buscarPorClienteId(clienteId: string): Promise<CalculoRegistro[]> {
    const calculos = await this.buscarTodos();
    return calculos.filter(c => c.clienteId === clienteId);
  }

  async deletar(id: string): Promise<void> {
    const calculos = await this.buscarTodos();
    const filtrados = calculos.filter(c => c.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtrados));
  }

  async deletarPorClienteId(clienteId: string): Promise<void> {
    const calculos = await this.buscarTodos();
    const filtrados = calculos.filter(c => c.clienteId !== clienteId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtrados));
  }
}
