# Job Search Specification

## Goal
Provide a simple first-version opportunity finder without building a complex recruitment marketplace.

## Inputs
### Keyword
Placeholder:
**Job title or keyword**

Examples:
- Care Assistant
- Support Worker
- Nurse

### Location
Placeholder:
**Town, city or postcode**

## Search behaviour
- Trim whitespace
- Handle empty fields
- Support case-insensitive matching
- Show a clear no-results state
- Preserve entered search terms
- Allow clearing/resetting the search
- Work on mobile and desktop
- Support keyboard submission

## Categories
Include:
- Care Assistant
- Senior Care Assistant
- Support Worker
- Healthcare Assistant
- Registered Nurse
- Senior Carer
- Live-in Carer
- Home Care Worker
- Dementia Care Worker
- Other care roles

## Initial data strategy
Keep the implementation compatible with a lightweight Google Sheets-backed dataset.

Suggested opportunity fields:
- id
- title
- location
- description
- category
- employment_type
- availability
- active

Do not add employer dashboards or complex vacancy management.
