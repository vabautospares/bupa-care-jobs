import { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about care jobs and the application process.",
};

export default function FaqsPage() {
  const faqs = [
    {
      question: "What is Bupa Care Jobs?",
      answer:
        "Bupa Care Jobs is a platform where applicants can explore available care opportunities and apply for roles that match their experience and interests.",
    },
    {
      question: "Who can apply?",
      answer:
        "The platform is available to people interested in available care opportunities, including applicants already in the UK and those exploring opportunities from overseas.",
    },
    {
      question: "How do I find available care jobs?",
      answer:
        "Use the **Find Opportunities** page to search available jobs by job title, keyword or location. You can also use the available category and location filters.",
    },
    {
      question: "How do I apply for a job?",
      answer:
        "Select an opportunity you are interested in, review the job details and select **Apply for this job**. Complete the application form, choose your recruitment support term, review the Terms & Conditions and submit your application.",
    },
    {
      question: "What information do I need to provide?",
      answer:
        "You will be asked to provide personal, contact, employment preference and experience information. You should make sure the information you provide is accurate.",
    },
    {
      question: "Do I need to upload my CV or certificates?",
      answer:
        "Supporting documents are not uploaded during the current application process. Supporting documents may be requested later.",
    },
    {
      question: "What recruitment and sponsorship support terms are available?",
      answer:
        "Two recruitment and sponsorship support terms are available:\n\n**3-Year Recruitment & Sponsorship Support: £4,000 total company service fee**\n\n* Deposit (due before application review): £1,000\n* Remaining balance (instalments after employment starts): £3,000\n\n**5-Year Recruitment & Sponsorship Support: £6,000 total company service fee**\n\n* Deposit (due before application review): £1,000\n* Remaining balance (instalments after employment starts): £5,000\n\nThe company service fee covers recruitment coordination and Certificate of Sponsorship administration. UK government and third-party immigration costs are quoted separately before payment.\n\nA Certificate of Sponsorship does not guarantee employment or visa approval.",
    },
    {
      question: "Is payment completed on the website?",
      answer:
        "No. Payment is not completed on the website. After submitting your application, our team will provide guidance on the next steps, including payment.",
    },
    {
      question: "What happens after I submit my application?",
      answer:
        "You will receive a confirmation showing your application ID and selected support term. You can then follow up with our team on WhatsApp for guidance on the next steps.",
    },
    {
      question: "Can I contact the team if I need help?",
      answer:
        "Yes. You can contact our team through WhatsApp for help with your application, the application process, your application details, support term information or next steps after submitting an application. If you have already submitted an application, please have your application ID available when contacting our team.",
    },
  ];

  return (
    <section className="bg-[var(--color-background)] py-12 sm:py-16">
      <div className="site-container max-w-3xl">
        <SectionHeading
          title="Frequently Asked Questions"
          description="Find answers to common questions about finding care opportunities, applying and taking the next step."
          align="center"
        />

        <div className="mt-12 space-y-4" role="list">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="card p-6 group animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
              role="listitem"
            >
              <summary className="flex cursor-pointer items-center justify-between list-none text-base font-semibold text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 rounded-md">
                {faq.question}
                <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center transition-transform group-open:rotate-180 text-[var(--color-muted)]" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-[var(--color-muted)] whitespace-pre-line leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}