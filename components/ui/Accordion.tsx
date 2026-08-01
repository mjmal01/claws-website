'use client'

import { useState, type ReactNode } from 'react'

interface AccordionItem {
  question: string
  answer: string | ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={item.question} className="border border-surface-border rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-6 py-4 text-left text-white-90 hover:text-white hover:bg-surface-raised transition-all duration-200"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="font-medium pr-4">{item.question}</span>
              <svg
                className={['w-5 h-5 text-white-50 flex-shrink-0 transition-transform duration-200', isOpen && 'rotate-180'].filter(Boolean).join(' ')}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="px-6 pb-5 text-white-70 leading-relaxed border-t border-surface-border/50 pt-4">
                {item.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
