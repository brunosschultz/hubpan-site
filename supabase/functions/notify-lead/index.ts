// Edge Function disparada por um Database Webhook (INSERT em `leads`) —
// manda um e-mail avisando que chegou um lead novo, via Resend.
// Configuração manual necessária (ver CLAUDE.md → seção Painel Admin):
//   1. `supabase secrets set RESEND_API_KEY=...` (chave gerada em resend.com)
//   2. Supabase Dashboard → Database → Webhooks: INSERT em `leads` → esta function
//   3. `supabase functions deploy notify-lead`

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const NOTIFY_TO = Deno.env.get('LEAD_NOTIFY_EMAIL') ?? 'bruno@bddb.com.br';
// `onboarding@resend.dev` funciona sem verificar domínio — trocar por um
// remetente @hubpan.com ou @bddb.com.br depois de verificar o domínio no Resend.
const FROM = Deno.env.get('LEAD_NOTIFY_FROM') ?? 'HUB PAN <onboarding@resend.dev>';

type LeadSource =
  | 'contato' | 'newsletter'
  | 'prointer_apoio' | 'prointer_inscricao'
  | 'govia_demo'
  | 'forum_empresas' | 'forum_participantes';

interface LeadRecord {
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
  created_at: string;
}

const SOURCE_LABEL: Record<LeadSource, string> = {
  contato: 'Contato',
  newsletter: 'Newsletter',
  prointer_apoio: 'PROINTER — Apoio',
  prointer_inscricao: 'PROINTER — Inscrição',
  govia_demo: 'GovIA — Demonstração',
  forum_empresas: 'Fórum — Patrocínio',
  forum_participantes: 'Fórum — Participação',
};

const FIELD_LABEL: Record<'telefone' | 'cargo' | 'perfil' | 'cidade' | 'organizacao' | 'assunto' | 'objetivo' | 'quantidade', string> = {
  telefone: 'Telefone', cargo: 'Cargo', perfil: 'Perfil', cidade: 'Cidade',
  organizacao: 'Organização', assunto: 'Assunto', objetivo: 'Objetivo', quantidade: 'Quantidade',
};

function buildBody(lead: LeadRecord): string {
  const extraFields = (['telefone', 'cargo', 'perfil', 'cidade', 'organizacao', 'assunto', 'objetivo', 'quantidade'] as const)
    .filter((f) => lead[f])
    .map((f) => `${FIELD_LABEL[f]}: ${lead[f]}`);
  const lines = [
    `Novo lead — ${SOURCE_LABEL[lead.source]}`,
    '',
    ...(lead.nome ? [`Nome: ${lead.nome}`] : []),
    `E-mail: ${lead.email}`,
    ...extraFields,
    ...(lead.mensagem ? ['', 'Mensagem:', lead.mensagem] : []),
    '',
    'Veja e responda em /admin/leads.',
  ];
  return lines.join('\n');
}

Deno.serve(async (req) => {
  if (!RESEND_API_KEY) {
    return new Response('RESEND_API_KEY não configurada.', { status: 500 });
  }

  const payload = await req.json();
  const lead: LeadRecord | undefined = payload?.record;
  if (!lead) return new Response('Payload sem `record`.', { status: 400 });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [NOTIFY_TO],
      // Clicar em "Responder" no e-mail já cai direto no lead, não no
      // remetente genérico do Resend.
      reply_to: lead.email,
      subject: `Novo lead — ${SOURCE_LABEL[lead.source]}${lead.nome ? ` (${lead.nome})` : ''}`,
      text: buildBody(lead),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return new Response(`Falha ao enviar via Resend: ${detail}`, { status: 502 });
  }

  return new Response('ok', { status: 200 });
});
