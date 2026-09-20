import { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { legalContent } from "@/lib/legal-content";
import { getContactConfig } from "@/lib/config";
import ReactMarkdown from "react-markdown";

export const metadata: Metadata = {
  title: "Accessibility Statement | Bupa Care Jobs",
  description: "Accessibility statement for Bupa Care Jobs.",
};

function LegalContent({ content }: { content: string }) {
  return (
    <div className="prose text-[var(--color-foreground)] max-w-none space-y-6">
      <ReactMarkdown
        components={{
          h2: ({ children }) => <h2 className="mt-8 mb-4 text-2xl font-bold text-[var(--color-foreground)]">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-6 mb-3 text-xl font-bold text-[var(--color-foreground)]">{children}</h3>,
          p: ({ children }) => <p className="text-[var(--color-muted)] leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-bold text-[var(--color-foreground)]">{children}</strong>,
          em: ({ children }) => <em className="italic text-[var(--color-muted)]">{children}</em>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)]">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 text-[var(--color-muted)]">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href ?? "#"}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-[var(--color-accent)] hover:underline font-medium"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function AccessibilityPage() {
  const accessibility = legalContent.accessibility;
  const { whatsappUsername, email: contactEmail } = getContactConfig();
  const whatsappLink = `https://wa.me/${whatsappUsername}?text=${encodeURIComponent("Hello, I have a question about accessibility.")}`;

  const markdownContent = accessibility.body.join("\n\n");

  return (
    <section className="bg-[var(--color-background)] py-12 sm:py-16">
      <div className="site-container max-w-3xl">
        <header className="mb-10 animate-fade-in-up">
          <SectionHeading eyebrow="Legal" title={accessibility.title} />
        </header>

        <article className="animate-fade-in-up delay-1">
          <LegalContent content={markdownContent} />
        </article>

        <div className="mt-12 animate-fade-in-up delay-2">
          <SectionHeading title="Our Commitment" />
          <div className="mt-6 card p-6">
            <p className="text-[var(--color-muted)]">
              We are committed to making our website accessible to everyone. If you encounter any accessibility barriers, please let us know.
            </p>
          </div>
        </div>

        <div className="mt-12 animate-fade-in-up delay-2">
          <SectionHeading title="Contact" />
          <div className="mt-6 card p-6">
            <p className="text-[var(--color-muted)]">
              If you have any questions about accessibility or need to report an issue, please contact us:
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto"
              >
                Contact via WhatsApp
              </a>
              <a
                href={`mailto:${contactEmail}`}
                className="btn-secondary w-full sm:w-auto"
              >
                Email us
              </a>
            </div>
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-[var(--color-border)] animate-fade-in-up delay-3">
          <p className="text-sm text-[var(--color-muted)] text-center">
            Last updated: 2026
          </p>
        </footer>
      </div>
    </section>
  );
}