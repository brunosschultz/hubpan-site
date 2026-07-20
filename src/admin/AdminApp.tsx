import { Routes, Route } from 'react-router-dom';
import { useEditorStore } from '../editor/store';
import { LoginScreen } from '../editor/ui';
import AdminDashboard from './AdminDashboard';
import AdminPages from './AdminPages';
import AdminSeoEditor from './AdminSeoEditor';

/**
 * Rota /admin/* — Painel administrativo (Fase 1: Dashboard, Páginas, SEO).
 * Reaproveita a mesma conta/login do editor visual (`useEditorStore`) —
 * sem sistema de autenticação novo. Edições feitas aqui (ex: título de SEO)
 * entram como rascunho (canal 'draft', ver store.tsx) até publicar.
 */
export default function AdminApp() {
  const { user } = useEditorStore();
  if (!user) return <LoginScreen subtitle="Painel administrativo" buttonLabel="Entrar no painel" />;

  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="paginas" element={<AdminPages />} />
      <Route path="paginas/:slug" element={<AdminSeoEditor />} />
      <Route path="*" element={<AdminDashboard />} />
    </Routes>
  );
}
