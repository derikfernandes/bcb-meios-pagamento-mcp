# Exemplos de Uso - Servidor MCP BCB

Este documento contém exemplos práticos de como usar as ferramentas do servidor MCP para consultar dados do Banco Central do Brasil.

## 📊 Dados Mensais de Meios de Pagamento

### Consultar PIX do mês

**Pergunta ao assistente:**
```
Mostre os dados de PIX para dezembro de 2023
```

**O que acontece:**
- Ferramenta: `consultar_meios_pagamento_mensal`
- Parâmetros: `ano_mes: "202312"`
- Retorna: Dados sobre transações PIX, incluindo quantidade e valores

### Consultar todos os meios de pagamento

**Pergunta ao assistente:**
```
Quais foram todos os meios de pagamento utilizados em janeiro de 2024?
```

**O que acontece:**
- Ferramenta: `consultar_meios_pagamento_mensal`
- Parâmetros: `ano_mes: "202401"`
- Retorna: Dados sobre PIX, TED, DOC, boletos bancários e outros

### Filtrar por tipo de operação

**Pergunta ao assistente:**
```
Mostre apenas as transferências TED de março de 2024
```

**O que acontece:**
- Ferramenta: `consultar_meios_pagamento_mensal`
- Parâmetros:
  - `ano_mes: "202403"`
  - `filtro: "Modalidade eq 'TED'"`

## 💳 Transações com Cartões

### Consultar transações trimestrais

**Pergunta ao assistente:**
```
Quais foram as transações com cartões no último trimestre de 2023?
```

**O que acontece:**
- Ferramenta: `consultar_transacoes_cartoes`
- Parâmetros: `trimestre: "20234"`
- Retorna: Estoque e transações de cartões de débito e crédito

### Ordenar por volume de transações

**Pergunta ao assistente:**
```
Mostre as transações com cartões do 3º trimestre de 2024, ordenadas por valor decrescente
```

**O que acontece:**
- Ferramenta: `consultar_transacoes_cartoes`
- Parâmetros:
  - `trimestre: "20243"`
  - `ordenar_por: "Valor desc"`

## 🏪 Estabelecimentos Credenciados

### Consultar quantidade de estabelecimentos

**Pergunta ao assistente:**
```
Quantos estabelecimentos estavam credenciados no 2º trimestre de 2024?
```

**O que acontece:**
- Ferramenta: `consultar_estabelecimentos_credenciados`
- Parâmetros: `trimestre: "20242"`
- Retorna: Quantidade de estabelecimentos por região e tipo

### Filtrar por região

**Pergunta ao assistente:**
```
Mostre os estabelecimentos credenciados em São Paulo no 1º trimestre de 2024
```

**O que acontece:**
- Ferramenta: `consultar_estabelecimentos_credenciados`
- Parâmetros:
  - `trimestre: "20241"`
  - `filtro: "UF eq 'SP'"`

## 💰 Taxas e Tarifas

### Consultar taxas de intercâmbio

**Pergunta ao assistente:**
```
Quais são as taxas de intercâmbio do último trimestre disponível?
```

**O que acontece:**
- Ferramenta: `consultar_taxas_intercambio`
- Parâmetros: `trimestre: "20244"` (ou o último disponível)
- Retorna: Taxas de intercâmbio por modalidade e bandeira

### Consultar taxas de desconto

**Pergunta ao assistente:**
```
Mostre as taxas de desconto cobradas dos estabelecimentos no 3º trimestre de 2024
```

**O que acontece:**
- Ferramenta: `consultar_taxas_desconto`
- Parâmetros: `trimestre: "20243"`
- Retorna: Taxas médias de desconto por tipo de transação

### Comparar taxas entre períodos

**Pergunta ao assistente:**
```
Compare as taxas de intercâmbio entre o 1º e 2º trimestre de 2024
```

**O que acontece:**
- Duas chamadas da ferramenta `consultar_taxas_intercambio`:
  1. `trimestre: "20241"`
  2. `trimestre: "20242"`
- O assistente faz a comparação dos resultados

## 🏧 Infraestrutura de Terminais

### Consultar ATMs

**Pergunta ao assistente:**
```
Quantos caixas eletrônicos (ATMs) existiam no Brasil no 4º trimestre de 2023?
```

**O que acontece:**
- Ferramenta: `consultar_terminais_atm`
- Parâmetros: `trimestre: "20234"`
- Retorna: Quantidade de ATMs por região e instituição

### Evolução temporal

**Pergunta ao assistente:**
```
Mostre a evolução do número de ATMs ao longo de 2023
```

**O que acontece:**
- Quatro chamadas da ferramenta `consultar_terminais_atm`:
  - `trimestre: "20231"` (1º trimestre)
  - `trimestre: "20232"` (2º trimestre)
  - `trimestre: "20233"` (3º trimestre)
  - `trimestre: "20234"` (4º trimestre)

