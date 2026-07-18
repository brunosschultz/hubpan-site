# HUB PAN — Design System Completo

Fonte de verdade dos tokens visuais do projeto (cores, tipografia, espaçamento,
componentes). Toda seção ou página nova deve obedecer estes valores. Em caso de
dúvida ou detalhe não coberto aqui, confirme direto no Figma (fileKey no CLAUDE.md).

---

# 1. FUNDAMENTOS

## 1.1 Fontes

- **Display (títulos, números):** Luxenta — Regular (400), Medium (500), SemiBold (600). Subir woff2.
- **Texto e UI:** Inter — Light (300), Regular (400), Medium (500), SemiBold (600). Google Fonts.
- **Watermark decorativo:** Axiforma SemiBold — somente no "HUB PAN" gigante do Manifesto. Subir woff2.
- **Ícones:** Lucide, outline, stroke 2px — padrão global.

**Renderização obrigatória (global):**
```css
font-synthesis: none;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```
Impede o browser de sintetizar bold/italic e garante espessura fiel ao Figma.

## 1.2 Cores

| Token | Hex | Uso |
|---|---|---|
| navy-900 | #060919 | Base do hero escuro |
| navy-700 | #152852 | Títulos, botão escuro, seções escuras, rodapé |
| blue-500 | #2d4ebf | Ação primária, acentos |
| lime-400 | #d2e718 | Destaque / CTA principal |
| cyan-400 | #00e4ff | Botão portal, detalhes |
| white | #ffffff | Fundos claros |
| gray-100 | #f5f5f5 | Fundo de seção claro (parceiros) |
| gray-150 | #ebebeb | Fundo de contraste para cards brancos |
| gray-200 | #ecedf0 | Fundo de seção alternativo |
| text-muted | #a7a4a4 | Rótulos "olho", metadados |
| text-body | #797979 | Corpo de texto |
| text-on-dark | #d6d6d6 | Texto sobre fundo escuro |
| placeholder | #c4c4c4 | Marcação de imagem (retângulo cinza) |

**Estados:** hover = escurecer 10%, pressed = escurecer 20%, disabled = 40% opacidade. Transição: 200ms ease-out.

## 1.3 Tipografia

| Estilo | Fonte | Peso | Tamanho | Line-height | Tracking | Uso |
|---|---|---|---|---|---|---|
| H1 (hero/impacto) | Luxenta | 400 (Regular) | 65px | 65px | −1.95px | Hero, seções de impacto |
| H2 (seção) | Luxenta | 400 | 50px | normal | −0.5px | Títulos de seção |
| Título de card | Luxenta | 600 (SemiBold) | 35px | 36px | — | Cards de plataforma |
| Título glass card | Luxenta | 400 | 24px | normal | — | Cards de governança |
| Título cidade | Luxenta | 600 | 24px | 25px | — | Timeline jornada |
| Número de destaque | Luxenta | 400 | 82px | 1 | — | Estatísticas (glass cards hero) |
| Número grande | Luxenta | 400 | 140px | 0.72 | −4px | Cards de número (cortado na base pela máscara da imagem) |
| Rótulo "olho" | Inter | 500 | 13–16px | normal | 4.8px (30%), MAIÚSCULO | Rótulo de seção |
| Rótulo de card | Inter | 500 | 14px | normal | 1.4px (10%), MAIÚSCULO | Dentro de cards |
| Descrição de seção | Inter | 400 | 16px | 25px | — | Abaixo de títulos |
| Corpo grande | Inter | 400 | 18px | 36px | −0.18px | Hero, manifesto |
| Corpo | Inter | 400 | 14px | 28px | — | Cards, descrições |
| Nav | Inter | 500 (Medium) | 14px | normal | — | Menu principal |
| Meta/micro | Inter | 400 | 11–12px | normal | 2–3.5px | Categorias, tags |

**Regra:** todos os números nos glass cards (10, 4, 15, etc.) devem ter o MESMO tamanho (82px). Nunca variar tamanho por quantidade de dígitos.

## 1.4 Escala de espaçamento (base 4px)
4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 120

