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

**Figma:** fileKey `JFAJ01FA0KiD5FQYnMOD4B`, node da Home `2007-20`.

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

---

## Pendências gerais do projeto

- [ ] Outras páginas do site: Institucional (O HUB PAN, Manifesto, Legado, Governança,
      Imprensa), Plataformas (PROINTER, Fórum Mundial IA, GovIA, Academy, Alliance),
      Insights/Newsletter, Contato — todas devem reutilizar NavBar, Footer, tokens e
      componentes já existentes.
- [ ] Ajustes finos de alinhamento em várias seções (em andamento, seção por seção).
- [ ] Conectar o domínio do cliente na Vercel quando o site for aprovado.
- [ ] Revogar/rotacionar qualquer token do GitHub que tenha sido exposto durante setup.

---

## Fluxo de trabalho esperado

1. Bruno descreve o ajuste ou pede uma seção/página nova (às vezes com print/imagem).
2. Confira o Figma (se disponível) ou peça valores exatos antes de implementar.
3. Edite os arquivos reais do projeto.
4. Rode `npm run build` para validar que não quebrou nada antes de considerar concluído.
5. Ao finalizar, ofereça rodar `git add / commit / push` — sempre pedindo confirmação
   antes de qualquer ação que envie algo para fora (GitHub).
