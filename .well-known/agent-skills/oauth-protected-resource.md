# OAuth Protected Resource Metadata

This site publishes OAuth Protected Resource Metadata at `/.well-known/oauth-protected-resource` so agents can discover resource server authentication requirements.

## Endpoint

- `/.well-known/oauth-protected-resource`

## Published fields

- `resource`: canonical resource identifier for this API.
- `authorization_servers`: OAuth/OIDC issuers that can mint access tokens for the resource.
- `scopes_supported`: supported scopes for calling the resource.

## Notes

- Values are generated from `site.config.json` during build.
- Keep this metadata aligned with live authorization infrastructure when APIs are protected.

