import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ClipboardCopy, Loader2, Mail, MailOpen, RefreshCw, Trash2 } from 'lucide-react';
import { supabase } from '../editor/supabaseClient';
import { formatWhen } from '../editor/store';
import { type Lead, type LeadSource, LEAD_SOURCE_LABEL, LEAD_SOURCES, LEAD_FIELD_LABEL, buildLeadSummary, buildWeeklySummary } from './leads';
import AdminLayout from './AdminLayout';
import { t } from './theme';

const EXTRA_FIELDS = ['telefone', 'cargo', 'perfil', 'cidade', 'organizacao', 'assunto', 'objetivo', 'quantidade'] as const;

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedWeekly, setCopiedWeekly] = useState(false);
  const [filter, setFilter] = useState<'all' | LeadSource>('all');

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

  const deleteLead = async (lead: Lead) => {
    if (!supabase || !leads) return;
    if (!window.confirm('Excluir este lead? Essa ação não pode ser desfeita.')) return;
    const prev = leads;
    setLeads(leads.filter((l) => l.id !== lead.id));
    setExpanded((cur) => (cur === lead.id ? null : cur));
    const { error: deleteError } = await supabase.from('leads').delete().eq('id', lead.id);
    if (deleteError) { setLeads(prev); setError('Não foi possível excluir — tente novamente.'); }
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

  const counts = useMemo(() => {
    const c: Partial<Record<'all' | LeadSource, number>> = { all: leads?.length ?? 0 };
    for (const s of LEAD_SOURCES) c[s] = leads?.filter((l) => l.source === s).length ?? 0;
    return c;
  }, [leads]);

  // "caixa de e-mail" — abas por fonte, sempre visíveis mesmo com 0 (o
  // Bruno pediu pra sempre poder filtrar por qualquer uma das origens).
  const filtered = useMemo(() => {
    if (!leads) return null;
    return filter === 'all' ? leads : leads.filter((l) => l.source === filter);
  }, [leads, filter]);

  const naoLidos = filtered?.filter((l) => !l.lida).length ?? 0;

  return (
    <AdminLayout title="Leads">
      <div className="flex items-center justify-between mb-6">
        <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: t.mutedForeground, maxWidth: 560 }}>
          Envios reais dos formulários do site. Clique numa linha pra ver os detalhes e marcar como lido.
          Use "Copiar resumo" pra trazer aqui no chat e eu ajudar a redigir uma resposta.
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

      {/* Abas de filtro — estilo caixa de e-mail: Todos por padrão + uma por fonte */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
        {(['all', ...LEAD_SOURCES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="shrink-0 px-3.5 py-1.5 rounded-full transition"
            style={{
              fontFamily: 'Inter', fontWeight: 600, fontSize: 12.5,
              background: filter === s ? t.primary : t.muted,
              color: filter === s ? t.primaryForeground : t.mutedForeground,
            }}
          >
            {s === 'all' ? 'Todos' : LEAD_SOURCE_LABEL[s]} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      {error && <p className="mb-4" style={{ fontFamily: 'Inter', fontSize: 13, color: t.destructive }}>{error}</p>}

      {!error && loading && !leads && (
        <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: t.mutedForeground }}>Carregando leads…</p>
      )}

      {filtered && filtered.length === 0 && (
        <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: t.mutedForeground }}>
          {filter === 'all' ? 'Nenhum lead recebido ainda.' : `Nenhum lead de "${LEAD_SOURCE_LABEL[filter]}" ainda.`}
        </p>
      )}

      {filtered && filtered.length > 0 && (
        <>
          <p className="mb-3" style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground }}>
            {naoLidos > 0 ? `${naoLidos} não lido${naoLidos > 1 ? 's' : ''} de ${filtered.length}` : `Todos os ${filtered.length} já foram lidos`}
          </p>
          <div className="overflow-hidden" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
            {filtered.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                open={expanded === lead.id}
                onToggle={() => setExpanded((cur) => (cur === lead.id ? null : lead.id))}
                onToggleLida={() => void toggleLida(lead)}
                onCopy={() => copyLead(lead)}
                onDelete={() => void deleteLead(lead)}
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
  lead, open, onToggle, onToggleLida, onCopy, onDelete, copied,
}: { lead: Lead; open: boolean; onToggle: () => void; onToggleLida: () => void; onCopy: () => void; onDelete: () => void; copied: boolean }) {
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
            {EXTRA_FIELDS.filter((f) => lead[f]).map((f) => (
              <p key={f}><b>{LEAD_FIELD_LABEL[f]}:</b> {lead[f]}</p>
            ))}
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
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 transition hover:opacity-70"
              style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: t.destructive }}
            >
              <Trash2 size={13} />
              Excluir lead
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
