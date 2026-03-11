import { AnimateIn } from "@/components/ui/AnimateIn";

export function Hero() {
  return (
    <section className="pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div className="mx-auto max-w-content px-6 text-center">
        <AnimateIn variant="blur" delay={100}>
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted mb-8">
            <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
            Your bookmarks, rediscovered
          </div>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={200}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tightest leading-[1.05] mb-6">
            Your X Bookmarks,
            <br />
            <span className="text-accent">Delivered Daily</span>
          </h1>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={350}>
          <p className="text-lg sm:text-xl text-muted max-w-[600px] mx-auto mb-10 leading-relaxed">
            Stop forgetting what you saved. Get a curated selection of your
            X bookmarks delivered to your inbox every morning.
          </p>
        </AnimateIn>

        <AnimateIn variant="fade" delay={500}>
          <p className="text-sm text-muted">
            Choose 1–20 bookmarks per email. Unsubscribe anytime.
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
