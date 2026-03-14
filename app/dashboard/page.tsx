"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

interface UserPreferences {
  xUsername: string;
  xDisplayName: string | null;
  email: string | null;
  bookmarkCount: number;
  digestTime: string;
  timezone: string;
  isActive: boolean;
  lastDigestAt: string | null;
  plan: string;
  planExpiresAt: string | null;
}

const PLANS = [
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
  {
    name: "Lifetime",
    price: "$40",
    period: "one-time",
    plan: "lifetime",
    desc: "Pay once, keep forever",
  },
];

function formatHour(hour: number): string {
  if (hour === 0) return "12:00 AM";
  if (hour === 12) return "12:00 PM";
  if (hour < 12) return `${hour}:00 AM`;
  return `${hour - 12}:00 PM`;
}

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
  value: `${String(i).padStart(2, "0")}:00`,
  label: formatHour(i),
}));

export default function DashboardPage() {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [email, setEmail] = useState("");
  const [bookmarkCount, setBookmarkCount] = useState(5);
  const [digestTime, setDigestTime] = useState("08:00");
  const [timezone, setTimezone] = useState("America/New_York");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Detect browser timezone
    const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(detectedTz);

    fetch("/api/preferences")
      .then((r) => r.json())
      .then((data) => {
        setPrefs(data);
        setEmail(data.email || "");
        setBookmarkCount(data.bookmarkCount);
        setDigestTime(data.digestTime || "08:00");
        setTimezone(data.timezone || detectedTz);
        setIsActive(data.isActive);
      })
      .catch(() => {
        window.location.href = "/";
      });
  }, []);

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, bookmarkCount, digestTime, timezone, isActive }),
      });
      if (res.ok) {
        setMessage("Preferences saved!");
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to save");
      }
    } catch {
      setMessage("Failed to save preferences");
    }
    setSaving(false);
  }

  async function handleCheckout(plan: string) {
    setCheckoutLoading(plan);
    setCheckoutError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (res.status === 401) {
        window.location.href = "/api/auth/login";
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setCheckoutError(data.error || `Error ${res.status}: Something went wrong`);
        setCheckoutLoading(null);
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error || "Something went wrong");
      }
    } catch {
      setCheckoutError("Something went wrong. Please try again.");
    }
    setCheckoutLoading(null);
  }

  if (!prefs) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const hasPlan = prefs.plan !== "free";
  const detectedTz = typeof window !== "undefined"
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : "America/New_York";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="w-full border-b border-border/50">
        <div className="mx-auto max-w-content flex items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter">
            <Logo size={28} />
            Daily<span className="text-accent">Marks</span>
          </a>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-surface-light transition-colors"
              aria-label="Menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="5" x2="17" y2="5" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="15" x2="17" y2="15" />
              </svg>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-border bg-background shadow-lg z-50 py-1">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm text-muted">@{prefs.xUsername}</p>
                  </div>
                  {hasPlan && prefs.plan !== "lifetime" && (
                    <button
                      onClick={async () => {
                        setMenuOpen(false);
                        try {
                          const res = await fetch("/api/billing", { method: "POST" });
                          const data = await res.json();
                          if (data.url) {
                            window.location.href = data.url;
                          }
                        } catch {
                          // silently fail
                        }
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-light transition-colors"
                    >
                      Manage membership
                    </button>
                  )}
                  <a
                    href="/api/auth/logout"
                    className="block px-4 py-2.5 text-sm hover:bg-surface-light transition-colors"
                  >
                    Log out
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Dashboard content */}
      <div className="mx-auto max-w-[640px] px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tighter mb-2">
          Your preferences
        </h1>
        <p className="text-muted mb-10">
          Configure how your daily bookmark digest is delivered.
        </p>

        {/* Plan status */}
        {hasPlan ? (
          <div className="mb-8 p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {prefs.plan.charAt(0).toUpperCase() + prefs.plan.slice(1)} plan
                  {prefs.plan === "lifetime" && (
                    <span className="ml-2 text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                      Lifetime
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted">
                  {prefs.plan === "lifetime"
                    ? "You have lifetime access"
                    : prefs.planExpiresAt
                    ? `Renews ${new Date(prefs.planExpiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                    : "Active subscription"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4">Select a plan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PLANS.map((p) => (
                <button
                  key={p.plan}
                  onClick={() => handleCheckout(p.plan)}
                  disabled={checkoutLoading !== null}
                  className={`rounded-xl border border-border hover:border-accent p-5 text-left transition-all focus:outline-none focus:ring-2 focus:ring-accent ${
                    checkoutLoading === p.plan ? "opacity-70" : ""
                  }`}
                >
                  <p className="text-sm text-muted mb-1">{p.name}</p>
                  <p className="text-2xl font-bold tracking-tight mb-1">
                    {p.price}
                    <span className="text-sm font-normal text-muted ml-1">
                      {p.period}
                    </span>
                  </p>
                  <p className="text-xs text-muted">{p.desc}</p>
                  <div className="mt-3 w-full h-[36px] rounded-lg font-medium text-sm bg-accent text-white flex items-center justify-center">
                    {checkoutLoading === p.plan ? "Redirecting..." : "Get started"}
                  </div>
                </button>
              ))}
            </div>
            {checkoutError && (
              <p className="mt-3 text-sm text-red-600">{checkoutError}</p>
            )}
          </div>
        )}

        {/* Email */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full h-[44px] px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <p className="text-xs text-muted mt-1">
            We&apos;ll send your daily bookmark digest to this address.
          </p>
        </div>

        {/* Bookmark count */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            Bookmarks per email:{" "}
            <span className="text-accent font-bold">{bookmarkCount}</span>
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={bookmarkCount}
            onChange={(e) => setBookmarkCount(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>1</span>
            <span>20</span>
          </div>
        </div>

        {/* Delivery time */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            Delivery time
          </label>
          <select
            value={digestTime}
            onChange={(e) => setDigestTime(e.target.value)}
            className="w-full h-[44px] px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted mt-1">
            Your timezone: {detectedTz}
          </p>
        </div>

        {/* Active toggle */}
        <div className="mb-8 flex items-center justify-between p-4 rounded-lg border border-border">
          <div>
            <p className="font-medium">Daily digest</p>
            <p className="text-sm text-muted">
              {isActive
                ? "You will receive bookmarks daily"
                : "Digest is paused"}
            </p>
          </div>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              isActive ? "bg-accent" : "bg-border"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                isActive ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Last digest info */}
        {prefs.lastDigestAt && (
          <p className="text-sm text-muted mb-8">
            Last digest sent:{" "}
            {new Date(prefs.lastDigestAt).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {/* Save button */}
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save preferences"}
        </Button>

        {message && (
          <p
            className={`mt-4 text-sm ${
              message.includes("saved") ? "text-green-600" : "text-accent"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
