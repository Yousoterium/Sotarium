# Work.ink integration notes

## Official sources consulted

- https://blog.work.ink/how-to-override-link-destinations-on-the-fly/
- https://blog.work.ink/migrating-from-the-linkvertise-anti-bypass-system-to-the-work-ink-key-system/
- https://blog.work.ink/introducing-the-work-ink-sdk-monetize-your-software-in-minutes/

## Link Override flow

Work.ink’s published Link Override API accepts a destination URL:

```text
GET https://work.ink/_api/v2/override?destination=<URL-encoded destination>
```

It returns JSON containing an `sr` value. The caller then appends that value to an existing publisher-owned Work.ink short link:

```text
https://work.ink/<publisher-link>?sr=<returned-sr>
```

This means the Sotarium integration needs a real Work.ink base link supplied or created in the owner’s Work.ink dashboard. The API response does not itself contain a complete publisher link.

## Key-system verification

Work.ink’s published key-system guidance uses a return destination that includes a generated `{TOKEN}`. The backend must verify the returned token with Work.ink before granting access. The public migration article describes `https://work.ink/_api/v2/token/isValid/<token>` and an optional single-use deletion query parameter. Dashboard documentation is required to confirm the current complete response contract before production token verification is implemented.

## Offer-card SDK

The public SDK announcement describes a Windows-native SDK intended for desktop applications/installers. It does not document a browser JavaScript SDK or an Opera-specific web integration, so the website will use the documented Link Override/key-system flow rather than inventing an unsupported web offer-card implementation.

## Authenticated dashboard verification

The authenticated Work.ink dashboard confirms the key-system and Link Override sequence used by this implementation:

1. Create a publisher link with `https://work.ink/token` as its original destination.
2. Call `GET https://work.ink/_api/v2/override?destination=<URL>` to obtain an `sr` override token.
3. Append `sr` to the publisher link to redirect users to the custom destination while preserving the `{TOKEN}` placeholder.
4. Send the returned token to the server for `GET https://work.ink/_api/v2/token/isValid/{TOKEN}` validation before issuing access.

The created publisher base link is server configuration only: `https://work.ink/2dbK/sotarium-opera-browser-checkpoint`.

## Security requirements

- Keep the provider’s base link and any publisher credentials in server configuration, not browser code.
- Associate each short-lived Work.ink return token with a server-managed Sotarium session.
- Work.ink sessions reuse the existing server-only `earnpaste_sessions` table, identified by a Work.ink step-one URL. This avoids exposing any session data publicly and avoids an unnecessary second migration.
- Verify Work.ink completion server-side before issuing a Sotarium key.
- Do not treat visiting a `/workink` route by itself as completion.

## Test caveat

The public endpoint returned HTTP 200 with an empty body to command-line requests from this environment, despite the authenticated dashboard documenting the `sr` JSON response. The deployed handler performs the documented request and validates the required `sr` field, so it fails closed rather than redirecting to an unverifiable URL if the provider does not return a usable override token.
