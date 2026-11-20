# CORE EYE Group website

GitHub `main` is the source of truth. The Ubuntu checkout lives at
`~/coreeye-website`. Use Node.js supported by the repository's locked Vite
version, with npm, Git, Curl, Caddy, and Ubuntu's standard utilities.

## First publish on the existing Ubuntu host

Run as the checkout owner. Start the updated enquiry service as described
under Subsequent website updates before switching the live website.

```bash
cd ~/coreeye-website &&
  git pull --ff-only origin main &&
  bash deploy/publish.sh --setup-caddy
```

The setup flag expects the existing corporate static root in
`/etc/caddy/Caddyfile` to be `/var/www/coreeyegroup.com/public` or a
versioned directory under `/var/www/coreeyegroup.com/releases`. It saves the
current Caddyfile, sets the static root to `/var/www/coreeyegroup.com/current`,
and enables the static pages and custom 404 while retaining the enquiry proxy.

## Subsequent website updates

Run as the checkout owner. The enquiry service on TCP port 3107 must be
running this release's `server/enquiry.mjs` before the frontend is published.
The first time you publish this release, pull the update and identify the
running service:

```bash
cd ~/coreeye-website &&
  git pull --ff-only origin main &&
  sudo ss -ltnp 'sport = :3107'
```

Run `systemctl status <PID>` with the Node PID from that output to identify
its unit, then use `systemctl show -p ExecStart <unit>` to check which script
it runs. If it runs from a separate checkout or installation directory, update
its entry point through that service's existing release process. Run `sudo systemctl restart <unit>` with the identified unit name, then verify
that the service advertises the new category:

```bash
curl -fsS http://127.0.0.1:3107/health
```

The response should contain `Strategic Partnerships`. The privacy page
describes the website enquiry flow. The footer remains marked as a development
preview pending company disclosure approval.

```bash
cd ~/coreeye-website &&
  git pull --ff-only origin main &&
  bash deploy/publish.sh
```

The script checks that tracked files match the fetched commit and that the
enquiry service supports the current form. It builds with locked
dependencies, stages a release, and switches the `current` symlink. The first
publish with individually generated pages backs up and reloads Caddy once to
remove the legacy shared-HTML rewrite. Subsequent releases reuse the same
configuration.

The script checks the HTTPS origin for each public page, the sitemap,
the robots file, a genuine 404 response, and the enquiry API. If a check fails,
it restores the previous release and any Caddy configuration changed during
the publish. The HTTP checks leave mail delivery untouched. To verify delivery
after publishing, submit an authorised test and match its website reference
against the message in the monitored mailbox.

## Local development

```bash
npm ci
npm run dev
```

The development server adds a `noindex, nofollow` meta tag. The production
build uses the public title and description without that tag.

The frontend uses React, TypeScript, Vite, and Oxlint.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
