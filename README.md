# Threadkeeper

**Take the thread with you.**

This repository hosts the public product page for Threadkeeper, a local-first continuity passport studio for AI companions and agents. The complete studio is delivered as a ZIP after purchase.

## Product page

- Responsive static landing page.
- Payhip checkout at `https://payhip.com/b/MtKLY`.
- No external fonts, analytics, or runtime dependencies.

Threadkeeper organizes user-authored context. It does not claim to recover hidden model state or guarantee identity continuity.

## Preview locally

Serve the repository root with any static HTTP server, then open the local URL it prints.

## Deployment

This is a static site. Deploy the project root to any static host after setting the payment link. Do not put private passport exports in the deployed directory.

Before release, run `git diff --check`, verify each purchase link resolves to the Payhip product, and test the deployed page at desktop and mobile widths.

## Source ideas, not copied identity

Threadkeeper recombines three general design laws: provenance-bearing memory revisions, consent-forward interaction preferences, and a separate-forms/stable-orbit visual metaphor. It contains no private agent identity, relationship history, internal path, credential, or private infrastructure reference.
