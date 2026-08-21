# Work.ink deployment notes

The Vercel project configuration is accessible through the authenticated `sotariumus` project settings. The required server-only environment variable is:

```text
WORKINK_BASE_LINK=https://work.ink/2dbK/sotarium-opera-browser-checkpoint
```

The value must be applied to Production and Preview environments before the `/api/workink` endpoint can generate override URLs.

## Current configuration status

The settings page was initially accessible in the connected browser but then reverted to the Vercel login screen while the environment-variable form was loading. The sandbox Vercel CLI is also logged out, and the configured Vercel management integration has no environment-variable mutation action. The production configuration therefore remains pending authenticated Vercel access.

The browser session was restored and the environment-variable form opened with `WORKINK_BASE_LINK` entered as the key, but the connected browser extension timed out before the value could be entered or saved. No variable was created during that timeout.

**Completed:** `WORKINK_BASE_LINK` was then successfully added as a sensitive environment variable for both **Production** and **Preview**. Vercel reports that a new deployment is required for the setting to take effect; the upcoming GitHub push will create that deployment.

The authenticated Supabase SQL editor for project `easqbdadxctsixvtttax` was available. A new table is not required: the final provider implementation reuses the already deployed, server-only `earnpaste_sessions` table and distinguishes Work.ink sessions through the generated Work.ink checkpoint URL. The attempted optional-table query did not execute, and no further database migration is required.
