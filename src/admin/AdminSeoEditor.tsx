import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Check, CheckCircle2, ClipboardCopy, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { useEditorStore, formatWhen } from '../editor/store';
import { pageForSlug } from '../editor/pageRoutes';
import { SEO_DEFAULTS } from './seoDefaults';
import { seoKey, computeSeoStatus, SEO_LEVEL_LABEL, SEO_LEVEL_TOKEN, auditHtml, buildAuditSummary, type OnPageAudit } from './seo';
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
  const kKey = seoKey(seoSlug, 'keyword');
  const fallback = SEO_DEFAULTS[seoSlug || 'home'];

  const [title, setTitle] = useState(() => get(tKey, ''));
  const [description, setDescription] = useState(() => get(dKey, ''));
  const [keyword, setKeyword] = useState(() => get(kKey, ''));
  const [saved, setSaved] = useState(false);

  useEffect(() => { setTitle(get(tKey, '')); }, [tKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setDescription(get(dKey, '')); }, [dKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setKeyword(get(kKey, '')); }, [kKey]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const commitKeyword = () => {
    if (keyword === get(kKey, '')) return;
    setValue(kKey, keyword.trim() ? keyword : null, { label: `SEO — palavra-chave (${page.label})`, kind: 'text' });
    flash();
  };
  const toggleNoindex = () => {
    setValue(nKey, noindex ? null : 'true', { label: `SEO — não indexar (${page.label})`, kind: 'text' });
    flash();
  };

  const effectiveTitle = title || fallback?.title || page.label;
  const effectiveDescription = description || fallback?.description || '';
  const status = computeSeoStatus({ title: effectiveTitle, description: effectiveDescription });

  const [html, setHtml] = useState<string | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const loadAudit = useCallback(async () => {
    setAuditLoading(true);
    setAuditError(null);
    try {
      const res = await fetch(`${SITE_URL}${page.path}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      setHtml(await res.text());
      setLastChecked(Date.now());
    } catch {
      setHtml(null);
      setAuditError('Não foi possível carregar a página publicada pra analisar. Tente de novo em instantes.');
    } finally {
      setAuditLoading(false);
    }
  }, [page.path]);

  useEffect(() => { void loadAudit(); }, [loadAudit]);

  const audit = useMemo(() => (html ? auditHtml(html, keyword) : null), [html, keyword]);

  const copySummary = () => {
    if (!audit) return;
    const summary = buildAuditSummary({
      pageLabel: page.label, url: `${SITE_URL}${page.path}`,
      title: effectiveTitle, description: effectiveDescription, keyword, audit,
    });
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {
      setAuditError('Não foi possível copiar — selecione e copie manualmente pelo navegador.');
    });
  };

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

          <div className="p-6" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
            <label className="block mb-1.5" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: t.foreground }}>Palavra-chave principal (opcional)</label>
            <p className="mb-2" style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground }}>
              A auditoria abaixo confere se ela aparece no título e no texto da página.
            </p>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onBlur={commitKeyword}
              placeholder="ex: plataforma de ia para governos"
              style={inputStyle()}
            />
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

      <div className="mt-6 p-6" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
        <div className="flex items-center justify-between mb-1">
          <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 15, color: t.foreground }}>Auditoria on-page</p>
          <div className="flex items-center gap-4">
            {audit && (
              <button
                onClick={copySummary}
                className="flex items-center gap-1.5 transition hover:opacity-80"
                style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: copied ? t.success : t.primary }}
              >
                {copied ? <Check size={13} /> : <ClipboardCopy size={13} />}
                {copied ? 'Copiado!' : 'Copiar resumo'}
              </button>
            )}
            <button
              onClick={() => void loadAudit()}
              disabled={auditLoading}
              className="flex items-center gap-1.5 transition hover:opacity-80 disabled:opacity-50"
              style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: t.primary }}
            >
              {auditLoading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
              Atualizar
            </button>
          </div>
        </div>
        <p className="mb-5" style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground }}>
          Lida direto da página publicada — título, H1/H2, imagens e palavra-chave. Isso não edita nada; pra corrigir
          um item, use "Copiar resumo" e traga aqui no chat.
          {lastChecked && <> Última checagem: {formatWhen(lastChecked)}. Depois de eu ajustar algo, espere o deploy
          (~1-2 min) e clique em "Atualizar" pra conferir se melhorou.</>}
        </p>

        {auditError && (
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: t.destructive }}>{auditError}</p>
        )}
        {!auditError && auditLoading && !audit && (
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: t.mutedForeground }}>Analisando a página…</p>
        )}
        {audit && <AuditResult audit={audit} />}
      </div>
    </AdminLayout>
  );
}

function AuditResult({ audit }: { audit: OnPageAudit }) {
  const imagesOk = audit.images.length - audit.imagesMissingAlt.length;

  return (
    <div>
      <div className="grid sm:grid-cols-4 gap-4 mb-5">
        <MiniStat label="Palavras" value={audit.wordCount} />
        <MiniStat label="H1" value={audit.h1.length} />
        <MiniStat label="H2" value={audit.h2.length} />
        <MiniStat label="Imagens OK" value={`${imagesOk}/${audit.images.length}`} />
      </div>

      {audit.issues.length === 0 ? (
        <p className="flex items-center gap-2" style={{ fontFamily: 'Inter', fontSize: 13, color: t.success }}>
          <CheckCircle2 size={16} /> Nenhum problema encontrado na auditoria.
        </p>
      ) : (
        <ul className="space-y-2">
          {audit.issues.map((issue) => (
            <li key={issue} className="flex items-start gap-2" style={{ fontFamily: 'Inter', fontSize: 13, color: t.foreground }}>
              <AlertTriangle size={15} style={{ color: t.warning, marginTop: 1, flexShrink: 0 }} />
              {issue}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3" style={{ borderRadius: t.radius, background: t.muted }}>
      <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '0.4px', textTransform: 'uppercase', color: t.mutedForeground }}>{label}</p>
      <p className="mt-1" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 22, color: t.foreground }}>{value}</p>
    </div>
  );
}
