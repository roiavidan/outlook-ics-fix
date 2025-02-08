# Outlook ICS Fix

This repository contains a small NodeJS script that provides a proxy for fixing an exported/public/shared Outlook ICS.

It comes to solve the annoying issue Microsoft has been aware of and persistently ignored up to this moment, which is setting the wrong Timezone value for calendar events.
This results in a messed up view of Outlook events in calendars such as Google Calendar.

This script is designed specifically for my need.
It fixes the `Australia/Melbourne` screw-up, but feel free to change it to sort out yours.

### Deployment

I used AWS to deploy this script as a `Lambda` with an open `Lambda URL` endpoint.
AWS provides a free-tier which allows me to run this code easily without incurring any costs.

You may choose to do the same, or not ...

> *NOTE:* It's not the "most secure" option out there, I agree, but considering I do not expose any private information here and someone bothering to hack my AWS account somehow and changes this lambda, will at most be able to give me partial or wrong calendar events (which are extremely easy to confirm against the original calendar), I conider the overall risk profile is very low.

### Accessing the deployed endpoint

If you choose to deploy as suggested, you'll end up with a URL that looks like this: `https://<something>.lambda-url.<region>.on.aws/`.

Getting your ICS fixed will require you to use this url in your Google (or any other) calendar instead of the original one:

`https://<something>.lambda-url.<region>.on.aws/ics-fix?url=<original_outlook_shared_ics_url>`
