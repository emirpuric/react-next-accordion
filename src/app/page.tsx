import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqItems = [
  {
    value: "what-is-nextjs",
    question: "What is Next.js?",
    answer:
      "Next.js is a React framework that enables server-side rendering, static site generation, and other powerful features for building modern web applications.",
  },
  {
    value: "why-typescript",
    question: "Why use TypeScript with React?",
    answer:
      "TypeScript adds static type checking to JavaScript, catching errors at compile time, improving editor support with autocompletion, and making large codebases easier to maintain and refactor.",
  },
  {
    value: "what-is-tailwind",
    question: "What is Tailwind CSS?",
    answer:
      "Tailwind CSS is a utility-first CSS framework that lets you style elements directly in your markup using pre-defined classes, enabling rapid UI development without writing custom CSS.",
  },
  {
    value: "what-is-app-router",
    question: "What is the App Router?",
    answer:
      "The App Router is the modern routing system in Next.js that uses the app/ directory. It supports React Server Components, nested layouts, loading states, and streaming out of the box.",
  },
];

const featureItems = [
  {
    value: "compound-pattern",
    title: "Compound Component Pattern",
    description:
      "This accordion is built using the compound component pattern. A root <Accordion> component manages state via React Context, while child components like <AccordionItem>, <AccordionTrigger>, and <AccordionContent> consume that context. This gives consumers a declarative, composable API.",
  },
  {
    value: "accessible",
    title: "Fully Accessible",
    description:
      "Every trigger is a native <button> element with aria-expanded and aria-controls attributes. Content regions use role=\"region\" with aria-labelledby pointing back to their trigger. Keyboard navigation works out of the box.",
  },
  {
    value: "animated",
    title: "Smooth CSS Animation",
    description:
      "The expand/collapse animation uses the CSS grid-template-rows technique — transitioning between 0fr and 1fr — so the content height animates smoothly without JavaScript measurement. No fixed heights or max-heights needed.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 px-4 py-16 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-2xl space-y-16">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Accordion Component
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            A reusable, accessible accordion built with the compound component
            pattern. Two examples below demonstrate single and multiple open
            modes.
          </p>
        </header>

        {/* Example 1 — Single mode (FAQ) */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
            FAQ
            <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
              (single mode — one item open at a time)
            </span>
          </h2>

          <Accordion
            type="single"
            defaultValue="what-is-nextjs"
            className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900"
          >
            {faqItems.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left font-medium text-zinc-900 hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-800/50">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4 text-zinc-600 dark:text-zinc-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Example 2 — Multiple mode (Features) */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
            How It Works
            <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
              (multiple mode — many items can be open)
            </span>
          </h2>

          <Accordion
            type="multiple"
            className="space-y-3"
          >
            {featureItems.map((item) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              >
                <AccordionTrigger className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left font-medium text-zinc-900 hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-800/50">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4 text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>
    </div>
  );
}
