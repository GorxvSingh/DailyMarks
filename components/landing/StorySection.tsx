import { AnimateIn } from "@/components/ui/AnimateIn";

const days = [
  {
    day: "Monday morning:",
    lines: [
      "You're scrolling X. A killer thread on system design. A founder's raw take on failure. A career tip that hits different.",
      "You bookmark all three. You'll read them later.",
    ],
  },
  {
    day: "Tuesday:",
    lines: [
      "Your bookmarks: 47 posts. Your \"read later\" count: growing.",
      "You save two more. A long-form essay. A tool recommendation. Important stuff.",
      "Later never comes.",
    ],
  },
  {
    day: "Wednesday:",
    lines: [
      "Someone mentions a post you bookmarked last month. You know it exists. Somewhere.",
      "You scroll through 90 bookmarks. You can't find it.",
      "You give up after 3 minutes.",
    ],
  },
  {
    day: "Thursday:",
    lines: [
      "You bookmark a mass layoff analysis. A side project idea. A productivity hack.",
      "Total bookmarks: 100+. Total bookmarks read: maybe 5.",
      "Your bookmarks folder is where good content goes to die.",
    ],
  },
  {
    day: "Friday:",
    lines: [
      "Another week of saving everything. Reading nothing.",
      "Hundreds of bookmarks. Zero value extracted.",
    ],
  },
];

export function StorySection() {
  return (
    <section className="py-20 border-t border-border/30">
      <div className="mx-auto max-w-[640px] px-6">
        <AnimateIn variant="fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-12">
            This is your week on X...
          </h2>
        </AnimateIn>

        <div className="space-y-10">
          {days.map((day, i) => (
            <AnimateIn key={day.day} variant="fade-up" delay={i * 100}>
              <div>
                <h3 className="text-lg font-bold text-accent mb-3">
                  {day.day}
                </h3>
                <div className="space-y-3">
                  {day.lines.map((line, j) => (
                    <p
                      key={j}
                      className={`text-[15px] leading-relaxed ${
                        j === day.lines.length - 1 && day.lines.length > 1
                          ? "text-foreground font-medium"
                          : "text-muted"
                      }`}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn variant="scale" delay={500}>
          <div className="mt-16 p-8 rounded-2xl bg-surface-lighter border border-border/50 text-center">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight italic mb-4">
              Sound familiar?
            </p>
            <p className="text-muted text-[15px] leading-relaxed max-w-[460px] mx-auto">
              You don&apos;t have a saving problem. You have a{" "}
              <span className="text-foreground font-semibold">
                rediscovery problem
              </span>
              . DailyMarks brings your forgotten bookmarks back to you, one
              email at a time.
            </p>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
