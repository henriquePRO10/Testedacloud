# 📋 TaskFlow Pro

**Gerenciador de tarefas moderno e eficiente com Cloudflare D1**

Sistema de gerenciamento de tarefas desenvolvido com React, TypeScript e Vite, integrado com banco de dados Cloudflare D1 para armazenamento serverless e escalável.

---

## ✨ Funcionalidades

- ✅ **Gerenciamento de Tarefas**: Crie, edite e exclua tarefas
- 🎨 **Categorias Personalizadas**: Organize tarefas com cores customizadas
- 📅 **Prazos**: Defina deadlines para suas tarefas
- 🌐 **Serverless**: Backend totalmente serverless com Cloudflare Workers
- 🗄️ **D1 Database**: Banco de dados SQLite distribuído globalmente
- 🚀 **Edge Computing**: Deploy na rede global da Cloudflare
- 📱 **Responsivo**: Interface adaptada para mobile e desktop
- 🎯 **Performance**: Carregamento ultra-rápido com edge caching

---

## 🏗️ Arquitetura

```
Frontend (React + Vite)
    ↓
Workers Functions (/api)
    ↓
Cloudflare D1 (SQLite)
```

**Veja mais detalhes em:** [`ARCHITECTURE.md`](./ARCHITECTURE.md)

---

## 🚀 Deploy Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Criar banco D1
```bash
npm run d1:create
```

### 3. Configurar `wrangler.toml`
Copie o `database_id` gerado e cole no arquivo `wrangler.toml`

### 4. Executar migrations
```bash
npm run d1:migrate
```

### 5. Build e Deploy
```bash
npm run build
npx wrangler pages deploy dist --project-name=taskflow-pro
```

### 6. Associar D1 no Dashboard
- Acesse [Cloudflare Dashboard](https://dash.cloudflare.com)
- Workers & Pages → taskflow-pro → Settings → Functions
- Adicione binding: `DB` → `taskflow-db`

**Guia completo:** [`DEPLOY.md`](./DEPLOY.md)  
**Checklist:** [`CHECKLIST.md`](./CHECKLIST.md)

---

## 💻 Desenvolvimento Local

### Modo desenvolvimento (sem D1)
```bash
npm run dev
```
Acesse: `http://localhost:3000`

### Modo desenvolvimento (com D1 local)
```bash
npm run build
npm run wrangler:dev
```
Acesse: `http://localhost:8788`

---

## 📦 Estrutura do Projeto

```
taskflow-pro/
├── functions/
│   └── api/
│       ├── categories.ts    # API de categorias
│       └── tasks.ts         # API de tarefas
├── services/
│   └── dbService.ts         # Cliente HTTP
├── components/
│   ├── TaskBoard.tsx
│   ├── TaskModal.tsx
│   └── CategoryManager.tsx
├── schema.sql               # Schema D1
├── wrangler.toml            # Config Cloudflare
└── package.json
```

---

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento Vite |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build local |
| `npm run wrangler:dev` | Desenvolvimento com D1 local |
| `npm run wrangler:deploy` | Deploy no Cloudflare Pages |
| `npm run d1:create` | Cria banco D1 |
| `npm run d1:migrate` | Executa migrations SQL |

---

## 🗄️ Schema do Banco de Dados

### Tabela: `categories`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | TEXT | Primary Key |
| name | TEXT | Nome da categoria |
| color | TEXT | Cor em hexadecimal |

### Tabela: `tasks`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | TEXT | Primary Key |
| title | TEXT | Título da tarefa |
| content | TEXT | Descrição |
| categoryId | TEXT | Foreign Key → categories |
| deadline | TEXT | Data limite (ISO) |
| createdAt | TEXT | Data de criação (ISO) |

---

## 🌐 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/categories` | Lista categorias |
| POST | `/api/categories` | Cria/atualiza categoria |
| DELETE | `/api/categories?id=xxx` | Remove categoria |
| GET | `/api/tasks` | Lista tarefas |
| POST | `/api/tasks` | Cria/atualiza tarefa |
| DELETE | `/api/tasks?id=xxx` | Remove tarefa |

---

## 🔧 Tecnologias

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Cloudflare Workers Functions
- **Banco**: Cloudflare D1 (SQLite)
- **Deploy**: Cloudflare Pages
- **CLI**: Wrangler

---

## 📝 Comandos Úteis D1

### Ver dados
```bash
wrangler d1 execute taskflow-db --command="SELECT * FROM tasks"
wrangler d1 execute taskflow-db --command="SELECT * FROM categories"
```

### Executar SQL customizado
```bash
wrangler d1 execute taskflow-db --command="INSERT INTO categories VALUES ('cat-4', 'Urgente', '#ef4444')"
```

### Ver logs
```bash
wrangler pages deployment tail
```

---

## 🐛 Troubleshooting

### Erro "DB is not defined"
✅ Verifique se associou o D1 no dashboard (Settings → Functions → D1 bindings)

### Dados não aparecem
✅ Execute `npm run d1:migrate` novamente

### Erro de CORS
✅ Workers Functions já incluem CORS headers automaticamente

---

## 📄 Licença

MIT License - Sinta-se livre para usar em seus projetos!

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

## 📚 Documentação Adicional

- [Arquitetura Completa](./ARCHITECTURE.md)
- [Guia de Deploy](./DEPLOY.md)
- [Checklist de Integração](./CHECKLIST.md)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

---

**Desenvolvido com ❤️ usando Cloudflare Workers e D1**
