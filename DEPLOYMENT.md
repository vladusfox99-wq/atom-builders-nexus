# REG.RU production deployment

## Production drift as of 2026-10-19

Production has newer, manually patched assets for the forum strip, homepage headline, news and events that are not all represented in this repository. Do not run a full `dist/client` deployment until those live changes are reconciled into source; doing so would roll back current content. The homepage spacing fix was applied as a reversible CSS addition to the live `index.html`, preserving its existing import map and assets. Its previous HTML is backed up at `output/hero-spacing-20261019/index.before.html`. The homepage headline and forum strip have been reconciled in `src/components/askao/`, but news and events still need reconciliation. `scripts/verify-site.mjs` intentionally expects the local build's entry point and will fail against this newer production runtime until the drift is resolved.

## Source of truth

The financial forum poster now uses the immutable path `/uploads/news/iii-finansovo-promyshlennyy-forum-2026-20261022.webp` in source. The current production runtime uses versioned news adapters that preserve newer live records. `/assets/news-forum-banner-20261022.js` updates the poster, and `/assets/news-content-forum-text-20261022-e03d6c15d8.js` applies the revised forum announcement from the source JSON. The original compiled modules remain unchanged. Deployment snapshots are in `output/playwright/forum-banner-20261022/cache-fix/` and `output/forum-text-20261022/deployment/`. A future reconciled full build uses the source JSON and callout links directly and does not need these adapters.

For targeted news edits while the production drift remains, `scripts/update-reg-news.py --slug <slug> --release <unique-release> --host server174.hosting.reg.ru --user <deployment-user> --backup output/<release>/deployment` creates an immutable adapter from the source record, updates public import maps and the article's metadata, and verifies uploaded bytes. Reuse the same backup to resume an interrupted upload. Original HTML and the previous mapping are saved in the release directory. It retains other records by importing the previous news adapter; it is specific to the current checked production module exports and stops if those exports or mappings change.

For a new article, add `--create`. The same installer uploads immutable images from the source record, creates the article shell before switching public import maps, inserts the record into the news list in date order, and appends its URL to the existing production sitemap without dropping other live URLs. The 2026-10-26 Uzatom conference report is stored at `src/content/cms/news/askao-konferentsiya-aes-uzbekistan-2026.json`; its release snapshots are in `output/playwright/uzatom-20261026/deployment/`.

Yandex Metrika counter `113671476` is loaded from `public/askao-metrika.js`. Retain its script and no-JavaScript pixel in all public page shells. See `ANALYTICS.md` for SPA tracking, event identifiers and the targeted production installer.

The live Publications section was synchronized into React source on 2026-09-22. Deploy the complete `dist/client` build; do not patch compiled JavaScript.

- Publication data and scholarly metadata: `src/content/publication.json`.
- Additional publication records: `src/content/publications/`; display order and shared metadata: `src/content/publications.ts`.
- Publication list/detail: `src/pages/PublicationsPage.tsx`.
- Original PDF: `public/publications/files/izvlechenie-bitumirovannyh-rao-2026.pdf`.
- All news, including the publication announcement and SHOS: `src/content/cms/news/`.
- `scripts/generate-seo.mjs` generates sitemap entries and metadata shells for all publication records, preserved committee deep links and a noindex `404.html`.

## Build and publish

1. Check the current production entry and repository. Preserve intervening changes and do not publish an older build over newer content.
2. Run `npm test -- --run`, `npm run build` and review `git diff`.
3. Preview direct links, SPA navigation and narrow screens.
4. Run `python scripts/deploy-reg.py deploy --host server174.hosting.reg.ru --user <deployment-user> --backup output/<unique-release>/deployment`. The deployment account is restricted to `/www/xn--80aa3arm.xn--p1ai`; its FTP root is `/`. The script uses certificate-verified FTPS, prompts for the password without saving it, backs up replaced files, uploads assets before HTML and `.htaccess`, and verifies uploaded bytes. `--resume` continues the same build, retaining original rollback copies after a connection interruption.
5. Run `node scripts/verify-site.mjs output/<unique-release>/verification.json`. Check the live page in a browser as well.
6. Commit and push source changes. Never commit credentials, local backups, deployment archives or `dist`.

Do not delete old asset directories during release: open browser sessions may still load them. The deploy script leaves unlisted remote files untouched.

## Routing settings

Only the ASKAO domain is affected. In ISPmanager, SSL and HSTS remain enabled; "Redirect HTTP-requests to HTTPS" is enabled and "Domain redirect" is set to "From www.аскао.рф to аскао.рф". REG.RU implements the www redirect via an HTTP hop followed by the HTTPS redirect; verify that the final URL is canonical. These hosting settings are outside Git and must be retained if the site moves.

`public/.htaccess` also normalizes domain/protocol for requests reaching Apache, maps existing generated routes to HTML shells, and uses `ErrorDocument 404 /404.html`. `DirectorySlash Off` avoids an unnecessary redirect before the route-shell rewrite; directory listing remains disabled. There is no blanket fallback returning 200 for unknown routes. Hidden committee routes remain accessible by direct URL but are not added to navigation or the sitemap.

## Recovery and evidence

The pre-release root page, sitemap and config are in `output/fixes-20260922/preflight/`. Changed-file backups and the upload manifest are in `output/fixes-20260922/deployment/`; responsive screenshots and HTTP verification are in `output/fixes-20260922/` (local, not versioned).

To restore overwritten files, run the deploy script with `rollback` and the original `--backup` directory. It restores prior config/page files, verifies their bytes and leaves added hashed assets available. If hosting routing settings also need reversal, restore the two settings above to their prior state: HTTPS redirect unchecked; domain redirect disabled. SSL/HSTS were already on.

The earlier SHOS release snapshot and backup remain in `output/shos-deploy-20260922/`; its runtime was `/assets/shos-20260922/`.
