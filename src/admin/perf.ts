/**
 * Utilidades de Velocidade do Painel Admin — funções puras, mesmo padrão
 * de `seo.ts`. Não faz o fetch (isso fica no componente, igual à SEO) —
 * só transforma o JSON cru do PageSpeed Insights num formato limpo.
 */

import type { SeoLevel } from './seo';

/** Mesmos limiares do Lighthouse (0–89 = atenção/ruim, 90+ = bom). */
export function perfLevel(score: number): SeoLevel {
  if (score >= 0.9) return 'good';
  if (score >= 0.5) return 'warning';
  return 'bad';
}

/** Descrições do Lighthouse vêm em Markdown com link tipo "[texto](url)"
 * — troca por só o texto, sem link solto atrapalhando a leitura. */
function stripMarkdownLink(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
}

/** As 5 métricas que compõem a nota geral do Lighthouse, cada uma com o
 * peso indicado — não é um número aleatório, é o que o próprio Google usa
 * (FCP 10%, LCP 25%, TBT 30%, CLS 25%, Speed Index 10%). */
const METRIC_DEFS = [
  {
    id: 'first-contentful-paint', label: 'FCP',
    explanation: 'Tempo até o primeiro conteúdo (texto ou imagem) aparecer na tela.',
    format: (ms: number) => `${(ms / 1000).toFixed(1)}s`,
  },
  {
    id: 'largest-contentful-paint', label: 'LCP',
    explanation: 'Tempo até o maior bloco visível (geralmente a imagem ou título principal) terminar de carregar.',
    format: (ms: number) => `${(ms / 1000).toFixed(1)}s`,
  },
  {
    id: 'total-blocking-time', label: 'TBT',
    explanation: 'Quanto tempo o JavaScript trava a página, impedindo o visitante de interagir.',
    format: (ms: number) => `${Math.round(ms)}ms`,
  },
  {
    id: 'cumulative-layout-shift', label: 'CLS',
    explanation: 'O quanto os elementos "pulam" de lugar enquanto a página carrega — incomoda o usuário.',
    format: (ms: number) => ms.toFixed(3),
  },
  {
    id: 'speed-index', label: 'Speed Index',
    explanation: 'Quão rápido o conteúdo visível vai sendo preenchido, de forma geral.',
    format: (ms: number) => `${(ms / 1000).toFixed(1)}s`,
  },
] as const;

const METRIC_IDS = new Set<string>(METRIC_DEFS.map((m) => m.id));

export interface PerfMetric {
  id: string;
  label: string;
  explanation: string;
  value: string;
  level: SeoLevel;
}

export interface PerfCheck {
  id: string;
  label: string;
  level: SeoLevel;
  detail: string;
  /** true pra achados relacionados a imagem (ex: uses-optimized-images,
   * unsized-images) — merece atenção especial: mudar isso quase sempre
   * envolve um trade-off de qualidade visual, diferente de um ajuste
   * puramente técnico de código. Detectado pelo `id` do audit (nunca
   * muda de idioma, ao contrário do `label`). */
  isImage: boolean;
}

export interface PerfAudit {
  score: number; // 0–1, escala do Lighthouse
  metrics: PerfMetric[];
  checks: PerfCheck[]; // ordenados por impacto — pior primeiro
  passedCount: number; // quantas outras verificações passaram sem problema
}

export interface PerfAuditPair {
  mobile: PerfAudit;
  desktop: PerfAudit;
}

const RELEVANT_DISPLAY_MODES = new Set(['numeric', 'binary', 'metricSavings']);

/** Acesso defensivo — o JSON do PageSpeed é grande e nem todo campo
 * sempre existe (depende da página analisada). */
export function parsePerfResult(json: any): PerfAudit {
  const audits = json?.lighthouseResult?.audits ?? {};
  const score = json?.lighthouseResult?.categories?.performance?.score ?? 0;

  const metrics: PerfMetric[] = METRIC_DEFS.map((def) => {
    const a = audits[def.id] ?? {};
    return {
      id: def.id,
      label: def.label,
      explanation: def.explanation,
      value: def.format(a.numericValue ?? 0),
      level: perfLevel(a.score ?? 0),
    };
  });

  const others = Object.entries(audits).filter(([id, a]: [string, any]) => (
    !METRIC_IDS.has(id) && a?.score !== null && a?.score !== undefined
    && a.score < 0.9 && RELEVANT_DISPLAY_MODES.has(a.scoreDisplayMode)
  )) as [string, any][];

  const checks: PerfCheck[] = others
    .map(([id, a]) => {
      const savingsMs = a.details?.overallSavingsMs;
      const detail = stripMarkdownLink(a.description ?? '') + (savingsMs > 0 ? ` (~${Math.round(savingsMs)}ms de economia estimada)` : '');
      const isImage = id.includes('image') || id.includes('img');
      return { id, label: a.title ?? id, level: perfLevel(a.score), detail, isImage, savingsMs: savingsMs ?? 0 };
    })
    .sort((a, b) => (a.level === b.level ? b.savingsMs - a.savingsMs : (a.level === 'bad' ? -1 : 1)))
    .map(({ id, label, level, detail, isImage }) => ({ id, label, level, detail, isImage }));

  const passedCount = Object.entries(audits).filter(([id, a]: [string, any]) => (
    !METRIC_IDS.has(id) && a?.score !== null && a?.score !== undefined
    && a.score >= 0.9 && RELEVANT_DISPLAY_MODES.has(a.scoreDisplayMode)
  )).length;

  return { score, metrics, checks, passedCount };
}

/** Cópia do audit só com os `checks` cujo id está em `selectedIds` — as
 * métricas-base sempre entram inteiras (não fazem sentido "desmarcar" uma
 * métrica). Usada só na hora de montar o texto de copiar; a exibição do
 * checklist continua mostrando tudo, marcado ou não. */
export function filterAuditChecks(audit: PerfAudit, selectedIds: Set<string>): PerfAudit {
  return { ...audit, checks: audit.checks.filter((c) => selectedIds.has(c.id)) };
}

function buildPlatformSummary(label: string, audit: PerfAudit): string[] {
  const lvl = perfLevel(audit.score);
  return [
    `${label}:`,
    `Nota: ${Math.round(audit.score * 100)}/100 — ${lvl === 'good' ? 'Bom' : lvl === 'warning' ? 'Atenção' : 'Precisa de ajuste'}`,
    ...audit.metrics.map((m) => `${m.label}: ${m.value}`),
    '',
    'Certo:',
    ...(audit.passedCount > 0 ? [`- ${audit.passedCount} outra${audit.passedCount > 1 ? 's' : ''} verificaç${audit.passedCount > 1 ? 'ões' : 'ão'} sem problema.`] : []),
    ...(audit.checks.length === 0 ? ['- (nada mais a destacar)'] : []),
    '',
    'Pra revisar:',
    ...(audit.checks.length > 0 ? audit.checks.map((c) => `- [${c.level === 'bad' ? '!' : '?'}] ${c.label}: ${c.detail}`) : ['- (nada — tudo certo)']),
  ];
}

export function buildPerfSummary({
  pageLabel, url, pair,
}: { pageLabel: string; url: string; pair: PerfAuditPair }): string {
  const lines = [
    `Página: ${pageLabel} (${url})`,
    '',
    ...buildPlatformSummary('Mobile', pair.mobile),
    '',
    ...buildPlatformSummary('Desktop', pair.desktop),
  ];
  return lines.join('\n');
}
