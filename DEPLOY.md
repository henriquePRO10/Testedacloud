# 🚀 Guia de Deploy - TaskFlow Pro com Cloudflare D1

Este guia mostra como fazer o deploy da sua aplicação TaskFlow Pro no Cloudflare Pages com banco de dados D1.

## 📋 Pré-requisitos

- Conta no Cloudflare
- Node.js instalado
- Wrangler CLI (será instalado com `npm install`)

## 🔧 Passo 1: Instalar Dependências

```bash
npm install
```

## 🗄️ Passo 2: Criar o Banco de Dados D1

Execute o comando para criar o banco D1:

```bash
npm run d1:create
```

**Importante:** Copie o `database_id` que aparecerá no terminal e cole no arquivo `wrangler.toml` na linha:

```toml
database_id = "COLE_O_ID_AQUI"
```

## 📊 Passo 3: Executar as Migrations (Criar Tabelas)

Após configurar o `database_id`, execute:

```bash
npm run d1:migrate
```

Isso criará as tabelas `categories` e `tasks` no banco D1.

## 🏗️ Passo 4: Build da Aplicação

```bash
npm run build
```

## 🧪 Passo 5: Testar Localmente (Opcional)

Para testar com o D1 local antes do deploy:

```bash
npm run wrangler:dev
```

Acesse: `http://localhost:8788`

## 🌐 Passo 6: Deploy no Cloudflare Pages

### Primeira vez (criar projeto):

```bash
npx wrangler pages deploy dist --project-name=taskflow-pro
```

### Deploys seguintes:

```bash
npm run wrangler:deploy
```

## 🔗 Passo 7: Associar o D1 ao Pages (IMPORTANTE!)

Após o primeiro deploy, você precisa associar o banco D1 ao projeto Pages:

1. Acesse o [Dashboard do Cloudflare](https://dash.cloudflare.com)
2. Vá em **Workers & Pages**
3. Clique no projeto **taskflow-pro**
4. Vá em **Settings** → **Functions**
5. Role até **D1 database bindings**
6. Clique em **Add binding**
7. Configure:
   - **Variable name:** `DB`
   - **D1 database:** Selecione `taskflow-db`
8. Clique em **Save**

## ✅ Passo 8: Verificar

Após associar o D1, faça um novo deploy:

```bash
npm run wrangler:deploy
```

Acesse a URL do seu projeto (ex: `https://taskflow-pro.pages.dev`) e teste a aplicação!

## 🔍 Comandos Úteis

### Ver dados no D1:

```bash
wrangler d1 execute taskflow-db --command="SELECT * FROM categories"
wrangler d1 execute taskflow-db --command="SELECT * FROM tasks"
```

### Ver logs do Workers:

```bash
wrangler pages deployment tail
```

## 🐛 Troubleshooting

### Erro "DB is not defined"
- Verifique se você associou o D1 no dashboard (Passo 7)
- Confirme que o `database_id` está correto no `wrangler.toml`

### Erro de CORS
- As Workers Functions já incluem headers CORS
- Se persistir, verifique se está acessando `/api/tasks` e `/api/categories`

### Dados não aparecem
- Execute `npm run d1:migrate` novamente
- Verifique se as categorias padrão foram inseridas

## 📝 Estrutura de Arquivos

```
taskflow-pro/
├── functions/
│   └── api/
│       ├── categories.ts  # API de categorias
│       └── tasks.ts       # API de tarefas
├── services/
│   └── dbService.ts       # Cliente HTTP para API
├── schema.sql             # Schema do banco D1
├── wrangler.toml          # Configuração do Cloudflare
└── package.json           # Scripts e dependências
```

## 🎉 Pronto!

Sua aplicação agora está rodando no Cloudflare Pages com banco de dados D1!

**URL de produção:** `https://taskflow-pro.pages.dev` (ou seu domínio customizado)
