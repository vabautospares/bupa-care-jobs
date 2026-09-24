# Architecture

## Runtime shape

```mermaid
flowchart LR
    Browser[Next.js browser client]
    NextServer[Next.js App Router server]
    OpportunitiesSheet[Google Sheet: opportunities]
    ApplicationsSheet[Google Sheet: applications]
    Storage[Cloud file storage]
    WhatsApp[WhatsApp handoff]
    Paystack[Payment link (Paystack)]

    Browser -->|read-only search requests| NextServer
    NextServer -->|Google API with server credentials| OpportunitiesSheet
    NextServer -->|validated application write| ApplicationsSheet
    Browser -->|upload request| NextServer
    NextServer -->|provider adapter| Storage
    NextServer -->|file reference, never file bytes| ApplicationsSheet
    Browser -->|configured handoff link| WhatsApp
    Browser -->|payment link| Paystack
```

## Routes reserved for later phases

| Route | Responsibility |
|---|---|
| `GET /api/opportunities` | Read and filter opportunity rows from the opportunities Sheet. |
| `POST /api/applications` | Validate an application, store uploaded file references, and write one application row. |
| `/find-opportunities` | Search and category entry points. |
| `/apply` | Application form and plan/terms flow. |
| `/confirmation` | Successful-submission confirmation with payment link. |
| `/care-careers` | Broader working-in-care information. |
| `/terms-and-conditions` | Editable Terms content and version display. |
| `/privacy-notice` | Editable Privacy content. |
| `/cookie-information` | Editable Cookie content. |
| `/accessibility` | Editable Accessibility content. |

## Data boundaries

- Opportunity rows are read-only from the dedicated opportunities Sheet.
- Application rows are written through a server route; browser code never receives Google credentials.
- CVs and certificates are stored through a provider adapter. Only stable references and metadata are written to the application Sheet.
- The WhatsApp destination is server configuration. The handoff URL contains no application or personal data.
- The Paystack payment link is server configuration. The payment URL contains no application or personal data.
- Legal content is data-driven and can be replaced without changing route or submission logic.

## Deployment shape

- Vercel hosts the Next.js application.
- Environment variables hold deployment-specific Sheet IDs, credentials, storage settings, contact settings, terms version, and the Paystack payment URL.
- Build output is standalone-compatible for straightforward deployment.
