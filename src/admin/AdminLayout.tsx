import type { ReactNode } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Mail, Settings, LogOut, ExternalLink, CloudUpload, Loader2, Check } from 'lucide-react';
import { useEditorStore } from '../editor/store';
import { initials } from '../editor/theme';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/admin/paginas', label: 'Páginas', Icon: FileText, end: false },
];

const SOON_ITEMS = [
  { label: 'Leads', Icon: Mail },
  { label: 'Configurações', Icon: Settings },
];

function PublishButton() {
  const { publish, publishing, hasUnpublished } = useEditorStore();
  if (!hasUnpublished) {
    return (
      <span className="flex items-center gap-2" style={{ fontFamily: 'Inter', fontSize: 13, color: '#1fae5e' }}>
        <Check size={15} /> Tudo publicado
      </span>
    );
  }
  return (
    <button
      onClick={() => void publish()}
      disabled={publishing}
      className="flex items-center gap-2 rounded-full transition hover:brightness-95 disabled:opacity-60"
      style={{ height: 38, padding: '0 18px', background: '#d2e718', fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#152852' }}
    >
      {publishing ? <Loader2 size={15} className="animate-spin" /> : <CloudUpload size={15} />}
      {publishing ? 'Publicando…' : 'Publicar alterações'}
    </button>
  );
}

export default function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  const { user, logout } = useEditorStore();

  return (
    <div className="min-h-screen flex" style={{ background: '#f5f5f5' }}>
      <aside className="w-64 shrink-0 flex flex-col" style={{ background: '#060919' }}>
        <div className="px-6 pt-7 pb-6">
          <p style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1, color: '#fff' }}>
            HUB <span style={{ color: '#d2e718' }}>PAN</span>
          </p>
          <p className="mt-1" style={{ fontFamily: 'Inter', fontSize: 12, color: '#8b90a3' }}>Painel administrativo</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="flex items-center gap-3 rounded-[10px] px-3.5 transition"
              style={({ isActive }) => ({
                height: 42,
                fontFamily: 'Inter', fontWeight: 500, fontSize: 14,
                color: isActive ? '#152852' : 'rgba(255,255,255,0.75)',
                background: isActive ? '#d2e718' : 'transparent',
              })}
            >
              <item.Icon size={17} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
          {SOON_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-[10px] px-3.5"
              style={{ height: 42, fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: 'rgba(255,255,255,0.28)', cursor: 'not-allowed' }}
              title="Vem numa próxima fase"
            >
              <span className="flex items-center gap-3"><item.Icon size={17} strokeWidth={2} />{item.label}</span>
              <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 999, padding: '2px 6px' }}>
                Em breve
              </span>
            </div>
          ))}
        </nav>

        <div className="px-3 pb-4 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-[10px] px-3.5 transition hover:bg-white/5"
            style={{ height: 40, fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, color: 'rgba(255,255,255,0.6)' }}
          >
            <ExternalLink size={15} /> Ver site
          </Link>
        </div>

        <div className="px-4 py-4 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 32, height: 32, background: 'rgba(210,231,24,0.15)', color: '#d2e718', fontFamily: 'Inter', fontWeight: 600, fontSize: 12 }}>
            {initials(user?.name ?? '?')}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: '#fff' }}>{user?.name}</p>
          </div>
          <button onClick={logout} title="Sair" className="shrink-0 opacity-60 hover:opacity-100 transition" style={{ color: '#fff' }}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="flex items-center justify-between px-8" style={{ height: 68, background: '#fff', borderBottom: '1px solid #ecedf0' }}>
          <h1 style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 20, color: '#152852' }}>{title}</h1>
          <PublishButton />
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
