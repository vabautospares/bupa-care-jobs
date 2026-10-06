import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { SupportPlans } from "@/components/support-plans";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Our Recruitment Process",
  description:
    "Registering, your profile, job search, applying for a job, the application process and how to get help from the resourcing team.",
  path: "/recruitment-process",
});

const assessments = [
  "Core competency interview",
  "Technical/function specific interview",
  "Online profiling assessment",
  "Presentation, written task, role play",
  "Assessment centre",
] as const;

export default function RecruitmentProcessPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

  return (
    <section className="bg-[var(--color-background)] py-16 sm:py-24">
      <div className="site-container max-w-4xl">
        <figure className="relative mb-12 overflow-hidden rounded-sm bg-[var(--color-navy)] animate-fade-in-up">
          <div className="relative aspect-[21/9]">
            <Image
              src="/images/caregiver-tablet.jpg"
              alt="Care worker helping an older woman use a tablet"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 56rem"
              className="object-cover"
            />
            <span aria-hidden="true" className="absolute left-0 top-0 h-14 w-14 bg-[var(--color-accent)]" />
          </div>
          <figcaption className="px-5 py-3 text-xs font-semibold text-[var(--color-muted)]">
            Photo: Andrea Piacquadio / Pexels
          </figcaption>
        </figure>

        <SectionHeading
          title="Our recruitment process"
          headingLevel="h1"
          description="Registering, your profile, job search, applying for a job and what happens next."
        />

        <div className="mt-16">
          <SectionHeading
            title="Registering and our application process"
            headingLevel="h2"
            description="From registering your interest through to the offer and onboarding."
          />

          <div className="mt-12">
            <h3 className="text-xl font-bold text-[var(--color-foreground)]">Registering</h3>
            <p className="mt-4 leading-8 text-[var(--color-muted)]">
              By registering with us for UK-based jobs, you can easily search and apply for any new jobs as they go live. This will also mean that the resourcing team will be able to match your experience to new jobs, recommending roles for you to apply to.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
               <Link href="/find-opportunities" className="btn btn-primary px-6 py-3">
                 Search our UK-based jobs
               </Link>
               <Link href="/apply/eligibility" className="btn btn-outline px-6 py-3">
                 Register your interest
               </Link>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-bold text-[var(--color-foreground)]">Your profile</h3>
            <p className="mt-4 leading-8 text-[var(--color-muted)]">
              We ask you to send a copy of your CV when applying, as this is a key part of the material that the resourcing team will review when considering any application and matching anyone to a job.
            </p>
            <p className="mt-4 leading-8 text-[var(--color-muted)]">
              If you aren&rsquo;t able to send a copy of your CV, please complete each section of your application in full and to the best of your ability, so that the system can create a CV from your information.
            </p>
            <p className="mt-4 leading-8 text-[var(--color-muted)]">
              The more detail you can provide us with, the better we&rsquo;ll be at matching you to the right job.
            </p>
            <p className="mt-4 leading-8 text-[var(--color-muted)]">
              For ease, you can also send your CV, certificates and any other supporting documents to{" "}
              {contactEmail ? (
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                >
                  {contactEmail}
                </a>
              ) : (
                <span className="font-semibold text-[var(--color-foreground)]">
                  the email address shown on this site
                </span>
              )}
              , and our team will add them to your application.
            </p>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-bold text-[var(--color-foreground)]">Job search</h3>
            <p className="mt-4 leading-8 text-[var(--color-muted)]">
              On our UK-based jobs portal, you can also type in any key words relating to your experience or the title of the job you are looking for, and relevant matches will be displayed for you.
            </p>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-bold text-[var(--color-foreground)]">Applying for a job</h3>
            <p className="mt-4 leading-8 text-[var(--color-muted)]">
              Once you have registered, applying for a job couldn&rsquo;t be simpler. Just click on the &lsquo;Apply&rsquo; option when you are viewing a job and your application will be sent to the resourcing team to review. When you submit your application you will likely be asked to answer a few pre-screening questions relevant to the particular role and asked to send a copy of your CV.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Link href="/find-opportunities" className="btn btn-primary px-6 py-3">
                View our UK-based jobs
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-bold text-[var(--color-foreground)]">Application process</h3>
            <p className="mt-4 leading-8 text-[var(--color-muted)]">
              Timescales for reviewing applications will vary by role, but you will always receive a response to your application. The recruitment process itself will vary per role, but you will be updated along the way via phone and email (so please look out for these!).
            </p>
            <p className="mt-4 leading-8 text-[var(--color-muted)]">
              If you are invited to an interview, a member of the resourcing team will be able to advise you on what to expect. This will vary by role, but will likely include an initial phone or digital interview, followed by one or more of the following forms of assessment:
            </p>
            <ul className="mt-4 space-y-2" role="list">
              {assessments.map((assessment) => (
                <li key={assessment} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                  <span className="leading-8 text-[var(--color-muted)]">{assessment}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 leading-8 text-[var(--color-muted)]">
              As this is a UK-based role, we will also carry out right to work and DBS checks before you start.
            </p>
            <p className="mt-4 leading-8 text-[var(--color-muted)]">
              If your application is successful and you&rsquo;re invited to join the team, the resourcing team will guide you through your onboarding journey.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <SupportPlans
            eyebrow="Recruitment and sponsorship support"
            title="Choose the support that suits your move to the UK"
            description="The support term covers recruitment coordination and administration of your Certificate of Sponsorship. UK government and third-party immigration costs are quoted separately."
            planNotes={{
              "three-year": "Suits you if you are looking for recruitment support across a three-year term.",
              "five-year": "Suits you if you want the same recruitment support across a five-year term.",
            }}
            ctaLabel="Start application"
            ctaHref="/apply/eligibility"
          />
        </div>

        <div className="mt-20">
          <SectionHeading
            title="Help"
            headingLevel="h2"
            description="If you can't find what you're looking for or require further help, please contact the resourcing team."
          />
          <p className="mt-4 leading-8 text-[var(--color-muted)]">
            You can email the resourcing team at{" "}
            {contactEmail ? (
              <a
                href={`mailto:${contactEmail}`}
                className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
              >
                {contactEmail}
              </a>
            ) : (
              <span className="font-semibold text-[var(--color-foreground)]">
                the email address shown on this site
              </span>
            )}
            , or send a message through our contact page and we will come back to you.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className="btn btn-primary px-6 py-3">
              Contact the resourcing team
            </Link>
          </div>
        </div>

        <div className="mt-20 flex justify-center">
          <Link href="/find-opportunities" className="btn btn-primary px-8 py-4 text-lg shadow-md hover:shadow-lg">
            View available opportunities
          </Link>
        </div>
      </div>
    </section>
  );
}
