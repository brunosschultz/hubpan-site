/**
 * Utilidades de Velocidade do Painel Admin — funções puras, mesmo padrão
 * de `seo.ts`. Não faz o fetch (isso fica no componente, igual à SEO) —
 * só transforma o JSON cru do PageSpeed Insights num formato limpo.
 */

import type { SeoLevel } from './seo';

export interface PerfOpportunity {
  id: string;
  title: string;
  savingsMs: number;
}

export interface PerfAudit {
  score: number; // 0–1, escala do Lighthouse
  lcpMs: number;
  cls: number;
  tbtMs: number;
  opportunities: PerfOpportunity[]; // ordenadas por economia estimada, até 6
}

/** Acesso defensivo — o JSON do PageSpeed é grande e nem todo campo
 * sempre existe (depende da página analisada). */
export function parsePerfResult(json: any): PerfAudit {
  const audits = json?.lighthouseResult?.audits ?? {};
  const score = json?.lighthouseResult?.categories?.performance?.score ?? 0;

  const opportunities: PerfOpportunity[] = Object.entries(audits)
    .filter(([, a]: [string, any]) => a?.details?.type === 'opportunity' && (a.details.overallSavingsMs ?? 0) > 0)
    .map(([id, a]: [string, any]) => ({ id, title: a.title ?? id, savingsMs: a.details.overallSavingsMs }))
    .sort((a, b) => b.savingsMs - a.savingsMs)
    .slice(0, 6);

  return {
    score,
    lcpMs: audits['largest-contentful-paint']?.numericValue ?? 0,
    cls: audits['cumulative-layout-shift']?.numericValue ?? 0,
    tbtMs: audits['total-blocking-time']?.numericValue ?? 0,
    opportunities,
  };
}

/** Mesmos limiares do Lighthouse (0–89 = atenção/ruim, 90+ = bom) —
 * reaproveita o `SeoLevel` de `seo.ts`, é o mesmo enum de 3 níveis. */
export function perfLevel(score: number): SeoLevel {
  if (score >= 0.9) return 'good';
  if (score >= 0.5) return 'warning';
  return 'bad';
}

export function buildPerfSummary({
  pageLabel, url, audit, levelLabel,
}: { pageLabel: string; url: string; audit: PerfAudit; levelLabel: string }): string {
  const lines = [
    `Página: ${pageLabel} (${url})`,
    '',
    `Nota de performance (mobile): ${Math.round(audit.score * 100)}/100 — ${levelLabel}`,
    `LCP (maior elemento visível carregado): ${(audit.lcpMs / 1000).toFixed(1)}s`,
    `CLS (estabilidade visual): ${audit.cls.toFixed(3)}`,
    `TBT (tempo bloqueado por JS): ${Math.round(audit.tbtMs)}ms`,
    '',
    'Oportunidades de melhoria:',
    ...(audit.opportunities.length > 0
      ? audit.opportunities.map((o) => `- ${o.title} (~${Math.round(o.savingsMs)}ms de economia estimada)`)
      : ['- (nenhuma oportunidade relevante encontrada)']),
  ];
  return lines.join('\n');
}
