/**
 * Utilidades de SEO do Painel Admin — funções puras, sem dependência de
 * React, fáceis de revisar/testar isoladas do resto do editor.
 */

/** slug '' (home) vira 'home' na chave — evita a chave feia "seo..title". */
function normalizeSlug(slug: string): string {
  return slug || 'home';
}

export type SeoField = 'title' | 'description' | 'noindex';

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
