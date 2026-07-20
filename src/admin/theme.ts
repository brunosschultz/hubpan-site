/** Helpers pra consumir os tokens de `theme.css` a partir de inline styles. */
export const t = {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: 'hsl(var(--card))',
  cardForeground: 'hsl(var(--card-foreground))',
  muted: 'hsl(var(--muted))',
  mutedForeground: 'hsl(var(--muted-foreground))',
  primary: 'hsl(var(--primary))',
  primaryForeground: 'hsl(var(--primary-foreground))',
  accent: 'hsl(var(--accent))',
  accentForeground: 'hsl(var(--accent-foreground))',
  border: 'hsl(var(--border))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  destructive: 'hsl(var(--destructive))',
  sidebarBackground: 'hsl(var(--sidebar-background))',
  sidebarForeground: 'hsl(var(--sidebar-foreground))',
  sidebarPrimary: 'hsl(var(--sidebar-primary))',
  sidebarPrimaryForeground: 'hsl(var(--sidebar-primary-foreground))',
  sidebarAccent: 'hsl(var(--sidebar-accent))',
  sidebarBorder: 'hsl(var(--sidebar-border))',
  sidebarMuted: 'hsl(var(--sidebar-muted))',
  radius: 'var(--radius)',
};

/** Nome exibido no cabeçalho do painel — o único lugar "de marca" que resta
 * fora dos tokens de cor/fonte. Trocar aqui pra reusar o painel noutro projeto. */
export const ADMIN_SITE_NAME = 'HUB PAN';
