import { Link } from 'react-router-dom';
import { PencilLine, Search } from 'lucide-react';
import { useEditorStore } from '../editor/store';
import { PAGE_ROUTES } from '../editor/pageRoutes';
import { seoKey, computeSeoStatus, SEO_LEVEL_LABEL, SEO_LEVEL_TOKEN } from './seo';
import AdminLayout from './AdminLayout';
import { t } from './theme';

export default function AdminSeoList() {
  const { overrides, get } = useEditorStore();

  return (
    <AdminLayout title="SEO">
      <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 13.5, color: t.mutedForeground, maxWidth: 620 }}>
        Título, descrição, preview de como aparece no Google e uma nota de qualidade pra cada página do site.
      </p>
      <div className="overflow-hidden" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
        <div className="grid items-center px-6 py-3" style={{ gridTemplateColumns: '1fr 160px 140px', background: t.muted, borderBottom: `1px solid ${t.border}` }}>
          {['Página', 'Nota de SEO', ''].map((h) => (
            <p key={h} style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11.5, letterSpacing: '0.6px', textTransform: 'uppercase', color: t.mutedForeground }}>{h}</p>
          ))}
        </div>
        {PAGE_ROUTES.map((page) => {
          const tKey = seoKey(page.slug, 'title');
          const dKey = seoKey(page.slug, 'description');
          const reviewed = tKey in overrides || dKey in overrides;
          const status = reviewed ? computeSeoStatus({ title: get(tKey, ''), description: get(dKey, '') }) : null;

          return (
            <div key={page.slug} className="grid items-center px-6" style={{ gridTemplateColumns: '1fr 160px 140px', height: 60, borderBottom: `1px solid ${t.border}` }}>
              <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: t.foreground }}>{page.label}</p>

              {status ? (
                <span className="flex items-center gap-1.5" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: t[SEO_LEVEL_TOKEN[status.level]] }}>
                  <span className="rounded-full" style={{ width: 7, height: 7, background: t[SEO_LEVEL_TOKEN[status.level]] }} />
                  {SEO_LEVEL_LABEL[status.level]}
                </span>
              ) : (
                <span className="flex items-center gap-1.5" style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground }}>
                  <Search size={12} /> Não revisado
                </span>
              )}

              <Link to={`/admin/seo/${page.slug}`} className="flex items-center gap-1.5 hover:underline w-fit" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: t.primary }}>
                <PencilLine size={13} /> Editar SEO
              </Link>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
