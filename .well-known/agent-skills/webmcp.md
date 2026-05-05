# WebMCP discovery

The homepage exposes browser-side tools through the WebMCP API when `navigator.modelContext.provideContext()` is available.

## Exposed tools

- `navigate_to_section` scrolls to a named section of the portfolio.
- `open_accessibility_settings` opens the accessibility drawer.
- `set_theme` switches between the supported visual themes.
- `get_profile_summary` returns a compact summary of the portfolio data already present on the page.

## Availability

The tools are registered progressively and only when the browser exposes the WebMCP API.

