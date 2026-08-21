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

## Live interface check

The deployment at `https://sotarium.vercel.app/` is live. The provider picker shows **Download Opera Browser** with the Opera and Work.ink icons and the description “Complete two Work.ink checkpoints.” Selecting the provider opens the **Universal Ad Blocker** overlay before any Work.ink offer can be started. The overlay explains that users can temporarily disable their ad blocker for Work.ink, makes no browser changes itself, and offers explicit continue and cancel controls. A second live-path check confirmed that no provider request occurs before the user explicitly acknowledges this gate.

A live first-checkpoint creation test was initiated after the notice was acknowledged. Production runtime logs confirm that `POST /api/workink` returned **200** at 06:38, which verifies that the server created the first Work.ink checkpoint redirect URL successfully. The connected browser ended its automation session while handing off to Work.ink, so the external offer page and a completed return token were not exercised; the application correctly requires a provider-issued token before it can advance either step.

## Separate provider update

The live provider selector now has separate **Work.ink** and **Download Opera Browser** options. Work.ink states that it uses two checkpoints, while the Opera option states that a single download step unlocks the key.

A live Work.ink flow test triggered the new detector. In the connected browser, it detected a blocked ad resource or placeholder and displayed the **Ad blocker detected** gate with a **Check again** action. No Work.ink checkpoint was initiated while that condition was present.

The live Opera Browser flow displays a single progress step and the action **“Download Opera Browser & unlock key.”** The button opens Opera’s official download page and then unlocks the key; it was not activated during browser verification to avoid creating an unsolicited download in the user’s browser.
