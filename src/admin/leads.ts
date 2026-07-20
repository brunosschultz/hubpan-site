/**
 * Utilidades de Leads do Painel Admin — funções puras, sem dependência de
 * React, mesmo padrão de `seo.ts`.
 */

export type LeadSource = 'contato' | 'newsletter';

export interface Lead {
  id: string;
  created_at: string;
  source: LeadSource;
  nome: string | null;
  email: string;
  organizacao: string | null;
  assunto: string | null;
  mensagem: string | null;
  lida: boolean;
}

export const LEAD_SOURCE_LABEL: Record<LeadSource, string> = {
  contato: 'Contato',
  newsletter: 'Newsletter',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' às ' + new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/** Texto pronto pra colar no chat — resumo de um único lead. */
export function buildLeadSummary(lead: Lead): string {
  const lines = [
    `Lead: ${LEAD_SOURCE_LABEL[lead.source]} — ${formatDate(lead.created_at)}`,
    '',
    ...(lead.nome ? [`Nome: ${lead.nome}`] : []),
    `E-mail: ${lead.email}`,
    ...(lead.organizacao ? [`Organização: ${lead.organizacao}`] : []),
    ...(lead.assunto ? [`Assunto: ${lead.assunto}`] : []),
    ...(lead.mensagem ? ['', 'Mensagem:', lead.mensagem] : []),
  ];
  return lines.join('\n');
}

/** Resumo dos leads dos últimos 7 dias ainda não marcados como lidos. */
export function buildWeeklySummary(leads: Lead[]): string {
  const weekAgo = Date.now() - 7 * 86_400_000;
  const pending = leads.filter((l) => !l.lida && new Date(l.created_at).getTime() >= weekAgo);

  if (pending.length === 0) {
    return 'Nenhum lead pendente nos últimos 7 dias — tudo em dia.';
  }

  const lines = [
    `${pending.length} lead${pending.length > 1 ? 's' : ''} da última semana ainda não respondido${pending.length > 1 ? 's' : ''}:`,
    '',
    ...pending.map((l, i) => [
      `${i + 1}. [${LEAD_SOURCE_LABEL[l.source]}] ${l.nome ? `${l.nome} — ` : ''}${l.email} (${formatDate(l.created_at)})`,
      ...(l.assunto ? [`   Assunto: ${l.assunto}`] : []),
      ...(l.mensagem ? [`   Mensagem: ${l.mensagem}`] : []),
    ].join('\n')),
  ];
  return lines.join('\n');
}
