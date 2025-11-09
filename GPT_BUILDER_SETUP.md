# Guia de Configuração para GPT Builder

Este guia explica como configurar o servidor MCP BCB Meios de Pagamento para uso com o GPT Builder.

## Pré-requisitos

1. Servidor deployado no Render (ou outro provedor) com HTTPS
2. Acesso ao GPT Builder
3. URL do servidor acessível publicamente

## Configuração no GPT Builder

### Passo 1: Deploy do Servidor

Certifique-se de que o servidor está deployado e acessível. Você pode verificar acessando:

```
https://seu-servidor.onrender.com/health
```

Deve retornar:
```json
{
  "status": "ok",
  "service": "bcb-meios-pagamento-mcp"
}
```

### Passo 2: Verificar Endpoints

O servidor expõe os seguintes endpoints:

- `GET /health` - Verifica se o servidor está online
- `GET /tools` - Lista todas as ferramentas disponíveis
- `POST /tools/call` - Executa uma ferramenta
- `GET /mcp` - Retorna informações do servidor MCP
- `GET /sse` - Endpoint SSE para ChatGPT (não usado pelo GPT Builder)

### Passo 3: Configurar no GPT Builder

1. Acesse o GPT Builder
2. Vá para a seção de configuração de servidores MCP
3. Adicione um novo servidor MCP com as seguintes informações:
   - **Nome**: BCB Meios de Pagamento
   - **URL Base**: `https://seu-servidor.onrender.com`
   - **Tipo**: REST API
   - **Endpoint de Ferramentas**: `/tools`
   - **Endpoint de Execução**: `/tools/call`

### Passo 4: Testar a Conexão

Após configurar, o GPT Builder deve automaticamente:
1. Fazer uma requisição GET para `/tools` para obter a lista de ferramentas
2. Exibir as 8 ferramentas disponíveis
3. Permitir que você teste as ferramentas

## Formato das Requisições

### Listar Ferramentas

**Requisição:**
```
GET https://seu-servidor.onrender.com/tools
```

**Resposta:**
```json
{
  "tools": [
    {
      "name": "consultar_meios_pagamento_mensal",
      "description": "Consulta dados mensais sobre meios de pagamento...",
      "inputSchema": {
        "type": "object",
        "properties": {
          "ano_mes": {
            "type": "string",
            "description": "Ano e mês no formato YYYYMM"
          }
        },
        "required": ["ano_mes"]
      }
    }
  ]
}
```

### Executar Ferramenta

**Requisição:**
```
POST https://seu-servidor.onrender.com/tools/call
Content-Type: application/json

{
  "name": "consultar_meios_pagamento_mensal",
  "arguments": {
    "ano_mes": "202312"
  }
}
```

**Resposta (Sucesso):**
```json
{
  "success": true,
  "content": [
    {
      "type": "text",
      "text": "{ ... dados da API do BCB ... }"
    }
  ]
}
```

**Resposta (Erro):**
```json
{
  "success": false,
  "content": [
    {
      "type": "text",
      "text": "Erro ao consultar API do BCB: ..."
    }
  ],
  "isError": true
}
```

## Solução de Problemas

### Erro: "Unable to load tools"

Este erro geralmente significa que o GPT Builder não conseguiu obter a lista de ferramentas. Verifique:

1. **Servidor está online?**
   ```bash
   curl https://seu-servidor.onrender.com/health
   ```

2. **Endpoint /tools está acessível?**
   ```bash
   curl https://seu-servidor.onrender.com/tools
   ```

3. **CORS está configurado?**
   - O servidor já está configurado com CORS habilitado
   - Verifique os logs do servidor para erros de CORS

4. **Formato da resposta está correto?**
   - O endpoint `/tools` deve retornar um objeto JSON com uma chave `tools`
   - Cada ferramenta deve ter `name`, `description` e `inputSchema`

### Erro: "Tool execution failed"

Se as ferramentas são carregadas mas não funcionam:

1. **Verifique os logs do servidor**
   - No Render, acesse a seção de Logs
   - Procure por erros ao executar ferramentas

2. **Teste manualmente o endpoint**
   ```bash
   curl -X POST https://seu-servidor.onrender.com/tools/call \
     -H "Content-Type: application/json" \
     -d '{
       "name": "consultar_meios_pagamento_mensal",
       "arguments": {
         "ano_mes": "202312"
       }
     }'
   ```

3. **Verifique os parâmetros**
   - Certifique-se de que os parâmetros obrigatórios estão sendo fornecidos
   - Verifique o formato dos dados (ex: `ano_mes` deve ser no formato YYYYMM)

### Servidor não responde

1. **Verifique se o servidor está deployado**
   - No Render, verifique o status do serviço
   - Certifique-se de que o build foi bem-sucedido

2. **Verifique as variáveis de ambiente**
   - `PORT` deve estar configurada (geralmente 3000 ou automática)
   - `NODE_ENV` pode ser `production`

3. **Verifique os logs**
   - No Render, acesse a seção de Logs
   - Procure por erros de inicialização

## Testando Localmente

Para testar localmente antes de fazer deploy:

1. **Inicie o servidor:**
   ```bash
   npm run dev:http
   ```

2. **Teste os endpoints:**
   ```bash
   # Health check
   curl http://localhost:3000/health

   # Listar ferramentas
   curl http://localhost:3000/tools

   # Executar ferramenta
   curl -X POST http://localhost:3000/tools/call \
     -H "Content-Type: application/json" \
     -d '{
       "name": "consultar_meios_pagamento_mensal",
       "arguments": {
         "ano_mes": "202312"
       }
     }'
   ```

3. **Use ngrok para testar com GPT Builder:**
   ```bash
   ngrok http 3000
   ```
   Use a URL HTTPS fornecida pelo ngrok no GPT Builder

## Ferramentas Disponíveis

O servidor expõe 8 ferramentas:

1. `consultar_meios_pagamento_mensal` - Dados mensais de meios de pagamento
2. `consultar_meios_pagamento_trimestral` - Dados trimestrais de meios de pagamento
3. `consultar_transacoes_cartoes` - Transações com cartões
4. `consultar_estabelecimentos_credenciados` - Estabelecimentos credenciados
5. `consultar_taxas_intercambio` - Taxas de intercâmbio
6. `consultar_taxas_desconto` - Taxas de desconto
7. `consultar_terminais_atm` - Estatísticas de terminais ATM
8. `consultar_portadores_cartao` - Informações sobre portadores de cartão

## Suporte

Se você encontrar problemas:

1. Verifique os logs do servidor
2. Teste os endpoints manualmente
3. Verifique a documentação da API do BCB
4. Abra uma issue no GitHub do projeto

## Exemplos de Uso

Após configurar, você pode fazer perguntas como:

- "Quais foram os dados de PIX em dezembro de 2023?"
- "Mostre as transações com cartões no último trimestre de 2023"
- "Quantos estabelecimentos estavam credenciados no 3º trimestre de 2023?"
- "Quais são as taxas de intercâmbio atuais?"

O GPT Builder irá automaticamente usar as ferramentas apropriadas para responder suas perguntas.

