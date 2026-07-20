import { Routes, Route } from 'react-router-dom';
import { useEditorStore } from '../editor/store';
import AdminLoginScreen from './AdminLoginScreen';
import AdminDashboard from './AdminDashboard';
import AdminPages from './AdminPages';
import AdminSeoList from './AdminSeoList';
import AdminSeoEditor from './AdminSeoEditor';
import AdminLeads from './AdminLeads';
import './theme.css';

/**
 * Rota /admin/* — Painel administrativo (Fase 1: Dashboard, Páginas, SEO).
 * Reaproveita a mesma conta/login do editor visual (`useEditorStore`) —
 * sem sistema de autenticação novo. Edições feitas aqui (ex: título de SEO)
 * entram como rascunho (canal 'draft', ver store.tsx) até publicar.
 *
 * Visual isolado em `theme.css`/`theme.ts` (tokens estilo shadcn/tweakcn,
 * não a identidade navy/lime/Luxenta do site) — pra poder virar um painel
 * white-label reusável noutros projetos só trocando os valores dos tokens.
 */
export default function AdminApp() {
  const { user } = useEditorStore();
  if (!user) return <AdminLoginScreen />;

  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="paginas" element={<AdminPages />} />
      <Route path="seo" element={<AdminSeoList />} />
      <Route path="seo/:slug" element={<AdminSeoEditor />} />
      <Route path="leads" element={<AdminLeads />} />
      <Route path="*" element={<AdminDashboard />} />
    </Routes>
  );
}
