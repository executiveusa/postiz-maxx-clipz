# MAXX CLIPZ Rebrand Notes

## Updated Areas
- `apps/frontend/src` — layouts, metadata, and shared components refreshed for MAXX CLIPZ.
- `apps/frontend/public` — favicon, app icons, OG image, and SVG marks replaced with new brand assets.
- `apps/frontend/tailwind.config.js` & `src/app/colors.scss` — new palette variables, radii, and shadows.
- `libraries/react-shared-libraries/src/translation/locales/en/translation.json` — English copy aligned to MAXX CLIPZ branding with attribution.
- `README.md`, `THEME.md` — documentation for the UI-only rebrand and design tokens.

## Tests
- Added Jest snapshot/metadata smoke tests under `apps/frontend/src/__tests__` to lock in the new presentation.

## Guardrail
- Introduced `scripts/ensure-ui-only.mjs` executed via `pnpm test` to fail if non-UI scopes are modified.

## Integrity Statement
- No backend, infrastructure, or deployment descriptors were changed. All environment variables, Docker assets, and one-click deploy templates remain untouched.
