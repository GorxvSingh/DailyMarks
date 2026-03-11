import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function CtaBanner() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-content">
        <AnimateIn variant="fade-up">
          <div className="rounded-2xl border border-border bg-surface-lighter px-8 py-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4">
              Ready to rediscover your bookmarks?
            </h2>
            <p className="text-muted max-w-[480px] mx-auto mb-8">
              Pick a plan and start getting your saved content delivered to your
              inbox every morning.
            </p>
            <Button href="/pricing">See pricing</Button>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
