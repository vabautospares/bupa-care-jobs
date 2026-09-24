# Phase 0 Decisions

## Status

Phase 0 decisions are recorded on 2026-09-17. Implementation decisions are approved by the project owner. Legal wording remains explicitly pending approval.

## Approved decisions

| Area | Decision | Status |
|---|---|---|
| Technology stack | Next.js, React, TypeScript, Tailwind CSS | Approved |
| Hosting | Vercel | Approved |
| Opportunity data | Read from a separate Google Sheet | Approved |
| Application data | Write through a server-side API layer to a separate Google Sheet | Approved |
| File storage | Use cloud storage behind a replaceable storage adapter; do not store large files in Sheets | Approved |
| WhatsApp | Use `+44 7708 251658`; keep it in server-side configuration only | Approved |
| Contact email | Use `bupacareeers@gmail.com` | Approved |
| Care Careers route | Separate page, not the homepage | Approved |
| Application order | Form → select plan → review Terms → accept Terms → submit → save to Sheets → confirmation → WhatsApp | Approved |
| Legal content | Dedicated editable content modules with clearly marked placeholders until approved | Approved |
| Payments | Payment link (Paystack) on confirmation page — approved | Approved |
| Sponsorship and accounts | No sponsorship, employer portal, applicant portal, CMS, or complex database in version 1 | Confirmed by source documents |

## Configuration boundaries

- `NEXT_PUBLIC_*` variables are limited to non-secret browser configuration.
- Google credentials, the WhatsApp number, storage credentials, and server-only integration settings remain outside client bundles.
- The WhatsApp number is read from one server-side environment configuration.
- The initial payment, terms version, plan IDs, storage credentials, and legal placeholders are present in `.env.example` as replaceable examples.
- File storage is represented by an adapter interface. A provider implementation is intentionally not selected in Phase 0.

## Open Phase 0 inputs

| Input | Owner | Required before |
|---|---|---|
| Google application Sheet ID and service-account credentials | Project owner / integration owner | Phase 5 |
| Google opportunities Sheet ID, tab name, and column mapping | Project owner / integration owner | Phase 3 |
| Cloud storage provider and bucket/container details | Project owner / integration owner | File-upload implementation |
| Approved Terms & Conditions | Legal adviser / project owner | Launch |
| Approved Privacy Notice, Cookie Information, and Accessibility content | Legal adviser / project owner | Launch |
| Confirmed `terms_version` for approved legal copy | Project owner / legal adviser | Launch |

## Phase 0 acceptance

- [x] Stack and hosting selected.
- [x] Opportunity and application Sheet roles separated.
- [x] Secure server-side integration boundary defined.
- [x] File storage replacement boundary defined.
- [x] WhatsApp and contact configuration boundaries defined.
- [x] Care Careers route decision recorded.
- [x] Application and acceptance order recorded.
- [x] Editable placeholder legal-content structure created.
- [x] Page/content ownership map created.
- [x] Implementation checklist created.
