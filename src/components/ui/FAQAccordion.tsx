import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export const FAQAccordion = ({ items, className = '' }: FAQAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className={`space-y-3 max-w-3xl mx-auto ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-neutral-border rounded-card bg-neutral-surface overflow-hidden transition-all duration-200"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none focus:bg-neutral-bg"
              aria-expanded={isOpen}
            >
              <span className="text-sm sm:text-base font-semibold text-neutral-text">
                {item.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-muted shrink-0 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180 text-primary' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-neutral-muted leading-relaxed border-t border-neutral-border/60">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

