# ✅ Checklist de Integração Cloudflare D1

Use este checklist para garantir que todos os passos foram executados corretamente.

## 📦 Preparação Local

- [x] ✅ Dependências instaladas (`npm install`)
- [x] ✅ `wrangler.toml` criado
- [x] ✅ `schema.sql` criado
- [x] ✅ Workers Functions criadas (`/functions/api/`)
- [x] ✅ `dbService.ts` atualizado para usar API HTTP

## 🗄️ Configuração do Banco D1

- [ ] ⏳ Criar banco D1: `npm run d1:create`
- [ ] ⏳ Copiar `database_id` para `wrangler.toml`
- [ ] ⏳ Executar migrations: `npm run d1:migrate`

## 🏗️ Build e Deploy

- [ ] ⏳ Build da aplicação: `npm run build`
- [ ] ⏳ Deploy no Pages: `npx wrangler pages deploy dist --project-name=taskflow-pro`

## 🔗 Associação D1 no Dashboard

- [ ] ⏳ Acessar [Cloudflare Dashboard](https://dash.cloudflare.com)
- [ ] ⏳ Ir em **Workers & Pages** → **taskflow-pro**
- [ ] ⏳ **Settings** → **Functions** → **D1 database bindings**
- [ ] ⏳ Adicionar binding:
  - Variable name: `DB`
  - D1 database: `taskflow-db`
- [ ] ⏳ Salvar e fazer novo deploy: `npm run wrangler:deploy`

## ✅ Verificação Final

- [ ] ⏳ Acessar URL do projeto (ex: `https://taskflow-pro.pages.dev`)
- [ ] ⏳ Testar criação de categoria
- [ ] ⏳ Testar criação de tarefa
- [ ] ⏳ Verificar dados no D1: `wrangler d1 execute taskflow-db --command="SELECT * FROM tasks"`

## 🎯 Próximos Passos (Opcional)

- [ ] Configurar domínio customizado
- [ ] Configurar variáveis de ambiente
- [ ] Adicionar autenticação (Cloudflare Access)
- [ ] Configurar backups do D1

---

**Data de conclusão:** ___/___/______

**URL de produção:** _________________________________
