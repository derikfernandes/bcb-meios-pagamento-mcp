#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import express from "express";
import cors from "cors";

const API_BASE_URL = "https://olinda.bcb.gov.br/olinda/servico/MPV_DadosAbertos/versao/v1/odata";

// Interface para parâmetros de consulta
interface QueryParams {
  formato?: string;
  top?: number;
  skip?: number;
  filter?: string;
  orderby?: string;
}

// Função auxiliar para construir URL com parâmetros
function buildUrl(endpoint: string, params: QueryParams = {}): string {
  const url = new URL(`${API_BASE_URL}/${endpoint}`);

  if (params.formato) url.searchParams.append("$format", params.formato);
  if (params.top) url.searchParams.append("$top", params.top.toString());
  if (params.skip) url.searchParams.append("$skip", params.skip.toString());
  if (params.filter) url.searchParams.append("$filter", params.filter);
  if (params.orderby) url.searchParams.append("$orderby", params.orderby);

  return url.toString();
}

// Função auxiliar para fazer requisições à API
async function fetchBCBData(endpoint: string, params: QueryParams = {}) {
  try {
    const url = buildUrl(endpoint, params);
    const response = await axios.get(url, {
      headers: {
        "Accept": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro ao consultar API do BCB: ${error.message}`);
    }
    throw error;
  }
}

// Definição das ferramentas com metadados para ChatGPT
const tools: Tool[] = [
  {
    name: "consultar_meios_pagamento_mensal",
    description: "Consulta dados mensais sobre meios de pagamento, incluindo operações com boletos bancários, PIX, TED, DOC e outros. Use o formato YYYYMM para o parâmetro ano_mes (exemplo: '202312' para dezembro de 2023).",
    inputSchema: {
      type: "object",
      properties: {
        ano_mes: {
          type: "string",
          description: "Ano e mês no formato YYYYMM (exemplo: '202312')",
        },
        top: {
          type: "number",
          description: "Número máximo de registros a retornar (padrão: 100)",
        },
        skip: {
          type: "number",
          description: "Número de registros a pular para paginação",
        },
        filtro: {
          type: "string",
          description: "Filtro OData para refinar a consulta (exemplo: \"Modalidade eq 'PIX'\")",
        },
      },
      required: ["ano_mes"],
    },
  },
  {
    name: "consultar_meios_pagamento_trimestral",
    description: "Consulta dados trimestrais sobre operações com cartões de pagamento e transferências de crédito. Use o formato YYYYQ para o parâmetro trimestre (exemplo: '20234' para o 4º trimestre de 2023).",
    inputSchema: {
      type: "object",
      properties: {
        trimestre: {
          type: "string",
          description: "Ano e trimestre no formato YYYYQ (exemplo: '20234' para 4º trimestre de 2023)",
        },
        top: {
          type: "number",
          description: "Número máximo de registros a retornar (padrão: 100)",
        },
        skip: {
          type: "number",
          description: "Número de registros a pular para paginação",
        },
        filtro: {
          type: "string",
          description: "Filtro OData para refinar a consulta",
        },
      },
      required: ["trimestre"],
    },
  },
  {
    name: "consultar_transacoes_cartoes",
    description: "Consulta estoque e transações de cartões de pagamento por trimestre. Retorna dados sobre quantidade e valor das transações realizadas com cartões.",
    inputSchema: {
      type: "object",
      properties: {
        trimestre: {
          type: "string",
          description: "Ano e trimestre no formato YYYYQ (exemplo: '20234')",
        },
        top: {
          type: "number",
          description: "Número máximo de registros a retornar (padrão: 100)",
        },
        ordenar_por: {
          type: "string",
          description: "Campo para ordenação (exemplo: 'Trimestre desc')",
        },
        filtro: {
          type: "string",
          description: "Filtro OData para refinar a consulta",
        },
      },
      required: ["trimestre"],
    },
  },
  {
    name: "consultar_estabelecimentos_credenciados",
    description: "Consulta quantidade de estabelecimentos credenciados para aceitar meios de pagamento eletrônico por trimestre.",
    inputSchema: {
      type: "object",
      properties: {
        trimestre: {
          type: "string",
          description: "Ano e trimestre no formato YYYYQ (exemplo: '20234')",
        },
        top: {
          type: "number",
          description: "Número máximo de registros a retornar (padrão: 100)",
        },
        ordenar_por: {
          type: "string",
          description: "Campo para ordenação",
        },
        filtro: {
          type: "string",
          description: "Filtro OData para refinar a consulta",
        },
      },
      required: ["trimestre"],
    },
  },
  {
    name: "consultar_taxas_intercambio",
    description: "Consulta taxas de intercâmbio praticadas no mercado de meios de pagamento por trimestre.",
    inputSchema: {
      type: "object",
      properties: {
        trimestre: {
          type: "string",
          description: "Ano e trimestre no formato YYYYQ (exemplo: '20234')",
        },
        top: {
          type: "number",
          description: "Número máximo de registros a retornar (padrão: 100)",
        },
        filtro: {
          type: "string",
          description: "Filtro OData para refinar a consulta",
        },
      },
      required: ["trimestre"],
    },
  },
  {
    name: "consultar_taxas_desconto",
    description: "Consulta taxas de desconto cobradas de estabelecimentos comerciais por operações com meios de pagamento.",
    inputSchema: {
      type: "object",
      properties: {
        trimestre: {
          type: "string",
          description: "Ano e trimestre no formato YYYYQ (exemplo: '20234')",
        },
        top: {
          type: "number",
          description: "Número máximo de registros a retornar (padrão: 100)",
        },
        filtro: {
          type: "string",
          description: "Filtro OData para refinar a consulta",
        },
      },
      required: ["trimestre"],
    },
  },
  {
    name: "consultar_terminais_atm",
    description: "Consulta estatísticas sobre terminais de autoatendimento (ATM/caixas eletrônicos) por trimestre.",
    inputSchema: {
      type: "object",
      properties: {
        trimestre: {
          type: "string",
          description: "Ano e trimestre no formato YYYYQ (exemplo: '20234')",
        },
        top: {
          type: "number",
          description: "Número máximo de registros a retornar (padrão: 100)",
        },
        filtro: {
          type: "string",
          description: "Filtro OData para refinar a consulta",
        },
      },
      required: ["trimestre"],
    },
  },
  {
    name: "consultar_portadores_cartao",
    description: "Consulta informações sobre portadores de cartões de pagamento por trimestre.",
    inputSchema: {
      type: "object",
      properties: {
        trimestre: {
          type: "string",
          description: "Ano e trimestre no formato YYYYQ (exemplo: '20234')",
        },
        top: {
          type: "number",
          description: "Número máximo de registros a retornar (padrão: 100)",
        },
        filtro: {
          type: "string",
          description: "Filtro OData para refinar a consulta",
        },
      },
      required: ["trimestre"],
    },
  },
];

// Função para executar uma ferramenta (compartilhada entre REST e MCP)
async function executeTool(name: string, args: any) {
  try {
    switch (name) {
      case "consultar_meios_pagamento_mensal": {
        const { ano_mes, top = 100, skip, filtro } = args as {
          ano_mes: string;
          top?: number;
          skip?: number;
          filtro?: string;
        };

        const data = await fetchBCBData(`MeiosdePagamentosMensalDA(AnoMes=@AnoMes)?@AnoMes='${ano_mes}'`, {
          formato: "json",
          top,
          skip,
          filter: filtro,
        });

        return {
          success: true,
          data,
        };
      }

      case "consultar_meios_pagamento_trimestral": {
        const { trimestre, top = 100, skip, filtro } = args as {
          trimestre: string;
          top?: number;
          skip?: number;
          filtro?: string;
        };

        const data = await fetchBCBData(`MeiosdePagamentosTrimestralDA(trimestre=@trimestre)?@trimestre='${trimestre}'`, {
          formato: "json",
          top,
          skip,
          filter: filtro,
        });

        return {
          success: true,
          data,
        };
      }

      case "consultar_transacoes_cartoes": {
        const { trimestre, top = 100, ordenar_por, filtro } = args as {
          trimestre: string;
          top?: number;
          ordenar_por?: string;
          filtro?: string;
        };

        const data = await fetchBCBData(`Quantidadeetransacoesdecartoes(trimestre=@trimestre)?@trimestre='${trimestre}'`, {
          formato: "json",
          top,
          orderby: ordenar_por,
          filter: filtro,
        });

        return {
          success: true,
          data,
        };
      }

      case "consultar_estabelecimentos_credenciados": {
        const { trimestre, top = 100, ordenar_por, filtro } = args as {
          trimestre: string;
          top?: number;
          ordenar_por?: string;
          filtro?: string;
        };

        const data = await fetchBCBData(`EstabCredTransDA(trimestre=@trimestre)?@trimestre='${trimestre}'`, {
          formato: "json",
          top,
          orderby: ordenar_por,
          filter: filtro,
        });

        return {
          success: true,
          data,
        };
      }

      case "consultar_taxas_intercambio": {
        const { trimestre, top = 100, filtro } = args as {
          trimestre: string;
          top?: number;
          filtro?: string;
        };

        const data = await fetchBCBData(`TaxasIntercambioDA(trimestre=@trimestre)?@trimestre='${trimestre}'`, {
          formato: "json",
          top,
          filter: filtro,
        });

        return {
          success: true,
          data,
        };
      }

      case "consultar_taxas_desconto": {
        const { trimestre, top = 100, filtro } = args as {
          trimestre: string;
          top?: number;
          filtro?: string;
        };

        const data = await fetchBCBData(`TaxasDescontoDA(trimestre=@trimestre)?@trimestre='${trimestre}'`, {
          formato: "json",
          top,
          filter: filtro,
        });

        return {
          success: true,
          data,
        };
      }

      case "consultar_terminais_atm": {
        const { trimestre, top = 100, filtro } = args as {
          trimestre: string;
          top?: number;
          filtro?: string;
        };

        const data = await fetchBCBData(`TerminaisATMDA(trimestre=@trimestre)?@trimestre='${trimestre}'`, {
          formato: "json",
          top,
          filter: filtro,
        });

        return {
          success: true,
          data,
        };
      }

      case "consultar_portadores_cartao": {
        const { trimestre, top = 100, filtro } = args as {
          trimestre: string;
          top?: number;
          filtro?: string;
        };

        const data = await fetchBCBData(`PortadoresCartaoDA(trimestre=@trimestre)?@trimestre='${trimestre}'`, {
          formato: "json",
          top,
          filter: filtro,
        });

        return {
          success: true,
          data,
        };
      }

      default:
        throw new Error(`Ferramenta desconhecida: ${name}`);
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Criar servidor MCP
function createMCPServer() {
  const server = new Server(
    {
      name: "bcb-meios-pagamento-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handler para listagem de ferramentas
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools,
    };
  });

  // Handler para execução de ferramentas (usa a função compartilhada)
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    const result = await executeTool(name, args || {});

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `Erro ao executar ${name}: ${result.error || 'Erro desconhecido'}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

// Iniciar servidor HTTP com SSE e REST
async function main() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'bcb-meios-pagamento-mcp' });
  });

  // REST endpoint para listar ferramentas (compatível com GPT Builder)
  app.get('/tools', (req, res) => {
    res.json({
      tools: tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    });
  });

  // Endpoint para listar ferramentas (formato alternativo)
  app.get('/api/tools', (req, res) => {
    res.json({
      tools: tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    });
  });

  // Handler para executar ferramentas (reutilizável)
  const handleToolCall = async (req: express.Request, res: express.Response) => {
    try {
      // Suporta múltiplos formatos de requisição
      const { name, tool, arguments: args, args: argsAlt, parameters } = req.body;
      const toolName = name || tool;
      const toolArgs = args || argsAlt || parameters || {};

      if (!toolName) {
        return res.status(400).json({
          success: false,
          error: 'Nome da ferramenta é obrigatório',
          message: 'Especifique "name" ou "tool" no corpo da requisição',
        });
      }

      const result = await executeTool(toolName, toolArgs);

      if (result.success) {
        res.json({
          success: true,
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2),
            },
          ],
        });
      } else {
        res.status(500).json({
          success: false,
          content: [
            {
              type: 'text',
              text: result.error || 'Erro desconhecido',
            },
          ],
          isError: true,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        content: [
          {
            type: 'text',
            text: `Erro ao executar ferramenta: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      });
    }
  };

  // REST endpoint para executar ferramentas (compatível com GPT Builder)
  app.post('/tools/call', handleToolCall);

  // Endpoint alternativo para executar ferramentas
  app.post('/api/tools/call', handleToolCall);

  // Endpoint MCP padrão (retorna informações do servidor e ferramentas)
  app.get('/mcp', (req, res) => {
    res.json({
      name: 'bcb-meios-pagamento-mcp',
      version: '1.0.0',
      capabilities: {
        tools: {},
      },
      tools: tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    });
  });

  // Endpoint alternativo para manifesto (compatível com GPT Builder)
  app.get('/.well-known/mcp', (req, res) => {
    res.json({
      name: 'bcb-meios-pagamento-mcp',
      version: '1.0.0',
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {},
      },
    });
  });

  // SSE endpoint para MCP (compatível com ChatGPT)
  app.get('/sse', async (req, res) => {
    console.error('Nova conexão SSE estabelecida');

    // Configurar headers para SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    try {
      const server = createMCPServer();
      const transport = new SSEServerTransport('/message', res);

      await server.connect(transport);

      // Cleanup quando a conexão fechar
      req.on('close', () => {
        console.error('Conexão SSE fechada');
      });
    } catch (error) {
      console.error('Erro na conexão SSE:', error);
      res.status(500).end();
    }
  });

  // Endpoint para mensagens MCP (usado pelo SSEServerTransport)
  app.post('/message', async (req, res) => {
    // Este endpoint é usado pelo SSEServerTransport para receber mensagens
    // Não deve ser chamado diretamente
    res.status(405).json({ error: 'Use SSE endpoint para conexões MCP' });
  });

  app.listen(PORT, () => {
    console.error(`Servidor MCP BCB rodando na porta ${PORT}`);
    console.error(`Health check: http://localhost:${PORT}/health`);
    console.error(`Tools endpoint: http://localhost:${PORT}/tools`);
    console.error(`Tools call endpoint: http://localhost:${PORT}/tools/call`);
    console.error(`SSE endpoint: http://localhost:${PORT}/sse`);
  });
}

main();
