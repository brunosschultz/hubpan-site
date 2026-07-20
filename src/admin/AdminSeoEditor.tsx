import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, ExternalLink } from 'lucide-react';
import { useEditorStore } from '../editor/store';
import { pageForSlug } from '../editor/pageRoutes';
import { SEO_DEFAULTS } from './seoDefaults';
import { seoKey, computeSeoStatus, SEO_LEVEL_LABEL, SEO_LEVEL_TOKEN } from './seo';
import { SITE_URL } from '../components/PageMeta';
import AdminLayout from './AdminLayout';
import { t } from './theme';

function inputStyle(): React.CSSProperties {
  return {
    height: 46, borderRadius: t.radius, background: t.muted, border: `1px solid ${t.border}`,
    fontFamily: 'Inter', fontSize: 14.5, color: t.foreground, padding: '0 14px', width: '100%', outline: 'none',
  };
}

function CharCount({ value, min, max }: { value: string; min: number; max: number }) {
  const len = value.length;
  const ok = len >= min && len <= max;
  const color = len === 0 ? t.mutedForeground : ok ? t.success : t.warning;
  return <span style={{ fontFamily: 'Inter', fontSize: 12, color }}>{len} caracteres (ideal {min}–{max})</span>;
}

export default function AdminSeoEditor() {
  const { slug = '' } = useParams();
  const page = pageForSlug(slug);
  const seoSlug = page.slug;
  const { get, setValue } = useEditorStore();

  const tKey = seoKey(seoSlug, 'title');
  const dKey = seoKey(seoSlug, 'description');
  const nKey = seoKey(seoSlug, 'noindex');
  const fallback = SEO_DEFAULTS[seoSlug || 'home'];

  const [title, setTitle] = useState(() => get(tKey, ''));
  const [description, setDescription] = useState(() => get(dKey, ''));
  const [saved, setSaved] = useState(false);

  useEffect(() => { setTitle(get(tKey, '')); }, [tKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setDescription(get(dKey, '')); }, [dKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const noindex = get(nKey, 'false') === 'true';
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 1400); };

  const commitTitle = () => {
    if (title === get(tKey, '')) return;
    setValue(tKey, title.trim() ? title : null, { label: `SEO — título (${page.label})`, kind: 'text' });
    flash();
  };
  const commitDescription = () => {
    if (description === get(dKey, '')) return;
    setValue(dKey, description.trim() ? description : null, { label: `SEO — descrição (${page.label})`, kind: 'text' });
    flash();
  };
  const toggleNoindex = () => {
    setValue(nKey, noindex ? null : 'true', { label: `SEO — não indexar (${page.label})`, kind: 'text' });
    flash();
  };

  const effectiveTitle = title || fallback?.title || page.label;
  const effectiveDescription = description || fallback?.description || '';
  const status = computeSeoStatus({ title: effectiveTitle, description: effectiveDescription });

  return (
    <AdminLayout title={`SEO — ${page.label}`}>
      <Link to="/admin/seo" className="inline-flex items-center gap-1.5 mb-6 hover:underline" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: t.mutedForeground }}>
        <ArrowLeft size={14} /> Todas as páginas
      </Link>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="space-y-6">
          <div className="p-6" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
            <div className="flex items-center justify-between mb-1.5">
              <label style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: t.foreground }}>Título (aparece na aba do navegador e no Google)</label>
              {saved && <span className="flex items-center gap-1" style={{ fontFamily: 'Inter', fontSize: 12, color: t.success }}><Check size={12} /> Salvo</span>}
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={commitTitle}
              placeholder={fallback?.title ?? page.label}
              style={inputStyle()}
            />
            <div className="mt-2 flex items-center justify-between">
              <CharCount value={title || fallback?.title || ''} min={40} max={60} />
              {!title && <span style={{ fontFamily: 'Inter', fontSize: 12, color: t.mutedForeground }}>Usando o título padrão do código</span>}
            </div>
          </div>

          <div className="p-6" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
            <label className="block mb-1.5" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: t.foreground }}>Descrição (o texto abaixo do título no Google)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={commitDescription}
              placeholder={fallback?.description ?? ''}
              rows={4}
              style={{ ...inputStyle(), height: 'auto', padding: '12px 14px', resize: 'vertical', lineHeight: '22px' }}
            />
            <div className="mt-2 flex items-center justify-between">
              <CharCount value={description || fallback?.description || ''} min={120} max={160} />
              {!description && <span style={{ fontFamily: 'Inter', fontSize: 12, color: t.mutedForeground }}>Usando a descrição padrão do código</span>}
            </div>
          </div>

          <div className="p-6 flex items-center justify-between" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
            <div>
              <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: t.foreground }}>Não indexar esta página</p>
              <p className="mt-1" style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground, maxWidth: 440 }}>
                Pede pro Google não mostrar essa página nas buscas. Use só em páginas que não devem aparecer publicamente.
              </p>
            </div>
            <button
              onClick={toggleNoindex}
              className="relative shrink-0 transition"
              style={{ width: 46, height: 26, borderRadius: 999, background: noindex ? t.destructive : t.border }}
            >
              <span className="absolute rounded-full bg-white transition" style={{ width: 20, height: 20, top: 3, left: noindex ? 23 : 3, boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
            <p className="mb-4" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12, letterSpacing: '0.6px', textTransform: 'uppercase', color: t.mutedForeground }}>Nota de SEO</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full" style={{ width: 10, height: 10, background: t[SEO_LEVEL_TOKEN[status.level]] }} />
              <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 17, color: t[SEO_LEVEL_TOKEN[status.level]] }}>{SEO_LEVEL_LABEL[status.level]}</span>
            </div>
            {status.issues.length > 0 ? (
              <ul className="space-y-1.5">
                {status.issues.map((issue) => (
                  <li key={issue} style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground, lineHeight: '18px' }}>• {issue}</li>
                ))}
              </ul>
            ) : (
              <p style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground }}>Título e descrição dentro do tamanho ideal.</p>
            )}
          </div>

          <div className="p-6" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12, letterSpacing: '0.6px', textTransform: 'uppercase', color: t.mutedForeground }}>Como aparece no Google</p>
              <a href={page.path} target="_blank" rel="noreferrer" style={{ color: t.mutedForeground }}><ExternalLink size={13} /></a>
            </div>
            <p style={{ fontFamily: 'Arial', fontSize: 13.5, color: '#202124' }}>{SITE_URL.replace('https://', '')}{page.path}</p>
            <p className="mt-1 truncate" style={{ fontFamily: 'Arial', fontSize: 18, color: '#1a0dab', lineHeight: '22px' }}>{effectiveTitle}</p>
            <p className="mt-1" style={{ fontFamily: 'Arial', fontSize: 13.5, color: '#4d5156', lineHeight: '20px' }}>
              {effectiveDescription || 'Sem descrição definida.'}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
