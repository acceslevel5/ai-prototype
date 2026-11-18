# Prototype workspace — rules for Claude

This folder is where BOG designers build clickable HTML prototypes. Prototypes must match the Figma design system, so **always build from the shared component library in `bog-ui/`** instead of writing new styles. The library comes from the `bog-ui` plugin; use its `bog-prototype` skill when building.

## Building a prototype

1. Each prototype lives in its own folder: `prototypes/<feature-name>/`, with an `index.html` entry point.
2. Link the library: `<link rel="stylesheet" href="../../bog-ui/bog-ui.css">` and `<script src="../../bog-ui/bog-ui.js" defer></script>`. For a prototype you'll publish, copy `bog-ui/` into the prototype's `assets/` folder and link it from there.
3. For every UI element in the Figma screen, check `bog-ui/README.md` first. If a component exists, use its markup and `data-*` attributes exactly, as shown on its page in `bog-ui/docs/` (start page: `bog-ui/index.html`). Don't restyle it, override its colors, or rebuild it with custom CSS.
4. Map Figma variant properties directly to attributes: `Type=Negative Secondary` → `data-type="negative-secondary"`, `Size=Small` → `data-size="small"`, `Appearance=Inverse Static` → `data-appearance="inverse"`, `State=Loading` → `data-state="loading"`, `State=Disabled` → `disabled`.
5. For any other color, spacing, radius or type value, use the CSS variables in `bog-ui/tokens.css` (they mirror the Figma variable names). Never hardcode hex values that have a token.
6. **Flags, photos/avatars, illustrations, bank cards, icon circles, counters and initials avatars always use the UI Elements** (`bog-flag`, `bog-media-*`, `bog-illustration`, `bog-card-art`, `bog-icon-holder`, `bog-counter`, `bog-avatar`). Never style a raw `<img>` for these.
7. Rows of items (accounts, transactions, settings, options) are **List items** (`bog-list-item`) inside a `bog-list`. Anything that slides up from the bottom is a **Bottom Sheet**, and dropdowns are a **Select** that opens one. Centered confirmations are a **Modal Dialog** (`bog-modal`). Don't build custom modals or native `<select>` dropdowns. Confirmation/error messages are **Feedback** (inline) or `BOG.toast()`; "nothing here" screens are **Empty State**; the end of a flow is a **Result Page** (`bog-result-page`); money inputs are **Currency Input**; quantities, passwords and phone numbers use **Number / Password / Phone Input**; one-time codes are **OTP Verification** (`bog-otp`). Every screen starts with a **Navigation Bar** (`bog-navbar`) and puts its bottom buttons in a **Sticky Bar** (`bog-stickybar`); app sections use the **Tab Bar** (`bog-tabbar`); in-page switching is **Tabs** (`bog-tabs`) or a **Segmented Control** (`bog-segmented`); info icons are a **Tooltip** (`bog-tooltip`); number pads are **Keyboard Numeric** (`bog-keypad`); screen layouts follow **Section Page** (`bog-section-page`).
8. Ignore "iOS Liquid Glass" variants. Always use the "BOG Design" source.
9. Build only the screens you're given. Don't invent extra flow screens.
10. If the screen needs a component that isn't in `bog-ui/` yet, say so instead of building a one-off, so it can be added to the shared library.

## Previewing

Serve the folder over HTTP (`python3 -m http.server 8000`) and open `http://localhost:8000/prototypes/<feature-name>/`. Opening files directly won't load the icons.

## Fonts

The BOG fonts are licensed. Don't publish them in public repos or public sites without approval.
