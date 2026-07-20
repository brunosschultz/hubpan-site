/**
 * Utilidades de SEO do Painel Admin — funções puras, sem dependência de
 * React, fáceis de revisar/testar isoladas do resto do editor.
 */

/** slug '' (home) vira 'home' na chave — evita a chave feia "seo..title". */
function normalizeSlug(slug: string): string {
  return slug || 'home';
}

export type SeoField = 'title' | 'description' | 'noindex' | 'keyword' | 'image';

/** Chave em `content_overrides` pra um campo de SEO de uma página. */
export function seoKey(slug: string, field: SeoField): string {
  return `seo.${normalizeSlug(slug)}.${field}`;
}

export type SeoLevel = 'good' | 'warning' | 'bad';

/** Chaves de `t` (theme.ts) — resolvidas no componente pra não importar
 * React/CSS aqui, mantendo `seo.ts` uma função pura sem dependências. */
export const SEO_LEVEL_TOKEN: Record<SeoLevel, 'success' | 'warning' | 'destructive'> = {
  good: 'success',
  warning: 'warning',
  bad: 'destructive',
};

export const SEO_LEVEL_LABEL: Record<SeoLevel, string> = {
  good: 'Bom',
  warning: 'Atenção',
  bad: 'Precisa de ajuste',
};

const TITLE_MIN = 40;
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 160;
const MIN_WORDS = 300;

/**
 * Versão rápida (só título/descrição, sem buscar a página publicada) —
 * usada no Dashboard e na lista de SEO, onde buscar o HTML de todas as
 * páginas de uma vez seria lento. O checklist completo (`buildSeoChecklist`)
 * é só na tela de edição de cada página, que já busca o HTML mesmo assim.
 */
export function quickSeoLevel({ title, description }: { title: string; description: string }): SeoLevel {
  if (!title.trim() || !description.trim()) return 'bad';
  const titleOk = title.length >= TITLE_MIN && title.length <= TITLE_MAX;
  const descOk = description.length >= DESC_MIN && description.length <= DESC_MAX;
  return titleOk && descOk ? 'good' : 'warning';
}

/* ═══════════ Auditoria on-page ═══════════
   Lê o HTML PUBLICADO de verdade (pré-renderizado pelo SSG) e extrai os
   dados brutos — contagem de palavras, H1/H2, imagens — que depois viram
   o checklist visual em `buildSeoChecklist()`. Tudo só-leitura: quando
   aparece um problema, o ajuste é feito direto no código (ex: via chat),
   não por um formulário no painel. */

export interface OnPageAudit {
  wordCount: number;
  h1: string[];
  h2: string[];
  /** `decorative` = tem `alt=""` explícito no HTML (correto pra imagem
   * puramente decorativa — pede pro leitor de tela pular) — diferente de
   * não ter o atributo `alt` de jeito nenhum, que é o problema de verdade. */
  images: { src: string; alt: string; decorative: boolean }[];
  /** Só as que realmente não têm o atributo `alt` — decorativas não contam. */
  imagesMissingAlt: { src: string }[];
}

export function auditHtml(html: string): OnPageAudit {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  /* <br> não vira espaço em .textContent — sem isso, um título com quebra
   * manual tipo "ecossistema<br>global de inovação" (renderiza certinho em
   * duas linhas na página de verdade) vira "ecossistemaglobal de inovação"
   * na extração de texto, um falso problema que não existe no site real. */
  doc.querySelectorAll('br').forEach((br) => br.replaceWith(' '));
  const scope = doc.querySelector('main') ?? doc.body;

  const text = (scope.textContent ?? '').replace(/\s+/g, ' ').trim();
  const wordCount = text ? text.split(' ').length : 0;
  const h1 = [...scope.querySelectorAll('h1')].map((el) => (el.textContent ?? '').trim()).filter(Boolean);
  const h2 = [...scope.querySelectorAll('h2')].map((el) => (el.textContent ?? '').trim()).filter(Boolean);
  const images = [...scope.querySelectorAll('img')].map((el) => {
    const hasAlt = el.hasAttribute('alt');
    const alt = el.getAttribute('alt') ?? '';
    return { src: el.getAttribute('src') ?? '', alt, decorative: hasAlt && !alt.trim() };
  });
  const imagesMissingAlt = images.filter((img) => !img.decorative && !img.alt.trim()).map((img) => ({ src: img.src }));

  return { wordCount, h1, h2, images, imagesMissingAlt };
}

/* ═══════════ Checklist visual ═══════════
   Cada critério de SEO vira um item com veredito próprio (bom/atenção/
   ruim/não avaliado) — pra sempre mostrar tanto os acertos (check verde)
   quanto os problemas, não só uma lista de erros. Pedido explícito do
   Bruno: "quero ver os acertos também, não só quando está errado". */

export type CheckLevel = SeoLevel | 'neutral';

export interface SeoCheck {
  id: string;
  label: string;
  level: CheckLevel;
  detail: string;
}

/** pega palavra a palavra dentro de frases maiores — evita "ia" achar "diagnóstico" */
function containsPhrase(haystack: string, needle: string): boolean {
  if (!needle.trim()) return false;
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}

