import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase do editor visual. Se as variáveis de ambiente não
 * estiverem configuradas (ex.: rodando localmente antes do setup, ou uma
 * preview sem as env vars), o editor cai automaticamente no modo local
 * (localStorage) — ver store.tsx. Isso nunca deve acontecer em produção,
 * desde que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estejam configuradas
 * na Vercel (Project Settings → Environment Variables).
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;
