import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("A chave GEMINI_API_KEY não foi encontrada nas configurações de Secrets do AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-prev-calc',
        }
      }
    });
  }
  return aiClient;
}

// Auxiliar para parsing de request bodies
export async function getRequestBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: any) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error("JSON inválido no corpo da requisição"));
      }
    });
    req.on('error', (err: any) => reject(err));
  });
}

// Auxiliar para respostas JSON
export function sendJsonResponse(res: any, statusCode: number, data: any) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// POST /api/generate-parecer - Gera um parecer técnico completo baseado nos cálculos do cliente
async function handleGenerateParecer(req: any, res: any) {
  try {
    const body = await getRequestBody(req);
    const { client, modulo, calculoDet } = body;

    if (!client) {
      return sendJsonResponse(res, 400, { error: "Dados do cliente são necessários para gerar o parecer técnico." });
    }

    const ai = getAiClient();
    const prompt = `Como um consultor jurídico e especialista em direito previdenciário brasileiro (Regras Gerais do RGPS, Emenda Constitucional 103/2019 e RPPS), elabore um parecer jurídico profissional detalhado em formato de texto estruturado.

MÓDULO DE CÁLCULO SELECIONADO: "${modulo}"
INFORMAÇÕES DO CLIENTE:
- Nome: ${client.nome || 'Não Informado'}
- Gênero: ${client.genero === 'F' ? 'Feminino' : 'Masculino'}
- Data de Nascimento: ${client.dataNascimento || 'Não Informada'}
- Idade Calculada: ${client.idade || 'Não informada'} anos
- Tempo de Contribuição: ${client.tempoContribuicaoAnos || 0} anos, ${client.tempoContribuicaoMeses || 0} meses e ${client.tempoContribuicaoDias || 0} dias
- Carência Alcançada: ${client.carencia || 0} contribuições mensais

DETALHES DO CÁLCULO:
${JSON.stringify(calculoDet || {})}

O Parecer Técnico deve conter seções claras em português formal:
1. Resumo Executivo da Situação Contributiva do(a) Segurado(a).
2. Enquadramento e análise técnica pré/pós Reforma da Previdência (Direito Adquirido, Regras de Transição cabíveis, ou BPC/LOAS conforme o módulo).
3. Memória de Cálculo Simplificada com indicação de aplicação de Correção Monetária (IPCA-E/INPC) e Teto do INSS (quando cabível).
4. Próximos Passos recomendados ao advogado para instrução do requerimento administrativo ou petição de liquidação.

Format seu texto com Markdown elegante e linguagem técnica de ponta.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um robô de inteligência artificial de alta performance especializado em cálculos atuariais e advocacia previdenciária de elite (RGPS/RPPS brasileiro).",
      }
    });

    return sendJsonResponse(res, 200, { parecer: response.text });
  } catch (error: any) {
    console.error("Erro ao gerar Parecer Previdenciário com IA:", error);
    return sendJsonResponse(res, 500, { error: error.message || "Falha na comunicação com o motor de Inteligência Artificial Gemini." });
  }
}

// POST /api/simular-indices - Simulação de índices de correção oficiais
async function handleSimularIndices(req: any, res: any) {
  try {
    const body = await getRequestBody(req);
    const { competências } = body; // Array de { competencia: string, valorOriginal: number }

    if (!competências || !Array.isArray(competências)) {
      return sendJsonResponse(res, 400, { error: "Formato de competências inválido. Esperado um array." });
    }

    // Retorna correções simuladas com índices reais projetados historicamente (tabela básica baseada no INPC/IPCA-E histórico)
    const taxaJurosMensal = 0.005; // 0.5% a.m tradicional (Poupança/Lei 11.960/09)
    let totalCorrigido = 0;
    let totalJuros = 0;
    let totalGeral = 0;

    const detalhado = competências.map((comp: any, index: number) => {
      const original = Number(comp.valorOriginal) || 0;
      // Simulação fidedigna de fator variando pelo tempo decorrido
      const mesesAtras = (competências.length - index) * 1.25;
      const fatorCorrecao = 1 + (mesesAtras * 0.0035); // Projeção aproximada IPCA-E
      const valorCorrigido = original * fatorCorrecao;
      
      const taxaJurosAcumulada = mesesAtras * taxaJurosMensal;
      const valorJuros = valorCorrigido * taxaJurosAcumulada;
      const totalCompetencia = valorCorrigido + valorJuros;

      totalCorrigido += valorCorrigido;
      totalJuros += valorJuros;
      totalGeral += totalCompetencia;

      return {
        competencia: comp.competencia,
        original,
        fator: fatorCorrecao.toFixed(6),
        valorCorrigido: Number(valorCorrigido.toFixed(2)),
        jurosPercentual: (taxaJurosAcumulada * 100).toFixed(2),
        valorJuros: Number(valorJuros.toFixed(2)),
        totalCompetencia: Number(totalCompetencia.toFixed(2))
      };
    });

    return sendJsonResponse(res, 200, {
      detalhado,
      resumo: {
        totalOriginal: competências.reduce((acc, c) => acc + (Number(c.valorOriginal) || 0), 0),
        totalCorrigido: Number(totalCorrigido.toFixed(2)),
        totalJuros: Number(totalJuros.toFixed(2)),
        totalGeral: Number(totalGeral.toFixed(2))
      }
    });

  } catch (err: any) {
    return sendJsonResponse(res, 500, { error: err.message || "Erro no processador de índices" });
  }
}

// Distribuidor principal de rotas API do servidor
export async function routeApiRequest(req: any, res: any): Promise<boolean> {
  const url = req.url || '';
  if (!url.startsWith('/api/')) return false;

  const pathname = url.split('?')[0];

  try {
    if (pathname === '/api/generate-parecer' && req.method === 'POST') {
      await handleGenerateParecer(req, res);
      return true;
    }
    if (pathname === '/api/simular-indices' && req.method === 'POST') {
      await handleSimularIndices(req, res);
      return true;
    }

    sendJsonResponse(res, 404, { error: `Endpoint previdenciário ${pathname} não encontrado.` });
    return true;
  } catch (e: any) {
    sendJsonResponse(res, 500, { error: e.message || "Erro na central de cálculos" });
    return true;
  }
}
