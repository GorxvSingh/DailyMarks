"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { AnimateIn } from "@/components/ui/AnimateIn";

const TIERS = [
  { price: 40, limit: 50 },
  { price: 60, limit: 50 },
  { price: 80, limit: 50 },
  { price: 100, limit: 50 },
];

// TODO: Replace with real member count from API/database
const CURRENT_MEMBERS = 0;

function getTierState(tiers: typeof TIERS, memberCount: number) {
  let remaining = memberCount;
  return tiers.map((tier) => {
    const filled = Math.min(remaining, tier.limit);
    remaining -= filled;
    const soldOut = filled >= tier.limit;
    return { ...tier, filled, soldOut };
  });
}

function getCurrentPrice(tiers: typeof TIERS, memberCount: number) {
  let remaining = memberCount;
  for (const tier of tiers) {
    if (remaining < tier.limit) return tier.price;
    remaining -= tier.limit;
  }
  return tiers[tiers.length - 1].price;
}

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const tierState = getTierState(TIERS, CURRENT_MEMBERS);
  const currentPrice = getCurrentPrice(TIERS, CURRENT_MEMBERS);

  async function handleCheckout(plan: string) {
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setLoading(null);
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-[720px]">
          {/* Subscription options */}
          <AnimateIn variant="fade-up">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4">
                Simple pricing
              </h1>
              <p className="text-lg text-muted max-w-[500px] mx-auto">
                Start with a subscription, or lock in lifetime access before the
                price goes up.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn variant="fade-up" delay={150}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20">
              {[
                {
                  name: "Monthly",
                  price: "$5",
                  period: "/month",
                  plan: "monthly",
                  desc: "Cancel anytime",
                },
                {
                  name: "Yearly",
                  price: "$25",
                  period: "/year",
                  plan: "yearly",
                  desc: "Save 58%",
                },
              ].map((p) => (
                <div
                  key={p.plan}
                  className="rounded-xl border border-border bg-surface-lighter p-6 flex flex-col"
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <span className="text-xs text-muted">{p.desc}</span>
                  </div>
                  <div className="mb-5">
                    <span className="text-3xl font-bold tracking-tight">
                      {p.price}
                    </span>
                    <span className="text-muted text-sm ml-1">{p.period}</span>
                  </div>
                  <button
                    onClick={() => handleCheckout(p.plan)}
                    disabled={loading !== null}
                    className={`w-full h-[42px] rounded-lg font-medium border border-border text-foreground hover:bg-surface-light transition-all focus:outline-none focus:ring-2 focus:ring-accent ${
                      loading === p.plan ? "opacity-70" : ""
                    }`}
                  >
                    {loading === p.plan ? "Redirecting..." : "Get started"}
                  </button>
                </div>
              ))}
            </div>
          </AnimateIn>

          {/* Lifetime tier section */}
          <AnimateIn variant="fade-up" delay={300}>
            <div className="mb-4">
              <p className="text-sm text-muted uppercase tracking-wider font-medium">
                Lifetime access
              </p>
            </div>

            <div className="mb-2">
              <span className="text-5xl sm:text-6xl font-bold tracking-tighter">
                ${currentPrice}
              </span>
              <span className="text-muted text-lg ml-2">/one-time</span>
            </div>

            <p className="text-muted mb-10">
              Price increases every 50 members.
            </p>
          </AnimateIn>

          {/* Tier progress bars */}
          <div className="space-y-6 mb-10">
            {tierState.map((tier, i) => (
              <AnimateIn key={i} variant="fade-up" delay={400 + i * 80}>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium">${tier.price} tier</span>
                    {tier.soldOut && (
                      <span className="text-xs font-semibold uppercase tracking-wider border border-border rounded px-2 py-0.5">
                        Sold out
                      </span>
                    )}
                  </div>
                  <div className="flex gap-[3px]">
                    {Array.from({ length: tier.limit }).map((_, j) => (
                      <div
                        key={j}
                        className={`h-6 flex-1 rounded-[2px] transition-colors ${
                          j < tier.filled
                            ? "bg-accent"
                            : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn variant="scale" delay={700}>
            <button
              onClick={() => handleCheckout("lifetime")}
              disabled={loading !== null}
              className={`w-full sm:w-auto h-[48px] px-8 rounded-lg font-medium bg-accent text-white hover:bg-accent-hover transition-all focus:outline-none focus:ring-2 focus:ring-accent ${
                loading === "lifetime" ? "opacity-70" : ""
              }`}
            >
              {loading === "lifetime"
                ? "Redirecting..."
                : `Get lifetime access for $${currentPrice}`}
            </button>
          </AnimateIn>

          <AnimateIn variant="fade" delay={800}>
            <p className="text-sm text-muted mt-6">
              All plans include up to 20 bookmarks per email, daily delivery,
              and beautiful email formatting. Payments processed securely by
              Stripe.
            </p>
          </AnimateIn>
        </div>
      </div>

      <Footer />
    </main>
  );
}
