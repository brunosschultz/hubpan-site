import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Check, CheckCircle2, ChevronDown, ClipboardCopy, ExternalLink, ImageOff, Loader2, MinusCircle, RefreshCw, Upload, XCircle } from 'lucide-react';
import { useEditorStore, formatWhen, processImage } from '../editor/store';
import { pageForSlug } from '../editor/pageRoutes';
import { SEO_DEFAULTS } from './seoDefaults';
import {
  seoKey, auditHtml, buildSeoChecklist, overallLevel, buildAuditSummary,
  SEO_LEVEL_LABEL, SEO_LEVEL_TOKEN, type OnPageAudit, type SeoCheck, type SeoLevel,
} from './seo';
import {
  parsePerfResult, perfLevel, buildPerfSummary,
  type PerfAudit, type PerfAuditPair, type PerfCheck, type PerfMetric,
} from './perf';
import { SITE_URL } from '../components/PageMeta';
import AdminLayout from './AdminLayout';
import { t } from './theme';

const OG_IMAGE_SPEC = { w: 1200, h: 630, shape: 'paisagem' as const, fit: 'cover' as const };
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/s1-hero-bg.webp`;

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
  const { get, setValue, uploadImage } = useEditorStore();
  const psiKey = import.meta.env.VITE_PAGESPEED_API_KEY as string | undefined;

  const tKey = seoKey(seoSlug, 'title');
  const dKey = seoKey(seoSlug, 'description');
  const nKey = seoKey(seoSlug, 'noindex');
  const kKey = seoKey(seoSlug, 'keyword');
  const iKey = seoKey(seoSlug, 'image');
  const fallback = SEO_DEFAULTS[seoSlug || 'home'];

  /* Pré-preenche com o texto ATUAL (override salvo, ou o padrão do código
   * se nunca foi editado) — editar aqui é ajustar o que já existe, não
   * reescrever do zero. O "baseline" (valor de referência pra saber se
   * mudou algo) é recalculado a cada render, então funciona tanto pra
   * campo nunca tocado quanto pra campo já com override. */
  const titleBaseline = get(tKey, fallback?.title ?? '');
  const descriptionBaseline = get(dKey, fallback?.description ?? '');
  const keywordBaseline = get(kKey, '');

  const [title, setTitle] = useState(titleBaseline);
  const [description, setDescription] = useState(descriptionBaseline);
  const [keyword, setKeyword] = useState(keywordBaseline);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setTitle(titleBaseline); }, [tKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setDescription(descriptionBaseline); }, [dKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setKeyword(keywordBaseline); }, [kKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const noindex = get(nKey, 'false') === 'true';
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 1400); };

  const commitTitle = () => {
    if (title === titleBaseline) return;
    setValue(tKey, title.trim() ? title : null, { label: `SEO — título (${page.label})`, kind: 'text' });
    flash();
  };
  const commitDescription = () => {
    if (description === descriptionBaseline) return;
    setValue(dKey, description.trim() ? description : null, { label: `SEO — descrição (${page.label})`, kind: 'text' });
    flash();
  };
  const commitKeyword = () => {
    if (keyword === keywordBaseline) return;
    setValue(kKey, keyword.trim() ? keyword : null, { label: `SEO — palavra-chave (${page.label})`, kind: 'text' });
    flash();
  };
  const toggleNoindex = () => {
    setValue(nKey, noindex ? null : 'true', { label: `SEO — não indexar (${page.label})`, kind: 'text' });
    flash();
  };

  const ogImage = get(iKey, DEFAULT_OG_IMAGE);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onPickImage = async (file: File) => {
    setUploadingImage(true);
    try {
      const dataUrl = await processImage(file, OG_IMAGE_SPEC);
      const url = await uploadImage(dataUrl, `${iKey}`);
      setValue(iKey, url, { label: `SEO — imagem de compartilhamento (${page.label})`, kind: 'image' });
      flash();
    } catch {
      setAuditError('Não foi possível processar essa imagem. Tente outro arquivo.');
    } finally {
      setUploadingImage(false);
    }
  };

  const effectiveTitle = title || fallback?.title || page.label;
  const effectiveDescription = description || fallback?.description || '';

  const [html, setHtml] = useState<string | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

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

  /* Velocidade — sob demanda (nunca auto-roda, diferente do áudito de SEO
   * acima): o PageSpeed Insights roda um Lighthouse de verdade no servidor
   * do Google, leva até 30s, custaria uma espera ruim toda vez que a tela
   * abre. */
  const [perfPair, setPerfPair] = useState<PerfAuditPair | null>(null);
  const [perfTab, setPerfTab] = useState<'mobile' | 'desktop'>('mobile');
  const [perfLoading, setPerfLoading] = useState(false);
  const [perfError, setPerfError] = useState<string | null>(null);
  const [perfChecked, setPerfChecked] = useState<number | null>(null);
  const [perfCopied, setPerfCopied] = useState(false);
  const [showPerfSummary, setShowPerfSummary] = useState(false);

  /* Mobile e desktop rodam juntos, no mesmo clique — evita dobrar a
   * espera (cada chamada já leva até 30s sozinha) e deixa as duas prontas
   * pra alternar por aba sem precisar rodar de novo. */
  const loadPerf = useCallback(async () => {
    if (!psiKey) return;
    setPerfLoading(true);
    setPerfError(null);
    try {
      const pageUrl = `${SITE_URL}${page.path}`;
      const urlFor = (strategy: 'mobile' | 'desktop') => `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(pageUrl)}&strategy=${strategy}&category=performance&key=${psiKey}`;
      const [mobileRes, desktopRes] = await Promise.all([fetch(urlFor('mobile')), fetch(urlFor('desktop'))]);
      if (!mobileRes.ok || !desktopRes.ok) throw new Error('psi-error');
      const [mobileJson, desktopJson] = await Promise.all([mobileRes.json(), desktopRes.json()]);
      setPerfPair({ mobile: parsePerfResult(mobileJson), desktop: parsePerfResult(desktopJson) });
      setPerfChecked(Date.now());
    } catch {
      setPerfPair(null);
      setPerfError('Não foi possível rodar a auditoria de velocidade agora. Tente de novo em instantes.');
    } finally {
      setPerfLoading(false);
    }
  }, [page.path, psiKey]);

  const perfSummaryText = useMemo(() => {
    if (!perfPair) return '';
    return buildPerfSummary({ pageLabel: page.label, url: `${SITE_URL}${page.path}`, pair: perfPair });
  }, [perfPair, page.label, page.path]);

  const copyPerfSummary = () => {
    if (!perfSummaryText) return;
    navigator.clipboard.writeText(perfSummaryText).then(() => {
      setPerfCopied(true);
      setTimeout(() => setPerfCopied(false), 1800);
    }).catch(() => {
      setPerfError('Não foi possível copiar — selecione o texto abaixo e copie manualmente.');
      setShowPerfSummary(true);
    });
  };

  const audit = useMemo(() => (html ? auditHtml(html) : null), [html]);
  const checks = useMemo(
    () => (audit ? buildSeoChecklist({ title: effectiveTitle, description: effectiveDescription, keyword, audit }) : null),
    [audit, effectiveTitle, effectiveDescription, keyword],
  );
  const level = checks ? overallLevel(checks) : null;

  const summaryText = useMemo(() => {
    if (!audit || !checks) return '';
    return buildAuditSummary({
      pageLabel: page.label, url: `${SITE_URL}${page.path}`,
      title: effectiveTitle, description: effectiveDescription, keyword, audit, checks,
    });
  }, [audit, checks, page.label, page.path, effectiveTitle, effectiveDescription, keyword]);

  const copySummary = () => {
    if (!summaryText) return;
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {
      setAuditError('Não foi possível copiar — selecione o texto abaixo e copie manualmente.');
      setShowSummary(true);
    });
  };

  return (
    <AdminLayout title={`SEO — ${page.label}`}>
      <Link to="/admin/seo" className="inline-flex items-center gap-1.5 mb-6 hover:underline" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: t.mutedForeground }}>
        <ArrowLeft size={14} /> Todas as páginas
      </Link>

      <p className="mb-6 px-4 py-3" style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground, background: t.muted, borderRadius: t.radius, maxWidth: 720 }}>
        O que você edita aqui vira <b>rascunho</b> na hora — só passa a valer no site de verdade quando você clicar em
        "Publicar alterações" no topo da tela.
      </p>

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
              style={inputStyle()}
            />
            <div className="mt-2 flex items-center justify-between">
              <CharCount value={title} min={40} max={60} />
              {title === (fallback?.title ?? '') && <span style={{ fontFamily: 'Inter', fontSize: 12, color: t.mutedForeground }}>Ainda é o título padrão do código</span>}
            </div>
          </div>

          <div className="p-6" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
            <label className="block mb-1.5" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: t.foreground }}>Descrição (o texto abaixo do título no Google)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={commitDescription}
              rows={4}
              style={{ ...inputStyle(), height: 'auto', padding: '12px 14px', resize: 'vertical', lineHeight: '22px' }}
            />
            <div className="mt-2 flex items-center justify-between">
              <CharCount value={description} min={120} max={160} />
              {description === (fallback?.description ?? '') && <span style={{ fontFamily: 'Inter', fontSize: 12, color: t.mutedForeground }}>Ainda é a descrição padrão do código</span>}
            </div>
          </div>

          <div className="p-6" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
            <label className="block mb-1.5" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: t.foreground }}>Palavra-chave principal (opcional)</label>
            <p className="mb-2" style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground }}>
              A análise abaixo confere se ela aparece no título, na descrição e no H1.
            </p>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onBlur={commitKeyword}
              placeholder="ex: plataforma de ia para governos"
              style={inputStyle()}
            />
          </div>

          <div className="p-6" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
            <label className="block mb-1.5" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: t.foreground }}>Imagem de compartilhamento</label>
            <p className="mb-3" style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground }}>
              Aparece quando o link dessa página é compartilhado no WhatsApp, LinkedIn, Facebook etc. Tamanho ideal: 1200×630.
            </p>
            <div className="flex items-center gap-4">
              <div className="shrink-0 overflow-hidden" style={{ width: 140, height: 74, borderRadius: t.radius, background: t.muted, border: `1px solid ${t.border}` }}>
                <img src={ogImage} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex items-center gap-1.5 transition hover:opacity-80 disabled:opacity-50"
                  style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: t.primary }}
                >
                  {uploadingImage ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                  {uploadingImage ? 'Enviando…' : 'Trocar imagem'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void onPickImage(f); e.target.value = ''; }}
                />
              </div>
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

          <p className="mt-5 mb-2" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12, letterSpacing: '0.6px', textTransform: 'uppercase', color: t.mutedForeground }}>Como aparece ao compartilhar</p>
          <div className="overflow-hidden" style={{ borderRadius: t.radius, border: `1px solid ${t.border}` }}>
            <div style={{ aspectRatio: '1200/630', background: t.muted }}>
              <img src={ogImage} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-2.5">
              <p className="truncate" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12.5, color: t.foreground }}>{effectiveTitle}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 11, color: t.mutedForeground }}>{SITE_URL.replace('https://', '')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-6" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 15, color: t.foreground }}>Análise de SEO</p>
            {level && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: t.muted }}>
                <span className="rounded-full" style={{ width: 7, height: 7, background: t[SEO_LEVEL_TOKEN[level]] }} />
                <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11.5, color: t[SEO_LEVEL_TOKEN[level]] }}>{SEO_LEVEL_LABEL[level]}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {checks && (
              <button
                onClick={() => setShowSummary((s) => !s)}
                className="transition hover:opacity-80"
                style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: t.primary }}
              >
                {showSummary ? 'Esconder resumo' : 'Ver resumo'}
              </button>
            )}
            {checks && (
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
          Lida direto da página publicada. Mostra tanto o que já está certo quanto o que precisa de ajuste — pra
          corrigir algo, use "Copiar resumo" e traga aqui no chat.
          {lastChecked && <> Última checagem: {formatWhen(lastChecked)}. Depois de eu ajustar algo, espere o deploy
          (~1-2 min) e clique em "Atualizar" pra conferir se melhorou.</>}
        </p>

        {showSummary && summaryText && (
          <textarea
            readOnly
            value={summaryText}
            rows={10}
            className="mb-5 w-full"
            style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, padding: 14, borderRadius: t.radius, background: t.muted, border: `1px solid ${t.border}`, color: t.foreground, resize: 'vertical' }}
          />
        )}

        {auditError && (
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: t.destructive }}>{auditError}</p>
        )}
        {!auditError && auditLoading && !audit && (
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: t.mutedForeground }}>Analisando a página…</p>
        )}
        {audit && checks && <AuditResult audit={audit} checks={checks} />}
      </div>

      <div className="mt-6 p-6" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
        <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 15, color: t.foreground }}>Velocidade</p>
            {perfPair && (
              <div className="flex items-center rounded-full p-0.5" style={{ background: t.muted }}>
                {(['mobile', 'desktop'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setPerfTab(tab)}
                    className="px-3 py-1 rounded-full transition"
                    style={{
                      fontFamily: 'Inter', fontWeight: 600, fontSize: 11.5,
                      background: perfTab === tab ? t.card : 'transparent',
                      color: perfTab === tab ? t.foreground : t.mutedForeground,
                      boxShadow: perfTab === tab ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    {tab === 'mobile' ? 'Mobile' : 'Desktop'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {perfPair && (
              <button
                onClick={() => setShowPerfSummary((s) => !s)}
                className="transition hover:opacity-80"
                style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: t.primary }}
              >
                {showPerfSummary ? 'Esconder resumo' : 'Ver resumo'}
              </button>
            )}
            {perfPair && (
              <button
                onClick={copyPerfSummary}
                className="flex items-center gap-1.5 transition hover:opacity-80"
                style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: perfCopied ? t.success : t.primary }}
              >
                {perfCopied ? <Check size={13} /> : <ClipboardCopy size={13} />}
                {perfCopied ? 'Copiado!' : 'Copiar resumo'}
              </button>
            )}
            <button
              onClick={() => void loadPerf()}
              disabled={perfLoading || !psiKey}
              className="flex items-center gap-1.5 transition hover:opacity-80 disabled:opacity-50"
              style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: t.primary }}
            >
              {perfLoading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
              {perfPair ? 'Rodar de novo' : 'Rodar auditoria de velocidade'}
            </button>
          </div>
        </div>
        <p className="mb-5" style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground }}>
          Usa o PageSpeed Insights do Google (o mesmo motor por trás do Lighthouse), testando mobile e desktop juntos
          — pode levar até 30 segundos, é um teste de verdade rodando no servidor do Google, por isso não roda
          sozinho ao abrir a tela.
          {!psiKey && <> Chave de API não configurada — peça pro Claude configurar <code>VITE_PAGESPEED_API_KEY</code>.</>}
          {perfChecked && <> Última checagem: {formatWhen(perfChecked)}.</>}
        </p>

        {showPerfSummary && perfSummaryText && (
          <textarea
            readOnly
            value={perfSummaryText}
            rows={14}
            className="mb-5 w-full"
            style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, padding: 14, borderRadius: t.radius, background: t.muted, border: `1px solid ${t.border}`, color: t.foreground, resize: 'vertical' }}
          />
        )}

        {perfError && <p style={{ fontFamily: 'Inter', fontSize: 13, color: t.destructive }}>{perfError}</p>}
        {perfLoading && !perfPair && (
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: t.mutedForeground }}>Rodando auditoria de velocidade em mobile e desktop (até 30s)…</p>
        )}
        {perfPair && <PerfResult audit={perfPair[perfTab]} />}
      </div>
    </AdminLayout>
  );
}

const CHECK_ICON = { good: CheckCircle2, warning: AlertTriangle, bad: XCircle, neutral: MinusCircle };
const CHECK_COLOR_KEY = { good: 'success', warning: 'warning', bad: 'destructive', neutral: 'mutedForeground' } as const;

type ExpandKey = 'h1' | 'h2' | 'imagens' | null;

function AuditResult({ audit, checks }: { audit: OnPageAudit; checks: SeoCheck[] }) {
  const imagesOk = audit.images.length - audit.imagesMissingAlt.length;
  const [expanded, setExpanded] = useState<ExpandKey>(null);
  const toggle = (k: ExpandKey) => setExpanded((cur) => (cur === k ? null : k));

  return (
    <div>
      <div className="grid sm:grid-cols-4 gap-4 mb-3">
        <MiniStat label="Palavras" value={audit.wordCount} />
        <MiniStat label="H1" value={audit.h1.length} expanded={expanded === 'h1'} onClick={() => toggle('h1')} />
        <MiniStat label="H2" value={audit.h2.length} expanded={expanded === 'h2'} onClick={() => toggle('h2')} />
        <MiniStat label="Imagens OK" value={`${imagesOk}/${audit.images.length}`} expanded={expanded === 'imagens'} onClick={() => toggle('imagens')} />
      </div>

      {expanded && (
        <div className="mb-5 p-4" style={{ borderRadius: t.radius, background: t.muted }}>
          {expanded === 'h1' && <TagList items={audit.h1} empty="Nenhum H1 encontrado." />}
          {expanded === 'h2' && <TagList items={audit.h2} empty="Nenhum H2 encontrado." />}
          {expanded === 'imagens' && <ImageGallery images={audit.images} />}
        </div>
      )}

      <div className="divide-y" style={{ borderColor: t.border }}>
        {checks.map((c) => {
          const Icon = CHECK_ICON[c.level];
          const color = t[CHECK_COLOR_KEY[c.level]];
          return (
            <div key={c.id} className="flex items-start gap-3 py-3">
              <Icon size={17} style={{ color, marginTop: 1, flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: t.foreground }}>{c.label}</p>
                <p style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground, lineHeight: '18px' }}>{c.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TagList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <p style={{ fontFamily: 'Inter', fontSize: 13, color: t.mutedForeground }}>{empty}</p>;
  return (
    <ul className="space-y-2">
      {items.map((text, i) => (
        <li key={i} className="flex items-start gap-2" style={{ fontFamily: 'Inter', fontSize: 13, color: t.foreground, lineHeight: '19px' }}>
          <span className="shrink-0" style={{ color: t.mutedForeground, fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
          {text}
        </li>
      ))}
    </ul>
  );
}

function ImageGallery({ images }: { images: OnPageAudit['images'] }) {
  if (images.length === 0) return <p style={{ fontFamily: 'Inter', fontSize: 13, color: t.mutedForeground }}>Nenhuma imagem encontrada.</p>;
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {images.map((img, i) => {
        const status = img.decorative ? 'Decorativa (alt vazio de propósito)' : img.alt.trim() ? `Alt: "${img.alt}"` : 'Sem alt (precisa de ajuste)';
        const color = !img.decorative && !img.alt.trim() ? t.destructive : t.mutedForeground;
        return (
          <div key={i} className="overflow-hidden" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
            <div className="flex items-center justify-center" style={{ height: 90, background: t.border }}>
              {img.src ? (
                <img src={img.src} alt="" className="w-full h-full object-cover" />
              ) : (
                <ImageOff size={20} style={{ color: t.mutedForeground }} />
              )}
            </div>
            <div className="p-2.5">
              <p className="truncate" style={{ fontFamily: 'Inter', fontSize: 11, color: t.mutedForeground }}>{img.src.split('/').pop()}</p>
              <p style={{ fontFamily: 'Inter', fontSize: 11.5, color }}>{status}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PerfResult({ audit }: { audit: PerfAudit }) {
  const lvl = perfLevel(audit.score);
  return (
    <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-start">
      <ScoreGauge score={audit.score} level={lvl} />

      <div>
        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
          {audit.metrics.map((m) => <MetricChip key={m.id} metric={m} />)}
        </div>

        {audit.checks.length === 0 && audit.passedCount > 0 && (
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: t.success }}>
            Nenhum problema relevante encontrado — {audit.passedCount} outras verificações passaram.
          </p>
        )}
        {audit.checks.length > 0 && (
          <>
            <p className="mb-3" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12.5, color: t.mutedForeground }}>
              Onde melhorar — do maior pro menor impacto
              {audit.passedCount > 0 && ` (${audit.passedCount} outras verificações passaram sem problema)`}:
            </p>
            <div className="divide-y" style={{ borderColor: t.border }}>
              {audit.checks.map((c, i) => <PerfCheckRow key={c.id} check={c} priority={i === 0} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PerfCheckRow({ check, priority }: { check: PerfCheck; priority: boolean }) {
  const Icon = check.level === 'bad' ? XCircle : AlertTriangle;
  const color = check.level === 'bad' ? t.destructive : t.warning;
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon size={17} style={{ color, marginTop: 1, flexShrink: 0 }} />
      <div>
        <p className="flex items-center gap-2" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: t.foreground }}>
          {check.label}
          {priority && (
            <span className="px-1.5 py-0.5 rounded" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 9.5, letterSpacing: '0.4px', textTransform: 'uppercase', background: t.destructive, color: '#fff' }}>
              Prioridade
            </span>
          )}
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 12.5, color: t.mutedForeground, lineHeight: '18px' }}>{check.detail}</p>
      </div>
    </div>
  );
}

/** Medidor circular estilo PageSpeed Insights — anel de progresso em SVG,
 * cor conforme o nível, nota grande no centro. */
function ScoreGauge({ score, level }: { score: number; level: SeoLevel }) {
  const pct = Math.round(score * 100);
  const color = t[SEO_LEVEL_TOKEN[level]];
  const size = 120;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score);

  return (
    <div className="shrink-0 mx-auto lg:mx-0" style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={t.muted} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 30, color, lineHeight: 1 }}>{pct}</p>
        <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 10.5, color: t.mutedForeground }}>/100</p>
      </div>
    </div>
  );
}

function MetricChip({ metric }: { metric: PerfMetric }) {
  const color = t[SEO_LEVEL_TOKEN[metric.level]];
  const tint = metric.level === 'good' ? 'rgba(34,197,94,0.08)' : metric.level === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.08)';
  return (
    <div className="p-3" style={{ borderRadius: t.radius, background: tint, border: `1px solid ${color}33` }} title={metric.explanation}>
      <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11, letterSpacing: '0.4px', color }}>{metric.label}</p>
      <p className="mt-1" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: t.foreground }}>{metric.value}</p>
      <p className="mt-1" style={{ fontFamily: 'Inter', fontSize: 10.5, color: t.mutedForeground, lineHeight: '13px' }}>{metric.explanation}</p>
    </div>
  );
}

function MiniStat({ label, value, expanded, onClick }: { label: string; value: string | number; expanded?: boolean; onClick?: () => void }) {
  const clickable = !!onClick;
  return (
    <button
      onClick={onClick}
      disabled={!clickable}
      className="p-3 text-left transition"
      style={{
        borderRadius: t.radius, background: expanded ? t.accent : t.muted, cursor: clickable ? 'pointer' : 'default',
        border: `1px solid ${expanded ? t.primary : 'transparent'}`,
      }}
    >
      <div className="flex items-center justify-between">
        <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '0.4px', textTransform: 'uppercase', color: t.mutedForeground }}>{label}</p>
        {clickable && <ChevronDown size={13} style={{ color: t.mutedForeground, transform: expanded ? 'rotate(180deg)' : undefined, transition: 'transform .15s' }} />}
      </div>
      <p className="mt-1" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 22, color: t.foreground }}>{value}</p>
    </button>
  );
}
