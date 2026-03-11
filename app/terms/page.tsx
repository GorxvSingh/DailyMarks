import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - DailyMarks",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-[720px] px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-muted mb-10">
          Last updated: March 11, 2026
        </p>

        <div className="space-y-8 text-[15px] leading-relaxed text-foreground/90">
          <section>
            <h2 className="text-lg font-semibold mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using DailyMarks, you agree to be bound by these
              Terms of Service. If you do not agree, please do not use the
              service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              2. Description of Service
            </h2>
            <p>
              DailyMarks is a service that fetches your saved X (Twitter)
              bookmarks and delivers a curated selection to your email inbox on
              a daily basis. You control how many bookmarks (1–20) are included
              in each digest.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              3. Account and Authentication
            </h2>
            <p>
              To use DailyMarks, you must sign in with your X account via
              OAuth 2.0. You are responsible for maintaining the security of
              your X account. DailyMarks is not responsible for any
              unauthorized access resulting from your failure to protect your
              account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              4. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-muted">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>
                Use automated means to access the service beyond its intended
                functionality
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              5. X API and Third-Party Terms
            </h2>
            <p>
              Your use of DailyMarks is also subject to X&apos;s Terms of
              Service and Developer Agreement. We access your bookmarks through
              the X API and are bound by their usage policies. Any changes to
              the X API that affect bookmark access may impact the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              6. Service Availability
            </h2>
            <p>
              We strive to keep DailyMarks available and reliable, but we do
              not guarantee uninterrupted service. The service may be
              temporarily unavailable due to maintenance, updates, or
              circumstances beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              DailyMarks is provided &ldquo;as is&rdquo; without warranties of
              any kind. We are not liable for any indirect, incidental, or
              consequential damages arising from your use of the service,
              including but not limited to missed or delayed email deliveries.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              8. Termination
            </h2>
            <p>
              You may stop using DailyMarks at any time by disconnecting your
              account from the dashboard. We reserve the right to suspend or
              terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              9. Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. Continued use of the
              service after changes are posted constitutes acceptance of the
              revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">10. Contact</h2>
            <p>
              Questions about these terms? Reach out via our{" "}
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
