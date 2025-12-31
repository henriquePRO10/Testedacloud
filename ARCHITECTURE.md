# 🏗️ Arquitetura - TaskFlow Pro + Cloudflare D1

## 📊 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE PAGES                         │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │          Frontend (React + Vite)                  │    │
│  │                                                   │    │
│  │  ┌─────────────┐      ┌──────────────┐          │    │
│  │  │   App.tsx   │──────│ dbService.ts │          │    │
│  │  │             │      │  (HTTP API)  │          │    │
│  │  └─────────────┘      └──────┬───────┘          │    │
│  │                              │                   │    │
│  └──────────────────────────────┼───────────────────┘    │
│                                 │                         │
│                                 │ HTTP Requests           │
│                                 │ (fetch)                 │
│                                 ▼                         │
│  ┌──────────────────────────────────────────────────┐    │
│  │       Workers Functions (/functions/api/)        │    │
│  │                                                  │    │
│  │  ┌──────────────┐      ┌──────────────┐        │    │
│  │  │categories.ts │      │  tasks.ts    │        │    │
│  │  │              │      │              │        │    │
│  │  │ GET /api/    │      │ GET /api/    │        │    │
│  │  │ POST         │      │ POST         │        │    │
│  │  │ DELETE       │      │ DELETE       │        │    │
│  │  └──────┬───────┘      └──────┬───────┘        │    │
│  │         │                     │                 │    │
│  │         └──────────┬──────────┘                 │    │
│  │                    │ SQL Queries                │    │
│  │                    ▼                            │    │
│  │         ┌──────────────────┐                   │    │
│  │         │   D1 Binding     │                   │    │
│  │         │   (env.DB)       │                   │    │
│  │         └─────────┬────────┘                   │    │
│  └───────────────────┼──────────────────────────────┘    │
│                      │                                   │
└──────────────────────┼───────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │   CLOUDFLARE D1 DATABASE     │
        │                              │
        │  ┌────────────────────────┐  │
        │  │  Table: categories     │  │
        │  │  - id (TEXT PK)        │  │
        │  │  - name (TEXT)         │  │
        │  │  - color (TEXT)        │  │
        │  └────────────────────────┘  │
        │                              │
        │  ┌────────────────────────┐  │
        │  │  Table: tasks          │  │
        │  │  - id (TEXT PK)        │  │
        │  │  - title (TEXT)        │  │
        │  │  - content (TEXT)      │  │
        │  │  - categoryId (TEXT FK)│  │
        │  │  - deadline (TEXT)     │  │
        │  │  - createdAt (TEXT)    │  │
        │  └────────────────────────┘  │
        └──────────────────────────────┘
```

## 🔄 Fluxo de Dados

### 1️⃣ Leitura de Dados (GET)

```
Frontend (App.tsx)
    │
    ├─► dbService.getTasks()
    │       │
    │       └─► fetch('/api/tasks')
    │               │
    │               └─► Workers Function (tasks.ts)
    │                       │
    │                       └─► env.DB.prepare('SELECT * FROM tasks')
    │                               │
    │                               └─► D1 Database
    │                                       │
    │                                       └─► Retorna JSON
    │
    └─► setTasks(data)
```

### 2️⃣ Criação/Atualização (POST)

```
Frontend (App.tsx)
    │
    ├─► dbService.saveTask(task)
    │       │
    │       └─► fetch('/api/tasks', { method: 'POST', body: JSON.stringify(task) })
    │               │
    │               └─► Workers Function (tasks.ts)
    │                       │
    │                       └─► env.DB.prepare('INSERT OR REPLACE INTO tasks...')
    │                               │
    │                               └─► D1 Database
    │                                       │
    │                                       └─► Retorna { success: true }
    │
    └─► fetchData() // Recarrega dados
```

### 3️⃣ Exclusão (DELETE)

```
Frontend (App.tsx)
    │
    ├─► dbService.deleteTask(id)
    │       │
    │       └─► fetch('/api/tasks?id=xxx', { method: 'DELETE' })
    │               │
    │               └─► Workers Function (tasks.ts)
    │                       │
    │                       └─► env.DB.prepare('DELETE FROM tasks WHERE id = ?')
    │                               │
    │                               └─► D1 Database
    │                                       │
    │                                       └─► Retorna { success: true }
    │
    └─► fetchData() // Recarrega dados
```

## 🛠️ Componentes Principais

### Frontend (`/src`)
- **App.tsx** - Componente principal
- **dbService.ts** - Cliente HTTP para API
- **components/** - Componentes React (TaskBoard, TaskModal, etc.)

### Backend (`/functions/api`)
- **categories.ts** - CRUD de categorias
- **tasks.ts** - CRUD de tarefas

### Banco de Dados
- **schema.sql** - Definição das tabelas
- **D1 Database** - SQLite serverless da Cloudflare

### Configuração
- **wrangler.toml** - Configuração do Workers/Pages
- **package.json** - Scripts e dependências

## 🌐 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/categories` | Lista todas as categorias |
| POST | `/api/categories` | Cria/atualiza categoria |
| DELETE | `/api/categories?id=xxx` | Remove categoria |
| GET | `/api/tasks` | Lista todas as tarefas |
| POST | `/api/tasks` | Cria/atualiza tarefa |
| DELETE | `/api/tasks?id=xxx` | Remove tarefa |

## 🔐 Segurança

- ✅ CORS habilitado nas Workers Functions
- ✅ SQL Prepared Statements (previne SQL Injection)
- ✅ Validação de IDs nos endpoints DELETE
- ✅ Fallback para localStorage em caso de erro

## 📈 Escalabilidade

- **D1**: Até 10GB por banco (plano gratuito)
- **Workers**: 100.000 requisições/dia (plano gratuito)
- **Pages**: Builds e deploys ilimitados
- **Edge Network**: Deploy global automático

## 🎯 Próximas Melhorias

- [ ] Autenticação (Cloudflare Access)
- [ ] Rate limiting
- [ ] Paginação de resultados
- [ ] Cache com KV ou R2
- [ ] Webhooks para sincronização
