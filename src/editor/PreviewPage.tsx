import { useLocation } from 'react-router-dom';
import { pageForSlug } from './pageRoutes';

/**
 * Rota /preview (e /preview/<slug>, ex: /preview/govia) — mostra o RASCUNHO
 * da página correspondente (o mesmo que o editor vê), sem exigir login e
 * sem nenhum controle de edição. É o link que dá pra mandar pro cliente
 * conferir as mudanças antes de clicar em "Publicar" em /editar. Fica
 * sempre em tempo real: qualquer edição salva aparece aqui na hora (mesma
 * assinatura em tempo real do Supabase usada no editor).
 */
export default function PreviewPage() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\/preview\/?/, '');
  const { Component: Page } = pageForSlug(slug);
  return <Page />;
}
