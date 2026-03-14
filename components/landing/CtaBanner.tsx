"use client";

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
              Join the waitlist and be the first to know when DailyMarks launches.
            </p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex h-[44px] items-center px-6 rounded-lg font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
            >
              Join the waitlist
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
