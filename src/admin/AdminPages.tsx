import { Link } from 'react-router-dom';
import { ExternalLink, PencilLine, Search } from 'lucide-react';
import { useEditorStore } from '../editor/store';
import { PAGE_ROUTES } from '../editor/pageRoutes';
import { seoKey, computeSeoStatus, SEO_LEVEL_LABEL, SEO_LEVEL_COLOR } from './seo';
import AdminLayout from './AdminLayout';

export default function AdminPages() {
  const { overrides, get } = useEditorStore();

  return (
    <AdminLayout title="Páginas">
      <div className="rounded-[16px] bg-white overflow-hidden" style={{ border: '1px solid #ecedf0' }}>
        <div className="grid items-center px-6 py-3" style={{ gridTemplateColumns: '1fr 140px 140px 140px', background: '#f5f5f5', borderBottom: '1px solid #ecedf0' }}>
          {['Página', 'SEO', 'Conteúdo', 'Site'].map((h) => (
            <p key={h} style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11.5, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#a7a4a4' }}>{h}</p>
          ))}
        </div>
        {PAGE_ROUTES.map((page) => {
          const tKey = seoKey(page.slug, 'title');
          const dKey = seoKey(page.slug, 'description');
          const reviewed = tKey in overrides || dKey in overrides;
          const status = reviewed ? computeSeoStatus({ title: get(tKey, ''), description: get(dKey, '') }) : null;

          return (
            <div key={page.slug} className="grid items-center px-6" style={{ gridTemplateColumns: '1fr 140px 140px 140px', height: 60, borderBottom: '1px solid #ecedf0' }}>
              <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: '#152852' }}>{page.label}</p>

              <Link to={`/admin/paginas/${page.slug}`} className="flex items-center gap-1.5 hover:underline w-fit">
                {status ? (
                  <span className="flex items-center gap-1.5" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: SEO_LEVEL_COLOR[status.level] }}>
                    <span className="rounded-full" style={{ width: 7, height: 7, background: SEO_LEVEL_COLOR[status.level] }} />
                    {SEO_LEVEL_LABEL[status.level]}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5" style={{ fontFamily: 'Inter', fontSize: 12.5, color: '#a7a4a4' }}>
                    <Search size={12} /> Não revisado
                  </span>
                )}
              </Link>

              <Link to={`/editar/${page.slug}`} className="flex items-center gap-1.5 hover:underline w-fit" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: '#2d4ebf' }}>
                <PencilLine size={13} /> Editar
              </Link>

              <a href={page.path} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline w-fit" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: '#797979' }}>
                <ExternalLink size={13} /> Ver
              </a>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
