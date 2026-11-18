# CORE EYE Group website

GitHub `main` is the source of truth. The Ubuntu checkout lives at
`~/coreeye-website`. Use Node.js supported by the repository's locked Vite
version, with npm, Git, Curl, Caddy, and Ubuntu's standard utilities.

## First publish on the existing Ubuntu host

Run as the checkout owner. The final command switches the live website.

```bash
cd ~/coreeye-website &&
  git pull --ff-only origin main &&
  bash deploy/publish.sh --setup-caddy
```

The setup flag expects the existing corporate static root in
`/etc/caddy/Caddyfile` to be `/var/www/coreeyegroup.com/public` or a
versioned directory under `/var/www/coreeyegroup.com/releases`. It saves the
current Caddyfile, sets the static root to `/var/www/coreeyegroup.com/current`,
and adds the expertise-page rewrite while retaining the enquiry proxy.

## Subsequent website updates

```bash
cd ~/coreeye-website &&
  git pull --ff-only origin main &&
  bash deploy/publish.sh
```

The script checks that tracked files match the fetched commit, installs
locked dependencies, and builds as the checkout owner. It stages the files
in a separate release directory and switches the `current` symlink. Caddy
serves the new release without a reload on routine updates.

After activation, the script checks the HTTPS origin for the homepage, all four
expertise pages, and the enquiry API. If a check fails, it restores the previous
symlink and, during first setup, the previous configuration. The original site
files and release directories are retained. The public Cloudflare response and
actual mail delivery can be checked separately. The script publishes the
frontend and leaves the existing Node enquiry service running.

## Local development

```bash
npm ci
npm run dev
```

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
