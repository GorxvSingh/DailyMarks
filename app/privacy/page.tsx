import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - DailyMarks",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-[720px] px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted mb-10">
          Last updated: March 11, 2026
        </p>

        <div className="space-y-8 text-[15px] leading-relaxed text-foreground/90">
          <section>
            <h2 className="text-lg font-semibold mb-3">
              1. Information We Collect
            </h2>
            <p>
              When you sign in with your X (Twitter) account, we collect and
              store the following information:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-muted">
              <li>Your X user ID, username, and display name</li>
              <li>OAuth access and refresh tokens (used solely to fetch your bookmarks)</li>
              <li>The email address you provide for digest delivery</li>
              <li>Your preference settings (bookmark count, active/paused status)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              2. How We Use Your Information
            </h2>
            <p>We use your information exclusively to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-muted">
              <li>Authenticate your identity via X OAuth 2.0</li>
              <li>Fetch your bookmarked posts from X on your behalf</li>
              <li>Send your daily bookmark digest to your email address</li>
              <li>Track which bookmarks have been sent to avoid duplicates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              3. Data Storage and Security
            </h2>
            <p>
              Your data is stored in a secure database. OAuth tokens are used
              only to communicate with the X API and are never shared with third
              parties. We do not sell, trade, or rent your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              4. Third-Party Services
            </h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-muted">
              <li>
                <strong>X (Twitter) API</strong> - to read your bookmarked posts
              </li>
              <li>
                <strong>Resend</strong> - to deliver your digest emails
              </li>
            </ul>
            <p className="mt-2">
              Each service has its own privacy policy governing how they handle
              your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              5. Data Retention and Deletion
            </h2>
            <p>
              You can disconnect your account at any time from the dashboard.
              When you disconnect, we revoke your OAuth tokens and delete your
              account data. Sent bookmark records are removed along with your
              account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              6. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-muted">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Pause or stop your daily digest at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">7. Contact</h2>
            <p>
              If you have questions about this privacy policy, please reach out
              via our{" "}
              <a href="/contact" className="text-accent hover:underline">
                contact page
              </a>
              .
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