export function buildSeoChecklist({
  title, description, keyword, audit,
}: { title: string; description: string; keyword: string; audit: OnPageAudit }): SeoCheck[] {
  const checks: SeoCheck[] = [];
  const h1Text = audit.h1.join(' ');

  // Título
  if (!title.trim()) {
    checks.push({ id: 'titulo', label: 'Título definido', level: 'bad', detail: 'Nenhum título de SEO definido pra essa página.' });
  } else if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
    checks.push({ id: 'titulo', label: 'Tamanho do título', level: 'warning', detail: `${title.length} caracteres — ideal entre ${TITLE_MIN} e ${TITLE_MAX}.` });
  } else {
    checks.push({ id: 'titulo', label: 'Tamanho do título', level: 'good', detail: `${title.length} caracteres — dentro do ideal (${TITLE_MIN}–${TITLE_MAX}).` });
  }

  // Descrição
  if (!description.trim()) {
    checks.push({ id: 'descricao', label: 'Descrição definida', level: 'bad', detail: 'Nenhuma descrição de SEO definida pra essa página.' });
  } else if (description.length < DESC_MIN || description.length > DESC_MAX) {
    checks.push({ id: 'descricao', label: 'Tamanho da descrição', level: 'warning', detail: `${description.length} caracteres — ideal entre ${DESC_MIN} e ${DESC_MAX}.` });
  } else {
    checks.push({ id: 'descricao', label: 'Tamanho da descrição', level: 'good', detail: `${description.length} caracteres — dentro do ideal (${DESC_MIN}–${DESC_MAX}).` });
  }

  // H1
  if (audit.h1.length === 1) {
    checks.push({ id: 'h1', label: 'H1 único na página', level: 'good', detail: `"${audit.h1[0]}"` });
  } else if (audit.h1.length === 0) {
    checks.push({ id: 'h1', label: 'H1 único na página', level: 'bad', detail: 'Nenhum H1 encontrado.' });
  } else {
    checks.push({ id: 'h1', label: 'H1 único na página', level: 'warning', detail: `${audit.h1.length} tags H1 encontradas — o ideal é ter só uma.` });
  }

  // H2
  if (audit.h2.length > 0) {
    checks.push({ id: 'h2', label: 'Subtítulos (H2) estruturando o conteúdo', level: 'good', detail: `${audit.h2.length} encontrados.` });
  } else {
    checks.push({ id: 'h2', label: 'Subtítulos (H2) estruturando o conteúdo', level: 'warning', detail: 'Nenhum H2 encontrado — considere adicionar subtítulos.' });
  }

  // Contagem de palavras
  if (audit.wordCount >= MIN_WORDS) {
    checks.push({ id: 'palavras', label: 'Quantidade de texto', level: 'good', detail: `${audit.wordCount} palavras — acima do mínimo (${MIN_WORDS}).` });
  } else {
    checks.push({ id: 'palavras', label: 'Quantidade de texto', level: 'warning', detail: `${audit.wordCount} palavras — abaixo do mínimo (${MIN_WORDS}) costuma rankear pior.` });
  }

  // Imagens com alt
  if (audit.imagesMissingAlt.length === 0) {
    checks.push({ id: 'imagens', label: 'Imagens com texto alternativo', level: 'good', detail: `${audit.images.length} de ${audit.images.length} imagens OK.` });
  } else {
    checks.push({
      id: 'imagens', label: 'Imagens com texto alternativo', level: 'bad',
      detail: `${audit.imagesMissingAlt.length} de ${audit.images.length} sem alt: ${audit.imagesMissingAlt.map((i) => i.src.split('/').pop()).join(', ')}`,
    });
  }

  // Palavra-chave — cada checagem fica "neutral" (não avaliada) se não houver palavra-chave definida
  const kw = keyword.trim();
  if (!kw) {
    checks.push({ id: 'kw-definida', label: 'Palavra-chave definida', level: 'neutral', detail: 'Opcional — defina uma pra ativar as checagens abaixo.' });
  } else {
    checks.push({ id: 'kw-definida', label: 'Palavra-chave definida', level: 'good', detail: `"${keyword}"` });
    checks.push({
      id: 'kw-titulo', label: 'Palavra-chave no título', level: containsPhrase(title, kw) ? 'good' : 'warning',
      detail: containsPhrase(title, kw) ? 'Aparece no título.' : 'Não aparece no título.',
    });
    checks.push({
      id: 'kw-descricao', label: 'Palavra-chave na descrição', level: containsPhrase(description, kw) ? 'good' : 'warning',
      detail: containsPhrase(description, kw) ? 'Aparece na descrição.' : 'Não aparece na descrição.',
    });
    checks.push({
      id: 'kw-h1', label: 'Palavra-chave no H1', level: containsPhrase(h1Text, kw) ? 'good' : 'warning',
      detail: containsPhrase(h1Text, kw) ? 'Aparece no H1.' : 'Não aparece no H1.',
    });
  }

  return checks;
}

export function overallLevel(checks: SeoCheck[]): SeoLevel {
  if (checks.some((c) => c.level === 'bad')) return 'bad';
  if (checks.some((c) => c.level === 'warning')) return 'warning';
  return 'good';
}

/**
 * Texto pronto pra colar no chat — o Bruno pediu um jeito rápido de trazer
 * o diagnóstico sem ter que descrever cada item manualmente.
 */
export function buildAuditSummary(input: {
  pageLabel: string;
  url: string;
  title: string;
  description: string;
  keyword: string;
  audit: OnPageAudit;
  checks: SeoCheck[];
}): string {
  const { pageLabel, url, checks } = input;
  const good = checks.filter((c) => c.level === 'good');
  const rest = checks.filter((c) => c.level !== 'good');
  const lines = [
    `Página: ${pageLabel} (${url})`,
    '',
    'Certo:',
    ...(good.length > 0 ? good.map((c) => `- ${c.label}: ${c.detail}`) : ['- (nada ainda)']),
    '',
    'Pra revisar:',
    ...(rest.length > 0 ? rest.map((c) => `- [${c.level === 'bad' ? '!' : c.level === 'warning' ? '?' : '-'}] ${c.label}: ${c.detail}`) : ['- (nada — tudo certo)']),
  ];
  return lines.join('\n');
}
