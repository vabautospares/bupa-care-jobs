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
- salary
- active

`salary` is optional. When the sheet provides it, the vacancy card shows the employer's own pay for that role. When it is missing, the card is shown without a pay figure rather than guessing one.

## Pay guidance
Where a vacancy has no pay figure, the role cards use the typical UK ranges held in `src/data/homepage.ts` (`jobCategories.salary` for each role, plus `SALARY_GUIDANCE_NOTE`). These are market ranges, not an offer: the employer sets the rate for each vacancy and confirms it in the offer. Update them when the advertised rates move.

Do not add employer dashboards or complex vacancy management.
