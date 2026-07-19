# Editor visual do HUB PAN — guia de configuração

O site tem um painel de edição de conteúdo em **`/editar`** — login, edição
inline de textos com formatação, troca de imagens/ícones, cores, e
**histórico de auditoria** (quem editou, quando, o quê, com desfazer).

## Status: conectado ao Supabase — faltam 3 passos pra ativar de vez

O código já está pronto e publicado. O projeto Supabase (`hubpan-site`, na
organização BDDB) já foi criado e as chaves já estão configuradas. Faltam
só estes passos, todos feitos no **painel do Supabase** (supabase.com/dashboard):

### 1. Rodar o schema do banco (uma vez só)

1. No painel do projeto `hubpan-site`, vá em **SQL Editor** (menu lateral) → **New query**.
2. Abra o arquivo [`supabase/schema.sql`](supabase/schema.sql) deste projeto, copie o conteúdo inteiro e cole lá.
3. Clique em **Run**. Isso cria as tabelas de conteúdo e histórico, as
   permissões de segurança, o espaço de armazenamento das imagens e a
   função de publicação — tudo de uma vez.

### 2. Criar sua conta de acesso ao editor

O `/editar` usa login real (diferente do modo de teste anterior — nenhuma
senha aleatória funciona mais). Você precisa criar sua conta manualmente:

1. No painel, vá em **Authentication** → **Users** → **Add user** → **Create new user**.
2. Preencha seu e-mail e uma senha (marque **Auto Confirm User** — assim
   não precisa de e-mail de confirmação).
3. Pronto — use esse e-mail/senha pra entrar em `/editar` (o nome que você
   digitar no formulário de login é só o que aparece no histórico, pode
   ser qualquer nome).

**Quando for dar acesso ao cliente**, repita esse passo com o e-mail dele —
é só isso, não precisa mexer em código.

### 3. Configurar as variáveis de ambiente na Vercel

O site publicado (Vercel) precisa das mesmas duas chaves que já uso aqui
localmente, senão o `/editar` em produção cai no modo local antigo:

1. No painel da Vercel → projeto `hubpan-site` → **Settings** → **Environment Variables**.
2. Adicione:
   - `VITE_SUPABASE_URL` = `https://mankfcffiymqddeqftfq.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = a chave publicável (a mesma que você me
     passou, começa com `sb_publishable_...`)
3. Marque as três opções de ambiente (Production, Preview, Development) e salve.
4. Depois de salvar, force um novo deploy (na aba **Deployments**, três
   pontinhos no último deploy → **Redeploy**) pra ele pegar as variáveis novas.

Feito isso, `/editar` (login) e `/preview` (link pra mandar ao cliente,
sem senha) já funcionam com dados reais na nuvem — inclusive entre
dispositivos diferentes.

## Como funciona o rascunho e a publicação

- Toda edição feita em `/editar` vai pro **rascunho** — visível na hora só
  em `/editar` e em `/preview`.
- O **site público** (`/`) só muda quando você clica em **Publicar** na
  barra do editor.
- `/preview` é o link pra mandar ao cliente conferir antes de publicar —
  não pede login, é só visualização, e atualiza em tempo real conforme
  você edita.
- O histórico registra também o evento de publicação (quem e quando
  publicou).

## Arquitetura (pra referência técnica)

```
src/editor/
├── supabaseClient.ts — cliente Supabase (env vars) + isSupabaseConfigured
├── store.tsx       — estado de conteúdo (rascunho/publicado), histórico,
│                     sessão (Supabase Auth), tempo real, upload de imagens
├── fields.tsx      — <ET> texto · <ERich> bloco rico com toolbar de
│                     formatação · <EImg>/useEditImage imagens ·
│                     <EIcon> picker Lucide · useEditColor(s) cores
├── ui.tsx          — login, toolbar flutuante, painéis, botão Publicar
├── EditorPage.tsx  — rota /editar (login gate + home em modo edição)
└── PreviewPage.tsx — rota /preview (home lendo o rascunho, sem edição)
```

- Sem `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` configuradas, o editor
  cai automaticamente no **modo local** antigo (localStorage, qualquer
  senha entra) — só deve acontecer numa cópia local antes do setup acima.
- Os **valores padrão** de todos os campos continuam no código das seções
  (fallbacks) — o banco guarda só o que foi editado (rascunho e publicado
  separados). Restaurar padrão = apagar o override.
- O design fica **travado**: o editor só expõe conteúdo (texto/imagem/
  cor/ícone), nunca layout, fonte-base ou espaçamento estrutural.
