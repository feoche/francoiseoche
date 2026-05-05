# Markdown negotiation for agents

This site supports markdown negotiation for agent requests when deployed on a host that executes the edge middleware.

## Behavior

- Browser requests keep HTML as the default response.
- Requests to `/` with `Accept: text/markdown` return the markdown representation from `/index.md`.
- Markdown responses use `Content-Type: text/markdown; charset=utf-8`.
- Responses include `Vary: Accept`.
- Responses include `x-markdown-tokens` with an estimated token count.

## Deployment note

The negotiation logic is implemented in `functions/_middleware.mjs`, compatible with Cloudflare Pages Functions style middleware. Static hosts that do not run middleware can still publish `/index.md` and alternate links, but cannot negotiate on `Accept` alone.

