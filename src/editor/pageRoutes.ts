import type { ComponentType } from 'react';
import Home from '../pages/Home';
import Institucional from '../pages/institucional';
import Prointer from '../pages/prointer';
import GovIA from '../pages/govia';
import ForumMundialIA from '../pages/forum';
import Insights from '../pages/insights';
import Contato from '../pages/contato';
import Glossario from '../pages/utilitarias/Glossario';
import Imprensa from '../pages/utilitarias/Imprensa';
import CasosDeUso from '../pages/utilitarias/CasosDeUso';

/**
 * Mapa slug → página, usado por /editar/<slug>, /preview/<slug> e pelo
 * Painel Admin (/admin/paginas). Slug vazio ('') = home. `path` espelha a
 * rota pública em `App.tsx` (com a barra inicial) — ao criar página nova,
 * adicionar aqui também pra ela ficar editável e aparecer no painel.
 */
export const PAGE_ROUTES: { slug: string; label: string; path: string; Component: ComponentType }[] = [
  { slug: '', label: 'Home', path: '/', Component: Home },
  { slug: 'o-hub-pan', label: 'O HUB PAN', path: '/o-hub-pan', Component: Institucional },
  { slug: 'prointer', label: 'PROINTER', path: '/prointer', Component: Prointer },
  { slug: 'govia', label: 'GovIA', path: '/govia', Component: GovIA },
  { slug: 'forum-mundial-ia', label: 'Fórum Mundial de IA', path: '/forum-mundial-ia', Component: ForumMundialIA },
  { slug: 'insights', label: 'Insights', path: '/insights', Component: Insights },
  { slug: 'contato', label: 'Contato', path: '/contato', Component: Contato },
  { slug: 'glossario', label: 'Glossário', path: '/glossario', Component: Glossario },
  { slug: 'imprensa', label: 'Imprensa', path: '/imprensa', Component: Imprensa },
  { slug: 'casos-de-uso', label: 'Casos de Uso', path: '/casos-de-uso', Component: CasosDeUso },
];

export function pageForSlug(slug: string) {
  return PAGE_ROUTES.find((p) => p.slug === slug) ?? PAGE_ROUTES[0];
}
