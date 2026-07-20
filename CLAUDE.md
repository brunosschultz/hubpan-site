# HUB PAN — Contexto do Projeto

Site institucional do HUB PAN (plataforma internacional de inovação que conecta
Américas e África). Construído em **React + Vite + TypeScript + Tailwind CSS + GSAP**,
seguindo um design system extraído do Figma com fidelidade total.

**Cliente:** Bruno (agência BDDB, Curitiba) — diretor de arte, não programa diretamente,
constrói tudo via IA. Prefira explicações simples e diretas ao mexer no projeto; ele
lê os diffs mas não escreve código manualmente.

**Deploy:** GitHub (`brunosschultz/hubpan-site`) → Vercel (auto-deploy no push da branch
`main`). Site no ar em `hubpan-site.vercel.app`. Domínio do cliente ainda não conectado.

---

## Regra de ouro: fidelidade ao Figma

Este projeto nasceu de uma frustração com o Lovable interpretando mal os valores do
design system (tamanhos de fonte, cores, espaçamentos). A prioridade #1 é **fidelidade
milimétrica** — nunca aproxime valores "que parecem certos".

**Antes de consultar o Figma ao vivo, sempre confira primeiro o arquivo
`DESIGN-SYSTEM.md`** (na raiz do projeto) — ele já contém a maioria dos tokens
exatos (cores, tipografia, espaçamentos, componentes) extraídos do Figma. Só
recorra ao Figma MCP se o valor que você precisa não estiver nesse documento, ou
para elementos novos ainda não documentados. Isso evita reprocessar o Figma inteiro
a cada pergunta.

Se nem o `DESIGN-SYSTEM.md` nem o Figma MCP resolverem, peça ao Bruno um print ou
os valores exatos antes de adivinhar.

**Figma não é só "olhar e copiar número" — é medir de volta no navegador.** Um valor
extraído do Figma (`width-[Npx]`, `left-[Npx]`, `right-[Npx]`) descreve a posição/
tamanho DENTRO do frame 1920px do Figma. Isso não garante que:
- o mesmo valor em `px` vai caber igual no container real do site (que pode ser mais
  estreito que 1920, ter padding/gutter próprio, ou estar aninhado em outro elemento
  posicionado) — sempre confirme contra o container PAI real, não assuma;
- a quebra de linha do texto vai ficar igual — a métrica de fonte no Figma e no
  browser pode divergir o suficiente pra mudar o número de linhas mesmo usando a
  fonte certa. **Depois de aplicar um valor de largura/posição que afeta quebra de
  linha, sempre valide contando as linhas de verdade no navegador** (não só olhando
  a screenshot), com um snippet tipo:
  ```js
  const range = document.createRange();
  range.selectNodeContents(el);
  const tops = new Set(Array.from(range.getClientRects()).map(r => Math.round(r.top)));
  tops.size // nº de linhas reais
  ```
  Teste em 1280 / 1440 / 1920 / 2560 antes de considerar definitivo.
- texto branco não aparece em screenshot de node isolado com fundo transparente —
  se for tirar print de um node específico pra conferir quebra de linha, tire o
  print da SEÇÃO inteira (com o fundo real) em vez do node isolado.

**Figma:** fileKey `JFAJ01FA0KiD5FQYnMOD4B`, node da Home `2007-20`.

---

## Regra de ouro #2: fidelidade ao CONTEÚDO (nunca inventar texto)

**Erro cometido nesta sessão (não repetir):** ao criar as páginas internas
(PROINTER, GovIA, Fórum Mundial de IA, Insights, Contato, Glossário, Imprensa,
Casos de Uso), o conteúdo foi **inventado do zero** — títulos, números,
programas, formulários, FAQ — em vez de extraído do wireframe de referência
que o Bruno já tinha compartilhado no início do projeto. O layout/design saiu
ótimo (o padrão §5.5 do DESIGN-SYSTEM.md é sólido), mas o texto não tinha
nenhuma relação com o conteúdo real definido pelo cliente. Ele só percebeu
depois de publicado, teve que apontar página por página o que estava errado.

**Causa raiz:** ao construir uma página nova sem ter o conteúdo em mãos, é
tentador "preencher" com copy plausível e no tom certo — mas plausível não é
o mesmo que correto. Alguns exemplos do que foi inventado incorretamente:
- PROINTER: inventei um programa genérico de patrocínio ESG. O real é um
  programa de **bolsas 100% gratuitas** com jornada específica (Belo
  Horizonte → Nova York → Boston/Cambridge → volta como "Embaixador"),
  modelo de doação com 4 níveis de valor (R$500/1000/5000/10000) e dois
  formulários distintos (apoiar / candidatar-se).
