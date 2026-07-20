import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useEditorStore } from './store';
import { EditorChrome, LoginScreen } from './ui';
import { pageForSlug } from './pageRoutes';

/**
 * Rota /editar (e /editar/<slug>, ex: /editar/govia) — painel de edição
 * visual da página correspondente (ver pageRoutes.ts pro mapa slug→página).
 * Sem login → tela de acesso; logado → a própria página com o modo edição
 * ligado (textos, imagens e cores clicáveis) + chrome do editor (toolbar,
 * painéis e histórico) por cima.
 */
export default function EditorPage() {
  const { user, setEditMode } = useEditorStore();
  const location = useLocation();
  const slug = location.pathname.replace(/^\/editar\/?/, '');
  const { Component: Page } = pageForSlug(slug);

  useEffect(() => {
    setEditMode(!!user);
    return () => setEditMode(false);
  }, [user, setEditMode]);

  if (!user) return <LoginScreen />;

  return (
    <>
      <Page />
      <EditorChrome />
    </>
  );
}
