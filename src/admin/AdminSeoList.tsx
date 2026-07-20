import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useEditorStore } from '../editor/store';
import { PAGE_ROUTES } from '../editor/pageRoutes';
import { SEO_DEFAULTS } from './seoDefaults';
import { seoKey, quickSeoLevel, SEO_LEVEL_LABEL, SEO_LEVEL_TOKEN } from './seo';
import AdminLayout from './AdminLayout';
import { t } from './theme';

export default function AdminSeoList() {
  const { overrides, get } = useEditorStore();

  return (
    <AdminLayout title="SEO">
      <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 13.5, color: t.mutedForeground, maxWidth: 620 }}>
        Título, descrição, preview de como aparece no Google e uma nota de qualidade pra cada página do site. Clique
        numa linha pra editar.
      </p>
      <div className="overflow-hidden" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
        <div className="grid items-center px-6 py-3" style={{ gridTemplateColumns: '1fr 160px 24px', background: t.muted, borderBottom: `1px solid ${t.border}` }}>
          {['Página', 'Nota de SEO', ''].map((h) => (
            <p key={h} style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11.5, letterSpacing: '0.6px', textTransform: 'uppercase', color: t.mutedForeground }}>{h}</p>
          ))}
        </div>
        {PAGE_ROUTES.map((page) => {
          const tKey = seoKey(page.slug, 'title');
          const dKey = seoKey(page.slug, 'description');
          const fallback = SEO_DEFAULTS[page.slug || 'home'];
          const level = quickSeoLevel({
            title: get(tKey, fallback?.title ?? ''),
            description: get(dKey, fallback?.description ?? ''),
          });
          const edited = (tKey in overrides) || (dKey in overrides);

          return (
            <Link
              key={page.slug}
              to={`/admin/seo/${page.slug || 'home'}`}
              className="grid items-center px-6 transition"
              style={{ gridTemplateColumns: '1fr 160px 24px', height: 60, borderBottom: `1px solid ${t.border}` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = t.muted; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span className="flex items-center gap-2">
                <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: t.foreground }}>{page.label}</span>
                {edited && <span style={{ fontFamily: 'Inter', fontSize: 11, color: t.mutedForeground }}>editado</span>}
              </span>

              <span className="flex items-center gap-1.5" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: t[SEO_LEVEL_TOKEN[level]] }}>
                <span className="rounded-full" style={{ width: 7, height: 7, background: t[SEO_LEVEL_TOKEN[level]] }} />
                {SEO_LEVEL_LABEL[level]}
              </span>

              <ChevronRight size={16} style={{ color: t.mutedForeground }} />
            </Link>
          );
        })}
      </div>
    </AdminLayout>
  );
}
