# REG.RU production deployment

## Production-only changes

As verified on 2026-09-22, the live site contains changes not yet represented in the React source tree: the Publications section, its navigation links, the scientific article page and a related news item added on 2026-09-21. Do not replace production wholesale with `dist/client` until those changes have been synchronized into source.

The SHOS news publication on 2026-09-22 preserved the live runtime from `/assets/publications-20260921-v2/` and published its updated copy under `/assets/shos-20260922/`. Only the SHOS news record, gallery handling of `fit: contain`, runtime directory references, new article metadata and the sitemap entry were changed. Existing publications, calendar events and members were retained.

The editable news record is `src/content/cms/news/shos-avtonomnaya-energetika-2026.json`; its three original photographs are in `public/uploads/news/`. The source gallery adjustment is in `src/pages/NewsDetailPage.tsx`.

Local deployment evidence and backup for this release are in `output/shos-deploy-20260922/` (not versioned). The `backup` directory contains previous runtime files, page shells and sitemap; `upload-manifest.json` records the uploaded files. The previous asset directories remain on the host for recovery and existing browser sessions.

Before any subsequent deployment, inspect the current live entry point and compare it with the version being edited. Upload new assets before switching page shells. Preserve production-only routes and sitemap entries. Never store hosting credentials in this repository.
