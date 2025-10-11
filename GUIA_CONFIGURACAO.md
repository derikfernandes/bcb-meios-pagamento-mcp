# Guia de Configuração - Servidor MCP BCB

## 📱 Configuração para Claude Desktop

### macOS

1. Localize o arquivo de configuração:
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

2. Edite o arquivo e adicione:
```json
{
  "mcpServers": {
    "bcb-meios-pagamento": {
      "command": "node",
      "args": ["/Users/seu-usuario/projects/bcb-meios-de-pagamentos/dist/index.js"]
    }
  }
}
```

3. Substitua `/Users/seu-usuario/projects/bcb-meios-de-pagamentos` pelo caminho real onde você clonou o projeto.

4. Reinicie o Claude Desktop.

### Windows

1. Localize o arquivo de configuração:
```
%APPDATA%/Claude/claude_desktop_config.json
```

2. Edite o arquivo e adicione:
```json
{
  "mcpServers": {
    "bcb-meios-pagamento": {
      "command": "node",
      "args": ["C:\\caminho\\completo\\bcb-meios-de-pagamentos\\dist\\index.js"]
    }
  }
}
```

3. Substitua o caminho pelo local real do projeto.

4. Reinicie o Claude Desktop.

### Linux

1. Localize o arquivo de configuração:
```bash
~/.config/Claude/claude_desktop_config.json
```

2. Edite o arquivo e adicione:
```json
{
  "mcpServers": {
    "bcb-meios-pagamento": {
      "command": "node",
      "args": ["/home/seu-usuario/projects/bcb-meios-de-pagamentos/dist/index.js"]
    }
  }
}
```

3. Substitua pelo caminho real do projeto.

4. Reinicie o Claude Desktop.

## 🤖 Configuração para ChatGPT (OpenAI)

O ChatGPT está trabalhando no suporte ao Model Context Protocol. Quando disponível, você poderá configurar este servidor através da interface do OpenAI.

Para atualizações sobre compatibilidade com ChatGPT, consulte:
- Documentação oficial da OpenAI sobre MCP
- https://github.com/openai/mcp (quando disponível)

## 🔧 Configuração para Outros LLMs

### Cline (VS Code Extension)

1. Abra as configurações da extensão Cline no VS Code
2. Procure por "MCP Servers"
3. Adicione uma nova configuração:
```json
{
  "bcb-meios-pagamento": {
    "command": "node",
    "args": ["/caminho/completo/bcb-meios-de-pagamentos/dist/index.js"]
  }
}
```

### Continue.dev

1. Edite o arquivo de configuração `~/.continue/config.json`
2. Adicione na seção `mcpServers`:
```json
{
  "mcpServers": {
    "bcb-meios-pagamento": {
      "command": "node",
      "args": ["/caminho/completo/bcb-meios-de-pagamentos/dist/index.js"]
    }
  }
}
```

## ✅ Verificando a Instalação

Após configurar, você pode verificar se o servidor está funcionando:

1. Abra seu cliente MCP (Claude Desktop, etc.)
2. Procure pelas ferramentas disponíveis
3. Você deve ver 8 ferramentas do BCB:
   - consultar_meios_pagamento_mensal
   - consultar_meios_pagamento_trimestral
   - consultar_transacoes_cartoes
   - consultar_estabelecimentos_credenciados
   - consultar_taxas_intercambio
   - consultar_taxas_desconto
   - consultar_terminais_atm
   - consultar_portadores_cartao

## 🐛 Solução de Problemas

### Erro: "Cannot find module"

Certifique-se de que compilou o projeto:
```bash
npm run build
```

### Erro: "node: command not found"

Instale o Node.js:
- macOS: `brew install node`
- Windows: Baixe de https://nodejs.org
- Linux: `sudo apt install nodejs npm` ou equivalente

### Servidor não aparece no Claude

1. Verifique se o caminho está correto
2. Verifique se o arquivo `dist/index.js` existe
3. Reinicie o Claude Desktop completamente
4. Verifique os logs do Claude Desktop

### Como ver os logs no Claude Desktop

**macOS:**
```bash
tail -f ~/Library/Logs/Claude/mcp*.log
```

**Windows:**
```cmd
type %APPDATA%\Claude\Logs\mcp*.log
```

## 🔄 Atualizando o Servidor

Quando houver atualizações:

```bash
cd bcb-meios-de-pagamentos
git pull
npm install
npm run build
```

Depois reinicie seu cliente MCP.

## 📞 Suporte

Se encontrar problemas:

1. Verifique se todas as dependências estão instaladas: `npm install`
2. Verifique se o projeto foi compilado: `npm run build`
3. Verifique se o Node.js está instalado: `node --version` (deve ser v18+)
4. Abra uma issue no GitHub com detalhes do erro

## 🎯 Testando Manualmente

Para testar o servidor manualmente:

```bash
cd bcb-meios-de-pagamentos
npm start
```

O servidor deve iniciar e exibir: "Servidor MCP BCB Meios de Pagamento iniciado"
