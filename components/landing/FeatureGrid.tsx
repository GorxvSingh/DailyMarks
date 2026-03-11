import { AnimateIn } from "@/components/ui/AnimateIn";

const features = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
        />
      </svg>
    ),
    title: "Pick Your Count",
    description:
      "Choose anywhere from 1 to 20 bookmarks per email. Get exactly the amount you want to revisit each day.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
    title: "Daily Delivery",
    description:
      "Receive a fresh batch of your saved bookmarks every morning. Start your day with content you actually care about.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
        />
      </svg>
    ),
    title: "Beautiful Emails",
    description:
      "Clean, readable email digests with tweet text, author info, and direct links back to the original posts on X.",
  },
];

export function FeatureGrid() {
  return (
    <section className="py-20 bg-surface-lighter">
      <div className="mx-auto max-w-content px-6">
        <AnimateIn variant="fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-center mb-4">
            Simple by design
          </h2>
          <p className="text-muted text-center mb-14 max-w-[500px] mx-auto">
            No complicated setup. Connect your X account, pick your preferences,
            and start receiving your bookmarks.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <AnimateIn key={feature.title} variant="scale" delay={i * 150}>
              <div className="bg-background rounded-xl border border-border/50 p-6 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-accent-light text-accent flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
