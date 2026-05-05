# Link response headers for agent discovery

This site publishes HTTP `Link` response headers on the homepage to advertise machine-discovery resources.

## Header relations on `/`

- `rel="api-catalog"` -> `/.well-known/api-catalog`
- `rel="service-doc"` -> `/api-docs/`
- `rel="service-desc"` -> `/api/openapi.json`
- `rel="oauth-authorization-server"` -> `/.well-known/oauth-authorization-server`
- `rel="oauth-protected-resource"` -> `/.well-known/oauth-protected-resource`
- `rel="alternate"; type="text/markdown"` -> `/index.md`

## Notes

- The `_headers` manifest is included in the published output.
- Hosts that support `_headers` will emit these values as HTTP response headers.
- Static hosts that do not support custom headers need a proxy/CDN rule layer to add them.

