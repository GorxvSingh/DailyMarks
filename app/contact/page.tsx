"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-[560px] px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">Contact us</h1>
        <p className="text-muted mb-10">
          Have a question, feedback, or need help? Send us a message and
          we&apos;ll get back to you.
        </p>

        {status === "sent" ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
            <p className="text-green-800 font-medium mb-1">Message sent!</p>
            <p className="text-green-700 text-sm">
              Thanks for reaching out. We&apos;ll get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-[44px] px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-[44px] px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-accent">
                Something went wrong. Please try again or email us directly at{" "}
                <a
                  href="mailto:support@dailymarks.app"
                  className="underline"
                >
                  support@dailymarks.app
                </a>
                .
              </p>
            )}

            <Button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send message"}
            </Button>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted">
            You can also email us directly at{" "}
            <a
              href="mailto:support@dailymarks.app"
              className="text-accent hover:underline"
            >
              support@dailymarks.app
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
