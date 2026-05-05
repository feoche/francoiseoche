# API catalog discovery

This site publishes an API catalog at `/.well-known/api-catalog` using the `application/linkset+json` media type.

## Catalog contents

The catalog advertises a small, public, read-only API surface for agents:

- `service-desc` → the OpenAPI description
- `service-doc` → human-readable API documentation
- `status` → a lightweight health endpoint

## Public API endpoints

- `/api/profile.json`
- `/api/health.json`
- `/api/openapi.json`
- `/api-docs/`

These resources are public and do not require authentication.

