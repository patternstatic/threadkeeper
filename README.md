# Threadkeeper

**Take the thread with you.**

Threadkeeper is a local-first continuity passport studio for AI companions and agents. It helps a person write down the identity, communication rhythm, relationship context, boundaries, and uncertainty that should travel to a new model or tool without uploading private conversations.

## What ships

- Responsive landing page and working passport studio.
- Browser-local autosave with no backend requests.
- Immutable revision snapshots: later draft edits do not rewrite saved revisions.
- Markdown and versioned JSON exports.
- Fail-closed PayPal-hosted checkout configuration.
- No external fonts, UI libraries, analytics, or runtime dependencies.

Threadkeeper organizes user-authored context. It does not claim to recover hidden model state or guarantee identity continuity.

## Run locally

```sh
npm run serve
```

Open `http://127.0.0.1:4317`.

Run the domain tests:

```sh
npm test
```

## Connect PayPal

1. Sign in to PayPal.
2. With a Business account, go to **Pay & Get Paid → Create Payment Links and Buttons** and create a fixed-price `USD 12` link for `Threadkeeper Self-Serve Passport`.
3. With a Personal account and PayPal.Me enabled, append `/12USD` to the profile link (for example, `https://www.paypal.me/YourName/12USD`).
4. Copy the resulting PayPal-hosted HTTPS payment link.
5. Paste it into `src/config.js`:

```js
export const PAYPAL_PAYMENT_URL = "https://www.paypal.me/YourName/12USD";
```

6. Reload the page and click **Buy with PayPal**. Verify the PayPal page shows the correct merchant, product, currency, and amount before publishing.

PayPal's Business-account flow is documented at [Create payment link](https://developer.paypal.com/payment-links-buttons/create-payment-link/). A fixed-amount PayPal.Me URL is also supported for Personal accounts. Threadkeeper validates that the configured URL uses HTTPS and a PayPal-owned hostname, then opens PayPal in a separate tab; it never handles card credentials.

## Deployment

This is a static site. Deploy the project root to any static host after setting the payment link. Do not put private passport exports in the deployed directory.

Before release:

```sh
npm test
git diff --check
```

Then test the complete browser flow: form input, reload persistence, revision immutability, Markdown export, JSON export, reset confirmation, and the exact PayPal checkout destination.

## Source ideas, not copied identity

Threadkeeper recombines three general design laws: provenance-bearing memory revisions, consent-forward interaction preferences, and a separate-forms/stable-orbit visual metaphor. It contains no private agent identity, relationship history, internal path, credential, or private infrastructure reference.
