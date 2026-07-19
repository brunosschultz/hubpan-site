# Editor visual do HUB PAN — guia de configuração

O site tem um painel de edição de conteúdo em **`/editar`** — login, edição
inline de textos, troca de imagens (com specs de tamanho e otimização
automática pra WebP), cores de fundos/cards e **histórico de auditoria**
(quem editou, quando, o quê, com botão de restaurar).

## Estado atual: MODO LOCAL (demonstração)

Hoje o editor roda em modo local:

- **Login**: qualquer senha entra (o nome/e-mail digitados são usados no histórico).
- **Onde salva**: no `localStorage` do navegador — as edições valem **só naquele
  navegador**, não são publicadas para os visitantes do site.
- **Objetivo**: validar a experiência de edição antes de plugar o backend real.

## Próxima etapa: conectar o Supabase (login real + publicação)

O Supabase é um serviço de banco de dados + autenticação com **plano gratuito**
que atende este projeto com folga. Com ele conectado:

- Login real com e-mail/senha (um usuário pra agência, um pro cliente).
- Edições salvas no banco → **publicadas para todos os visitantes**.
- Imagens hospedadas no Supabase Storage (sem limite do navegador).
- Histórico de auditoria permanente e compartilhado.

### Passo a passo (≈10 minutos, feito pelo Bruno)

1. Criar conta gratuita em **supabase.com** (pode usar o e-mail da agência).
2. Criar um projeto novo (ex.: `hubpan-site`), região `South America (São Paulo)`.
3. No painel do projeto, ir em **Project Settings → API** e copiar dois valores:
   - `Project URL` (algo como `https://xxxx.supabase.co`)
   - `anon public key` (uma chave longa — essa pode ficar no site, é pública)
4. Passar esses dois valores pro Claude na próxima sessão. A partir daí o
   Claude faz o resto: cria as tabelas (via SQL no painel), o bucket de
   imagens, troca o adaptador de storage do editor (arquivo
   `src/editor/store.tsx` — as funções de load/persist estão isoladas
   justamente pra isso) e cria os dois usuários.

### O que NÃO fazer

- Não compartilhar a `service_role key` (essa é secreta — só a `anon public`).
- Não criar as tabelas manualmente — o Claude gera o SQL pronto pra colar.

## Arquitetura (pra referência técnica)

```
src/editor/
├── store.tsx       — estado de conteúdo (overrides), histórico, sessão,
│                     persistência (localStorage hoje → Supabase depois)
├── fields.tsx      — <ET> texto inline · <EImg>/useEditImage imagens ·
│                     useEditColor(s) cores — usados dentro das seções
├── ui.tsx          — login, toolbar flutuante, painéis (cor/imagem/histórico)
└── EditorPage.tsx  — rota /editar (login gate + home em modo edição)
```

- Os **valores padrão** de todos os campos continuam no código das seções
  (fallbacks) — o banco guarda só o que foi editado. Restaurar padrão = apagar
  o override.
- O design fica **travado**: o editor só expõe conteúdo (texto/imagem/cor),
  nunca layout, fonte ou espaçamento.
- Chaves e labels dos ~110 campos ficam nos call-sites das seções S1–S11
  (`<ET k="s1.eyebrow" l="Hero — selo superior" …>`).
