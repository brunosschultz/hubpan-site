import { Link } from 'react-router-dom';
import { FileText, PencilLine, Search } from 'lucide-react';
import { useEditorStore, formatWhen } from '../editor/store';
import { PAGE_ROUTES } from '../editor/pageRoutes';
import { seoKey, quickSeoLevel, SEO_LEVEL_LABEL, SEO_LEVEL_TOKEN, type SeoLevel } from './seo';
import AdminLayout from './AdminLayout';
import { t } from './theme';

function useSeoSummary() {
  const { overrides, get } = useEditorStore();
  let unreviewed = 0;
  const counts: Record<SeoLevel, number> = { good: 0, warning: 0, bad: 0 };

  for (const page of PAGE_ROUTES) {
    const tKey = seoKey(page.slug, 'title');
    const dKey = seoKey(page.slug, 'description');
    const reviewed = tKey in overrides || dKey in overrides;
    if (!reviewed) { unreviewed++; continue; }
    const level = quickSeoLevel({ title: get(tKey, ''), description: get(dKey, '') });
    counts[level]++;
  }
  return { unreviewed, counts, total: PAGE_ROUTES.length };
}

function StatCard({ label, value, hint, color }: { label: string; value: string | number; hint?: string; color?: string }) {
  return (
    <div className="p-6" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
      <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, letterSpacing: '0.6px', textTransform: 'uppercase', color: t.mutedForeground }}>{label}</p>
      <p className="mt-2" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 32, lineHeight: 1, color: color ?? t.foreground }}>{value}</p>
      {hint && <p className="mt-2" style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground }}>{hint}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { pendingCount, history } = useEditorStore();
  const seo = useSeoSummary();
  const recent = history.slice(0, 8);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Rascunhos pendentes"
          value={pendingCount}
          hint={pendingCount > 0 ? 'Publique pelo botão no topo pra colocar no ar.' : 'Tudo que foi editado já está publicado.'}
          color={pendingCount > 0 ? t.warning : t.success}
        />
        <StatCard label="Páginas no site" value={seo.total} hint="Home + 9 páginas internas." />
        <StatCard
          label="SEO revisado"
          value={`${seo.total - seo.unreviewed}/${seo.total}`}
          hint={seo.unreviewed > 0 ? `${seo.unreviewed} ainda usando o título/descrição padrão do código.` : 'Todas as páginas já têm SEO revisado no painel.'}
        />
        <StatCard
          label="SEO precisando de ajuste"
          value={seo.counts.bad + seo.counts.warning}
          hint="Entre as páginas já revisadas no painel."
          color={seo.counts.bad > 0 ? t.destructive : seo.counts.warning > 0 ? t.warning : t.success}
        />
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
        <div className="p-6" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
          <div className="flex items-center justify-between mb-5">
            <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16, color: t.foreground }}>Páginas</p>
            <Link to="/admin/paginas" className="flex items-center gap-1.5 hover:underline" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: t.primary }}>
              Ver todas <FileText size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {PAGE_ROUTES.map((page) => {
              const tKey = seoKey(page.slug, 'title');
              const dKey = seoKey(page.slug, 'description');
              return (
                <PageRow key={page.slug} label={page.label} slug={page.slug} tKey={tKey} dKey={dKey} />
              );
            })}
          </div>
        </div>

        <div className="p-6" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
          <p className="mb-5" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16, color: t.foreground }}>Edições recentes</p>
          {recent.length === 0 ? (
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: t.mutedForeground }}>Nenhuma edição registrada ainda.</p>
          ) : (
            <div className="space-y-4">
              {recent.map((h) => (
                <div key={h.id} className="flex items-start gap-3">
                  <span className="flex items-center justify-center rounded-full shrink-0 mt-0.5" style={{ width: 26, height: 26, background: t.muted, color: t.primary }}>
                    <PencilLine size={13} />
                  </span>
                  <div className="min-w-0">
                    <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: t.foreground }}>
                      <b>{h.userName}</b> {h.event === 'publish' ? 'publicou o site' : `editou "${h.label}"`}
                    </p>
                    <p style={{ fontFamily: 'Inter', fontSize: 12, color: t.mutedForeground }}>{formatWhen(h.ts)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function PageRow({ label, slug, tKey, dKey }: { label: string; slug: string; tKey: string; dKey: string }) {
  const { overrides, get } = useEditorStore();
  const reviewed = tKey in overrides || dKey in overrides;
  const level = reviewed ? quickSeoLevel({ title: get(tKey, ''), description: get(dKey, '') }) : null;

  return (
    <Link
      to={`/admin/seo/${slug || 'home'}`}
      className="flex items-center justify-between transition"
      style={{ height: 44, borderRadius: t.radius, padding: '0 14px' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = t.muted; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, color: t.foreground }}>{label}</span>
      {level ? (
        <span className="flex items-center gap-1.5" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, color: t[SEO_LEVEL_TOKEN[level]] }}>
          <span className="rounded-full" style={{ width: 7, height: 7, background: t[SEO_LEVEL_TOKEN[level]] }} />
          {SEO_LEVEL_LABEL[level]}
        </span>
      ) : (
        <span className="flex items-center gap-1.5" style={{ fontFamily: 'Inter', fontSize: 12, color: t.mutedForeground }}>
          <Search size={12} /> Não revisado
        </span>
      )}
    </Link>
  );
}