## 1.5 Ritmo de seção (global)
- **80px** — topo da seção → rótulo (e conteúdo → fim da seção)
- **24px** — rótulo → título
- **48px** — título → conteúdo
- **32px** — gap entre linhas de conteúdo
- Seções 100vh: conteúdo centralizado verticalmente, respiros de 80px
- Mobile: 80→48px, gaps proporcionais

## 1.6 Grid e layout
- **Container:** máx. 1600px, centralizado
- **Sanga/gutter:** 158–160px de cada lado (mobile: padding responsivo ~24-40px)
- **Fundos de seção:** full-bleed (ponta a ponta)

## 1.7 Raios de borda
- Botão: **pill** (border-radius: 100px)
- Card padrão: **20px**
- Card de logo/parceiro: **10px**
- Glass card accent: **20px 57px 20px 57px** (assimétrico)
- Glass card pill: **57px** (totalmente arredondado)

## 1.8 Efeitos

### Glassmorphism — 4 variantes

| Nome | Blur | Fundo | Borda | Raio | Onde |
|---|---|---|---|---|---|
| glass-stat | 17.6px | rgba(250,255,202,0.10) | 0.88px rgba(255,255,255,0.15) | pill ou 20/57/20/57 | Hero, cards de estatística |
| glass-card | 10–15px | rgba(255,255,255,0.10) | 1px rgba(255,255,255,0.10) | 20px | Governança |
| glass-circle | 30px | rgba(255,255,255,0.30) | 1px #D2E718 a 50% | 50% (círculo) | Manifesto, ícones |
| glass-nav | 26.5px | rgba(21,40,82,0.20) | — | — | Barra utilitária do topo |

