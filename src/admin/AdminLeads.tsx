import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ClipboardCopy, Loader2, Mail, MailOpen, RefreshCw } from 'lucide-react';
import { supabase } from '../editor/supabaseClient';
import { formatWhen } from '../editor/store';
import { type Lead, LEAD_SOURCE_LABEL, buildLeadSummary, buildWeeklySummary } from './leads';
import AdminLayout from './AdminLayout';
import { t } from './theme';

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedWeekly, setCopiedWeekly] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) { setError('Painel sem conexão com o banco de dados.'); return; }
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    setLoading(false);
    if (fetchError) { setError('Não foi possível carregar os leads.'); return; }
    setLeads(data as Lead[]);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const toggleLida = async (lead: Lead) => {
    if (!supabase || !leads) return;
    const next = !lead.lida;
    setLeads(leads.map((l) => (l.id === lead.id ? { ...l, lida: next } : l)));
    const { error: updateError } = await supabase.from('leads').update({ lida: next }).eq('id', lead.id);
    if (updateError) setLeads(leads.map((l) => (l.id === lead.id ? { ...l, lida: lead.lida } : l)));
  };

  const copyLead = (lead: Lead) => {
    navigator.clipboard.writeText(buildLeadSummary(lead)).then(() => {
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 1800);
    }).catch(() => setError('Não foi possível copiar — tente selecionar o texto manualmente.'));
  };

  const weeklySummary = useMemo(() => (leads ? buildWeeklySummary(leads) : ''), [leads]);
  const copyWeekly = () => {
    if (!weeklySummary) return;
    navigator.clipboard.writeText(weeklySummary).then(() => {
      setCopiedWeekly(true);
      setTimeout(() => setCopiedWeekly(false), 1800);
    }).catch(() => setError('Não foi possível copiar — tente novamente.'));
  };

  const naoLidos = leads?.filter((l) => !l.lida).length ?? 0;

  return (
    <AdminLayout title="Leads">
      <div className="flex items-center justify-between mb-6">
        <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: t.mutedForeground, maxWidth: 560 }}>
          Envios reais dos formulários de Contato e Newsletter do site. Clique numa linha pra ver os detalhes e
          marcar como lido. Use "Copiar resumo" pra trazer aqui no chat e eu ajudar a redigir uma resposta.
        </p>
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={copyWeekly}
            disabled={!leads}
            className="flex items-center gap-1.5 transition hover:opacity-80 disabled:opacity-50"
            style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: copiedWeekly ? t.success : t.primary }}
          >
            {copiedWeekly ? <Check size={13} /> : <ClipboardCopy size={13} />}
            {copiedWeekly ? 'Copiado!' : 'Copiar resumo da semana'}
          </button>
          <button
            onClick={() => void load()}
            disabled={loading}
            className="flex items-center gap-1.5 transition hover:opacity-80 disabled:opacity-50"
            style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: t.primary }}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            Atualizar
          </button>
        </div>
      </div>

      {error && <p className="mb-4" style={{ fontFamily: 'Inter', fontSize: 13, color: t.destructive }}>{error}</p>}

      {!error && loading && !leads && (
        <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: t.mutedForeground }}>Carregando leads…</p>
      )}

      {leads && leads.length === 0 && (
        <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: t.mutedForeground }}>Nenhum lead recebido ainda.</p>
      )}

      {leads && leads.length > 0 && (
        <>
          <p className="mb-3" style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground }}>
            {naoLidos > 0 ? `${naoLidos} não lido${naoLidos > 1 ? 's' : ''} de ${leads.length}` : `Todos os ${leads.length} já foram lidos`}
          </p>
          <div className="overflow-hidden" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
            {leads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                open={expanded === lead.id}
                onToggle={() => setExpanded((cur) => (cur === lead.id ? null : lead.id))}
                onToggleLida={() => void toggleLida(lead)}
                onCopy={() => copyLead(lead)}
                copied={copiedId === lead.id}
              />
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}

function LeadRow({
  lead, open, onToggle, onToggleLida, onCopy, copied,
}: { lead: Lead; open: boolean; onToggle: () => void; onToggleLida: () => void; onCopy: () => void; copied: boolean }) {
  return (
    <div style={{ borderBottom: `1px solid ${t.border}` }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-6 transition text-left"
        style={{ height: 60 }}
        onMouseEnter={(e) => { e.currentTarget.style.background = t.muted; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <span className="rounded-full shrink-0" style={{ width: 7, height: 7, background: lead.lida ? 'transparent' : t.primary }} />
        <span className="shrink-0 px-2 py-0.5 rounded-full" style={{ background: t.muted, fontFamily: 'Inter', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.4px', textTransform: 'uppercase', color: t.mutedForeground }}>
          {LEAD_SOURCE_LABEL[lead.source]}
        </span>
        <span className="flex-1 min-w-0 truncate" style={{ fontFamily: 'Inter', fontWeight: lead.lida ? 400 : 600, fontSize: 14, color: t.foreground }}>
          {lead.nome ? `${lead.nome} — ${lead.email}` : lead.email}
        </span>
        <span className="shrink-0" style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground }}>{formatWhen(new Date(lead.created_at).getTime())}</span>
        <ChevronDown size={15} style={{ color: t.mutedForeground, transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .15s' }} />
      </button>

      {open && (
        <div className="px-6 pb-5" style={{ background: t.muted }}>
          <div className="pt-4 space-y-1.5" style={{ fontFamily: 'Inter', fontSize: 13.5, color: t.foreground }}>
            {lead.organizacao && <p><b>Organização:</b> {lead.organizacao}</p>}
            {lead.assunto && <p><b>Assunto:</b> {lead.assunto}</p>}
            {lead.mensagem && <p style={{ whiteSpace: 'pre-line' }}><b>Mensagem:</b> {lead.mensagem}</p>}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={onToggleLida}
              className="flex items-center gap-1.5 transition hover:opacity-80"
              style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: t.primary }}
            >
              {lead.lida ? <Mail size={13} /> : <MailOpen size={13} />}
              {lead.lida ? 'Marcar como não lido' : 'Marcar como lido'}
            </button>
            <button
              onClick={onCopy}
              className="flex items-center gap-1.5 transition hover:opacity-80"
              style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: copied ? t.success : t.primary }}
            >
              {copied ? <Check size={13} /> : <ClipboardCopy size={13} />}
              {copied ? 'Copiado!' : 'Copiar resumo'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
