# iWsMMO Website

Official static website for `iwsgames.com`. The public registration form sends credentials only to `https://api.iwsgames.com`; GitHub Pages stores no account secrets.

## Publish

GitHub Pages publishes the repository root (`/`) on the `main` branch. Keep the `CNAME` file so the site remains bound to `iwsgames.com`. Cloudflare manages the domain DNS; this frontend does not require a Windows server deployment.

Run `npm run dev` for a local preview on port 8080. Run `npm run build` to validate required files and create a complete distribution in `dist/`; that directory is a build artifact, not the configured Pages source.

## Homepage assets

The original purple/gold palette, `assets/iwsmmo-hero.png`, and `assets/og.png` are preserved. `assets/homepage.css` applies only to the new homepage; registration, verification, shared scripts, and legal pages retain their existing behavior.

`assets/world-concept.png` and `assets/encounter-concept.png` were generated with OpenAI ImageGen on 2026-09-09 for this redesign. They illustrate a fantasy trading city and a party encounter with a giant guardian. Both are labelled as concept art on the page and are not gameplay screenshots. No new social preview image was generated.

## Website languages

All six website pages are available in Turkish at the root, English under `/en/`, and Arabic under `/ar/`. The full feature catalogue is included in each language. The language bar links to the equivalent page, preserves query parameters and section links, and remembers the visitor's explicit choice in browser storage. Static language links also work without JavaScript.

Arabic pages use `lang="ar"` and `dir="rtl"`; shared layout adjustments are in `assets/language.css`. `assets/language-dynamic.js` translates presentation messages and catalogue counters without changing the existing registration API logic. Shared assets remain under `/assets/`. When editing content, update the corresponding pages in all three languages. `npm run build` includes every localized page and language asset.

## Search visibility and image delivery

The homepage and feature catalogue have localized search titles/descriptions, consistent social previews, and Organization/WebSite/WebPage JSON-LD. Language URLs and existing language preferences are preserved. Search engine account verification and sitemap submission still require the owner. No tracking account, advertising campaign, ratings, price, or game source code is added.

WebP images retain the originals’ dimensions. Content pictures keep PNG fallbacks; the hero background uses WebP. Social previews use the smaller JPEG and the purple brand diamond supplies the favicon. Original PNG files remain available. Verification-result pages use noindex. Run `npm run test:seo` to validate metadata, canonical/alternate URLs, structured data and the sitemap; the build runs this validation too.
