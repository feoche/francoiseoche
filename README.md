# Personal Portfolio Website

Minimal single-page portfolio focused on accessibility, browser compatibility, and fast loading.

## Project files

- `index.html` - semantic page markup and content
- `styles.css` - styles and responsive rules
- `index.js` - interactive behavior and accessibility controls
- `site.config.json` - canonical site URL and agent/discovery configuration
- `bs-config.js` - BrowserSync development config
- `package.json` - development dependencies and scripts

## Run locally

Install dependencies:

```bash
npm install
```

Start local hot reload:

```bash
npm run dev
```

Create a GitHub Pages-ready build:

```bash
npm run build
```

This generates a `docs/` folder containing the static files ready to publish.

### Published discovery artifacts

The build now generates and publishes:

- `robots.txt` with explicit crawl rules, AI crawler directives, and `Content-Signal` preferences
- `sitemap.xml` with canonical URLs
- `index.md` as a markdown rendering of the homepage content
- `/.well-known/api-catalog` in `application/linkset+json`
- `/.well-known/mcp/server-card.json`
- `/.well-known/agent-skills/index.json`
- `/api/profile.json`, `/api/health.json`, and `/api/openapi.json`
- `/api-docs/` human-readable API documentation
- `_headers` as an optional custom-header manifest for hosts such as Netlify or Cloudflare Pages

## Publish to GitHub Pages

1. In the GitHub repository, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Commit and push your changes to `main`.

The workflow in `.github/workflows/deploy-pages.yml` will automatically install dependencies, run `npm run build`, and publish the generated `docs/` folder.

### One-command deploy

Once your changes are committed locally, deploy with:

```bash
git push origin main
```

You can also trigger the same deployment manually from the **Actions** tab with **Deploy to GitHub Pages**.

## Notes

- The site is static: no build step is required for development, and GitHub Pages builds the deployable `docs/` output in CI.
- `index.js` includes fallbacks for browsers that lack full support for `dialog`, `IntersectionObserver`, and modern media-query listeners.
- External links open with `target="_blank"` and `rel="noopener noreferrer"`.
- The build writes a `.nojekyll` file so GitHub Pages serves the output as plain static files.
- Running `npm run build` locally is still useful when you want to preview the exact deployment output before pushing.
- The homepage advertises discovery resources with HTML `<link>` elements, but true HTTP `Link` response headers and `Accept: text/markdown` content negotiation are not configurable on GitHub Pages. To support those two features exactly, place the site behind a host or proxy that supports custom response headers and content negotiation.
- The published JSON API is intentionally public and read-only, so OAuth/OIDC discovery documents are not emitted.

## Browser support target

- Latest Chrome/Edge
- Latest Firefox
- Safari 14+
- Modern mobile browsers
