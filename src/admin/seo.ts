/**
 * Utilidades de SEO do Painel Admin — funções puras, sem dependência de
 * React, fáceis de revisar/testar isoladas do resto do editor.
 */

/** slug '' (home) vira 'home' na chave — evita a chave feia "seo..title". */
function normalizeSlug(slug: string): string {
  return slug || 'home';
}

export type SeoField = 'title' | 'description' | 'noindex' | 'keyword';

/** Chave em `content_overrides` pra um campo de SEO de uma página. */
export function seoKey(slug: string, field: SeoField): string {
  return `seo.${normalizeSlug(slug)}.${field}`;
}

export type SeoLevel = 'good' | 'warning' | 'bad';

export interface SeoStatus {
  level: SeoLevel;
  issues: string[];
}

const TITLE_MIN = 40;
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 160;

/**
 * Heurística tipo Yoast/Rank Math — nada de IA, só faixas de tamanho
 * conhecidas por funcionarem bem em resultados de busca. `title`/
 * `description` vazios contam como "usando o padrão do código" — aqui
 * só avaliamos o texto que efetivamente será exibido (já resolvido com
 * fallback), não se é override ou não.
 */
export function computeSeoStatus({ title, description }: { title: string; description: string }): SeoStatus {
  const issues: string[] = [];
  let bad = false;

  if (!title.trim()) {
    issues.push('Sem título definido.');
    bad = true;
  } else if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
    issues.push(`Título com ${title.length} caracteres — ideal entre ${TITLE_MIN} e ${TITLE_MAX}.`);
  }

  if (!description.trim()) {
    issues.push('Sem descrição definida.');
    bad = true;
  } else if (description.length < DESC_MIN || description.length > DESC_MAX) {
    issues.push(`Descrição com ${description.length} caracteres — ideal entre ${DESC_MIN} e ${DESC_MAX}.`);
  }

  const level: SeoLevel = bad ? 'bad' : issues.length > 0 ? 'warning' : 'good';
  return { level, issues };
}

export const SEO_LEVEL_LABEL: Record<SeoLevel, string> = {
  good: 'Bom',
  warning: 'Atenção',
  bad: 'Precisa de ajuste',
};

/** Chaves de `t` (theme.ts) — resolvidas no componente pra não importar
 * React/CSS aqui, mantendo `seo.ts` uma função pura sem dependências. */
export const SEO_LEVEL_TOKEN: Record<SeoLevel, 'success' | 'warning' | 'destructive'> = {
  good: 'success',
  warning: 'warning',
  bad: 'destructive',
};

/* ═══════════ Auditoria on-page ═══════════
   Lê o HTML PUBLICADO de verdade (pré-renderizado pelo SSG) e analisa
   estrutura de título, contagem de palavras, alt text de imagem e uso da
   palavra-chave — tudo só-leitura. Não edita nada: quando aparece um
   problema, o ajuste é feito direto no código (ex: via chat), não por um
   formulário no painel. */

export interface OnPageAudit {
  wordCount: number;
  h1: string[];
  h2: string[];
  images: { src: string; alt: string }[];
  issues: string[];
}

const MIN_WORDS = 300;

export function auditHtml(html: string, keyword: string): OnPageAudit {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const scope = doc.querySelector('main') ?? doc.body;

  const text = (scope.textContent ?? '').replace(/\s+/g, ' ').trim();
  const wordCount = text ? text.split(' ').length : 0;
  const h1 = [...scope.querySelectorAll('h1')].map((el) => (el.textContent ?? '').trim()).filter(Boolean);
  const h2 = [...scope.querySelectorAll('h2')].map((el) => (el.textContent ?? '').trim()).filter(Boolean);
  const images = [...scope.querySelectorAll('img')].map((el) => ({
    src: el.getAttribute('src') ?? '',
    alt: el.getAttribute('alt') ?? '',
  }));

  const issues: string[] = [];
  if (h1.length === 0) issues.push('Nenhum H1 encontrado na página.');
  if (h1.length > 1) issues.push(`${h1.length} tags H1 na página — o ideal é ter só uma.`);
  if (h2.length === 0) issues.push('Nenhum H2 encontrado — subtítulos ajudam a estruturar o conteúdo pro Google.');
  if (wordCount < MIN_WORDS) issues.push(`Só ${wordCount} palavras de texto na página — abaixo de ${MIN_WORDS} costuma rankear pior.`);

  const missingAlt = images.filter((img) => !img.alt.trim());
  if (missingAlt.length > 0) issues.push(`${missingAlt.length} de ${images.length} imagens sem texto alternativo (alt).`);

  const kw = keyword.trim().toLowerCase();
  if (kw) {
    if (!h1.some((h) => h.toLowerCase().includes(kw))) issues.push(`Palavra-chave "${keyword}" não aparece no H1.`);
    if (!text.toLowerCase().includes(kw)) issues.push(`Palavra-chave "${keyword}" não aparece no texto da página.`);
  }

  return { wordCount, h1, h2, images, issues };
}
