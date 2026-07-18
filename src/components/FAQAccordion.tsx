import { useState } from 'react';

export interface FAQEntry {
  q: string;
  a: string;
}

/**
 * Acordeão de perguntas frequentes. Um item aberto por vez;
 * divisórias finas, toggle circular (+/−) que fica navy quando aberto.
 */
export default function FAQAccordion({ items, startOpen = 0 }: { items: FAQEntry[]; startOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(startOpen);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b border-gray200">
            <button
              className="w-full flex items-center justify-between gap-6 py-5 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 17, color: '#152852' }}>{item.q}</span>
              <span
                className="shrink-0 flex items-center justify-center rounded-full transition-colors duration-200"
                style={{
                  width: 28, height: 28,
                  border: isOpen ? 'none' : '1.5px solid #a7a4a4',
                  background: isOpen ? '#152852' : 'transparent',
                  color: isOpen ? '#d2e718' : '#797979',
                  fontFamily: 'Inter', fontSize: 16, lineHeight: 1,
                }}
              >
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div
              className="overflow-hidden transition-[max-height] duration-300 ease-out"
              style={{ maxHeight: isOpen ? 400 : 0 }}
            >
              <p className="pb-6" style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: '26px', color: '#797979', maxWidth: 720 }}>
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
