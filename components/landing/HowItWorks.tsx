import { AnimateIn } from "@/components/ui/AnimateIn";

const steps = [
  {
    number: "01",
    title: "Connect your X account",
    description:
      "Sign in with your X account using secure OAuth. We only request permission to read your bookmarks.",
  },
  {
    number: "02",
    title: "Choose your preferences",
    description:
      "Set how many bookmarks you want per email (1–20) and add your email address for delivery.",
  },
  {
    number: "03",
    title: "Receive your daily digest",
    description:
      "Every morning, get a curated email with your saved bookmarks. Rediscover what matters to you.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-content px-6">
        <AnimateIn variant="fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-center mb-4">
            How it works
          </h2>
          <p className="text-muted text-center mb-14 max-w-[500px] mx-auto">
            Three simple steps to start rediscovering your saved content.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <AnimateIn key={step.number} variant="fade-up" delay={i * 200}>
              <div className="text-center sm:text-left group">
                <span className="inline-block text-5xl font-bold font-mono mb-3 opacity-20 group-hover:opacity-40 transition-opacity duration-300 text-accent">
                  {step.number}
                </span>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
