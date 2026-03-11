"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

interface UserPreferences {
  xUsername: string;
  xDisplayName: string | null;
  email: string | null;
  bookmarkCount: number;
  isActive: boolean;
  lastDigestAt: string | null;
  plan: string;
  planExpiresAt: string | null;
}

export default function DashboardPage() {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [email, setEmail] = useState("");
  const [bookmarkCount, setBookmarkCount] = useState(5);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/preferences")
      .then((r) => r.json())
      .then((data) => {
        setPrefs(data);
        setEmail(data.email || "");
        setBookmarkCount(data.bookmarkCount);
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
        body: JSON.stringify({ email, bookmarkCount, isActive }),
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

  if (!prefs) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="w-full border-b border-border/50">
        <div className="mx-auto max-w-content flex items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter">
            <Logo size={28} />
            Daily<span className="text-accent">Marks</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">
              @{prefs.xUsername}
            </span>
            <Button href="/api/auth/logout" variant="ghost" size="sm">
              Log out
            </Button>
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
        <div className="mb-8 p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {prefs.plan === "free" ? "Free plan" : (
                  <>
                    {prefs.plan.charAt(0).toUpperCase() + prefs.plan.slice(1)} plan
                    {prefs.plan === "lifetime" && (
                      <span className="ml-2 text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                        Lifetime
                      </span>
                    )}
                  </>
                )}
              </p>
              <p className="text-sm text-muted">
                {prefs.plan === "free"
                  ? "Upgrade to unlock up to 20 bookmarks per digest"
                  : prefs.plan === "lifetime"
                  ? "You have lifetime access"
                  : prefs.planExpiresAt
                  ? `Renews ${new Date(prefs.planExpiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
                  : "Active subscription"}
              </p>
            </div>
            {prefs.plan === "free" && (
              <a
                href="/pricing"
                className="text-sm font-medium text-accent hover:underline"
              >
                Upgrade
              </a>
            )}
          </div>
        </div>

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

        {/* Active toggle */}
        <div className="mb-8 flex items-center justify-between p-4 rounded-lg border border-border">
          <div>
            <p className="font-medium">Daily digest</p>
            <p className="text-sm text-muted">
              {isActive
                ? "You will receive bookmarks every morning"
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