### glass-stat variante accent
- Cantos: 20px 57px 20px 57px
- Barra lateral esquerda: **10px solid** (lime #D2E718 ou cyan #00E4FF)

### Placeholder de imagem
Onde imagens reais ainda não foram inseridas, usar retângulo com:
- Fundo: `#c4c4c4` (cinza)
- Border-radius: conforme o contexto (20px para cards, 0 para seções full-bleed)
- Sem borda, sem texto

## 1.9 Movimento
- **Hover:** transição 200ms ease-out (botões, cards, logos)
- **Entrada ao scroll:** fade-in + subida 16px, ~400ms ease-out
- **Linhas SVG decorativas:** stroke-dashoffset ao scroll
- **Selo rotativo:** 360°, ~25s, linear
- **Carrossel de logos:** scroll contínuo ~30-40s
- **Accordion:** 400ms ease-out, auto-play 5s

---

# 2. COMPONENTES

## 2.1 Botões

Todos pill (border-radius: 100px). Ícone à direita dentro de círculo.

### Anatomia do botão
```
[ padding-left | TEXTO | gap | ● CÍRCULO(seta) | padding-right ]
```

- **Círculo:** fundo `rgba(0,0,0,0.1)` (preto 10% opacidade) — em TODAS as variantes
- **Seta:** SVG arrow-up-right, 13×13px nativo (viewBox 0 0 13 13)
- **Cor da seta:** branca em botões com fundo escuro (blue, navy); navy #152852 em botões com fundo claro (lime, cyan)
- **Texto:** Inter Medium

### Escalas (proporções exatas do Figma)

| Escala | Altura | Pad-Left | Pad-Right | Gap | Círculo ⌀ | Seta | Texto | Contexto |
|---|---|---|---|---|---|---|---|---|
| **Grande** | 62px | 40px | 10px | 15px | 36px | 13px | 18px | CTAs de seção |
| **Médio** | 52px | 34px | 8px | 13px | 30px | 11px | 15px | Cards de plataforma |
| **Pequeno** | 45px | 29px | 7px | 11px | 26px | 9px | 13px | Cards menores |
| **Menu** | 34px | 22px | 5px | 8px | 20px | 7px | 12px | Navegação do topo |

### Variantes de cor

| Variante | Fundo | Texto | Seta | Contexto típico |
|---|---|---|---|---|
| Primário | blue-500 #2d4ebf | branco | branca | CTA principal sobre fundo escuro |
| Destaque | lime-400 #d2e718 | navy-700 #152852 | navy #152852 | CTA destaque, fundo claro ou escuro |
| Escuro | navy-700 #152852 | branco | branca | CTA sobre fundo claro |
| Portal | cyan-400 #00e4ff | navy-700 #152852 | navy #152852 | Botão "Acessar Portal" no menu |
| Tag/outline | transparente | branco ou navy | branca ou navy | Tags de localização (borda 1px) |

**Regra de cor da seta:** se `fundo é claro` (lime, cyan, branco) → seta navy. Se `fundo é escuro` (blue, navy) → seta branca.

**Botão sem círculo:** "CONECTE-SE" no menu usa apenas texto, sem ícone/círculo. Fundo navy-700, texto branco, mesma escala menu.

### Implementação CSS (botão grande — referência)
```css
.btn-lg {
  height: 62px;
  border-radius: 100px;
  font-size: 18px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 10px 0 40px;
  border: none;
  cursor: pointer;
  font-synthesis: none;
}
.btn-lg .ic {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.btn-lg .ic img {
  width: 13px;
  height: 13px;
}
```

## 2.2 Catálogo de cards

### Card 1 — Glass Estatística (Hero)
- **Dimensão:** 233×115px
- **2 formas:** pill (border-radius 57px) / accent (20px 57px 20px 57px + barra 10px solid esquerda)
- **Conteúdo:** centralizado horizontal e verticalmente (`display:flex; align-items:center; justify-content:center; gap:14px; padding:0 20px`)
- **2 layouts:** número Luxenta 82px + rótulo Inter 18px OU logo/ícone ~55px + rótulo Inter 18px
- **Regra:** TODOS os números no mesmo tamanho (82px), independente de 1 ou 2 dígitos
- **Posicionamento no hero:** diagonal, usando `position:absolute` com coordenadas em % (responsivo)
- **Placeholder para ícones:** quadrado 55px, fundo `rgba(255,255,255,0.1)`, border-radius 8px

### Card 2 — Accordion (Plataformas, linha 1)
- Grid de **3 cards**, um expandido (~50% width) + dois recolhidos (~25% cada), altura fixa **420px**
- **Alinhamento vertical:** ícone, label, título e descrição ficam na mesma linha Y em todos os 3 cards (mesmo padding: 32px top, 32px left, 28px bottom)
- **Espaçadores fixos** entre elementos (flex-shrink:0): ícone (56×56px, border-radius 12px) → 16px → label (Inter 14px caps tracking 2px) → 8px → título (Luxenta SemiBold 35px) → 12px → descrição (Inter 14px)
- **Card expandido:** lado esquerdo = conteúdo + botão médio (52px, lime) fixo embaixo. Lado direito = imagem com **margens internas** (padding 20px topo/direita/baixo, 0 esquerda), border-radius 16px na imagem
- **Cards recolhidos:** mostram todo o conteúdo (ícone, label, título, descrição) mas sem foto e sem botão
- Hover num recolhido → expande, anterior recolhe (~400ms ease-out)
- Auto-play: avança a cada 5s se sem interação
- Conteúdos: ProInter (ícone PI azul), Fórum Mundial de IA (ícone IA lime), GovIA (ícone GV azul)

### Card 3 — Plataforma (Plataformas, linha 2)
- Grid de 4, estáticos, altura fixa **340px**, `display:flex; flex-direction:column`
- Ícone (48×48px, border-radius 12px) no topo, rótulo (Inter 14px caps tracking 2px), título (Luxenta SemiBold 20-24px), descrição (Inter 13px)
- Descrição com `margin-bottom:auto` — empurra o botão pra base do card independente da quantidade de texto
- Botão pequeno (45px) fixo na base do card
- Fundo variável: branco (borda #ecedf0), blue-500, navy-700, lime-400
- Raio 20px
- Conteúdos: HUP PAN Academy (branco), HUP PAN Sim!t (blue), HUP PAN Insights (navy), HUP PAN Digital (lime)

### Card 4 — Número (Números Validados)
- Grid de 4, altura fixa (~380px)
- Card branco, raio 20px, `overflow:hidden`
- Topo: imagem **full-bleed** (sem margem, ocupa toda a largura). Cantos superiores herdados do card. Cantos **inferiores arredondados** (border-radius: 0 0 20px 20px)
- Número Luxenta **140px** branco, alinhado na **base da imagem**, com `margin-bottom: -13px` — a base do texto é cortada pelo overflow da imagem (efeito máscara)
- Abaixo da imagem: descrição Inter 16px navy + botão pequeno (45px, lime) fixo na base do card via `flex:1` spacer
- Descrições de todos os 4 cards devem começar na mesma linha Y (altura da imagem fixa)
- Conteúdos: "15" (Edições do Fórum Pan-Americano), "04" (Edições em Nova York), "2017" (Início em Belo Horizonte), "+100" (Projetos de inovação abrigados)

### Card 5 — Persona (Para Quem É)
- Grid de 5
- Imagem ~259×280px raio 20px (placeholder cinza #c4c4c4)
- Card de fundo ~297×287px raio 20px, deslocado atrás (ziguezague cima/baixo)
- Inativo: fundo gray-150; Ativo (hover): fundo lime-400 + botão pequeno 45px aparece
- Label: Inter Medium 16px navy

### Card 6 — Insight/Blog (HUB PAN Insights)
- Grid de 3, altura fixa **440px**, `display:flex; flex-direction:column`
- Fundo gray-150, raio 20px, padding 21px
- Foto no topo com margem interna (~21px), raio 20px, altura fixa 180px (placeholder cinza #c4c4c4)
- Abaixo: rótulo categoria (Inter 11px, blue-500, caps, tracking 2px), título (Inter SemiBold 20px), descrição (Inter 14px, text-muted, `margin-top:auto`)
- Card inteiro clicável

## 2.3 Navegação

### Barra utilitária (topo absoluto, h50px)
- glass-nav (blur 26.5px, fundo rgba(21,40,82,0.20))
- Conteúdo alinhado à direita, padding: 0 160px
- Links secundários: Inter 12px branco (Glossário · Imprensa · Casos de Uso), separadores verticais (1px×15px, branco 30%)
- Bandeiras: 25×25px, border-radius 50%

### Nav principal (espaçamento exato do Figma)
- **Top:** 83px do início do frame (= 33px abaixo da barra utilitária)
- **Padding lateral:** 158px (alinhado com sanga)
- **Logo:** 117×114px, flex-shrink:0
- **Gap logo → primeiro link:** 127px (margin-right na logo)
- **Gap entre links:** 73px
- **Links:** Inter Medium 14px branco, align-items:center (centralizados verticalmente com a logo)
- **Botões:** margin-left:auto (empurrados pra direita)
  - "ACESSAR PORTAL": escala menu (34px), variante cyan, com círculo+seta
  - "CONECTE-SE": escala menu (34px), fundo navy-700, sem círculo

### Implementação CSS do nav
```css
.nav {
  position: absolute;
  top: 83px;
  left: 0; right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 0 158px;
}
.nav-logo { flex-shrink: 0; margin-right: 127px; }
.nav-links { display: flex; gap: 73px; }
.nav-btns { display: flex; gap: 12px; margin-left: auto; }
```

## 2.4 Componente: selo rotativo (Manifesto)
- SVG circular com texto em textPath
- Globo lime centralizado
- Animação: rotate 360° contínuo, ~25s, linear

## 2.5 Componente: carrossel de logos (Parceiros)
- Cards 303×125px, raio 10px
- Scroll automático contínuo (~30-40s ciclo)
- Fade-out nas extremidades
- Hover: zoom 1.05 (200ms)

## 2.6 Componente: timeline circular (Jornada Global)
- 6 círculos com foto (placeholder cinza #c4c4c4), linha horizontal
- Default 160px; Ativo (hover) 180px + SVG decorativo + pill tag
- Hover only, sem auto-play, um ativo por vez

## 2.7 Componente: lista numerada (Governança)
- Itens separados por linhas brancas, espaçamento 64px
- Texto Inter 16px branco à esquerda
- Número Luxenta 30px branco à direita
- Sobre fundo blue-500

---

# 3. SEÇÕES DA HOME

## S1. Hero (100vh)
- Imagem full-bleed (sem overlay por default — degradê adicionado separadamente se necessário)
- Conteúdo na sanga de 160px
- Rótulo "olho" Inter 500 13px, tracking 5.85px, MAIÚSCULO, branco 50%
- H1 Luxenta 400 65px (off-white #f5f4f4 + branco #fff + lime #d2e718)
- Corpo Inter 400 18px, line-height 36px, cor #d6d6d6, max-width 593px
- 2 CTAs grandes (62px): primário (blue) + destaque (lime)
- 4 glass cards em diagonal (posição absoluta, coordenadas em %)
- Nav: barra utilitária + nav principal com espaçamentos exatos

### Posições dos glass cards (% do viewport, responsivo)
```css
.gc1 { right: 37.4%; top: 47.4% } /* 10 anos — accent cyan */
.gc2 { right: 17%;   top: 56%   } /* Presença — pill */
.gc3 { right: 31.9%; top: 73%   } /* 4 edições NY — pill */
.gc4 { right: 12.7%; top: 81%   } /* 15 edições — accent lime */
```

## S2. Manifesto (100vh)
- Gradiente diagonal branco → lime
- Imagem lado esquerdo (placeholder cinza #c4c4c4)
- 4 círculos glass-circle com ícones Lucide, linhas curvas lime animadas
- Selo rotativo canto superior direito
- Título H1 65px + corpo 18px
- 2 CTAs grandes: "Assistir Vídeo" (primário) + "Leia nosso manifesto completo" (escuro)
- Watermark "HUB PAN" Axiforma, opacidade 40%, blend overlay

## S3. Plataformas Estratégicas (>100vh)
- Fundo gray-150 #ebebeb
- Rótulo + H2 50px
- Linha 1: 3 cards accordion
- Gap 32px
- Linha 2: 4 cards plataforma

## S4. Autoridade & Presença (100vh)
- Fundo blue-500
- Rótulo + H1 65px (branco + lime) + descrição 16px
- Tags/pills de localização: pill, borda branca 70%, Inter Medium 16px, h40px, grid 3+3, gap 12px
- Vídeo autoplay mudo loop (placeholder cinza #c4c4c4)
- 5 logos brancos
- Botão grande destaque (lime)

## S5. Jornada Global (100vh)
- Gradiente branco → lime
- Rótulo + H2 50px
- "Desde 2017" decorativo Luxenta 280px lime
- Timeline 6 círculos com hover

## S6. Números Validados (~2/3 vh)
- Fundo gray-150 #ebebeb
- Rótulo + H2 50px
- Grid 4 cards número

## S7. Para Quem É o HUB PAN (100vh)
- Fundo branco
- Rótulo + H2 50px + descrição 16px
- Grid 5 cards persona (ziguezague, hover lime)

## S8. Governança Global (100vh)
- Layout 3/5 + 2/5
- Esquerda: imagem (placeholder cinza #c4c4c4) + overlay, rótulo + H2 50px, 4 cards glass-card (2×2, gap 24px)
- Direita: fundo blue-500, H2 50px, lista numerada 5 itens, botão grande destaque

## S9. HUB PAN Insights
- Fundo branco
- Rótulo + H2 50px + botão "Ver todos" (médio, primário) alinhado à direita
- Grid 3 cards insight

## S10. Parceiros Estratégicos
- Fundo gray-100 #f5f5f5
- Rótulo + H2 50px + botão grande (escuro)
- Carrossel de logos

## S11. Newsletter
- Campo de email + botão "Inscreva-se"

## S12. Rodapé
- Fundo navy-700
- Logo, descrição, 3 colunas de links, barra inferior com copyright

---

# 4. MAPA DO SITE (páginas a gerar)

- **Institucional:** O HUB PAN ✅ · Manifesto · Legado · Governança · Imprensa
- **Plataformas:** PROINTER · Fórum Mundial de IA · GovIA · Academy · Alliance
- **Conteúdo:** Insights / Newsletter
- **Contato / Conecte-se**

Cada página reutiliza: nav, rodapé, tokens, catálogo de cards, ritmo de seção.

---

# 5.5 PADRÃO DE PÁGINAS INTERNAS (validado em O HUB PAN — replicar nas próximas)

A página **O HUB PAN** (`src/pages/institucional/index.tsx`) é a referência de
qualidade/consistência pra todas as páginas internas seguintes (PROINTER, GovIA,
Fórum Mundial de IA, Insights, Contato). Antes de criar uma página nova, releia
este bloco e o arquivo inteiro dessa página como exemplo vivo.

## 5.5.1 Hero 80vh + faixa de números 20vh
- Seção única dividida em duas partes: imagem de fundo full-bleed ocupando **80vh**
  (`h-[80vh] min-h-[560px]`) + faixa de estatísticas em destaque ocupando os
  **20vh** restantes (`h-[20vh] min-h-[150px]`) logo abaixo, sem gap entre elas.
- Fundo da imagem: overlay em degradê horizontal escuro→transparente
  (`linear-gradient(90deg, rgba(6,9,25,0.93) 0%, ... 0.35% 100%)`) + máscara
  inferior suave pra transicionar pra faixa de números.
- **Sem breadcrumb no topo** — decisão explícita do cliente, não usar em nenhuma
  página (nem a home nem as internas). O `PageHero.tsx` reutilizável já não tem
  mais essa prop.
- Rótulo "olho" do hero: sempre o padrão inline do hero da home — Inter 500 13px,
  tracking 5.85px, branco 50% (`color: rgba(255,255,255,0.5)`) — **não usar** a
  classe `.eyebrow` genérica aqui (essa é maior, 16px, feita pra rótulos de seção).
- H1: Luxenta 400, `clamp(32px, 3vw + 18px, 62px)`, `lineHeight: 1`, quebras de
  linha manuais (`<br />`) pra melhor encaixe — não depender de quebra automática.
- CTAs: 1 botão `lime` (ação principal) + 1 botão `blue` (ação secundária, ex.
  "Leia o manifesto") — nunca `outline-light` como secundário nesse contexto,
  fica sem contraste suficiente sobre foto.
- **Faixa de números (20vh):** grid 3/6 colunas, números `Counter` animado
  (conta de 0 até o valor ao entrar na viewport), Luxenta `clamp(34px,3vw,56px)`
  `lineHeight:1`, um dos valores em lime pra destaque (ex. "ONU"), rótulo Inter
  10.5px tracking 1.6px caps cinza (#a7a4a4), separador vertical entre colunas
  (`border-l border-white/10` a partir da 2ª coluna).
- **Cor de fundo da faixa de números — variar por página** (identidade visual por
  seção do site, evita repetir sempre navy900): ver tabela de atribuição em
  §5.5.5. Ajustar cor do texto/números/separadores pra manter contraste em cada
  fundo (ver §5.5.5).

## 5.5.2 Bento grid de presença/território (tiles mistos)
- Tipo `Tile` com 3 variantes de `kind`: `photocard` (foto em cima + card branco
  com infos embaixo — usar pra 2 tiles "âncora", maiores), `image` (foto full
  com overlay gradiente — usar pra tiles de destaque fotográfico simples) e
  `typo` (tile colorido tipográfico com ícone Lucide, que revela a foto no hover).
- Tiles `typo` usam `TILE_COLORS` (navy/blue/lime/white) — objeto com
  `bg/text/sub/tagBorder/tagText/iconBg/iconColor` por cor. Ao adicionar uma cor
  nova, sempre definir os 7 campos, senão a variante quebra.
- **Cards claros** (`lime`, `white`) precisam de `isLight` → no hover (foto +
  camada preta 55%), texto e borda da tag viram brancos, senão o texto escuro
  some sobre o fundo escurecido. Cards escuros (`navy`, `blue`) não precisam
  dessa troca, já têm contraste.
- Tile `white` leva borda sutil `1px solid #ecedf0` (senão some no fundo
  `gray-100` da seção).
- Hover: ícone (56px, círculo, `iconBg`) some, foto aparece (`opacity 0→100,
  scale 110→100`, 500ms ease-out), camada preta 55% garante contraste do texto.

## 5.5.3 Timeline de trajetória (scroll-linked)
- Ano gigante centralizado + infos em ziguezague (uma de cada lado) + trilho
  vertical central com linha de progresso lime que "desenha" conforme o scroll
  (`gsap.fromTo(scaleY 0→1)`, `scrollTrigger: { scrub: 0.6 }`, `transformOrigin:
  'top center'`).
- **Trilho e linha de progresso vão até a borda real da seção** — o padding
  inferior da seção deve estar no wrapper do trilho (`pb-24 lg:pb-32` no div
  `relative` que envolve o trilho), não no `<section>`, senão a linha para antes
  do fim visual da seção e "flutua" sem encostar na próxima.
- Reveal bidirecional (`useRevealBidirectional`) nos itens — aparecem ao descer,
  desaparecem ao subir. Bolinhas do trilho sempre sem preenchimento (outline).

## 5.5.4 Cards com hover GSAP (Governança e similares)
- Hover recolore o glass card inteiro (fundo transparente→branco, título→navy,
  texto→cinza, círculo do ícone→lime, ícone→navy) via GSAP `.to()`, não CSS
  transition simples — permite orquestrar múltiplas propriedades com timing
  único e reverter suavemente no mouseleave.
- Tilt de perspectiva (`useTilt` hook, `src/components/useTilt.ts`) — inclinação
  3D seguindo o cursor via `gsap.quickTo('rotationX'/'rotationY')`,
  `transformPerspective: 900`, reset suave no mouseleave. Usar em qualquer grid
  de cards "premium" (governança, cards de plataforma, etc.) pra dar
  sofisticação sem jank.

## 5.5.5 Cor da faixa de números (20vh) por página — variar identidade
Fundo padrão é `navy900` (usado em O HUB PAN). Nas próximas páginas, variar
conforme o tema, mantendo números em Luxenta branco (ou navy se o fundo for
claro) e 1 valor em destaque:

| Página | Fundo sugerido | Números | Detalhe/destaque |
|---|---|---|---|
| O HUB PAN | navy900 `#060919` | branco | 1 valor em lime |
| PROINTER | blue-500 `#2d4ebf` | branco | 1 valor em lime |
| GovIA | navy-700 `#152852` | branco | 1 valor em cyan `#00e4ff` |
| Fórum Mundial de IA | lime-400 `#d2e718` | navy `#152852` | 1 valor em navy com peso maior, sem "cor de destaque" separada (lime já é o destaque) |
| Insights | gray-100 `#f5f5f5` | navy `#152852` | 1 valor em blue-500 |

**Confirmar com o cliente antes de aplicar** — essa tabela é uma proposta, não
regra fechada; ajustar conforme feedback específico de cada página.

---

# 5. STACK TÉCNICA

## 5.1 Dependências
- **React + Vite** (default Lovable)
- **Tailwind CSS** + CSS custom properties para tokens
- **shadcn/ui** (Radix UI) — componentes headless de comportamento
- **GSAP + ScrollTrigger + @gsap/react** — animações
- **Lucide React** — ícones

## 5.2 shadcn/ui — mapeamento

| Componente | Uso no HUB PAN |
|---|---|
| `Tabs` | S3 Accordion plataformas (tab = card, auto-play 5s), S5 Timeline (tab = círculo) |
| `NavigationMenu` | Nav principal (6 links + futuros dropdowns) |
| `Sheet` | Menu mobile (hamburger → painel lateral) |
| `Dialog` | Modal de vídeo (S4 Autoridade) |
| `ScrollArea` | Wrapper carrossel logos (S10 Parceiros) |
| `Input` | Campo email newsletter (S11) |
| `Accordion` | Uso futuro (FAQ, etc.) |

**Regra:** shadcn fornece comportamento (acessibilidade, teclado, aria). Todo visual vem do design system (cores, fontes, raios, espaçamentos). Nunca usar os estilos default do shadcn.

## 5.3 GSAP — padrões

**Scroll reveal global:** Adicionar `data-animate` em títulos, cards, blocos. GSAP anima `{ y:16, opacity:0, duration:0.4, stagger:0.1 }` com ScrollTrigger `start: 'top 80%'`.

**Cleanup:** Sempre usar `gsap.context()` com `.revert()` no cleanup do useLayoutEffect.

**Transições de tabs (S3):** `gsap.to` width + opacity do conteúdo, 0.4s ease-out. Auto-play via setInterval 5s, pausar no hover.

**Carrossel (S10):** `gsap.to` translateX loop infinito, ~35s, ease "none". Duplicar logos pra seamless. Fade nas bordas via CSS mask-image.

**Linhas SVG (S2, S5):** stroke-dashoffset 100%→0, ScrollTrigger scrub:true.

## 5.4 Nav Mobile (< 1024px)
- Hamburger (Lucide `Menu`, 24px) canto direito
- Abre `Sheet` shadcn (side="right")
- Conteúdo: logo topo, links empilhados (Inter Medium 18px, gap 32px), botões CTA na base
- Fechar: ícone X ou overlay
