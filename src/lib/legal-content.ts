import { DEFAULT_TERMS_VERSION } from "@/lib/service-plans";
import { getContactConfig } from "@/lib/config";

export const termsVersion = process.env.TERMS_VERSION?.trim() || DEFAULT_TERMS_VERSION;

export const legalContent = {
  terms: {
    status: "approved",
    title: "Terms & Conditions for Applicants",
    body: [
      "Please read these Terms & Conditions carefully before submitting your application.",
      "",
      "### Applicant information",
      "",
      "Applicants must provide accurate and complete information when submitting an application.",
      "",
      "### Opportunities",
      "",
      "Care opportunities may change or become unavailable without notice.",
      "",
      "### Plans and payment",
      "",
      "Two service plans are available:",
      "",
      "**3 Years — £4,000 total**",
      "",
      "* Initial payment: £1,000",
      "* Remaining balance: £3,000",
      "",
      "**5 Years — £6,000 total**",
      "",
      "* Initial payment: £1,000",
      "* Remaining balance: £5,000",
      "",
      "Payment is not processed or completed on this website.",
      "",
      "### Supporting documents",
      "",
      "Supporting documents may be requested later as part of the application process.",
      "",
      "### Updates",
      "",
      "Terms & Conditions may be updated from time to time.",
      "",
      "### Contact",
      "",
      (() => {
        try {
          const { email, whatsappNumber } = getContactConfig();
          const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello, I have completed an application and would like help with the next steps.")}`;
          return `For questions about these terms, you can contact us via [email](${email}) or [WhatsApp](${whatsappLink}).`;
        } catch {
          return "For questions about these terms, please contact us via the channels on our Contact page.";
        }
      })(),
      "",
      "Last updated: 2026",
    ],
  },
  privacy: {
    status: "approved",
    title: "Privacy Notice for Applicants",
    body: [
      "This Privacy Notice explains how Bupa Care Jobs collects, uses and protects your personal information when you use our website and apply for care opportunities.",
      "",
      "We respect your privacy and are committed to protecting the personal information you provide when using Bupa Care Jobs.",
      "",
      "### Information we collect",
      "",
      "The website may collect information such as:",
      "",
      "* Name",
      "* Email address",
      "* Phone number",
      "* WhatsApp number",
      "* Country",
      "* Location",
      "* Employment preferences",
      "* Care experience",
      "* Application information",
      "",
      "### How information is used",
      "",
      "Information may be used to:",
      "",
      "* Process applications",
      "* Communicate with applicants",
      "* Provide application guidance",
      "* Manage available opportunities",
      "* Improve the service",
      "",
      "### Google services",
      "",
      "Application information is managed using Google services, including Google Sheets, as part of the application process.",
      "",
      "### WhatsApp",
      "",
      "WhatsApp may be used to communicate with applicants regarding their application and next steps.",
      "",
      "### Service providers",
      "",
      "Information may be shared with service providers that help operate the application service where necessary.",
      "",
      "### Selling information",
      "",
      "**We do not sell personal information.**",
      "",
      "### Retention",
      "",
      "Personal information is retained only for as long as reasonably necessary for the purposes described in this Privacy Notice.",
      "",
      "### Applicant rights",
      "",
      "Applicants may request:",
      "",
      "* Access to their personal information",
      "* Correction of inaccurate information",
      "* Deletion of their information",
      "",
      "### Cookies",
      "",
      "See our [Cookie Information](/cookie-information) page for details on cookie usage.",
      "",
      "### Contact",
      "",
      (() => {
        try {
          const { email, whatsappNumber } = getContactConfig();
          const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello, I have completed an application and would like help with the next steps.")}`;
          return `For privacy-related queries, you can contact us via [email](${email}) or [WhatsApp](${whatsappLink}).`;
        } catch {
          return "For privacy-related queries, contact us via the channels on our Contact page.";
        }
      })(),
      "",
      "Last updated: 2026",
    ],
  },
  cookies: {
    status: "approved",
    title: "Cookie Information",
    body: [
      "This Cookie Information explains how cookies and similar technologies may be used when you visit Bupa Care Jobs.",
      "",
      "### Essential cookies",
      "",
      "Essential cookies may be used to support core website functionality.",
      "",
      "### Analytics",
      "",
      "Analytics cookies may be used to understand how visitors use the website and help improve the service.",
      "",
      "### Advertising",
      "",
      "**Bupa Care Jobs does not currently use advertising or marketing cookies.**",
      "",
      "### Browser controls",
      "",
      "Users can manage or disable cookies through their browser settings.",
      "",
      "Disabling certain cookies may affect some website functionality.",
      "",
      "### Third-party services",
      "",
      "Third-party services used by the website may use cookies or similar technologies according to their own policies.",
      "",
      "### Privacy",
      "",
      "See our [Privacy Notice](/privacy-notice) for more information.",
      "",
      "### Contact",
      "",
      (() => {
        try {
          const { email, whatsappNumber } = getContactConfig();
          const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello, I have completed an application and would like help with the next steps.")}`;
          return `For questions about our cookie usage, you can contact us via [email](${email}) or [WhatsApp](${whatsappLink}).`;
        } catch {
          return "For questions about our cookie usage, please contact us via the channels on our Contact page.";
        }
      })(),
      "",
      "Last updated: 2026",
    ],
  },
  accessibility: {
    status: "approved",
    title: "Accessibility",
    body: [
      "Bupa Care Jobs aims to provide a website that is accessible and usable for applicants.",
      "",
      "### Keyboard navigation",
      "",
      "The website is designed to support navigation using a keyboard.",
      "",
      "### Screen readers",
      "",
      "Content and page structure are designed with screen-reader users in mind.",
      "",
      "### Clear content",
      "",
      "Use clear text, headings and understandable navigation.",
      "",
      "### Contrast",
      "",
      "Maintain sufficient visual contrast for readable content.",
      "",
      "### Mobile accessibility",
      "",
      "The website is designed to remain usable across mobile devices and different screen sizes.",
      "",
      "### Reporting accessibility problems",
      "",
      (() => {
        try {
          const { email, whatsappNumber } = getContactConfig();
          const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello, I have completed an application and would like help with the next steps.")}`;
          return `Applicants can contact the team using [email](${email}) or [WhatsApp](${whatsappLink}) if they experience an accessibility problem.`;
        } catch {
          return "Applicants can contact the team using the existing contact/WhatsApp details if they experience an accessibility problem.";
        }
      })(),
      "",
      "### Continuous improvement",
      "",
      "Accessibility will be reviewed and improved as the website develops.",
      "",
      "Last updated: 2026",
    ],
  },
};