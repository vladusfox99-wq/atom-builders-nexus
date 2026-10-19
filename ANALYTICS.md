# Yandex Metrika

- Production counter: `113671476`, owned by the user's Yandex account.
- Dashboard: https://metrika.yandex.ru/dashboard?id=113671476
- Implementation: `public/askao-metrika.js`; loaded once from every public HTML shell via `index.html` and the SEO shell generator.
- Initial and SPA pageviews use `defer: true` and explicit `hit` calls. Route titles are read after React updates them. Hash-only scrolls and repeated installation do not create pageviews; back/forward navigation does.
- Webvisor, click maps, automatic external-link/download tracking, and accurate bounce tracking are enabled. Local development and `/admin` are excluded by the script.

## Optional conversion goals

These JavaScript events are sent by the site. To report them as conversions, add goals of type **JavaScript event** in the counter's Goals settings with the exact identifiers below. Sending an event does not create its goal in the account.

| Goal identifier | Action |
| --- | --- |
| `pdf_open` | Open a PDF link |
| `pdf_download` | Click a PDF link with a download attribute |
| `contact_phone` | Click a `tel:` link |
| `contact_email` | Click a `mailto:` link |
| `telegram_click` | Open Telegram |
| `max_click` | Open MAX |
| `open_map` | Open the office in Yandex Maps |
| `forum_website` | Open promfinforum.ru |
| `event_registration` | Click an external registration link |

Contact goals apply only to actual links; plain-text contact information is not a phone call or an email event. Goal parameters contain only the page path and, for PDFs, the file path. The integration does not pass phone numbers, email addresses, or form field values to custom events.

## Production installation while source and hosting differ

The current production runtime contains newer content than the local full build (see `DEPLOYMENT.md`). `scripts/install-reg-metrika.py` inserts just the shared analytics script and the no-JavaScript pixel into the existing public HTML documents, preserving every other byte. It does not replace application assets or routing.

1. Run `python scripts/install-reg-metrika.py plan --host server174.hosting.reg.ru --user <deployment-user> --backup output/<unique-release>/deployment` and review its target list.
2. Run the same command with `apply` instead of `plan`. The installer checks all original hashes before uploading and verifies the uploaded bytes. `apply` can resume an interrupted upload with the same plan.
3. For recovery, use `rollback` with the same backup. Newer changes cause the rollback to stop for inspection; original HTML backups are retained. A newly added, unreferenced analytics script is left in place.

Initial installation backup: `output/metrika-20261019/deployment/`. Never commit those backups or credentials.

Official SPA integration documentation: https://yandex.ru/support/metrica/ru/code/counter-spa-setup
