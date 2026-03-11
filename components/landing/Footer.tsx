import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="bg-[#1e1e1e] dark:bg-[#050505] text-white/70">
      <div className="mx-auto max-w-content px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <Logo size={24} />
              <span className="text-lg font-bold text-white tracking-tighter">
                Daily<span className="text-accent">Marks</span>
              </span>
            </div>
            <p className="text-sm mt-1">
              Your X bookmarks, delivered to your inbox.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm">
          &copy; {new Date().getFullYear()} DailyMarks. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
