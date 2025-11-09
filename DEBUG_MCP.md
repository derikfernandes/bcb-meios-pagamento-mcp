# Guia de Debug para Problemas com MCP

## Problema: Erro 404 ao conectar servidor MCP

Se você está recebendo o erro:
```
Error retrieving tool list from MCP server: 'bcb_mcp'. Http status code: 404 (Not Found)
```

## Solução Passo a Passo

### 1. Verificar Logs do Servidor

Após fazer o deploy, verifique os logs do Render para ver qual endpoint está sendo chamado:

1. Acesse o dashboard do Render
2. Vá para a seção de Logs do seu serviço
3. Tente conectar novamente no GPT Builder
4. Observe qual URL está sendo chamada nos logs

O servidor agora registra todas as requisições no formato:
```
[2024-01-01T12:00:00.000Z] GET /algum-endpoint
```

### 2. Endpoints Disponíveis

O servidor agora suporta os seguintes endpoints para listar ferramentas:

- `GET /tools` ✅
- `POST /tools` ✅
- `GET /api/tools` ✅
- `GET /mcp/v1/tools` ✅
- `GET /bcb_mcp/tools` ✅
- `POST /bcb_mcp/tools` ✅
- `GET /bcb-mcp/tools` ✅
- `GET /mcp` ✅
- `GET /mcp/manifest` ✅

### 3. Testar Endpoints Manualmente

Teste cada endpoint para garantir que está funcionando:

```bash
# Teste 1: Endpoint básico
curl https://bcb-meios-pagamento-mcp-1.onrender.com/tools

# Teste 2: Endpoint com nome do servidor
curl https://bcb-meios-pagamento-mcp-1.onrender.com/bcb_mcp/tools

# Teste 3: Endpoint MCP v1
curl https://bcb-meios-pagamento-mcp-1.onrender.com/mcp/v1/tools

# Teste 4: Health check
curl https://bcb-meios-pagamento-mcp-1.onrender.com/health
```

Todos devem retornar um JSON com a lista de ferramentas (ou status ok para health).

### 4. Configuração no GPT Builder

No GPT Builder, tente as seguintes configurações:

#### Opção 1: URL Base com endpoint
- **URL Base**: `https://bcb-meios-pagamento-mcp-1.onrender.com`
- **Endpoint de Ferramentas**: `/tools`
- **Endpoint de Execução**: `/tools/call`

#### Opção 2: URL Base com nome do servidor
- **URL Base**: `https://bcb-meios-pagamento-mcp-1.onrender.com/bcb_mcp`
- **Endpoint de Ferramentas**: `/tools`
- **Endpoint de Execução**: `/tools/call`

#### Opção 3: URL completa
- **URL Base**: `https://bcb-meios-pagamento-mcp-1.onrender.com`
- **Endpoint de Ferramentas**: `/bcb_mcp/tools`
- **Endpoint de Execução**: `/bcb_mcp/tools/call`

### 5. Verificar Formato da Resposta

O endpoint deve retornar um JSON no formato:

```json
{
  "tools": [
    {
      "name": "consultar_meios_pagamento_mensal",
      "description": "...",
      "inputSchema": {
        "type": "object",
        "properties": {...},
        "required": [...]
      }
    }
  ]
}
```

### 6. Verificar CORS

Se você estiver testando de um navegador, verifique se o CORS está configurado corretamente. O servidor já está configurado com CORS habilitado para todas as origens.

### 7. Verificar HTTPS

Certifique-se de que está usando HTTPS (não HTTP). O Render fornece HTTPS automaticamente.

### 8. Endpoint de Debug

Se nenhum endpoint funcionar, acesse uma URL inválida para ver a lista de endpoints disponíveis:

```bash
curl https://bcb-meios-pagamento-mcp-1.onrender.com/endpoint-invalido
```

Isso retornará um JSON com todos os endpoints disponíveis.

## Problemas Comuns

### Problema: Endpoint retorna 404

**Solução**: 
1. Verifique se o servidor está rodando no Render
2. Verifique os logs para ver qual endpoint está sendo chamado
3. Teste o endpoint manualmente com curl
4. Certifique-se de que o build foi bem-sucedido

### Problema: Endpoint retorna 500

**Solução**:
1. Verifique os logs do servidor para ver o erro específico
2. Verifique se todas as dependências estão instaladas
3. Verifique se o código foi compilado corretamente

### Problema: CORS errors

**Solução**:
1. O servidor já está configurado com CORS
2. Verifique se está usando HTTPS
3. Verifique se o cabeçalho `Access-Control-Allow-Origin` está presente na resposta

### Problema: Timeout

**Solução**:
1. O Render pode ter um timeout para requisições longas
2. Verifique se a API do BCB está respondendo
3. Considere adicionar cache para reduzir o tempo de resposta

## Contato

Se o problema persistir:
1. Verifique os logs do Render
2. Teste os endpoints manualmente
3. Verifique a documentação do GPT Builder
4. Abra uma issue no GitHub do projeto

