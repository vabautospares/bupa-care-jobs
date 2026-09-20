# Application Form Specification

## Goal
Create a clean, accessible application form that collects the information required to understand an applicant and record their selected service plan.

## Sections

### Personal details
- Full name
- Email address
- Telephone number
- WhatsApp number
- Country of residence
- Current UK location, if applicable

### Opportunity
- Job/role interested in
- Preferred location
- Preferred work type
- Full-time / part-time preference
- Availability

### Experience
- Previous care experience
- Years of experience
- Relevant qualifications
- Current employment status

### Supporting information
- CV upload if supported by the chosen implementation
- Relevant certificates if supported

## Service plan
Provide clear selection:
- 3 years — £4,000
- 5 years — £6,000

Show:
- Initial payment — £1,000

Do not hide pricing.

## Terms
Before submission, provide a clear link to Terms & Conditions and a required checkbox:
**I have read and agree to the Terms & Conditions.**

The form must not submit until required fields and agreement are valid.

## Validation
- Required fields have visible labels
- Inline validation
- Human-readable error messages
- Email validation
- Phone/WhatsApp validation
- Prevent duplicate rapid submissions
- Show success and failure states
- Do not silently discard entered data

## Submission
On successful submission:
1. Send structured application data to Google Sheets through the chosen secure integration.
2. Record timestamp and selected plan.
3. Show confirmation.
4. Provide/trigger the WhatsApp handoff.

Never expose Google API keys or service credentials in client-side code.
