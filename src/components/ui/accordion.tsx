"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type AccordionContextValue = {
  openItems: string[];
  toggle: (value: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion compound components must be used within <Accordion>");
  return ctx;
}

type ItemContextValue = { value: string; triggerId: string; contentId: string };

const ItemContext = createContext<ItemContextValue | null>(null);

function useItem() {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error("AccordionItem compound components must be used within <AccordionItem>");
  return ctx;
}

// ---------------------------------------------------------------------------
// <Accordion>
// ---------------------------------------------------------------------------

type AccordionProps = {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  children: ReactNode;
  className?: string;
};

export function Accordion({
  type = "single",
  defaultValue,
  children,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(() => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const toggle = useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        const isOpen = prev.includes(value);
        if (isOpen) return prev.filter((v) => v !== value);
        return type === "multiple" ? [...prev, value] : [value];
      });
    },
    [type],
  );

  const ctx = useMemo(() => ({ openItems, toggle }), [openItems, toggle]);

  return (
    <AccordionContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// <AccordionItem>
// ---------------------------------------------------------------------------

type AccordionItemProps = {
  value: string;
  children: ReactNode;
  className?: string;
};

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  const id = useId();
  const triggerId = `accordion-trigger-${id}`;
  const contentId = `accordion-content-${id}`;

  const ctx = useMemo(() => ({ value, triggerId, contentId }), [value, triggerId, contentId]);

  return (
    <ItemContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </ItemContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// <AccordionTrigger>
// ---------------------------------------------------------------------------

type AccordionTriggerProps = {
  children: ReactNode;
  className?: string;
};

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const { openItems, toggle } = useAccordion();
  const { value, triggerId, contentId } = useItem();
  const isOpen = openItems.includes(value);

  return (
    <button
      id={triggerId}
      type="button"
      role="button"
      aria-expanded={isOpen}
      aria-controls={contentId}
      onClick={() => toggle(value)}
      className={className}
    >
      {children}
      <ChevronIcon className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
    </button>
  );
}

// ---------------------------------------------------------------------------
// <AccordionContent>
// ---------------------------------------------------------------------------

type AccordionContentProps = {
  children: ReactNode;
  className?: string;
};

export function AccordionContent({ children, className }: AccordionContentProps) {
  const { openItems } = useAccordion();
  const { value, triggerId, contentId } = useItem();
  const isOpen = openItems.includes(value);

  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      data-state={isOpen ? "open" : "closed"}
      className="accordion-grid"
    >
      <div className="overflow-hidden">
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal chevron icon
// ---------------------------------------------------------------------------

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
