<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CareFlow-Agent — UI design direction

## Design reference

Use **Evergreen Hospital - Dashboard**, designed by **Septin for Emura**, as the visual reference for UI work:
https://dribbble.com/shots/25375399-Evergreen-Hospital-Dashboard

The reference shows a patient detail workspace: a white left sidebar, a compact top bar, softly rounded information cards, a subtle pastel canvas, and a teal-accented medical panel. Adapt this visual language to CareFlow-Agent's actual features and data. The surrounding Dribbble page and browser frame are presentation elements, not application UI.

## Visual principles

- Build a calm, light, professional healthcare interface with generous whitespace and clear information hierarchy.
- Use white cards over a very pale gray canvas. Add restrained mint, cyan, and blush gradients behind content, never behind long passages of text.
- Keep borders thin and neutral; use little or no shadow. Avoid heavy outlines, dark navigation panels, saturated backgrounds, and decorative effects that compete with patient information.
- Use teal for primary actions, active navigation, selected states, and chart emphasis. Reserve warning and error colors for meaningful statuses.
- Treat the values below as implementation starting points inferred from the reference, not exact source design tokens. Reuse or extend the project's existing theme tokens rather than scattering literal values across components.

## Suggested tokens

| Role | Starting value |
| --- | --- |
| App canvas | `#F7F9FA` |
| Card and sidebar surface | `#FFFFFF` |
| Primary text | `#171A1C` |
| Secondary text | `#667078` |
| Subtle border | `#E8ECEE` |
| Primary teal | `#147D8D` |
| Soft mint accent | `#ABE3DF` |
| Active navigation background | `#F0F8F7` |
| Pastel canvas accents | `#EFF9F7`, `#EEF7FA`, `#FCF5F8` |

- Use a consistent spacing scale based on 4 px: 4, 8, 12, 16, 24, and 32 px.
- Start with 12–16 px card radii, 8–10 px control radii, and 16–24 px card padding.
- Use the existing sans-serif font; prefer a clean face such as Inter if no font is established. Support Vietnamese diacritics correctly.
- Keep body text approximately 14–16 px, secondary labels 12–14 px, section titles 16–18 px, and page titles 22–26 px. Avoid excessive bold text and oversized headings.

## Application layout

- On wide screens, use a white sidebar around 220–240 px wide with a subtle right divider. Place the brand at the top, group navigation with small muted labels, and keep support and account actions toward the bottom.
- Pair navigation labels with consistent thin-stroke icons. Indicate the active item with a pale mint background and darker teal text and icon.
- Use a compact top bar with the page title, search where relevant, utility actions, and the signed-in user's profile. Separate it from the content with a light divider.
- For patient detail pages, use a flexible main column and a narrower medical summary column, approximately a 2:1 ratio. Align card edges and maintain consistent gaps.
- Organize the main column into patient information, medical history, and supporting cards such as appointments and documents. Let real feature requirements determine which sections appear.
- Do not force every page into the patient-detail layout. Carry the same surfaces, typography, spacing, and navigation into other screens.

## Component guidance

- **Patient information:** present a portrait or accessible initials fallback alongside a readable grid of labeled fields. Keep labels muted and values visually stronger; allow long emails and addresses to wrap.
- **Medical history:** use compact condition summaries with small outlined icons and subtle dividers. Stack summaries when space is limited.
- **Appointments:** use a vertical timeline when appropriate, with mint completed markers and a stronger teal current marker. Convey state with text or icons as well as color.
- **Documents:** use clean rows with a file icon, descriptive name, size or relevant metadata, and a clear action. Preserve real download and open behavior.
- **Medical summary:** use a prominent measurement, supporting statistics, and a restrained chart. A medical illustration may serve as a focal point if a suitable licensed asset is available; do not copy the reference's portraits or artwork automatically.
- **Charts:** use teal and light mint series, faint gridlines, readable units, and explicit legends. Distinguish series beyond color where needed and provide an accessible textual summary.
- **Controls:** keep buttons, inputs, badges, and menus visually consistent. Provide visible hover, keyboard focus, disabled, and loading states. Icon-only actions need accessible names.

## Responsive behavior and accessibility

- Collapse the sidebar into an accessible menu or drawer on smaller screens. Stack the medical summary beneath the main content when two columns no longer fit comfortably.
- Turn field grids and paired cards into a single column on narrow screens. Prevent clipped text, overlapping controls, and page-level horizontal scrolling.
- Preserve readable text and comfortable touch targets rather than shrinking the desktop layout to match the reference screenshot.
- Meet WCAG AA contrast for text and controls. Pale mint is suitable for backgrounds and decoration; use darker text on it.
- Use semantic headings, labels, keyboard-operable controls, visible focus indicators, and reduced-motion support for any animation.

## Implementation and review

- Inspect existing components, routes, styling conventions, and theme tokens before changing UI. Follow the Next.js documentation requirement above when writing code.
- Preserve application behavior, data bindings, and navigation while applying the visual style. Keep reusable patterns in shared components.
- Use existing project assets and icon libraries where possible. Keep illustrative sample data clearly separate from real patient data; never invent clinical values to fill a card.
- Design coherent loading, empty, error, and populated states. Do not add inert buttons solely to resemble the reference.
- Verify affected screens at desktop, tablet, and mobile widths. Check spacing, alignment, text wrapping, contrast, keyboard focus, and functional interactions.
- Run checks appropriate to the implementation and report any verification that could not be completed. Compare against the reference for overall hierarchy and visual balance without reproducing its browser chrome or Dribbble wrapper.
