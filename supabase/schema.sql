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
