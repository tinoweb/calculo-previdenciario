export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationService {
  static validarCPF(cpf: string): ValidationResult {
    const errors: string[] = [];
    
    if (!cpf) {
      errors.push('CPF é obrigatório');
      return { isValid: false, errors };
    }

    // Remove caracteres não numéricos
    const cpfLimpo = cpf.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
      errors.push('CPF deve conter 11 dígitos');
      return { isValid: false, errors };
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) {
      errors.push('CPF inválido: todos os dígitos são iguais');
      return { isValid: false, errors };
    }

    // Validação do dígito verificador
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(9, 10))) {
      errors.push('CPF inválido: primeiro dígito verificador incorreto');
      return { isValid: false, errors };
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(10, 11))) {
      errors.push('CPF inválido: segundo dígito verificador incorreto');
      return { isValid: false, errors };
    }

    return { isValid: true, errors: [] };
  }

  static validarNome(nome: string): ValidationResult {
    const errors: string[] = [];

    if (!nome || nome.trim().length === 0) {
      errors.push('Nome é obrigatório');
      return { isValid: false, errors };
    }

    if (nome.trim().length < 3) {
      errors.push('Nome deve conter pelo menos 3 caracteres');
    }

    if (nome.trim().length > 100) {
      errors.push('Nome deve conter no máximo 100 caracteres');
    }

    return { isValid: errors.length === 0, errors };
  }

  static validarDataNascimento(dataNascimento: string): ValidationResult {
    const errors: string[] = [];

    if (!dataNascimento) {
      errors.push('Data de nascimento é obrigatória');
      return { isValid: false, errors };
    }

    const data = new Date(dataNascimento);
    const hoje = new Date();
    
    // Zerar as horas para comparação correta (evita problemas de fuso horário)
    hoje.setHours(0, 0, 0, 0);
    data.setHours(0, 0, 0, 0);

    if (isNaN(data.getTime())) {
      errors.push('Data de nascimento inválida');
      return { isValid: false, errors };
    }

    if (data > hoje) {
      errors.push('Data de nascimento não pode ser futura');
    }

    const idade = hoje.getFullYear() - data.getFullYear();
    
    if (idade > 120) {
      errors.push('Data de nascimento inválida: idade muito alta');
    }

    if (idade < 0) {
      errors.push('Data de nascimento inválida');
    }

    return { isValid: errors.length === 0, errors };
  }

  static validarEmail(email: string): ValidationResult {
    const errors: string[] = [];

    if (!email || email.trim().length === 0) {
      errors.push('E-mail é obrigatório');
      return { isValid: false, errors };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('E-mail inválido');
    }

    return { isValid: errors.length === 0, errors };
  }

  static validarValorNumerico(valor: number, min: number = 0, max?: number, nomeCampo: string = 'Valor'): ValidationResult {
    const errors: string[] = [];

    if (isNaN(valor)) {
      errors.push(`${nomeCampo} deve ser um número válido`);
      return { isValid: false, errors };
    }

    if (valor < min) {
      errors.push(`${nomeCampo} deve ser maior ou igual a ${min}`);
    }

    if (max !== undefined && valor > max) {
      errors.push(`${nomeCampo} deve ser menor ou igual a ${max}`);
    }

    return { isValid: errors.length === 0, errors };
  }

  static validarCarencia(carencia: number): ValidationResult {
    return this.validarValorNumerico(carencia, 0, 600, 'Carência');
  }

  static validarTempoContribuicao(anos: number, meses: number, dias: number): ValidationResult {
    const errors: string[] = [];

    const validacaoAnos = this.validarValorNumerico(anos, 0, 100, 'Anos');
    errors.push(...validacaoAnos.errors);

    const validacaoMeses = this.validarValorNumerico(meses, 0, 11, 'Meses');
    errors.push(...validacaoMeses.errors);

    const validacaoDias = this.validarValorNumerico(dias, 0, 30, 'Dias');
    errors.push(...validacaoDias.errors);

    return { isValid: errors.length === 0, errors };
  }

  static validarSenha(senha: string): ValidationResult {
    const errors: string[] = [];

    if (!senha || senha.length === 0) {
      errors.push('Senha é obrigatória');
      return { isValid: false, errors };
    }

    if (senha.length < 6) {
      errors.push('Senha deve conter pelo menos 6 caracteres');
    }

    return { isValid: errors.length === 0, errors };
  }
}
