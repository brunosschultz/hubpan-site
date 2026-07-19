import { useEffect } from 'react';
import Home from '../pages/Home';
import { useEditorStore } from './store';
import { EditorChrome, LoginScreen } from './ui';

/**
 * Rota /editar — painel de edição visual da home.
 * Sem login → tela de acesso; logado → a própria home com o modo
 * edição ligado (textos, imagens e cores clicáveis) + chrome do editor
 * (toolbar, painéis e histórico) por cima.
 */
export default function EditorPage() {
  const { user, setEditMode } = useEditorStore();

  useEffect(() => {
    setEditMode(!!user);
    return () => setEditMode(false);
  }, [user, setEditMode]);

  if (!user) return <LoginScreen />;

  return (
    <>
      <Home />
      <EditorChrome />
    </>
  );
}
