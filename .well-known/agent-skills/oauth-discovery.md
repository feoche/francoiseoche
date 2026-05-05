# OAuth and OIDC discovery

This site publishes OAuth 2.0 Authorization Server Metadata and OpenID Connect Discovery metadata at the standard well-known paths.

## Published documents

- `/.well-known/oauth-authorization-server`
- `/.well-known/openid-configuration`
- `/.well-known/jwks.json`

## Core fields

The discovery metadata includes:

- `issuer`
- `authorization_endpoint`
- `token_endpoint`
- `jwks_uri`
- `grant_types_supported`

These values are generated from `site.config.json` during the publish build.

