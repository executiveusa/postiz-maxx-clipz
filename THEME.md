# MAXX CLIPZ Theme Refresh

## Design Tokens
- **Colors**
  - `brand.primary` (`#111827`) – deep slate background for surfaces.
  - `brand.accent` (`#06B6D4`) – electric aqua used for primary CTAs and highlights.
  - `brand.surface` (`#0B0F14`) – dashboard backdrop for dark mode.
  - `brand.muted` (`#94A3B8`) – supportive typography and icon tone.
  - `brand.success` (`#10B981`) / `brand.danger` (`#EF4444`) – status feedback accents.
- **Radii**
  - `rounded-card` → `var(--radius-card)` (24px) for cards, menus, and CTA containers.
  - `rounded-input` → `var(--radius-input)` (14px) for form controls.
- **Shadow**
  - `shadow-soft` → `var(--shadow-soft)` subtle depth for cards/buttons.
- **Typography**
  - Inter applied globally with boosted heading sizes inside the dashboard shell.

## Component Updates
- `LayoutComponent` sidebar/header rebuilt with the MAXX CLIPZ wordmark, CTA, and profile badge.
- `MenuItem` active states now use the accent palette with accessible focus rings.
- `Logo` component swapped to the new icon and condensed mark treatment.
- Auth and marketing metadata titles updated to reflect MAXX CLIPZ branding.
- Global styles now expose CSS variables for the refreshed palette and radius tokens.
