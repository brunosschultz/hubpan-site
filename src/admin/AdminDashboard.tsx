import { Link } from 'react-router-dom';
import { FileText, PencilLine, Search } from 'lucide-react';
import { useEditorStore, formatWhen } from '../editor/store';
import { PAGE_ROUTES } from '../editor/pageRoutes';
import { seoKey, computeSeoStatus, SEO_LEVEL_LABEL, SEO_LEVEL_COLOR, type SeoLevel } from './seo';
import AdminLayout from './AdminLayout';

function useSeoSummary() {
  const { overrides, get } = useEditorStore();
  let unreviewed = 0;
  const counts: Record<SeoLevel, number> = { good: 0, warning: 0, bad: 0 };

  for (const page of PAGE_ROUTES) {
    const tKey = seoKey(page.slug, 'title');
    const dKey = seoKey(page.slug, 'description');
    const reviewed = tKey in overrides || dKey in overrides;
    if (!reviewed) { unreviewed++; continue; }
    const { level } = computeSeoStatus({ title: get(tKey, ''), description: get(dKey, '') });
    counts[level]++;
  }
  return { unreviewed, counts, total: PAGE_ROUTES.length };
}

function StatCard({ label, value, hint, color }: { label: string; value: string | number; hint?: string; color?: string }) {
  return (
    <div className="rounded-[16px] bg-white p-6" style={{ border: '1px solid #ecedf0' }}>
      <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#a7a4a4' }}>{label}</p>
      <p className="mt-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 34, lineHeight: 1, color: color ?? '#152852' }}>{value}</p>
      {hint && <p className="mt-2" style={{ fontFamily: 'Inter', fontSize: 12.5, color: '#797979' }}>{hint}</p>}
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
          color={pendingCount > 0 ? '#d99a1c' : '#1fae5e'}
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
          color={seo.counts.bad > 0 ? '#e5484d' : seo.counts.warning > 0 ? '#d99a1c' : '#1fae5e'}
        />
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
        <div className="rounded-[16px] bg-white p-6" style={{ border: '1px solid #ecedf0' }}>
          <div className="flex items-center justify-between mb-5">
            <p style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 17, color: '#152852' }}>Páginas</p>
            <Link to="/admin/paginas" className="flex items-center gap-1.5 hover:underline" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#2d4ebf' }}>
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

        <div className="rounded-[16px] bg-white p-6" style={{ border: '1px solid #ecedf0' }}>
          <p className="mb-5" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 17, color: '#152852' }}>Edições recentes</p>
          {recent.length === 0 ? (
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: '#a7a4a4' }}>Nenhuma edição registrada ainda.</p>
          ) : (
            <div className="space-y-4">
              {recent.map((h) => (
                <div key={h.id} className="flex items-start gap-3">
                  <span className="flex items-center justify-center rounded-full shrink-0 mt-0.5" style={{ width: 26, height: 26, background: '#f5f5f5', color: '#2d4ebf' }}>
                    <PencilLine size={13} />
                  </span>
                  <div className="min-w-0">
                    <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: '#152852' }}>
                      <b>{h.userName}</b> {h.event === 'publish' ? 'publicou o site' : `editou "${h.label}"`}
                    </p>
                    <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#a7a4a4' }}>{formatWhen(h.ts)}</p>
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
  const status = reviewed ? computeSeoStatus({ title: get(tKey, ''), description: get(dKey, '') }) : null;

  return (
    <Link
      to={`/admin/paginas/${slug}`}
      className="flex items-center justify-between rounded-[10px] px-3.5 transition hover:bg-gray100"
      style={{ height: 44 }}
    >
      <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, color: '#152852' }}>{label}</span>
      {status ? (
        <span className="flex items-center gap-1.5" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, color: SEO_LEVEL_COLOR[status.level] }}>
          <span className="rounded-full" style={{ width: 7, height: 7, background: SEO_LEVEL_COLOR[status.level] }} />
          {SEO_LEVEL_LABEL[status.level]}
        </span>
      ) : (
        <span className="flex items-center gap-1.5" style={{ fontFamily: 'Inter', fontSize: 12, color: '#a7a4a4' }}>
          <Search size={12} /> Não revisado
        </span>
      )}
    </Link>
  );
}
