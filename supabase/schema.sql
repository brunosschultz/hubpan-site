-- ═══════════════════════════════════════════════════════════════════
-- HUB PAN — Editor visual: schema do Supabase
-- Rode este arquivo inteiro em: Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════

-- Conteúdo editável: cada campo (texto/imagem/cor/ícone) é uma linha.
-- draft_value  = o que o editor mostra e edita (rascunho)
-- published_value = o que o site público mostra (só muda ao clicar "Publicar")
create table if not exists content_overrides (
  key text primary key,
  draft_value text,
  published_value text,
  updated_at timestamptz not null default now(),
  updated_by text
);

-- Histórico de auditoria: quem editou o quê, quando, e o evento de publicação
create table if not exists edit_history (
  id uuid primary key default gen_random_uuid(),
  ts timestamptz not null default now(),
  user_name text not null,
  user_email text not null,
  key text not null,
  label text not null,
  kind text not null,
  old_value text,
  new_value text,
  restaurado boolean not null default false,
  event text not null default 'edit'  -- 'edit' | 'publish'
);

alter table content_overrides enable row level security;
alter table edit_history enable row level security;

-- IMPORTANTE: tabelas criadas via SQL puro (fora do botão "New Table" do painel)
-- NÃO recebem privilégio básico pra anon/authenticated automaticamente — RLS
-- sozinho não basta, o GRANT de base precisa existir antes da política ser
-- avaliada. Sem isso, todo select/insert/update falha com "permission denied"
-- mesmo com as políticas certas (já aconteceu em produção — ver CLAUDE.md).
grant usage on schema public to anon, authenticated;
grant select on content_overrides to anon, authenticated;
grant insert, update on content_overrides to authenticated;
grant select, insert on edit_history to authenticated;

-- Leitura pública: o site (/) lê published_value, a pré-visualização (/preview)
-- lê draft_value — as duas rotas não pedem login, então SELECT é liberado a todos.
create policy "conteudo_leitura_publica" on content_overrides
  for select using (true);

-- Escrita: só quem estiver autenticado (ou seja, só as contas que você criar
-- manualmente em Authentication → Users — não existe cadastro público no site).
create policy "conteudo_escrita_autenticada" on content_overrides
  for insert to authenticated with check (true);
create policy "conteudo_atualizacao_autenticada" on content_overrides
  for update to authenticated using (true) with check (true);

-- Histórico: só visível e gravável por quem está logado no editor.
create policy "historico_leitura_autenticada" on edit_history
  for select to authenticated using (true);
create policy "historico_escrita_autenticada" on edit_history
  for insert to authenticated with check (true);

-- Bucket de imagens enviadas pelo editor — público pra leitura (o site precisa
-- exibir as fotos), upload só por quem está autenticado.
insert into storage.buckets (id, name, public)
values ('editor-images', 'editor-images', true)
on conflict (id) do nothing;

create policy "imagens_leitura_publica" on storage.objects
  for select using (bucket_id = 'editor-images');
create policy "imagens_upload_autenticado" on storage.objects
  for insert to authenticated with check (bucket_id = 'editor-images');
create policy "imagens_atualizacao_autenticada" on storage.objects
  for update to authenticated using (bucket_id = 'editor-images');

-- Publicar: copia todo o rascunho pro site público de uma vez, atomicamente.
-- security definer + grant só pra authenticated: só quem está logado no editor
-- pode publicar, mesmo a função rodando com privilégio elevado internamente.
create or replace function publish_all()
returns void
language sql
security definer
set search_path = public
as $$
  update content_overrides
  set published_value = draft_value, updated_at = now()
  where draft_value is distinct from published_value;
$$;

revoke all on function publish_all() from public, anon;
grant execute on function publish_all() to authenticated;

-- ═══════════════════════════════════════════════════════════════════
-- Leads: captação real dos formulários públicos (Contato e Newsletter)
-- ═══════════════════════════════════════════════════════════════════

-- Uma linha por envio. `source` distingue os dois formulários (contato tem
-- nome/organização/assunto/mensagem; newsletter só tem e-mail — os campos
-- que não se aplicam ficam null).
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source in ('contato', 'newsletter')),
  nome text,
  email text not null,
  organizacao text,
  assunto text,
  mensagem text,
  lida boolean not null default false
);

alter table leads enable row level security;

-- Mesma pegadinha já documentada acima pra content_overrides/edit_history:
-- tabela criada via SQL puro não recebe GRANT básico pra anon/authenticated
-- sozinho — sem isso todo insert/select falha com "permission denied" mesmo
-- com as políticas certas.
grant select, update on leads to authenticated;
grant insert on leads to anon, authenticated;

-- Escrita: qualquer visitante do site (sempre "anon", não existe cadastro
-- público) pode inserir um lead — é o próprio formulário público enviando.
-- Sem UPDATE/DELETE pra anon: ninguém de fora pode alterar ou apagar um lead
-- já enviado.
create policy "leads_insercao_publica" on leads
  for insert to anon, authenticated with check (true);

-- Leitura: só quem está logado no painel (só o Bruno) — o inverso de
-- content_overrides, onde a leitura é pública e a escrita é autenticada.
create policy "leads_leitura_autenticada" on leads
  for select to authenticated using (true);

-- Atualização: só pra marcar lida/não lida no painel (toggle simples, sem
-- workflow de resposta/e-mail — o aviso de novo lead vai por e-mail via
-- Edge Function + Database Webhook, ver supabase/functions/notify-lead).
create policy "leads_atualizacao_autenticada" on leads
  for update to authenticated using (true) with check (true);

-- Webhook de notificação por e-mail: em vez de configurar isso manualmente
-- em Dashboard → Database → Webhooks, é um trigger chamando `net.http_post`
-- direto (extensão `pg_net` — o mecanismo de baixo nível que o próprio
-- recurso "Database Webhooks" do Dashboard usa por baixo dos panos).
-- Dispara a Edge Function `notify-lead` a cada INSERT, de forma assíncrona
-- (não trava o insert esperando o e-mail sair). A function é implantada
-- com `--no-verify-jwt` (sem checar Authorization) porque só ENVIA e-mail,
-- não expõe nem altera dado nenhum — na pior das hipóteses alguém forja um
-- POST e gera um e-mail falso de aviso, sem risco real de segurança/dado,
-- o que dispensa gerenciar mais um segredo só pra esse detalhe.
create extension if not exists pg_net;

create or replace function public.notify_lead_webhook()
returns trigger
language plpgsql
security definer
set search_path = public, net
as $$
begin
  perform net.http_post(
    url := 'https://mankfcffiymqddeqftfq.supabase.co/functions/v1/notify-lead',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object('record', to_jsonb(new))
  );
  return new;
end;
$$;

create trigger "leads_notificar_email"
after insert on public.leads
for each row execute function public.notify_lead_webhook();
