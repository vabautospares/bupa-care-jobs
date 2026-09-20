# Google Sheets Integration

## Goal
Use Google Sheets as the initial simple datastore.

## Recommended sheet columns
- application_id
- submitted_at
- full_name
- email
- phone
- whatsapp
- country
- uk_location
- role
- preferred_location
- work_type
- employment_preference
- availability
- care_experience
- years_experience
- qualifications
- cv_reference
- selected_plan
- initial_payment
- terms_version
- terms_accepted
- terms_accepted_at
- status

## Architecture
Prefer a secure server-side/API layer or approved serverless endpoint between the browser and Google Sheets.

Do not place:
- Google service-account credentials
- private API keys
- OAuth client secrets
- spreadsheet write credentials

in frontend JavaScript.

## Error handling
If Sheets submission fails:
- Tell the user clearly
- Do not falsely say the application was submitted
- Preserve form information where practical
- Offer a retry
- Log technical details server-side only

## Status
Default new application status:
**New**

Later statuses can be added without changing the frontend form.
