import { ExternalLink, PencilLine } from 'lucide-react';
import { PAGE_ROUTES } from '../editor/pageRoutes';
import AdminLayout from './AdminLayout';
import { t } from './theme';

export default function AdminPages() {
  return (
    <AdminLayout title="Páginas">
      <div className="overflow-hidden" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
        <div className="grid items-center px-6 py-3" style={{ gridTemplateColumns: '1fr 140px 140px', background: t.muted, borderBottom: `1px solid ${t.border}` }}>
          {['Página', 'Conteúdo', 'Site'].map((h) => (
            <p key={h} style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11.5, letterSpacing: '0.6px', textTransform: 'uppercase', color: t.mutedForeground }}>{h}</p>
          ))}
        </div>
        {PAGE_ROUTES.map((page) => (
          <div key={page.slug} className="grid items-center px-6" style={{ gridTemplateColumns: '1fr 140px 140px', height: 60, borderBottom: `1px solid ${t.border}` }}>
            <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: t.foreground }}>{page.label}</p>

            <a href={`/editar/${page.slug}`} className="flex items-center gap-1.5 hover:underline w-fit" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: t.primary }}>
              <PencilLine size={13} /> Editar
            </a>

            <a href={page.path} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline w-fit" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: t.mutedForeground }}>
              <ExternalLink size={13} /> Ver
            </a>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
