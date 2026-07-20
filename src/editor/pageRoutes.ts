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
 * Mapa slug → página, usado por /editar/<slug> e /preview/<slug>.
 * Slug vazio ('') = home. Precisa espelhar as rotas públicas em `App.tsx`
 * (mesmo path, sem a barra inicial) — ao criar página nova, adicionar aqui
 * também pra ela ficar editável em /editar/<slug>.
 */
export const PAGE_ROUTES: { slug: string; label: string; Component: ComponentType }[] = [
  { slug: '', label: 'Home', Component: Home },
  { slug: 'o-hub-pan', label: 'O HUB PAN', Component: Institucional },
  { slug: 'prointer', label: 'PROINTER', Component: Prointer },
  { slug: 'govia', label: 'GovIA', Component: GovIA },
  { slug: 'forum-mundial-ia', label: 'Fórum Mundial de IA', Component: ForumMundialIA },
  { slug: 'insights', label: 'Insights', Component: Insights },
  { slug: 'contato', label: 'Contato', Component: Contato },
  { slug: 'glossario', label: 'Glossário', Component: Glossario },
  { slug: 'imprensa', label: 'Imprensa', Component: Imprensa },
  { slug: 'casos-de-uso', label: 'Casos de Uso', Component: CasosDeUso },
];

export function pageForSlug(slug: string) {
  return PAGE_ROUTES.find((p) => p.slug === slug) ?? PAGE_ROUTES[0];
}