- GovIA: inventei um "5.570 municípios" e uma seção de governança de IA
  genérica. O real tem um insight específico ("governos não têm cartão de
  crédito"), 3 planos de preço nomeados (Básico/Profissional/Enterprise) e
  um Observatório de IA com dados reais (mapeamento em MG, comparativo com
  Boston em 2027).
- WAIF: inventei uma "rota até 2027" com etapas genéricas. O real tem 4
  pilares nomeados (Autoridade/Relacionamento/Patrocínio/Ecossistema) e 3
  níveis de patrocínio (Bronze/Prata/Ouro) com benefícios específicos.

**Regra a partir de agora:**
1. **Antes de criar qualquer página nova (ou editar o conteúdo de uma
   existente), pergunte se existe uma referência de conteúdo** (wireframe,
   doc, brief) — não assuma que não existe só porque não foi mencionada de
   novo na conversa atual.
2. Se o Bruno mencionar um wireframe/link do Claude (`claude.ai/public/artifacts/...`),
   ele é a fonte de verdade do CONTEÚDO (textos, números, estrutura de
   formulários, FAQ) — o design system e os componentes já construídos são a
   fonte de verdade do VISUAL. As duas coisas são complementares, não uma
   substitui a outra.
3. **Como extrair o conteúdo de um artifact público do Claude:** WebFetch
   direto falha (é um iframe client-rendered). Abrir com o Browser tool e
   rodar via `javascript_exec`:
   ```js
   fetch('/api/published_artifacts/{uuid}').then(r => r.json()).then(d => window.__artifactData = d)
   ```
   Depois parsear `window.__artifactData.content` (string HTML) com
   `new DOMParser().parseFromString(html, 'text/html')` e extrair o texto de
   cada página via `doc.getElementById('page-xxx').innerText` — os
   wireframes desse projeto usam ids `page-home`, `page-prointer`,
   `page-govia`, `page-waif`, `page-inst`, `page-contato`, `page-insights`,
   `page-glossario`, `page-imprensa`, `page-casos`.
4. **Nunca preencher lacunas de conteúdo com texto "plausível".** Se não tem
   a fonte de conteúdo, é melhor perguntar ao Bruno do que inventar — mesmo
   que o resultado pareça bom, se não for o conteúdo real ele vai ter que
   revisar tudo de novo depois.
5. Números, nomes de planos/produtos, valores em R$, siglas e FAQ são
   **fatos do negócio**, não decisões de copywriting — nunca aproximar ou
   estimar um número que devia vir de uma fonte real.

---

## Design tokens (tailwind.config.js)

```js
colors: {
  navy900: '#060919',   // fundo mais escuro
  navy: '#152852',      // navy padrão (textos escuros, botões)
  hubblue: '#2d4ebf',   // azul de destaque
  lime: '#d2e718',      // lime de destaque (CTA principal)
  hubcyan: '#00e4ff',   // cyan (uso pontual)
  gray100: '#f5f5f5',
  gray150: '#ebebeb',
  gray200: '#ecedf0',
  muted: '#a7a4a4',     // texto secundário/rótulos
  body: '#797979',      // texto de corpo
  ondark: '#d6d6d6',    // texto sobre fundo escuro
  placeholder: '#c4c4c4',
}
fontFamily: {
  luxenta: display/títulos (Luxenta Regular/Medium/SemiBold, woff2 em /public/fonts)
  inter: texto geral (Google Fonts)
}
```

**Sanga global:** classe `.gutter` em `src/index.css` — 160px nas laterais em desktop,
responsivo via `clamp()` em telas menores. Todo o conteúdo de cada seção deve respeitar
essa sanga (o fundo pode ser full-bleed, o conteúdo não).

---

## Estrutura do projeto

```
src/
├── components/
│   ├── ArrowIcon.tsx      — seta SVG, path exato do Figma, cor via prop
│   ├── HubButton.tsx      — botão com 4 escalas (lg/md/sm/xs) × 6 variantes
│   │                        (blue/lime/navy/cyan/outline-light/outline-dark)
│   ├── NavBar.tsx         — barra utilitária + nav principal + menu mobile
│   ├── Footer.tsx         — rodapé (colunas + barra inferior)
│   └── useReveal.ts       — hook GSAP ScrollTrigger (fade + translateY, stagger)
├── sections/
│   ├── S1Hero.tsx         — hero + 4 glass cards flutuantes
│   ├── S2Manifesto.tsx    — gradiente + selo rotativo + círculos glass
│   ├── S3Plataformas.tsx  — accordion (3 cards, auto-play 5s) + 4 cards plataforma
│   ├── S4Autoridade.tsx   — fundo blue + tags + vídeo + logos parceiros
│   ├── S5Jornada.tsx      — timeline 6 cidades
│   ├── S6Numeros.tsx      — 4 cards com número grande sobre imagem
│   ├── S7ParaQuem.tsx     — 5 personas em layout ziguezague
│   ├── S8Governanca.tsx   — layout 3/5 + 2/5, lista numerada
│   ├── S9Insights.tsx     — 3 cards de blog/observatório
│   ├── S10Parceiros.tsx   — carrossel de logos (marquee infinito)
│   └── S11Newsletter.tsx  — formulário de email
├── App.tsx                — monta todas as seções em sequência + Footer
└── index.css               — @font-face, .gutter, .eyebrow, keyframes (marquee, spin)

public/
├── fonts/    — Luxenta em woff2 (Regular, Medium, SemiBold)
├── icons/    — SVGs (seta, selo rotativo, ícones das plataformas)
└── images/   — fotos em WebP, logos em PNG, vídeo em WebM
```

---

## Convenções do código

- **Componentes de seção:** um arquivo por seção (`S<N><Nome>.tsx`), nomeados na
  ordem em que aparecem na home. Páginas novas devem seguir o mesmo padrão de
  organização (uma pasta por página, ex: `src/pages/institucional/`).
- **Estilos:** Tailwind para layout/espaçamento estrutural; `style={{}}` inline para
  valores exatos do Figma (fonte, cor, tracking) que não têm classe Tailwind
  correspondente — isso é intencional, não um desvio de padrão.
- **Animações:** GSAP via `useReveal()` — adiciona `data-animate` no elemento e o
  hook cuida do fade-in no scroll. Não reinvente animações novas sem necessidade.
- **Imagens:** sempre WebP, otimizadas (qualidade 88-92, method 6). Fontes sempre
  woff2. Nunca suba PNG/JPG pesado sem converter.
- **Responsividade:** breakpoints Tailwind padrão (`sm/md/lg/xl`). O design original
  do Figma é desktop (≥1280px); mobile é adaptação, não 1:1 com o Figma.
- **HubButton:** sempre reutilizar esse componente para botões — nunca criar um botão
  novo do zero. Se precisar de uma variante que não existe, estenda o componente.

---

## Erros já cometidos e corrigidos (não repetir)

- **Ícones de seção (S3):** os SVGs em `/public/icons/` já contêm seu próprio fundo/cor
  — nunca adicionar um `background` extra atrás deles.
- **Título H1 do Hero:** cuidado com quebras de linha dependentes de `vw`/largura —
  em monitores muito grandes (2560px+) o texto pode quebrar diferente do esperado.
  Sempre testar em múltiplas resoluções (1280, 1440, 1920, 2560) antes de considerar
  uma correção de quebra de linha como definitiva.
- **Imagens de fundo (hero, etc.):** priorizar nitidez + leveza (padrão "Apple-like"):
  resolução alta (2x/retina, não menos) + WebP com qualidade 88-92 + method 6. Não
  comprimir agressivamente só para reduzir KB — o equilíbrio certo normalmente já
  fica leve nessa qualidade.
- **Container pai "roubando" espaço do filho (double constraint):** um filho com
  `maxWidth` ou `width` correto pode não renderizar do jeito esperado se o PAI já
  tem seu próprio `max-w-[Npx]` + padding cortando o espaço disponível antes de
  chegar no filho. Sempre medir `getBoundingClientRect()` do elemento final, não só
  conferir o valor que você escreveu — o valor escrito e o valor renderizado podem
  ser bem diferentes se algo acima na árvore já está restringindo.
- **CSS Grid + `items-center` não estica as colunas:** `align-items: stretch` é o
  default do Grid, mas `items-center` (Tailwind) sobrescreve isso — colunas passam a
  ter a altura do PRÓPRIO conteúdo, não da track do grid. Isso faz uma coluna com
  `aspect-ratio` no container "estufar" além do esperado se a coluna vizinha tiver
  mais conteúdo. Prefira altura explícita (`h-[NNvw]`) a `aspect-ratio` quando há
  grid + conteúdo de altura variável — `aspect-ratio` é só uma preferência, conteúdo
  grande ainda pode forçar a caixa a crescer além dela.
- **`flexBasis: 0` + `flexGrow` inline quebram o mobile:** usado para animar largura
  de cards lado a lado (accordion do S3) — funciona em `flex-row` (eixo principal
  horizontal), mas em telas menores onde o layout vira `flex-col` (empilhado), o
  MESMO `flexBasis: 0` zera a ALTURA dos cards (eixo principal agora é vertical) e
  eles somem. Nunca aplicar `flexGrow`/`flexBasis` inline sem `lg:` — sempre usar
  classes Tailwind responsivas (`lg:grow`, `lg:basis-0`) pra essas props só valerem
  no breakpoint onde o layout é realmente `flex-row`. **Sempre testar mobile depois
  de qualquer mudança em flex-grow/basis/aspect-ratio.**
- **`right`/`left` absoluto resolve contra o *containing block* mais próximo, não a
  seção inteira:** se um elemento posicionado (`position:absolute`) está aninhado
  dentro de outro `position:relative` (ex: uma coluna do grid), `right: 7%` é 7% da
  LARGURA DESSA COLUNA, não da seção. Se a referência do Figma é a seção inteira,
  o elemento precisa ser filho direto do `<section>` (ou de um wrapper do tamanho
  da seção), não de uma subcoluna.
- **Cor/variante de botão vindo de dados por instância:** nunca hardcodar uma
  variante genérica (`variant="blue"`) quando existe um campo de dado por card
  (`btnBg`) — já aconteceu 3 de 4 cards saírem com a cor errada porque o componente
  ignorava o dado e sempre usava a mesma variante. Sempre conferir que TODAS as
  props definidas no objeto de dados estão de fato sendo usadas na renderização.
- **`mix-blend-mode` é dado de design, não decoração opcional:** cada camada/logo no
  Figma pode ter um blend mode DIFERENTE (`plus-lighter`, `screen`, `luminosity`,
  `normal`) — nunca aplicar um valor uniforme "que parece ficar bom" pra todas as
  camadas. Conferir o blend mode de cada layer individualmente no Figma.

---

## Pendências gerais do projeto

- [x] Página O HUB PAN — referência de qualidade/consistência pras próximas
      páginas internas. Padrão completo documentado em `DESIGN-SYSTEM.md`,
      seção "5.5 PADRÃO DE PÁGINAS INTERNAS" (hero 80vh+20vh, bento grid de
      tiles, timeline com scroll-link, cards com hover+tilt GSAP). **Sempre
      consultar essa seção antes de começar uma página interna nova.**
- [x] Páginas internas criadas: PROINTER, GovIA, Fórum Mundial IA, Insights,
      Contato, Glossário, Imprensa e Casos de Uso — todas seguindo o padrão
      DESIGN-SYSTEM.md §5.5 (Hero80 compartilhado com faixa de cor por página).
- [ ] Páginas futuras se aprovadas: Academy, Alliance, Manifesto/Legado próprios.
- [ ] Conteúdo das páginas internas é proposta de copy — validar com o cliente
      (números da faixa de stats, releases de imprensa e casos de uso são
      ilustrativos e podem precisar de ajuste factual).
- [ ] Ajustes finos de alinhamento em várias seções (em andamento, seção por seção).
- [ ] Conectar o domínio do cliente na Vercel quando o site for aprovado.
- [ ] Revogar/rotacionar qualquer token do GitHub que tenha sido exposto durante setup.
- [ ] Otimizar `public/images/s4-autoridade-video.webm` (~16MB) — pesado para web,
      considerar comprimir/reduzir bitrate mantendo o fundo transparente.
- [x] **Editor visual (/editar) conectado ao Supabase — validado em produção.**
      Login real, edição, rascunho→preview→publicar testados de ponta a ponta
      em `hubpan-site.vercel.app`. Schema em `supabase/schema.sql`, login via
      Supabase Auth, rascunho/publicado separados
      (`content_overrides.draft_value`/`published_value`), upload de imagens
      no Storage, histórico em `edit_history`, tempo real via
      `postgres_changes`. Projeto: `hubpan-site` na org BDDB, região São Paulo.
      **Pegadinha real já resolvida** (não repetir): tabelas criadas via SQL
      puro fora do botão "New Table" do painel NÃO recebem GRANT automático
      pra `anon`/`authenticated` — RLS sozinho não basta, causou "permission
      denied" silencioso em produção (edição parecia salvar mas sumia ao
      recarregar). `schema.sql` já inclui os `grant select/insert/update`
      necessários; qualquer tabela nova criada por SQL precisa do mesmo.
