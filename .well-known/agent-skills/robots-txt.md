# Robots.txt discovery

This site publishes a `robots.txt` file at the web root with explicit crawl rules for general-purpose crawlers and AI-specific crawlers.

## What agents can expect

- `User-agent: *` allows the public site paths.
- Sensitive repository-only paths such as `/.git/`, `/.github/`, `/node_modules/`, and `/scripts/` are disallowed.
- AI crawler groups are declared explicitly for `GPTBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `Claude-Web`, `OAI-SearchBot`, `ChatGPT-User`, and `PerplexityBot`.
- `Content-Signal` directives declare the site's AI usage preferences.
- The file references the canonical sitemap with a `Sitemap:` directive.

## Policy summary

- Search and direct agent use are allowed.
- Model-training crawlers are disallowed.
- Public pages, assets, API metadata, and discovery resources remain crawlable.

