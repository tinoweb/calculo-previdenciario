import { Cliente } from '../types';

export interface IClienteRepository {
  salvar(cliente: Cliente): Promise<void>;
  buscarPorId(id: string): Promise<Cliente | null>;
  buscarTodos(): Promise<Cliente[]>;
  atualizar(id: string, cliente: Partial<Cliente>): Promise<void>;
  deletar(id: string): Promise<void>;
}

export class ClienteRepository implements IClienteRepository {
  private readonly storageKey = 'prev_clientes';

  async salvar(cliente: Cliente): Promise<void> {
    const clientes = await this.buscarTodos();
    const index = clientes.findIndex(c => c.id === cliente.id);
    
    if (index >= 0) {
      clientes[index] = cliente;
    } else {
      clientes.unshift(cliente);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(clientes));
  }

  async buscarPorId(id: string): Promise<Cliente | null> {
    const clientes = await this.buscarTodos();
    return clientes.find(c => c.id === id) || null;
  }

  async buscarTodos(): Promise<Cliente[]> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }
  }

  async atualizar(id: string, atualizacao: Partial<Cliente>): Promise<void> {
    const clientes = await this.buscarTodos();
    const index = clientes.findIndex(c => c.id === id);
    
    if (index >= 0) {
      clientes[index] = { ...clientes[index], ...atualizacao };
      localStorage.setItem(this.storageKey, JSON.stringify(clientes));
    }
  }

  async deletar(id: string): Promise<void> {
    const clientes = await this.buscarTodos();
    const filtrados = clientes.filter(c => c.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtrados));
  }
}