- [x] **9 páginas internas instrumentadas com o editor visual** (O HUB PAN,
      PROINTER, GovIA, Fórum Mundial de IA, Insights, Contato, Glossário,
      Imprensa, Casos de Uso) — mesmo padrão ET/ERich/EImg/EIcon/useEditColor
      da home, ~700 campos editáveis no total. Feito em paralelo via 6 agentes
      em background; revisado, sem colisão de prefixo de key, `tsc -b`/
      `npm run build` (com prerender das 10 rotas) limpos.
      **Componentes compartilhados ajustados** pra fechar os dois furos que os
      agentes reportaram de forma independente: `Hero80.tsx` (`eyebrow` e
      `HeroStat.label` eram `string`, agora `ReactNode`) e `FAQAccordion.tsx`
      (`FAQEntry.q`/`.a` eram `string`, agora `ReactNode`) — sem isso, eyebrow/
      stats do hero e perguntas/respostas de FAQ não podiam virar `ET`/`ERich`.
      `CTABanner.tsx`'s `sub` também virou `ReactNode` pelo mesmo motivo.
      `GlassHoverCard.tsx` (os 6 cards "Para Organizações" do PROINTER) também
      foi ajustado: `Icon` (component reference) virou `icon: ReactNode` e
      `tag`/`titulo`/`desc`/`itens` viraram `ReactNode`/`ReactNode[]` — agora
      os 6 cards são 100% editáveis (ícone via `EIcon`, textos via `ET`/`ERich`).
      **Rotas de edição por página** (`/editar/<slug>` e `/preview/<slug>`,
      ex: `/editar/govia`) — antes `/editar` e `/preview` só renderizavam a
      Home, então as 9 páginas ficaram sem UI de edição por várias sessões
      até isso ser notado. Mapa slug→componente em `src/editor/pageRoutes.ts`
      (ao criar página nova, adicionar aqui também); `EditorPage.tsx`/
      `PreviewPage.tsx` leem `location.pathname` e escolhem a página. Rotas
      em `App.tsx` mudaram de `/editar`/`/preview` (exatas) pra `/editar/*`/
      `/preview/*`. URLs válidas: `/editar` ou `/editar/govia` (home =
      slug vazio), idem `/preview`.
      **Ajustes reportados pelo Bruno depois de testar** (faixa de números do
      hero, cor dos cards de Contato, rótulo de Glossário/Imprensa/Casos de
      Uso): `PageHero.tsx`'s `eyebrow` também era `string` (mesmo furo do
      Hero80/FAQAccordion, achado só quando o Bruno tentou editar). `Hero80.tsx`
      ganhou `HeroStat.editKey`/`editLabel` (opcional — sem isso o valor do
      stat não é clicável) e `stripProps` (spread no container da faixa, pra
      dar pra tornar o fundo clicável via `useEditColor` sem editar Hero80 de
      novo a cada página); os 4 usos (PROINTER/GovIA/Fórum/Insights) e a faixa
      própria do institucional (antes com `bg-navy900` fixo, nunca conectado)
      foram todos ligados. Em `contato/index.tsx`, os cards de "Onde estamos"
      e "Imprensa & Mídia" viraram componentes próprios (`EnderecoCard`,
      `ImprensaMidiaCard`) só pra poder chamar `useEditColor` (hooks não podem
      rodar dentro de `.map()` inline). **Bug de verdade achado nesse processo**
      (não repetir): `useEditColors` em `editor/fields.tsx` só chamava
      `e.stopPropagation()` no clique, sem `e.preventDefault()` — qualquer
      cor editável dentro de um `<Link>` (como os cards de Caminho) tanto
      abria o painel de cor quanto navegava pra outra página ao mesmo tempo.
      Corrigido na função genérica (afeta todo `useEditColor`/`useEditColors`
      do projeto, não só Contato).
      (regra permanente de página nova já editável documentada em "Editor
      visual de conteúdo" abaixo).
- [x] **SSG/pré-renderização + SEO técnico — implementado.** `scripts/prerender.mjs`
      roda depois de `vite build` (`npm run build` já encadeia): abre Puppeteer
      headless, visita as 10 rotas públicas do `ROUTES` (lista duplicada em
      `App.tsx`/`prerender.mjs` — **atualizar as duas ao criar página nova**),
      força visibilidade de `[data-animate]`/`[data-hero-text]` (senão texto
      abaixo da dobra fica com opacity:0 no HTML capturado — animações de
      entrada nunca disparam sem scroll real) e salva `dist/<rota>/index.html`.
      `/` sobrescreve `dist/index.html`; `/editar` e `/preview` ficam de fora
      de propósito (client-side puro, `<NoIndexMeta/>`). A Vercel serve o
      arquivo estático por precedência de sistema de arquivos ANTES do rewrite
      SPA do `vercel.json` — não precisou mexer nele. Título/descrição/OG por
      página via `<PageMeta/>` (`src/components/PageMeta.tsx`) direto nas
      rotas do `App.tsx`. `sitemap.xml` gerado no mesmo script; `robots.txt`
      estático em `public/`. **Nunca falha o build** (try/catch em cada
      camada, `process.exit(0)` sempre) — se o Chrome não abrir no ambiente
      da Vercel, o script avisa e o deploy segue normal, só sem esse reforço.
      Botão Publicar dispara `VITE_VERCEL_DEPLOY_HOOK` (Vercel → Settings →
      Git → Deploy Hooks) se configurada — sem ela, publicar funciona igual,
      só que o HTML estático só atualiza no próximo deploy de código.
      **Deploy Hook já configurado** (`.env.local`, testado em produção —
      publicar dispara rebuild automático). Ainda pendente: trocar `SITE_URL`
      (em `PageMeta.tsx` e `prerender.mjs`) pelo domínio definitivo quando
      conectado.
- [x] **Painel admin `/admin` — Fase 1: Dashboard + Páginas + SEO.**
      Reaproveita a MESMA conta/login do editor visual (`useEditorStore`),
      mas com tela de login PRÓPRIA (`AdminLoginScreen.tsx`, ver "White-label"
      abaixo) — sem sistema de auth novo. `channel` em `store.tsx` agora
      também é `'draft'` em `/admin/*` (igual `/editar`/`/preview`): editar
      SEO no painel é rascunho até publicar, mesmo botão/fluxo de sempre.
      **SEO não tem tabela própria** — vira mais linhas em
      `content_overrides`, chaves `seo.<slug>.title/description/noindex`
      (`src/admin/seo.ts`: `seoKey()`, `computeSeoStatus()` heurística tipo
      Yoast, título 40–60/descrição 120–160 chars ideal). Zero migração de
      banco. `PageMeta.tsx` agora recebe `slug` (nova prop, uma por rota em
      `App.tsx`) e prefere o override salvo sobre o texto hardcoded — **os
      valores efetivos são calculados no corpo do componente e entram nas
      deps do `useEffect`, não as props brutas**, senão o SSG (que não
      navega, só carrega uma vez) captura sempre o valor hardcoded mesmo
      com override salvo — bug sutil, já corrigido, não reintroduzir.
      `src/editor/pageRoutes.ts` ganhou `path` por página (não título/
      descrição — isso ficaria numa 3ª cópia da mesma string já duplicada
      entre `App.tsx` e `prerender.mjs`; `src/admin/seoDefaults.ts` guarda
      uma cópia só pra placeholder no formulário, não é fonte de verdade).
      Menu: Dashboard, Páginas (link direto pra `/editar/<slug>`), **SEO**
      (seção própria — `/admin/seo` lista + `/admin/seo/<slug>` edita, uma
      aba dedicada porque o Bruno não achou o SEO quando estava só embutido
      dentro de Páginas). Leads/Configurações aparecem cinza "Em breve".

      **White-label (pedido do Bruno — o painel vai virar produto reusável
      noutros projetos, não só o HUB PAN):** todo o visual do painel usa
      tokens CSS em `src/admin/theme.css` (formato compatível com
      tweakcn.com/shadcn — variáveis HSL tipo `--primary`, `--sidebar-*`,
      etc., escopadas em `.admin-shell`, com helpers em `src/admin/theme.ts`)
      em vez da identidade navy/lime/Luxenta do site. **Regra permanente:**
      nenhum componente novo dentro de `src/admin/` deve usar cor/fonte
      hardcoded do site (`#152852`, `#d2e718`, `'Luxenta'` etc.) — sempre os
      tokens de `theme.ts`. Pra re-skinar o painel inteiro (quando o Bruno
      mandar os parâmetros do tweakcn), só trocar os valores em `theme.css`.
      Único texto "de marca" que sobrou é `ADMIN_SITE_NAME` (`theme.ts`).
      Login do painel é a `AdminLoginScreen.tsx` (própria, tokens do admin)
      — NÃO reaproveitar o `<LoginScreen/>` de `editor/ui.tsx`, que é
      propositalmente navy/lime (identidade do site, usado só em `/editar`).

      **`/admin` tem casca própria, sem NavBar/Footer/Newsletter/GSAP
      ScrollSmoother do site público** — `App.tsx` virou um `AppShell` que
      checa `location.pathname.startsWith('/admin')` e pula esse chrome
      inteiro nesse caso (achado testando: sem isso o NavBar público e o
      ScrollSmoother do site colidiam visualmente com o layout do painel).
      `AdminLayout.tsx` usa shell de altura travada (`h-screen overflow-hidden`
      no container raiz, sidebar e `<main>` cada um com seu próprio
      `overflow-y-auto`) em vez de `min-h-screen` — o corpo da página NUNCA
      rola, só a área de conteúdo interna. Isso corrigiu um scroll gigante
      com espaço em branco embaixo que o Bruno reportou (não reproduzi a
      causa exata, mas esse padrão de shell é a forma robusta de garantir
      que não aconteça de novo, independente da causa).

      Rotas pendentes de fase futura, já com "Em breve" no menu: Leads,
      Configurações (Google Analytics/Search Console), Usuários (precisa
      Edge Function com service key, nunca no cliente), Mídia.

      **Correção — link de SEO da Home:** links pra `/admin/seo/<slug>` da
      Home usam `page.slug || 'home'` (nunca o slug vazio na URL) — uma URL
      tipo `/admin/seo/` (vazio) casa com a rota exata `seo` (a lista) antes
      de chegar em `seo/:slug`, então o link parecia "não fazer nada". A
      chave salva no banco continua `seo.home.*` (slug interno de
      `pageForSlug` continua `''` — só a URL usa `'home'`).

      **Auditoria on-page (não é edição — é diagnóstico).** O Bruno pediu
      algo tipo Yoast, mas Yoast é plugin de WordPress (PHP, preso à
      arquitetura do WP) — não dá pra "instalar" aqui. Em vez de construir
      telas de edição pra cada parâmetro (alt de imagem, estrutura de H1/H2,
      contagem de palavras — o que seria bem mais trabalho), a seção
      "Auditoria on-page" em `AdminSeoEditor.tsx` faz `fetch(SITE_URL + page.path)`
      **na página PUBLICADA de verdade** (o HTML pré-renderizado pelo SSG) e
      analisa com `auditHtml()` (`src/admin/seo.ts`, função pura com
      `DOMParser`): contagem de palavras, quantos H1/H2 existem e seus
      textos, cobertura de alt text nas imagens, e — se o Bruno preencher o
      novo campo "palavra-chave principal" (`seo.<slug>.keyword`) — se ela
      aparece no H1 e no texto. Tudo só leitura, sem CORS (mesma origem em
      produção; testado e confirmado que também funciona em dev direto
      contra o domínio da Vercel). Quando a auditoria aponta um problema
      (ex: imagem sem alt), o ajuste é feito direto no código via chat — o
      painel não tem (e não deve ganhar) uma tela pra reatribuir H1/H2 ou
      editar alt text, pra não abrir brecha de quebrar a estrutura/design da
      página sem querer.

      **Fluxo de uso pretendido** (o Bruno perguntou como ele funciona na
      prática): botão "Copiar resumo" (`buildAuditSummary()` em `seo.ts`)
      gera um texto pronto — título, descrição, palavras, H1/H2, imagens sem
      alt, problemas — pra colar direto no chat. Depois que eu ajusto algo
      no código e o deploy termina (~1-2 min), o Bruno clica "Atualizar" na
      auditoria pra conferir se melhorou (mostra "última checagem: há X").
      Cogitei automatizar isso com uma IA chamando a API da Anthropic direto
      do painel, mas isso exigiria gerenciar uma chave paga só pra replicar
      o que já existe de graça neste chat — não vale a pena por ora.

      **Alt "vazio de propósito" vs. "esquecido" (correção real de bug na
      lógica da auditoria):** a primeira versão de `auditHtml()` tratava
      `alt=""` (explícito, correto pra imagem decorativa — pede pro leitor
      de tela pular) exatamente igual a não ter o atributo `alt` de jeito
      nenhum (bug de acessibilidade de verdade). Isso fazia a Home aparecer
      com "16 imagens sem alt" permanentemente, mesmo depois de eu revisar
      cada uma e confirmar que são ícones decorativos com nome escrito do
      lado (alt="" correto ali). Corrigido: `OnPageAudit.images` agora tem
      `decorative: boolean` (`el.hasAttribute('alt') && !alt.trim()`), e só
      `imagesMissingAlt` (atributo `alt` **ausente** de verdade) conta como
      problema. Se um dia adicionar imagem nova em qualquer seção, mesma
      regra vale: `alt=""` explícito pra decorativa, `alt="descrição"` pra
      imagem com conteúdo — nunca deixar o atributo simplesmente de fora.

      **Checklist visual (não só uma lista de erros) — pedido explícito do
      Bruno:** a versão anterior só mostrava números (contagem de H1/H2/
      palavras/imagens) e uma lista de problemas — não dava pra ver o que
      já estava certo. `src/admin/seo.ts` ganhou `buildSeoChecklist()`,
      que troca `computeSeoStatus()`/os `issues: string[]` soltos por uma
      lista de `SeoCheck` (`{id, label, level: 'good'|'warning'|'bad'|'neutral', detail}`)
      — SEMPRE mostra todos os critérios (título, descrição, H1, H2,
      contagem de palavras, imagens, e 4 checagens de palavra-chave se
      definida), cada um com ícone próprio (✓ verde / ⚠ âmbar / ✗ vermelho
      / – cinza pra "não avaliado"). `overallLevel()` deriva o badge geral
      a partir do pior nível entre os checks. Dashboard e a lista de SEO
      (que não buscam o HTML de todas as páginas, só título/descrição) usam
      `quickSeoLevel()` — uma versão mais simples/rápida, só pra essas duas
      telas; o checklist completo (com H1/H2/imagens/palavra-chave) só
      existe na tela de edição de cada página, que já busca o HTML mesmo
      assim pra auditoria. `buildAuditSummary()` (o botão "Copiar resumo")
      também foi atualizado pra listar separadamente "Certo" e "Pra
      revisar" a partir dos mesmos `SeoCheck[]`.

      **Rodada seguinte de ajustes do Bruno, todos em `AdminSeoEditor.tsx`:**
      - **Campo vazio em vez de pré-preenchido (bug real).** Os inputs de
        título/descrição inicializavam com `get(key, '')` — se nunca editado
        antes, o campo ficava em branco (só o placeholder cinza mostrava o
        texto padrão), mesmo a análise ao lado já mostrando as contagens
        desse texto. Editar virava reescrever do zero. Corrigido: o estado
        agora inicializa com um "baseline" (`get(key, fallback ?? '')` —
        override se existir, senão o texto padrão do código de verdade,
        não só um placeholder) e o `commit*()` só salva se o valor mudou em
        relação a esse baseline — abrir a tela e sair sem editar nada NÃO
        cria um override à toa.
      - **"Ver resumo"** — antes só "Copiar resumo" (cego, sem conferir
        antes). Agora um toggle mostra o texto completo num textarea
        readonly antes de copiar.
      - **Imagem de compartilhamento (og:image)** — campo novo
        (`seoKey(slug,'image')`), upload via `processImage()`+`uploadImage()`
        (mesmas funções do editor visual, `editor/store.tsx`), preview de
        como fica ao compartilhar (card 1200×630). `PageMeta.tsx` agora lê
        esse override (fallback pro `DEFAULT_IMAGE` de sempre).
      - **Aviso de rascunho vs. publicado** — nota fixa no topo da tela
        ("vira rascunho, só publica de verdade quando clicar Publicar")
        pra tirar a dúvida que o Bruno teve.
      - **`<main>` duplicado (bug real de HTML)** — `AppShell` (App.tsx)
        envolvia as rotas `/admin/*` num `<main>` próprio, mas
        `AdminLayout.tsx` já tem o seu — dois `<main>` aninhados é HTML
        inválido e pode confundir o cálculo de scroll do navegador. Rota
        `/admin` agora usa `<div>` nesse wrapper, só o `AdminLayout` é
        `<main>`.
      - **Scroll "vazando" pro body ao chegar no fim de uma área rolável**
        (relatado como "trava, dou mais um scroll e libera um espaço
        gigante em branco") — `overscroll-behavior: contain` (Tailwind
        `overscroll-contain`) no `<aside>` e no `<main>` do
        `AdminLayout.tsx`. É a correção padrão do CSS pra esse sintoma
        exato (scroll chaining pro elemento pai quando o filho rolável
        chega no limite) — não reproduzi o gesto exato via automação pra
        confirmar 100%, pedir confirmação do Bruno depois do deploy.

      **Copy de SEO profissional pra todas as 10 páginas (título/descrição
      em `App.tsx`, sincronizado em `admin/seoDefaults.ts`)** — o Bruno
      pediu pra eu escrever com base no conteúdo real de cada página
      (usei um agente Explore pra levantar propósito/dados concretos de
      cada uma antes de escrever). Título 40–60 / descrição 120–160
      caracteres em todas — várias estavam fora da faixa antes (Home 167
      na descrição, O HUB PAN 164, Contato 29 no título, Imprensa 37,
      Fórum 67, Casos de Uso só 83 na descrição). **Antes de escrever,
      consultei a tabela `content_overrides` direto via REST do Supabase
      com a chave anon/publishable (SELECT é público por RLS — só
      leitura, não precisa login) pra não sobrescrever o que o Bruno já
      tinha editado e PUBLICADO manualmente: descrição do PROINTER (tirou
      "gratuito"), imagem de compartilhamento do PROINTER, e descrição do
      GovIA (trocou "inteligência artificial" por "IA") — mantive esses
      3 exatamente como estão (o código só documenta o mesmo texto, o
      override no banco é quem realmente vale). Achado: `seo.govia.keyword`
      já tinha um valor salvo, mas era o título inteiro colado ali (teste
      do Bruno, não uma palavra-chave de verdade) — sinalizei pra ele
      trocar. Como não consigo logar (não insiro senha em hipótese
      nenhuma), só título/descrição (que têm fallback no código) eu
      ajusto direto — palavra-chave não tem fallback, existe só como
      override no banco, então as sugestões ficaram só na conversa pro
      Bruno colar ele mesmo no painel.

      **Palavra-chave genérica demais (feedback certeiro do Bruno)** —
      primeira rodada usei frases técnicas corretas mas sem julgamento de
      relevância real: "sem cartão de crédito" pro GovIA competia com um
      universo de busca sem nada a ver com governo/IA. Reescrevi 4
      (GovIA, PROINTER, Imprensa, Casos de Uso) pra frases mais
      específicas e ancoradas na marca/produto real — não basta a frase
      aparecer no título/descrição (checagem técnica), ela precisa
      identificar a página de verdade (julgamento de relevância). Lição
      pra próxima vez que sugerir palavra-chave: sempre os dois crivos
      juntos.

      **"Não revisado" não refletia a realidade (bug real, corrigido)** —
      `quickSeoLevel()` só era calculado quando havia override de
      título/descrição salvo (`AdminDashboard.tsx`/`AdminSeoList.tsx`);
      como os textos das 10 páginas agora vêm prontos do código
      (`SEO_DEFAULTS`), o Bruno editou só a palavra-chave (que não conta
      pra esse cálculo) e viu 8 de 10 páginas presas em "não revisado"
      mesmo com SEO correto. Corrigido: a nota agora é calculada SEMPRE
      a partir do texto efetivo (`get(key, SEO_DEFAULTS[slug])` —
      override se existir, senão o padrão do código), sem gate nenhum;
      um badge "editado" à parte (não bloqueante) mostra quais páginas
      já passaram por edição manual no painel, só como informação.

      **Ajustes de navegação pedidos pelo Bruno**: linha inteira da
      lista de SEO (`AdminSeoList.tsx`) agora é clicável (antes só o
      link "Editar SEO"); os cards de H1/H2/Imagens na "Análise de SEO"
      (`AdminSeoEditor.tsx`) viraram expansíveis — clicar mostra a lista
      completa dos H1/H2 encontrados ou uma galeria com miniatura +
      status de alt de cada imagem, sem precisar editar nada ali (o
      Bruno foi explícito: só visualizar, edição de estrutura continua
      fora do painel de propósito).

## Editor visual de conteúdo (/editar)

A home tem um painel de edição estilo Framer em `/editar` (login → clica no
texto e edita inline, clica na imagem → painel com specs de tamanho + upload
otimizado pra WebP, clica em fundo/card → paleta de cores; toolbar flutuante
com histórico de auditoria: quem/quando/o quê + restaurar).

**Regras permanentes (pedido explícito do Bruno, valem pra sempre, não só pra
sessão em que foram combinadas):**
1. **Toda página ou seção nova já nasce instrumentada com os campos editáveis**
   (`ET`/`ERich`/`EImg`/`EIcon`/`useEditColor`, como a home) — desde que o
   conteúdo aprovado vá pro ar, ela precisa ser editável pelo painel igual a
   qualquer outra. Não é pra o Bruno pedir de novo a cada página; é o padrão
   default de "página pronta pra publicar" neste projeto.
2. **Antes de mudar o valor padrão (fallback) de um campo que JÁ EXISTE no
   editor** — seja por pedido direto do Bruno aqui no Claude Code, seja numa
   refatoração — **avisar que aquele campo pode ter uma edição salva no banco
   (override) que vai continuar valendo e esconder a mudança**, e perguntar
   se ele quer que eu também limpe esse override (`content_overrides` no
   Supabase) pra a mudança de fato aparecer. Nunca mudar e seguir em silêncio
   — o resultado "pedi pra mudar e não mudou" é exatamente o que essa regra
   evita. (Campo NUNCA editado antes = sem risco, pode mudar o fallback livre.)

**Regras ao mexer nas seções da home (S1–S11) e em NavBar/Footer:**
- Campos editáveis: `<ET>` (texto inline) e `<ERich>` (bloco/caixa inteira,
  largura arrastável via `baseW`) — AMBOS abrem a mesma toolbar de formatação
  (B/I/U com estado ativo, tamanho em px na seleção, cor na seleção, limpar);
  `<EImg>`/`useEditImage`/`<BgEditChip>` (imagens; SVG passa sem rasterizar;
  `fit:'contain'` pra logos), `<EIcon>` (picker Lucide com tamanho/espessura/
  cor, catálogo em `editorIcons.ts`) e `useEditColor(s)` (fundos). Tudo em
  `src/editor/fields.tsx`.
- O valor padrão (design do Figma) fica no `v`/`children`/`fallback` — o
  storage guarda só edições (overrides). ERich aceita `<k>.w` (largura).
- Pegadinhas do contentEditable já resolvidas (não regredir): blur pra dentro
  da toolbar não pode commitar (checar relatedTarget); `focus()` sempre com
  `preventScroll: true` e recortes de foto com editável dentro usam
  `overflow: clip` (hidden permite scroll programático e o focus rolava o
  recorte — a foto "encolhia"); tamanho em px usa `<font size=7>` como
  marcador e exige styleWithCSS DESLIGADO na hora do execCommand.
- Ao alterar um texto padrão, alterar o fallback do campo (não criar campo
  novo) — a chave `k` é o identificador estável, não renomear sem motivo.
- Blocos com conteúdo misto (cores/negrito no meio) são UM `<ERich>` com o
  markup original como children — nunca fatiar em vários `<ET>` (o usuário
  espera editar a caixa inteira; fatias quebram a seleção no meio das linhas).
- Fora do modo edição, os componentes não têm handlers nem estilos extras —
  o site público renderiza idêntico ao design.
- No hero, o wrapper de conteúdo usa `pointer-events-none` + `pointer-events-auto`
  nos filhos pra deixar cliques alcançarem o BG e os glass cards atrás dele —
  manter esse padrão se criar overlays parecidos.
- **Updaters do React no store precisam ser puros** (StrictMode roda 2x em
  dev) — persistência e histórico ficam em `useEffect`/refs, nunca dentro de
  `setState(prev => …)`. Já causou entradas duplicadas no histórico.
- Cuidado com seletor CSS `[contenteditable]` — casa com `contenteditable="false"`
  também; usar `[contenteditable="true"]`/`="plaintext-only"`.

**Backend (Supabase) — `src/editor/store.tsx` e `supabase/schema.sql`:**
- Canal (`draft` vs `published`) é derivado da rota via `useLocation()` dentro
  do próprio `EditorProvider` — `/editar` e `/preview` leem `draft_value`,
  todo o resto lê `published_value`. Não precisa (e não deve) passar `channel`
  por prop — mexer no cálculo em `EditorProvider` se um novo tipo de rota
  precisar de outro canal.
- `setValue` só grava se `channel === 'draft'` — o `editMode` (interatividade)
  é decidido à parte, por página (`EditorPage` liga, `PreviewPage` nunca liga).
- Publicação é atômica via RPC `publish_all()` (security definer, só
  `authenticated` pode chamar) — nunca fazer publish campo-a-campo no
  cliente, quebra o "tudo ou nada" e é mais lento.
- Funções async dentro do provider que fecham sobre `supabase` (que é
  `SupabaseClient | null`) precisam capturar `const sb = supabase` logo
  após o guard `if (!supabase) return` — senão o TS perde o narrowing
  dentro de closures assíncronas/de cleanup.
- **`login()` devolve a mensagem de erro (ou `null`), nunca `boolean` +
  state separado** — já aconteceu de `authError` do contexto ficar stale
  dentro do closure do `submit()` do formulário (React batches setState),
  mostrando "Não foi possível entrar" genérico em vez do erro real do
  Supabase. Qualquer fluxo assíncrono que precise do resultado imediato
  deve devolver o valor pelo retorno da função, não depender de reler
  outro state do contexto logo após o `await`.

---

## Fluxo de trabalho esperado

1. Bruno descreve o ajuste ou pede uma seção/página nova (às vezes com print/imagem).
2. Confira o Figma (se disponível) ou peça valores exatos antes de implementar —
   `get_design_context` no node certo, não confiar de memória em `DESIGN-SYSTEM.md`
   pra elementos ainda não documentados.
3. Edite os arquivos reais do projeto.
4. **Verifique no navegador antes de dar como pronto**, não só visualmente:
   - Para textos com quebra de linha crítica (títulos, badges): conte as linhas de
     verdade via JS (ver snippet na seção "Regra de ouro"), não só olhe a screenshot.
   - Para qualquer mudança em flex/grid (`flex-grow`, `flex-basis`, `aspect-ratio`,
     `items-*`): teste mobile também, não só desktop — várias dessas props se
     comportam diferente quando o eixo principal do flex muda de direção.
   - Para posicionamento absoluto (`right`/`left`/`top` em px ou %): confirme contra
     qual elemento a porcentagem está de fato resolvendo (`getBoundingClientRect()`
     do elemento pai posicionado), não assuma que é a seção inteira.
   - Teste nos 4 breakpoints (1280 / 1440 / 1920 / 2560) sempre que a mudança afetar
     largura, quebra de linha ou posicionamento.
5. Rode `npm run build` para validar que não quebrou nada antes de considerar concluído.
6. Ao finalizar, ofereça rodar `git add / commit / push` — sempre pedindo confirmação
   antes de qualquer ação que envie algo para fora (GitHub).
