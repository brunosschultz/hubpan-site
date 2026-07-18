export interface StatItem {
  value: string;
  label: string;
}

/**
 * Faixa escura de números — usada logo abaixo do PageHero nas páginas internas.
 * Fundo navy (um tom acima do navy900 do hero), células separadas por linhas sutis.
 */
export default function StatStrip({ items }: { items: StatItem[] }) {
  return (
    <section className="w-full bg-navy border-b border-white/10">
      <div className="gutter py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 rounded-[10px] overflow-hidden border border-white/10">
          {items.map((s) => (
            <div key={s.label} className="py-5 px-4 text-center border border-white/10 -m-px">
              <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 34, lineHeight: 1, color: '#fff' }}>{s.value}</p>
              <p className="mt-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '1.65px', textTransform: 'uppercase', color: '#a7a4a4' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
