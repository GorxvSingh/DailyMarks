"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-content flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={28} />
          <span className="text-xl font-bold tracking-tighter">
            Daily<span className="text-accent">Marks</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