## 👥 Portadores de Cartão

### Consultar dados de portadores

**Pergunta ao assistente:**
```
Quantas pessoas tinham cartões de crédito no 2º trimestre de 2024?
```

**O que acontece:**
- Ferramenta: `consultar_portadores_cartao`
- Parâmetros: `trimestre: "20242"`
- Retorna: Quantidade de portadores por tipo de cartão

## 📈 Análises Complexas

### Análise mensal completa

**Pergunta ao assistente:**
```
Faça uma análise completa dos meios de pagamento de dezembro de 2023, incluindo volume de transações, estabelecimentos e taxas
```

**O que acontece:**
- Múltiplas ferramentas são chamadas:
  1. `consultar_meios_pagamento_mensal` (dados mensais)
  2. `consultar_meios_pagamento_trimestral` (4º trimestre)
  3. `consultar_estabelecimentos_credenciados`
  4. `consultar_taxas_intercambio`
  5. `consultar_taxas_desconto`

### Comparação trimestral

**Pergunta ao assistente:**
```
Compare todos os indicadores de meios de pagamento entre o 3º e 4º trimestre de 2023
```

**O que acontece:**
- Todas as ferramentas trimestrais são chamadas duas vezes:
  - Uma vez para `trimestre: "20233"`
  - Uma vez para `trimestre: "20234"`
- O assistente compila e compara os resultados

### Tendência anual

**Pergunta ao assistente:**
```
Mostre a tendência de crescimento do PIX ao longo de 2023
```

**O que acontece:**
- 12 chamadas da ferramenta `consultar_meios_pagamento_mensal`:
  - De `ano_mes: "202301"` até `ano_mes: "202312"`
  - Cada uma com `filtro: "Modalidade eq 'PIX'"`
- O assistente analisa a progressão mês a mês

## 🔍 Filtros Avançados OData

### Filtro de valor mínimo

**Pergunta ao assistente:**
```
Mostre apenas transações acima de 10 milhões de reais em dezembro de 2023
```

**Parâmetros usados:**
```
filtro: "Valor gt 10000000"
```

### Filtro combinado

**Pergunta ao assistente:**
```
Mostre transações PIX entre 1 milhão e 5 milhões em janeiro de 2024
```

**Parâmetros usados:**
```
filtro: "Modalidade eq 'PIX' and Valor gt 1000000 and Valor lt 5000000"
```

### Filtro com múltiplas condições

**Pergunta ao assistente:**
```
Mostre estabelecimentos em SP ou RJ com mais de 1000 transações no 2º trimestre de 2024
```

**Parâmetros usados:**
```
filtro: "(UF eq 'SP' or UF eq 'RJ') and Quantidade gt 1000"
```

## 📊 Paginação de Resultados

### Limitar resultados

**Pergunta ao assistente:**
```
Mostre os 10 maiores valores de transação em novembro de 2023
```

**Parâmetros usados:**
```
ano_mes: "202311"
top: 10
ordenar_por: "Valor desc"
```

### Paginação

**Pergunta ao assistente:**
```
Mostre os próximos 50 registros a partir do registro 100
```

**Parâmetros usados:**
```
skip: 100
top: 50
```

## 💡 Dicas de Uso

1. **Formatos de Data:**
   - Mensal: YYYYMM (ex: "202312" = Dezembro de 2023)
   - Trimestral: YYYYQ (ex: "20234" = 4º trimestre de 2023)

2. **Valores Numéricos:**
   - Valores geralmente são em Reais (R$)
   - Use números sem formatação: 1000000 (não "1.000.000")

3. **Filtros:**
   - Use aspas simples dentro dos filtros: `"Modalidade eq 'PIX'"`
   - Operadores: `eq`, `ne`, `gt`, `ge`, `lt`, `le`, `and`, `or`

4. **Performance:**
   - Use `top` para limitar resultados e melhorar performance
   - Use filtros específicos quando possível
   - Para análises longas, faça consultas separadas

5. **Dados Mais Recentes:**
   - Os dados têm uma defasagem de 1-2 trimestres
   - Sempre verifique qual é o período mais recente disponível

## 🎯 Casos de Uso Comuns

### Para Analistas Financeiros
```
Compare as taxas de desconto entre diferentes bandeiras de cartão no último ano
```

### Para Pesquisadores
```
Analise a adoção do PIX desde seu lançamento até hoje
```

### Para Empreendedores
```
Quantos estabelecimentos estão credenciados na minha região para aceitar cartões?
```

### Para Jornalistas
```
Qual foi a evolução do uso de boletos bancários nos últimos 2 anos?
```

### Para Desenvolvedores de Fintechs
```
Mostre as tendências de uso de diferentes meios de pagamento digital no Brasil
```
