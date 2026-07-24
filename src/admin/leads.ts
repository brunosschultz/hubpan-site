/**
 * Utilidades de Leads do Painel Admin — funções puras, sem dependência de
 * React, mesmo padrão de `seo.ts`.
 */

export type LeadSource =
  | 'contato'
  | 'newsletter'
  | 'prointer_apoio'
  | 'prointer_inscricao'
  | 'govia_demo'
  | 'forum_empresas'
  | 'forum_participantes';

export interface Lead {
  id: string;
  created_at: string;
  source: LeadSource;
  nome: string | null;
  email: string;
  telefone: string | null;
  cargo: string | null;
  perfil: string | null;
  cidade: string | null;
  organizacao: string | null;
  assunto: string | null;
  objetivo: string | null;
  quantidade: string | null;
  mensagem: string | null;
  lida: boolean;
}

export const LEAD_SOURCE_LABEL: Record<LeadSource, string> = {
  contato: 'Contato',
  newsletter: 'Newsletter',
  prointer_apoio: 'PROINTER — Apoio',
  prointer_inscricao: 'PROINTER — Inscrição',
  govia_demo: 'GovIA — Demonstração',
  forum_empresas: 'Fórum — Patrocínio',
  forum_participantes: 'Fórum — Participação',
};

/** Todas as fontes, na ordem usada nas abas do painel. */
export const LEAD_SOURCES: LeadSource[] = [
  'contato', 'newsletter', 'prointer_apoio', 'prointer_inscricao', 'govia_demo', 'forum_empresas', 'forum_participantes',
];

/** Rótulo em português de cada campo extra — cada fonte só preenche os que
 * fazem sentido pra ela (os demais ficam `null`), então a exibição/resumo
 * é sempre dirigida por quais campos vieram preenchidos, não pela fonte. */
export const LEAD_FIELD_LABEL: Record<'telefone' | 'cargo' | 'perfil' | 'cidade' | 'organizacao' | 'assunto' | 'objetivo' | 'quantidade' | 'mensagem', string> = {
  telefone: 'Telefone',
  cargo: 'Cargo',
  perfil: 'Perfil',
  cidade: 'Cidade',
  organizacao: 'Organização',
  assunto: 'Assunto',
  objetivo: 'Objetivo',
  quantidade: 'Quantidade',
  mensagem: 'Mensagem',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' às ' + new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

const EXTRA_FIELDS = ['telefone', 'cargo', 'perfil', 'cidade', 'organizacao', 'assunto', 'objetivo', 'quantidade'] as const;

/** Texto pronto pra colar no chat — resumo de um único lead. */
export function buildLeadSummary(lead: Lead): string {
  const lines = [
    `Lead: ${LEAD_SOURCE_LABEL[lead.source]} — ${formatDate(lead.created_at)}`,
    '',
    ...(lead.nome ? [`Nome: ${lead.nome}`] : []),
    `E-mail: ${lead.email}`,
    ...EXTRA_FIELDS.filter((f) => lead[f]).map((f) => `${LEAD_FIELD_LABEL[f]}: ${lead[f]}`),
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
