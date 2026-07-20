import type { ReactNode } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Search, Mail, Settings, LogOut, ExternalLink, CloudUpload, Loader2, Check } from 'lucide-react';
import { useEditorStore } from '../editor/store';
import { t, ADMIN_SITE_NAME } from './theme';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/admin/paginas', label: 'Páginas', Icon: FileText, end: false },
  { to: '/admin/seo', label: 'SEO', Icon: Search, end: false },
  { to: '/admin/leads', label: 'Leads', Icon: Mail, end: false },
];

const SOON_ITEMS = [
  { label: 'Configurações', Icon: Settings },
];

function PublishButton() {
  const { publish, publishing, hasUnpublished } = useEditorStore();
  if (!hasUnpublished) {
    return (
      <span className="flex items-center gap-2" style={{ fontFamily: 'Inter', fontSize: 13, color: t.success }}>
        <Check size={15} /> Tudo publicado
      </span>
    );
  }
  return (
    <button
      onClick={() => void publish()}
      disabled={publishing}
      className="flex items-center gap-2 transition hover:opacity-90 disabled:opacity-60"
      style={{ height: 38, padding: '0 18px', borderRadius: t.radius, background: t.primary, fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: t.primaryForeground }}
    >
      {publishing ? <Loader2 size={15} className="animate-spin" /> : <CloudUpload size={15} />}
      {publishing ? 'Publicando…' : 'Publicar alterações'}
    </button>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

export default function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  const { user, logout } = useEditorStore();

  return (
    <div className="admin-shell h-screen w-full flex overflow-hidden">
      <aside className="w-64 shrink-0 h-full flex flex-col overflow-y-auto overscroll-contain" style={{ background: t.sidebarBackground }}>
        <div className="px-6 pt-7 pb-6">
          <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, lineHeight: 1, color: t.sidebarForeground }}>
            {ADMIN_SITE_NAME}
          </p>
          <p className="mt-1" style={{ fontFamily: 'Inter', fontSize: 12, color: t.sidebarMuted }}>Painel administrativo</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="flex items-center gap-3 transition"
              style={({ isActive }) => ({
                height: 42, borderRadius: t.radius,
                padding: '0 14px',
                fontFamily: 'Inter', fontWeight: 500, fontSize: 14,
                color: isActive ? t.sidebarPrimaryForeground : t.sidebarForeground,
                background: isActive ? t.sidebarPrimary : 'transparent',
              })}
            >
              <item.Icon size={17} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
          {SOON_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between"
              style={{ height: 42, borderRadius: t.radius, padding: '0 14px', fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: t.sidebarMuted, opacity: 0.5, cursor: 'not-allowed' }}
              title="Vem numa próxima fase"
            >
              <span className="flex items-center gap-3"><item.Icon size={17} strokeWidth={2} />{item.label}</span>
              <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase', border: `1px solid ${t.sidebarBorder}`, borderRadius: 999, padding: '2px 6px' }}>
                Em breve
              </span>
            </div>
          ))}
        </nav>

        <div className="px-3 pb-4 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 transition hover:opacity-80"
            style={{ height: 40, borderRadius: t.radius, padding: '0 14px', fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, color: t.sidebarMuted }}
          >
            <ExternalLink size={15} /> Ver site
          </Link>
        </div>

        <div className="px-4 py-4 flex items-center gap-3 shrink-0" style={{ borderTop: `1px solid ${t.sidebarBorder}` }}>
          <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 32, height: 32, background: t.sidebarAccent, color: t.sidebarPrimary, fontFamily: 'Inter', fontWeight: 600, fontSize: 12 }}>
            {initials(user?.name ?? '?')}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: t.sidebarForeground }}>{user?.name}</p>
          </div>
          <button onClick={logout} title="Sair" className="shrink-0 opacity-60 hover:opacity-100 transition" style={{ color: t.sidebarForeground }}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-8 shrink-0" style={{ height: 68, background: t.card, borderBottom: `1px solid ${t.border}` }}>
          <h1 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 19, color: t.foreground }}>{title}</h1>
          <PublishButton />
        </header>
        <main className="flex-1 overflow-y-auto overscroll-contain p-8">{children}</main>
      </div>
    </div>
  );
}
