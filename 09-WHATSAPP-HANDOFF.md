# WhatsApp Handoff

## Goal
After a successful application and Terms & Conditions acceptance, provide a clear route to WhatsApp for assistance and payment information.

## Flow
Application submitted successfully
→ Confirmation page
→ Explain that the next step is to contact support on WhatsApp
→ Button: **Continue on WhatsApp**

## Message
Use a short pre-filled message containing only appropriate application context, for example:
“Hello, I have completed an application and would like help with the next steps.”

Do not put sensitive personal information into the WhatsApp URL.

## Failure handling
If WhatsApp cannot be opened, show a normal contact alternative.

## Configuration
Keep the WhatsApp destination configurable in one environment/configuration location. Do not scatter the number throughout the codebase.
