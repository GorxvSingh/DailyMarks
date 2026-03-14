"use client";

import { useState } from "react";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function Hero() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("You're on the list! We'll notify you when we launch.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

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

        <AnimateIn variant="fade-up" delay={500}>
          {status === "success" ? (
            <p className="text-accent font-medium">{message}</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-[440px] mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="flex-1 h-[48px] px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-[48px] px-6 rounded-lg font-medium bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-70"
              >
                {status === "loading" ? "Joining..." : "Join the waitlist"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="text-red-500 text-sm mt-3">{message}</p>
          )}
        </AnimateIn>
      </div>
    </section>
  );
}
