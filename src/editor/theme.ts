import type { CSSProperties } from 'react';

/* Tokens visuais compartilhados do editor (toolbar, painéis, popovers). */

export const PALETTE: { hex: string; name: string }[] = [
  { hex: '#060919', name: 'Navy escuro' },
  { hex: '#152852', name: 'Navy' },
  { hex: '#2d4ebf', name: 'Azul HUB' },
  { hex: '#d2e718', name: 'Lima' },
  { hex: '#00e4ff', name: 'Ciano' },
  { hex: '#ffffff', name: 'Branco' },
  { hex: '#f5f5f5', name: 'Cinza claro' },
  { hex: '#ebebeb', name: 'Cinza' },
  { hex: '#797979', name: 'Cinza texto' },
];

export const glass: CSSProperties = {
  background: 'rgba(10,13,30,0.92)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
};

export const label11: CSSProperties = {
  fontFamily: 'Inter', fontWeight: 500, fontSize: 11,
  letterSpacing: '1.4px', textTransform: 'uppercase', color: '#8b90a3',
};

export const text13: CSSProperties = { fontFamily: 'Inter', fontSize: 13, color: '#fff' };

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

/** rgb(a) → #hex (pra comparar cor computada com a paleta) */
export function toHex(color: string): string {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return color;
  return '#' + [m[1], m[2], m[3]].map((n) => (+n).toString(16).padStart(2, '0')).join('');
}
