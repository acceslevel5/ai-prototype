/* BOG UI docs — the single list of components.
   Adding a component = add one entry here + create docs/<page>.html from docs/_template.html.
   Used by the start page (index.html) and the sidebar on every component page.
   updated: the day the component last changed (YYYY-MM-DD) — used by the "Recently updated" sort. */
window.BOG_COMPONENTS = [
  {
    id: "button",
    updated: "2026-09-30",
    name: "Button & Icon Button",
    page: "button.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=38686-29051",
    desc: "19 button types, 17 icon-button types, 2 sizes, 5 states, Themed and Inverse.",
    preview: '<button class="bog-btn" data-type="primary" data-size="small">Button</button> <button class="bog-icon-btn" data-type="neutral" data-size="small" aria-label="Icon"><span class="bog-icon"></span></button>'
  },
  {
    id: "text-input",
    updated: "2026-10-28",
    motion: true,
    name: "Text Input",
    page: "text-input.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=44129-67424",
    desc: "Floating label, clear button, validation, loading, read-only, disabled, skeleton.",
    preview: '<div class="bog-field" data-state="filled" style="width:220px"><label class="bog-field__box"><span class="bog-field__text"><span class="bog-field__label">Full name</span><input class="bog-field__input" placeholder=" " value="Nino B." tabindex="-1"></span></label></div>'
  },
  {
    id: "amount",
    motion: true,
    updated: "2026-09-30",
    name: "Amount",
    page: "amount.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=47318-6396",
    desc: "Balance with currency, selector and per-currency balances. 3 sizes, 4 colors.",
    preview: '<div class="bog-amount" data-size="medium"><div class="bog-amount__main"><span class="bog-amount__value">1,000.00</span><span class="bog-amount__currency">₾</span></div></div>'
  },
  {
    id: "ui-elements",
    updated: "2026-10-19",
    name: "UI Elements",
    page: "ui-elements.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=54990-3178",
    desc: "Flags, images, illustrations, bank cards, icon containers and counters — used inside other components.",
    preview: '<span class="bog-flag" data-size="32"><img src="ASSETS/flags/ge.svg" alt=""></span> <span class="bog-media-circle" data-size="32"></span> <span class="bog-card-art" data-size="32"></span> <span class="bog-icon-holder" data-size="32"><span class="bog-icon"></span></span> <span class="bog-counter" data-size="32">99+</span>'
  },
  {
    id: "picker",
    updated: "2026-10-28",
    motion: true,
    name: "Account Picker",
    page: "picker.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=57967-24278",
    desc: "Selectable account card built from Amount, balances and UI Elements. Currency chips, loyalty, card number, IBAN.",
    preview: '<div class="bog-picker" data-selected style="width:260px"><div class="bog-picker__box"><div class="bog-picker__head"><div class="bog-picker__info"><span class="bog-picker__title">Multi-currency Account</span><div class="bog-amount" data-size="medium"><div class="bog-amount__main"><span class="bog-amount__value">1,000.00</span><span class="bog-amount__currency">₾</span></div></div></div><span class="bog-card-art" data-size="40"></span></div></div></div>'
  },
  {
    id: "bottom-sheet",
    updated: "2026-10-28",
    motion: true,
    name: "Bottom Sheet",
    page: "bottom-sheet.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=50084-32099",
    desc: "Slide-up panel with free content, title/description header, optional sticky bar. Opens with data-sheet-open.",
    preview: '<div style="width:200px;height:112px;overflow:hidden;border-radius:12px;background:#0f0f10ad;display:flex;align-items:flex-end"><div style="width:100%;background:#fff;border-radius:12px 12px 0 0;padding:14px 12px 10px;box-sizing:border-box;position:relative"><div style="position:absolute;top:5px;left:50%;width:24px;height:3px;margin-left:-12px;border-radius:9px;background:#d7d9db"></div><div style="font-weight:600;font-size:13px;margin-bottom:8px">Title</div><div style="height:6px;border-radius:3px;background:#ecedee;margin-bottom:6px"></div><div style="height:6px;width:70%;border-radius:3px;background:#ecedee;margin-bottom:10px"></div><div style="height:22px;border-radius:7px;background:#ff5c0a"></div></div></div>'
  },
  {
    id: "result",
    updated: "2026-11-03",
    motion: true,
    name: "Result Page",
    page: "result.html",
    figma: "https://www.figma.com/design/sDb5KObJDal0JvMECrN53T/?node-id=55279-42698",
    desc: "Full result screen: Result Status (success, warning, negative, info, pending) or Custom visual, amount, action, sticky bar.",
    preview: '<div class="bog-result" data-status="success" style="padding:0;gap:16px;transform:scale(.8)"><span class="bog-result__icon"></span><div class="bog-result__text" style="margin-top:-8px"><p class="bog-result__title">Transfer sent</p><p class="bog-result__desc">Nino B. will get it in seconds</p></div></div>'
  },
  {
    id: "select",
    updated: "2026-11-03",
    motion: true,
    name: "Select",
    page: "select.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=43757-27381",
    desc: "Input-style trigger that opens a Bottom Sheet with the options. Validation, read-only, disabled, skeleton.",
    preview: '<div class="bog-select" style="width:220px"><div class="bog-select__box"><span class="bog-select__text"><span class="bog-select__label">Country</span><span class="bog-select__value">Georgia</span></span><span class="bog-select__chevron"></span></div></div>'
  },
  {
    id: "action-card",
    updated: "2026-09-30",
    name: "Action Card",
    page: "action-card.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=48879-13185",
    desc: "Tappable bordered card with a UI Element slot, title, text, message and chevron. Row/column layouts and groups.",
    preview: '<div class="bog-action-card" style="width:250px;background:#fff"><span class="bog-icon-holder" data-size="40"><span class="bog-icon"></span></span><span class="bog-action-card__content"><span class="bog-action-card__title">Primary text</span><span class="bog-action-card__text">Secondary text</span></span><span class="bog-action-card__chevron"></span></div>'
  },
  {
    id: "action-item",
    updated: "2026-11-03",
    motion: true,
    name: "Action Item",
    page: "action-item.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=44073-26629",
    desc: "56px circle shortcut with label and amount: Primary, Secondary, Media, Avatar. Badges, remove button, 2/3-item rows.",
    preview: '<div class="bog-action-items" style="width:260px;gap:8px"><div class="bog-action-item" data-type="primary" style="width:80px"><span class="bog-action-item__main"><span class="bog-action-item__circle"><span class="bog-icon"></span></span><span class="bog-action-item__label">Transfer</span></span></div><div class="bog-action-item" data-type="secondary" style="width:80px"><span class="bog-action-item__main"><span class="bog-action-item__circle"><span class="bog-icon"></span></span><span class="bog-action-item__label">Pay</span></span></div><div class="bog-action-item" style="width:80px"><span class="bog-action-item__main"><span class="bog-action-item__circle"><span class="bog-avatar" data-size="56">NB</span></span><span class="bog-action-item__label">Nino</span></span></div></div>'
  },
  {
    id: "list",
    updated: "2026-10-19",
    name: "List",
    page: "list.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=45093-6300",
    desc: "List item rows: 1–3+ lines, left/right slots, amounts, chevron, dividers, group header. Skeleton, pressed, disabled.",
    preview: '<div class="bog-list" data-divider style="width:260px;background:#fff;border-radius:12px;padding:0 8px"><div class="bog-list-item"><span class="bog-icon-holder" data-size="40" data-type="outline"><span class="bog-icon"></span></span><span class="bog-list-item__content"><span class="bog-list-item__subtitle">Subtitle</span><span class="bog-list-item__label">Primary Label</span></span><span class="bog-list-item__chevron"></span></div></div>'
  },
  {
    id: "badge",
    updated: "2026-10-19",
    name: "Badges",
    page: "badge.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=40620-3172",
    desc: "Status, Currency, Loyalty and Feature badges. Medium/small, high contrast, disabled, skeleton.",
    preview: '<span class="bog-status-badge" data-status="success">Paid</span> <span class="bog-loyalty-badge" data-type="cashback">50% Cashback</span> <span class="bog-currency-badge">GEL</span> <span class="bog-feature-badge" data-type="new">New</span>'
  },
  {
    id: "avatar",
    updated: "2026-10-19",
    name: "Avatar",
    page: "avatar.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=41392-4706",
    desc: "Initials, icon or photo · 16–64 · status / action corners · add & overflow button · groups.",
    preview: '<div class="bog-avatar-group"><span class="bog-avatar" data-size="40">NB</span><span class="bog-avatar" data-size="40" data-type="icon"></span><span class="bog-avatar" data-size="40">GK</span><button type="button" class="bog-avatar-btn" data-size="40" data-type="overflow">+9</button></div>'
  },
  {
    id: "checkbox",
    updated: "2026-11-03",
    motion: true,
    name: "Checkbox",
    page: "checkbox.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=38613-9869",
    desc: "Checkbox, Checkbox + Label and Group. Checked, indeterminate, error, read-only, disabled, skeleton, inverse.",
    preview: '<label class="bog-checkbox"><input type="checkbox" class="bog-checkbox__input" checked><span class="bog-checkbox__text"><span class="bog-checkbox__label">I agree to the terms</span></span></label>'
  },
  {
    id: "radio",
    updated: "2026-11-03",
    motion: true,
    name: "Radio Button",
    page: "radio.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=38644-24312",
    desc: "Radio button, Radio Button + Label and Group. Left / right, horizontal, error, read-only, disabled, skeleton, inverse.",
    preview: '<div class="bog-radio-group" style="width:200px"><div class="bog-radio-group__options"><label class="bog-radio"><span class="bog-radio__row"><input type="radio" class="bog-radio__input" name="card-prev" tabindex="-1" checked><span class="bog-radio__text"><span class="bog-radio__title">Pick up at a branch</span></span></span></label><label class="bog-radio"><span class="bog-radio__row"><input type="radio" class="bog-radio__input" name="card-prev" tabindex="-1"><span class="bog-radio__text"><span class="bog-radio__title">Courier</span></span></span></label></div></div>'
  },
  {
    id: "toggle",
    updated: "2026-11-03",
    motion: true,
    name: "Toggle Switch",
    page: "toggle.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=38613-16004",
    desc: "Toggle Switch, Toggle Switch + Label and Group. On, indeterminate, error, read-only, disabled, skeleton, inverse.",
    preview: '<label class="bog-toggle" style="width:240px"><span class="bog-toggle__row"><span class="bog-toggle__text"><span class="bog-toggle__title">Push notifications</span><span class="bog-toggle__desc">Payments and offers</span></span><input type="checkbox" role="switch" class="bog-toggle__input" checked></span></label>'
  },
  {
    id: "chip",
    updated: "2026-11-11",
    motion: true,
    name: "Chip",
    page: "chip.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=41453-45819",
    desc: "Assist, Suggestion, Filter and Icon-only chips · selected, pressed, disabled, skeleton · chip groups.",
    preview: '<div class="bog-chip-group"><button class="bog-chip" data-type="filter" aria-pressed="true">All</button><button class="bog-chip" data-type="filter" aria-pressed="false">Cards</button><button class="bog-chip"><span class="bog-icon"></span>Help</button></div>'
  },
  {
    id: "feedback",
    updated: "2026-10-28",
    motion: true,
    name: "Feedback",
    page: "feedback.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=42389-14182",
    desc: "Inline messages and Toasts · 5 statuses · title, actions, close, loading, skeleton · BOG.toast().",
    preview: '<div class="bog-feedback" data-status="positive" style="width:240px"><div class="bog-feedback__text"><p class="bog-feedback__title">Payment sent</p><p class="bog-feedback__desc">50.00 ₾ to Nino B.</p></div></div>'
  },
  {
    id: "empty-state",
    updated: "2026-10-19",
    name: "Empty State",
    page: "empty-state.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=46547-9704",
    desc: "Status icon or custom visual, title, description and button · error, warning, success, info · inverse, skeleton.",
    preview: '<div class="bog-empty" data-type="info" style="transform:scale(.7)"><p class="bog-empty__title">No transactions yet</p><p class="bog-empty__desc">Your payments will appear here.</p></div>'
  },
  {
    id: "currency-input",
    updated: "2026-10-28",
    motion: true,
    name: "Currency Input",
    page: "currency-input.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=44129-67946",
    desc: "Amount + currency symbol + currency picker (opens a Bottom Sheet) · selectable / fixed / hidden · small 96px input.",
    preview: '<div class="bog-field bog-currency-input" data-state="filled" style="width:240px"><div class="bog-field__box"><span class="bog-field__text"><span class="bog-field__label">Amount</span><span class="bog-currency-input__value"><input class="bog-field__input" value="250.00" tabindex="-1" placeholder=" " style="width:56px"><span class="bog-currency-input__symbol">₾</span></span></span><span class="bog-currency-input__currency"><span class="bog-flag" data-size="16"><img src="ASSETS/flags/ge.svg" alt=""></span>GEL</span></div></div>'
  },
  {
    id: "account-select",
    updated: "2026-11-03",
    motion: true,
    name: "Account Select",
    page: "account-select.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=44129-69842",
    desc: "Select variant for accounts · card visual · opens a Bottom Sheet of Account Pickers · validation, read-only, disabled, skeleton.",
    preview: '<div class="bog-select" data-variant="account" style="width:240px"><div class="bog-select__box"><span class="bog-select__text"><span class="bog-select__label">Account<span class="bog-select__fav"></span></span><span class="bog-select__value">Main account</span></span><span class="bog-card-art" data-size="40"></span><span class="bog-select__chevron"></span></div></div>'
  },
  {
    id: "hero",
    updated: "2026-10-28",
    motion: true,
    name: "Hero Area",
    page: "hero.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=47547-44068",
    desc: "Centered header: visual, label, title, description · badges, feedback and actions · skeleton.",
    preview: '<section class="bog-hero" style="padding:0;transform:scale(.8)"><div class="bog-hero__content" style="padding:0"><span class="bog-avatar" data-size="48">NB</span><div class="bog-hero__text"><h1 class="bog-hero__title">Nino Beridze</h1><p class="bog-hero__desc">Premium client</p></div></div></section>'
  },
  {
    id: "product-card",
    updated: "2026-10-19",
    name: "Product Card",
    page: "product-card.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=53662-4573",
    desc: "Product summary card: title, Amount with balances, card stack or other media · empty, pressed, skeleton.",
    preview: '<div class="bog-product-card" style="width:250px"><div class="bog-product-card__info"><span class="bog-product-card__title">Account</span><div class="bog-amount" data-size="medium"><div class="bog-amount__main"><span class="bog-amount__value">1,000.00</span><span class="bog-amount__currency">₾</span></div></div></div><span class="bog-product-card__media" data-more><span class="bog-card-art" data-size="40"></span></span></div>'
  },
  {
    id: "inline-message",
    updated: "2026-10-19",
    name: "Inline Message",
    page: "inline-message.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=41453-34518",
    desc: "One-line status message · 6 statuses · medium/small · left/right · inverse, disabled, skeleton.",
    preview: '<div style="display:flex;flex-direction:column;gap:8px"><span class="bog-inline-message" data-status="positive">Payment sent</span><span class="bog-inline-message" data-status="negative">Insufficient funds</span><span class="bog-inline-message" data-status="info">Updated just now</span></div>'
  },
  {
    id: "notification-badge",
    updated: "2026-10-19",
    name: "Notification Badge",
    page: "notification-badge.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=41563-26011",
    desc: "Count / dot badge · accent, negative, warning, positive, neutral · inverse · auto corner placement.",
    preview: '<button class="bog-icon-btn" data-type="neutral" aria-label="x"><span class="bog-icon"></span><span class="bog-notification-badge">3</span></button> <span class="bog-notification-badge" data-status="negative">44+</span> <span class="bog-notification-badge"></span>'
  },
  {
    id: "number-input",
    updated: "2026-10-28",
    motion: true,
    name: "Number Input",
    page: "number-input.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=44129-68889",
    desc: "Text Input with − / + stepper buttons.",
    preview: '<div class="bog-field bog-number-input" style="width:260px"><label class="bog-field__box"><span class="bog-field__text"><span class="bog-field__label">Enter amount</span><input class="bog-field__input" placeholder=" " value="100" tabindex="-1"></span><span class="bog-number-input__stepper"><span class="bog-icon-btn" data-type="neutral" data-size="small"><span class="bog-icon" data-icon="minus"></span></span><span class="bog-icon-btn" data-type="neutral" data-size="small"><span class="bog-icon" data-icon="plus"></span></span></span></label></div>'
  },
  {
    id: "password-input",
    updated: "2026-10-28",
    motion: true,
    name: "Password Input",
    page: "password-input.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=65690-6315",
    desc: "Masked input with eye toggle and a live requirements checklist.",
    preview: '<div class="bog-field bog-password-input" style="width:260px"><label class="bog-field__box"><span class="bog-field__text"><span class="bog-field__label">Enter Password</span><input class="bog-field__input" type="password" placeholder=" " value="secret1234" tabindex="-1"></span><span class="bog-password-input__toggle"></span></label></div>'
  },
  {
    id: "phone-input",
    updated: "2026-10-28",
    motion: true,
    name: "Phone Input",
    page: "phone-input.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=61708-3382",
    desc: "Phone number with a country-code picker (opens a Bottom Sheet).",
    preview: '<div class="bog-field bog-phone-input" style="width:260px"><label class="bog-field__box"><span class="bog-phone-input__country"><span class="bog-flag" data-size="20"><img src="assets/flags/ge.svg" alt=""></span><span class="bog-phone-input__code">+995</span></span><span class="bog-field__text"><span class="bog-field__label">Phone number</span><input class="bog-field__input" placeholder=" " tabindex="-1"></span></label></div>'
  },
  {
    id: "modal",
    updated: "2026-10-28",
    motion: true,
    name: "Modal Dialog",
    page: "modal.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=52913-5147",
    desc: "Centered dialog with title, content and 1–2 buttons. Opens with data-modal-open.",
    preview: '<div class="bog-modal" data-open style="position:static;padding:0;background:none"><div class="bog-modal__dialog" style="width:240px"><header class="bog-modal__header"><span class="bog-modal__title" style="font:600 16px/24px var(--font-family-bog)">Modal dialog</span></header><div class="bog-modal__body" style="padding-block:4px 8px"><p class="bog-modal__text" style="font-size:12px;line-height:16px">Body text goes here.</p></div><footer class="bog-modal__footer"><span class="bog-btn" data-type="primary" data-size="small">Confirm</span></footer></div></div>'
  },
  // ---- New batch (isNew: true shows the "New" mark) ----
  {
    id: "search",
    updated: "2026-11-03",
    isNew: true,
    name: "Search input",
    page: "search.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=16112-42515",
    desc: "Small or Large, on the page or Overlay. Focus outline with Cancel, clear button while typing, skeleton.",
    preview: '<div class="bog-search" data-state="typing" style="width:240px"><label class="bog-search__box"><span class="bog-search__icon"></span><input class="bog-search__input" type="search" placeholder="Search" value="Silknet" tabindex="-1"><span class="bog-search__clear"></span></label><span class="bog-search__cancel">Cancel</span></div>'
  },
  {
    id: "textarea",
    updated: "2026-11-03",
    isNew: true,
    name: "Text area",
    page: "textarea.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=44920-16766",
    desc: "Multi-line Text Input with a character counter. Grows with the text; validation, read-only, disabled, skeleton.",
    preview: '<div class="bog-field" data-type="textarea" data-state="filled" style="width:240px"><label class="bog-field__box" style="min-height:88px"><span class="bog-field__text"><span class="bog-field__label">Payment purpose</span><textarea class="bog-field__input" placeholder=" " tabindex="-1">Rent for November</textarea></span><span class="bog-field__counter">17/140</span></label></div>'
  },
  {
    id: "tabs",
    updated: "2026-11-03",
    isNew: true,
    name: "Tabs",
    page: "tabs.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=38989-7118",
    desc: "Fixed (2–3, equal widths) or Wrapped (up to 5, scrolls). Underline and bold label on the selected tab; pressed, disabled, skeleton.",
    preview: '<div class="bog-tabs" style="width:240px"><span class="bog-tab" aria-selected="true">History</span><span class="bog-tab">Details</span><span class="bog-tab">Limits</span></div>'
  },
  {
    id: "segmented",
    updated: "2026-11-03",
    isNew: true,
    name: "Segmented Control",
    page: "segmented.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=32878-990",
    desc: "Large (2–5) or Small (up to 6) text segments, or two icons. Switches the view of the same content in place.",
    preview: '<div class="bog-segmented" style="width:240px"><span class="bog-segment" aria-checked="true">24 h</span><span class="bog-segment">Week</span><span class="bog-segment">All</span></div>'
  },
  {
    id: "navbar",
    updated: "2026-11-03",
    isNew: true,
    name: "Navigation Bar",
    page: "navbar.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=53831-5293",
    desc: "Back button, title (with secondary text or caption) and up to two right actions. Themed, White and Black Static.",
    preview: '<div class="bog-navbar" style="width:260px;min-width:0"><div class="bog-navbar__header" style="padding:0"><span class="bog-icon-btn" data-type="neutral" data-size="small"><span class="bog-icon" data-icon="chevron-left"></span></span><div class="bog-navbar__titles"><span class="bog-navbar__title">Card details</span><span class="bog-navbar__secondary">Visa •• 4821</span></div><div class="bog-navbar__actions"><span class="bog-icon-btn" data-type="neutral" data-size="small"><span class="bog-icon" data-icon="chat"></span></span></div></div></div>'
  },
  {
    id: "tabbar",
    updated: "2026-11-03",
    isNew: true,
    name: "Tab Bar",
    page: "tabbar.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=63155-50769",
    desc: "iOS glass tab bar with five destinations: filled icon and pill on the current page, notification dot, Light and Dark.",
    preview: '<div class="bog-tabbar" style="width:300px;padding:8px"><div class="bog-tabbar__bar"><span class="bog-tabbar__item" data-page="home" aria-current="page">Home</span><span class="bog-tabbar__item" data-page="my-space">My Space</span><span class="bog-tabbar__item" data-page="payments" data-badge>Payments</span><span class="bog-tabbar__item" data-page="offers">Offers</span><span class="bog-tabbar__item" data-page="hub">Hub</span></div></div>'
  },
  {
    id: "spinner",
    updated: "2026-11-03",
    isNew: true,
    name: "Loading Spinner",
    page: "spinner.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=114-613",
    desc: "Five sizes with an optional label. Primary, Inverse, Static Primary and White; disabled.",
    preview: '<div class="bog-spinner" data-size="large"><span class="bog-spinner__ring"></span><span class="bog-spinner__label">Loading...</span></div>'
  },
  {
    id: "progress",
    updated: "2026-11-03",
    isNew: true,
    name: "Progress Bar",
    page: "progress.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=42817-6948",
    desc: "Single or Segmented (2–10 steps), Thin or Thick. Accent, Positive, Warning, Negative, Neutral; labels and skeleton.",
    preview: '<div class="bog-progress" data-size="thick" style="--value:48%;width:240px"><div class="bog-progress__track"><span class="bog-progress__fill"></span></div><div class="bog-progress__text"><div><span class="bog-progress__label">2,400.00 ₾</span><span class="bog-progress__helper">Saved</span></div><div><span class="bog-progress__label">5,000.00 ₾</span><span class="bog-progress__helper">Goal</span></div></div></div>'
  },
  {
    id: "progress-circular",
    updated: "2026-11-03",
    isNew: true,
    name: "Progress Circular",
    page: "progress-circular.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=19482-141",
    desc: "Ring with a number, a fraction or a check. Milestone arc, four sizes, five statuses, completed and skeleton.",
    preview: '<div class="bog-pcircle" data-size="large" style="--value:50;--milestone:75"><svg viewBox="0 0 40 40"><circle class="bog-pcircle__rail" cx="20" cy="20" r="19" pathLength="100"/><circle class="bog-pcircle__milestone" cx="20" cy="20" r="19" pathLength="100"/><circle class="bog-pcircle__progress" cx="20" cy="20" r="19" pathLength="100"/></svg><span class="bog-pcircle__text">2/4</span></div> <div class="bog-pcircle" data-completed><svg viewBox="0 0 40 40"><circle class="bog-pcircle__rail" cx="20" cy="20" r="19" pathLength="100"/><circle class="bog-pcircle__progress" cx="20" cy="20" r="19" pathLength="100"/></svg></div>'
  },
  {
    id: "tracker",
    updated: "2026-11-03",
    isNew: true,
    name: "Progress Tracker",
    page: "tracker.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=64891-20193",
    desc: "Vertical steps: completed, current, pending (numbered), warning and error with messages; skeleton.",
    preview: '<ol class="bog-tracker" style="width:200px"><li class="bog-tracker__step" data-state="completed"><span class="bog-tracker__indicator"></span><div class="bog-tracker__content" style="min-height:0;padding-bottom:12px"><p class="bog-tracker__title">Application sent</p></div></li><li class="bog-tracker__step" data-state="current"><span class="bog-tracker__indicator"></span><div class="bog-tracker__content" style="min-height:0;padding-bottom:12px"><p class="bog-tracker__title">Credit review</p></div></li><li class="bog-tracker__step"><span class="bog-tracker__indicator" data-number="3"></span><div class="bog-tracker__content"><p class="bog-tracker__title">Contract</p></div></li></ol>'
  },
  {
    id: "status-badge",
    updated: "2026-11-03",
    isNew: true,
    name: "Status Icon Badge",
    page: "status-badge.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=15920-42344",
    desc: "Round check, alert, info or count mark. Five sizes, high and low contrast, skeleton.",
    preview: '<span class="bog-status-icon" data-status="positive"></span> <span class="bog-status-icon" data-status="warning"></span> <span class="bog-status-icon" data-status="negative">99+</span> <span class="bog-status-icon" data-status="info" data-contrast="low"></span>'
  },
  {
    id: "skeleton",
    updated: "2026-11-03",
    isNew: true,
    name: "Skeleton",
    page: "skeleton.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=49137-25398",
    desc: "Placeholder blocks, text bars for every text style, and paragraph skeletons for custom loading layouts.",
    preview: '<div style="display:flex;gap:12px;align-items:center;width:220px"><span class="bog-skeleton" data-shape="circle" style="width:40px;height:40px"></span><div style="display:flex;flex-direction:column;gap:8px;flex:1"><span class="bog-skeleton-text" data-style="title" style="width:70%"></span><span class="bog-skeleton-text" style="width:45%"></span></div></div>'
  },
  {
    id: "pin",
    updated: "2026-11-04",
    isNew: true,
    name: "PIN code Input",
    page: "pin.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=64863-18145",
    desc: "Title, helper and one dot per digit; fills as you type, error shake. Themed, White and Black Static.",
    preview: '<div class="bog-pin"><span class="bog-pin__title">Enter your PIN</span><span class="bog-pin__helper">Please enter your 4-digit code</span><span class="bog-pin__dots"><i data-filled></i><i data-filled></i><i></i><i></i></span></div>'
  },
  {
    id: "otp",
    updated: "2026-11-04",
    isNew: true,
    name: "OTP Verification",
    page: "otp.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=65051-82556",
    desc: "SMS / Email choice, code field, where it was sent, resend countdown. Loading, expired, resend and Hard states.",
    preview: '<div class="bog-otp" style="width:240px;gap:12px"><div class="bog-field"><label class="bog-field__box"><span class="bog-field__text"><span class="bog-field__label">Enter 4-digit code</span><input class="bog-field__input" placeholder=" " tabindex="-1"></span></label></div><div class="bog-otp__info" style="gap:4px"><p class="bog-otp__timer" style="font-size:12px">Resend code in <b>00:35</b></p></div></div>'
  },
  {
    id: "stepper",
    updated: "2026-11-04",
    isNew: true,
    motion: true,
    name: "Numeric Stepper",
    page: "stepper.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=54301-47922",
    desc: "− value + within min and max; limits disable a button. Loading, disabled, skeleton, helper.",
    preview: '<div class="bog-stepper"><span class="bog-icon-btn" data-type="neutral" data-size="small"><span class="bog-icon" data-icon="minus"></span></span><output class="bog-stepper__value">2</output><span class="bog-icon-btn" data-type="neutral" data-size="small"><span class="bog-icon" data-icon="plus"></span></span></div>'
  },
  {
    id: "slider",
    updated: "2026-11-04",
    isNew: true,
    name: "Range Slider",
    page: "slider.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=48088-199",
    desc: "One or two handles, free or 2–11 segments, value tooltip and halo while dragging, disabled.",
    preview: '<div class="bog-slider" style="width:240px"><div class="bog-slider__track" style="--from:calc(16px + (100% - 32px) * .25);--to:calc(16px + (100% - 32px) * .6)"><input type="range" value="25" tabindex="-1"><input type="range" value="60" tabindex="-1"></div><div class="bog-slider__amounts"><span>0 ₾</span><span>50,000 ₾</span></div></div>'
  },
  {
    id: "wheel",
    updated: "2026-11-04",
    isNew: true,
    name: "Wheel Picker",
    page: "wheel.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=52704-25075",
    desc: "Scroll-to-select list with the middle option selected and the rest fading out. Single or Multi.",
    preview: '<div style="display:flex;flex-direction:column;align-items:center;font-family:var(--font-family-bog);font-weight:600;color:var(--text-primary);line-height:1.25"><span style="font-size:13.5px;opacity:.3">3 month</span><span style="font-size:17px;opacity:.6">4 month</span><span style="font-size:24px">5 month</span><span style="font-size:17px;opacity:.6">6 month</span><span style="font-size:13.5px;opacity:.3">7 month</span></div>'
  },
  {
    id: "keypad",
    updated: "2026-11-04",
    isNew: true,
    name: "Keyboard Numeric",
    page: "keypad.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=64781-8649",
    desc: "In-app number pad with Face ID, fingerprint or dot key and delete. Themed, White, Black and Invert.",
    preview: '<div class="bog-keypad" style="width:220px;gap:2px 8px;padding:0"><span class="bog-keypad__key" style="height:30px;font-size:20px">1</span><span class="bog-keypad__key" style="height:30px;font-size:20px">2</span><span class="bog-keypad__key" style="height:30px;font-size:20px">3</span><span class="bog-keypad__key" style="height:30px;font-size:20px">4</span><span class="bog-keypad__key" style="height:30px;font-size:20px">5</span><span class="bog-keypad__key" style="height:30px;font-size:20px">6</span><span class="bog-keypad__key" data-key="face-id" style="height:30px"></span><span class="bog-keypad__key" style="height:30px;font-size:20px">0</span><span class="bog-keypad__key" data-key="backspace" style="height:30px"></span></div>'
  },
  {
    id: "checkbox-card",
    updated: "2026-11-04",
    isNew: true,
    name: "Checkbox Card",
    page: "checkbox-card.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=41394-24932",
    desc: "Multi-select cards with title, description, amount slot or list group. Left / Right, error, read-only, disabled, skeleton.",
    preview: '<div class="bog-choice-card-group" style="width:240px;gap:8px"><label class="bog-choice-card" style="padding:10px 12px"><input type="checkbox" class="bog-checkbox__input" checked tabindex="-1"><span class="bog-choice-card__text"><span class="bog-choice-card__title">SMS alerts</span></span><span class="bog-choice-card__slot"><b>0.50 ₾</b></span></label><label class="bog-choice-card" style="padding:10px 12px"><input type="checkbox" class="bog-checkbox__input" tabindex="-1"><span class="bog-choice-card__text"><span class="bog-choice-card__title">Insurance</span></span><span class="bog-choice-card__slot"><b>4.00 ₾</b></span></label></div>'
  },
  {
    id: "radio-card",
    updated: "2026-11-04",
    isNew: true,
    name: "Radio Card",
    page: "radio-card.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=22114-3977",
    desc: "Single-choice cards with details to compare. Left / Right, error, read-only, disabled, skeleton.",
    preview: '<div class="bog-choice-card-group" style="width:240px;gap:8px"><label class="bog-choice-card" style="padding:10px 12px"><input type="radio" class="bog-radio__input" name="rc-prev" checked tabindex="-1"><span class="bog-choice-card__text"><span class="bog-choice-card__title">Standard</span></span><span class="bog-choice-card__slot"><b>Free</b></span></label><label class="bog-choice-card" style="padding:10px 12px"><input type="radio" class="bog-radio__input" name="rc-prev" tabindex="-1"><span class="bog-choice-card__text"><span class="bog-choice-card__title">Express</span></span><span class="bog-choice-card__slot"><b>10.00 ₾</b></span></label></div>'
  },
  {
    id: "currency-option",
    updated: "2026-11-04",
    isNew: true,
    name: "Currency Option",
    page: "currency-option.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=43692-23471",
    desc: "Flag and currency code — USD, GBP, AED, CHF, GEL, EUR, TRY, ILS — enabled or disabled.",
    preview: '<span class="bog-currency-option"><img src="ASSETS/flags/us.svg" alt="">USD</span> <span class="bog-currency-option"><img src="ASSETS/flags/eu.svg" alt="">EUR</span> <span class="bog-currency-option"><img src="ASSETS/flags/ge.svg" alt="">GEL</span>'
  },
  {
    id: "currency-selector",
    updated: "2026-11-04",
    isNew: true,
    name: "Currency Selector",
    page: "currency-selector.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=43648-2878",
    desc: "Tappable flag + code + chevron. Ghost or Fill, Large / Medium / Small, pressed, disabled, skeleton.",
    preview: '<span class="bog-currency-selector" data-type="fill" data-size="medium"><span class="bog-currency-option"><img src="ASSETS/flags/ge.svg" alt="">GEL</span></span> <span class="bog-currency-selector" data-size="medium"><span class="bog-currency-option"><img src="ASSETS/flags/us.svg" alt="">USD</span></span>'
  },
  {
    id: "file-uploader",
    updated: "2026-11-04",
    isNew: true,
    name: "File uploader",
    page: "file-uploader.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=47089-30940",
    desc: "Several files of one kind: limits, Add file, rows with progress, result, Retry and ×. Default, Media and Compact rows.",
    preview: '<div class="bog-uploader" style="width:240px;padding:12px"><p class="bog-uploader__title" style="font-size:14px">Upload files</p><ul class="bog-uploader__files" style="margin-top:8px"><li class="bog-file" data-state="loading" style="--value:55%"><span class="bog-file__info" style="margin:0"><span class="bog-file__name">receipt.pdf</span><span class="bog-file__bar"></span></span></li><li class="bog-file" data-state="success"><span class="bog-file__info" style="margin:0"><span class="bog-file__name">ticket.pdf</span><span class="bog-file__status">Uploaded</span></span></li></ul></div>'
  },
  {
    id: "file-attachment",
    updated: "2026-11-04",
    isNew: true,
    name: "File Attachment",
    page: "file-attachment.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=62989-1397",
    desc: "One row per named document: upload, progress, preview with Delete / Replace, error, read-only, disabled, skeleton.",
    preview: '<div class="bog-attach" data-state="default" style="width:240px;min-height:0;padding:8px 12px"><span class="bog-attach__media" style="width:32px;height:32px"></span><span class="bog-attach__info" style="gap:2px"><span class="bog-attach__label" style="font-size:14px">Proof of income</span><span class="bog-attach__hint">PNG or JPG, max 10 MB</span></span></div>'
  },
  {
    id: "stickybar",
    updated: "2026-11-04",
    isNew: true,
    name: "Sticky Bar",
    page: "stickybar.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=46589-9729",
    desc: "The bottom action area of a screen: content fades under it; one or two buttons, an icon button, helper text or a slot; home indicator; Black and Overlay.",
    preview: '<div style="width:220px"><footer class="bog-stickybar" style="position:static;padding-top:8px"><div class="bog-stickybar__buttons" style="padding:0"><span class="bog-btn" data-type="primary" data-width="fill" data-size="small">Continue</span></div><span class="bog-stickybar__home"></span></footer></div>'
  },
  {
    id: "dots",
    updated: "2026-11-04",
    isNew: true,
    name: "Slider Indicator",
    page: "dots.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=46424-1188",
    desc: "Page dots for carousels and pagers; from six pages a sliding window of five with shrinking edge dots; White over imagery.",
    preview: '<div class="bog-dots"><i data-size="6" style="opacity:.6"></i><i></i><i aria-current></i><i></i><i data-size="4"></i></div>'
  },
  {
    id: "tooltip",
    updated: "2026-11-04",
    isNew: true,
    name: "Tooltip",
    page: "tooltip.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=41120-93",
    desc: "A one-line explanation behind an info icon; tap to open, tap anywhere to close; arrow left, centre, right or beside.",
    preview: '<div style="height:64px"><span class="bog-tooltip" data-align="center" data-open data-pinned><span class="bog-tooltip__trigger"></span><span class="bog-tooltip__bubble">Updated every 5 minutes</span></span></div>'
  },
  {
    id: "tour",
    updated: "2026-11-04",
    isNew: true,
    name: "Tour Popover",
    page: "tour.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=48088-1092",
    desc: "A step of an onboarding tour: title, description, step count, Skip and Next, and an arrow pointing at its target.",
    preview: '<div class="bog-tour" data-align="left" style="width:220px;padding:12px;gap:8px;margin-top:6px"><div class="bog-tour__text"><p class="bog-tour__title" style="font-size:13px;line-height:18px">Your cards</p><p class="bog-tour__desc" style="font-size:12px;line-height:16px">Swipe to see all of them.</p></div><div class="bog-tour__foot"><span class="bog-tour__count" style="font-size:11px">1 / 3</span><span class="bog-btn" data-type="primary" data-size="small">Next</span></div></div>'
  },
  {
    id: "banner",
    updated: "2026-11-04",
    isNew: true,
    name: "Banner",
    page: "banner.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=55863-25164",
    desc: "A suggestion in the content: title, description, optional amount, image, actions and ×; plus Banner Image Only and Promo Banner.",
    preview: '<div class="bog-banner" style="width:240px;padding:12px"><span class="bog-banner__text" style="gap:4px"><span class="bog-banner__title" style="font-size:13px;line-height:18px">Save automatically</span><span class="bog-banner__desc" style="font-size:12px;line-height:16px">10% of every salary to savings.</span></span><span class="bog-banner__media" style="width:56px;height:44px"></span></div>'
  },
  {
    id: "accordion",
    updated: "2026-11-04",
    isNew: true,
    name: "Accordion",
    page: "accordion.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=71927-11708",
    desc: "Rows that open to show detail: one to three line headers, left and right slots, single-open mode, disabled, skeleton. In progress in Figma.",
    preview: '<div class="bog-accordion" style="width:240px"><details class="bog-accordion__item" open><summary class="bog-accordion__header" style="min-height:40px"><span class="bog-accordion__titles" style="min-height:0"><span class="bog-accordion__title">Fees and limits</span></span></summary><div class="bog-accordion__content" style="padding-bottom:8px;margin-top:0;font-size:12px;line-height:16px"><p>Withdrawals at our ATMs are free.</p></div></details><details class="bog-accordion__item"><summary class="bog-accordion__header" style="min-height:40px"><span class="bog-accordion__titles" style="min-height:0"><span class="bog-accordion__title">Interest</span></span></summary></details></div>'
  },
  {
    id: "asset-card",
    updated: "2026-11-09",
    motion: true,
    isNew: true,
    name: "Asset Card",
    page: "asset-card.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=46034-5934",
    desc: "A portfolio holding: ticker, name, today's change (positive, negative, neutral) and value; a sideways-scrolling group; pressed, skeleton.",
    preview: '<span class="bog-asset" data-trend="positive" style="gap:16px"><span class="bog-asset__head"><span class="bog-asset__label"><span class="bog-asset__ticker">BTC</span><span class="bog-asset__name">Bitcoin</span></span><span class="bog-media-circle" data-size="32"></span></span><span class="bog-asset__foot"><span class="bog-asset__trend">+4.00%</span><span class="bog-asset__value">1,250.00 $</span></span></span>'
  },
  {
    id: "budget-card",
    updated: "2026-11-04",
    isNew: true,
    name: "Budget Card",
    page: "budget-card.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=22457-179",
    desc: "A spending category with a thin bar of the budget used and the amounts; Fill and Outlined; two to a row; pressed, skeleton.",
    preview: '<span class="bog-budget" style="--value:35%;width:200px"><span class="bog-budget__head"><span class="bog-icon-holder" data-size="40"><span class="bog-icon"></span></span><span class="bog-budget__text"><span class="bog-budget__title">Groceries</span><span class="bog-budget__desc">12 transactions</span></span></span><span class="bog-budget__bar"></span><span class="bog-budget__amounts"><span>350.00 ₾</span><span>1,000.00 ₾</span></span></span>'
  },
  {
    id: "discovery-card",
    updated: "2026-11-04",
    isNew: true,
    name: "Discovery Card",
    page: "discovery-card.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=56958-14663",
    desc: "A picture with a short title in a sideways-scrolling row; opened ones fade to Seen; pressed, skeleton.",
    preview: '<div style="display:flex;gap:8px"><span class="bog-discovery__card" style="width:112px;min-height:0"><span class="bog-discovery__media"></span><span class="bog-discovery__title" style="font-size:12px;line-height:16px">How cashback works</span></span><span class="bog-discovery__card" data-seen style="width:112px;min-height:0"><span class="bog-discovery__media"></span><span class="bog-discovery__title" style="font-size:12px;line-height:16px">Split the bill</span></span></div>'
  },
  {
    id: "feature-card",
    updated: "2026-11-04",
    isNew: true,
    name: "Feature Card",
    page: "feature-card.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=63398-3448",
    desc: "A partner offer: picture, coloured offer tab (MR, Plus, Cashback, Sale), brand and category; Mini, Small, Large; cap and timer tags.",
    preview: '<span class="bog-feature" style="width:150px"><span class="bog-feature__media"><span class="bog-feature__offer" data-brand><span class="bog-feature__offer-label" data-status="sale">25% Discount</span></span></span><span class="bog-feature__info"><span class="bog-media-circle" data-size="32"></span><span class="bog-feature__text"><span class="bog-feature__title">Brand Title</span><span class="bog-feature__desc">Category</span></span></span></span>'
  },
  {
    id: "task-card",
    updated: "2026-11-04",
    isNew: true,
    name: "Task Card",
    page: "task-card.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=52557-11698",
    desc: "Challenge tasks in a scrolling row: picture and two lines; Incomplete, Completed (green check), Unlockable; pressed, skeleton.",
    preview: '<div style="display:flex;gap:8px"><span class="bog-task" data-status="completed" style="width:96px;height:128px"><span class="bog-task__media"></span><span class="bog-task__text" style="min-height:56px;padding:8px;font-size:11px;line-height:14px">Open a savings goal</span></span><span class="bog-task" data-status="incomplete" style="width:96px;height:128px"><span class="bog-task__media"></span><span class="bog-task__text" style="min-height:56px;padding:8px;font-size:11px;line-height:14px">Invite a friend</span></span></div>'
  },
  {
    id: "payment-method",
    updated: "2026-11-04",
    isNew: true,
    name: "Payment Method",
    page: "payment-method.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=35176-2081",
    desc: "Apple Pay and Google Pay buttons (styles, Pay/Buy, pill), and card brand icons: digital card, Visa, Mastercard, Amex.",
    preview: '<div style="display:grid;gap:8px;width:200px"><span class="bog-applepay" data-style="black" style="height:36px"><span class="bog-applepay__mark" style="font-size:18px">&#xF8FF;Pay</span></span><span class="bog-gpay" data-style="light" style="height:36px"><span class="bog-gpay__mark"></span></span><span style="display:flex;gap:6px;justify-content:center"><span class="bog-pay-icon" data-brand="visa" data-background></span><span class="bog-pay-icon" data-brand="mastercard" data-background></span><span class="bog-pay-icon" data-brand="amex" data-background></span></span></div>'
  },
  {
    id: "static-list",
    updated: "2026-11-04",
    isNew: true,
    name: "Static List",
    page: "static-list.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=996-16019",
    desc: "Read-only label–value rows for terms and breakdowns, with an optional info tooltip; Blank, disabled, skeleton.",
    preview: '<dl class="bog-static-list" style="width:220px"><div class="bog-static"><dt>Loan amount</dt><dd>5,000.00 ₾</dd></div><div class="bog-static"><dt>Interest rate</dt><dd>9.50 %</dd></div><div class="bog-static"><dt>Term</dt><dd>24 months</dd></div></dl>'
  },
  {
    id: "summary",
    updated: "2026-11-04",
    isNew: true,
    name: "Summary",
    page: "summary.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=44746-30615",
    desc: "A card of details to check before confirming: title and value rows, secondary text, status helpers, a slot for an info icon, flag or card; skeleton.",
    preview: '<dl class="bog-summary" style="width:220px;padding:4px 0"><div class="bog-summary__item" style="padding:4px 12px"><dt class="bog-summary__title" style="font-size:12px;line-height:16px">Amount</dt><dd class="bog-summary__value">500.00 ₾</dd></div><div class="bog-summary__item" style="padding:4px 12px"><dt class="bog-summary__title" style="font-size:12px;line-height:16px">Transfer fee</dt><dd class="bog-summary__value">1.00 ₾</dd></div></dl>'
  },
  {
    id: "chart",
    updated: "2026-11-04",
    isNew: true,
    name: "Data Visualization",
    page: "chart.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=60325-9499",
    desc: "Donut Chart (Large, Mini; empty, multiple, selectable, incomplete, overflow, complete, data labels), Card Chart and Sparkline, drawn from data.",
    preview: '<div style="display:flex;align-items:center;gap:16px"><div class="bog-donut" data-size="mini" style="--_d:88px"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50.87,0.00A50,50 0 0 1 99.94,52.39L85.95,51.72A36,36 0 0 0 50.62,14.00Z" style="fill:var(--dv-01)"/><path d="M99.82,54.14A50,50 0 0 1 72.89,94.45L66.48,82.00A36,36 0 0 0 85.87,52.98Z" style="fill:var(--dv-09)"/><path d="M71.32,95.22A50,50 0 0 1 63.78,98.06L59.92,84.60A36,36 0 0 0 65.35,82.56Z" style="fill:var(--dv-06)"/><path d="M62.09,98.51A50,50 0 0 1 54.14,99.82L52.98,85.87A36,36 0 0 0 58.70,84.93Z" style="fill:var(--dv-03)"/><path d="M52.39,99.94A50,50 0 0 1 15.26,85.96L24.99,75.89A36,36 0 0 0 51.72,85.95Z" style="fill:var(--dv-10)"/><path d="M14.03,84.73A50,50 0 0 1 0.00,50.87L14.00,50.62A36,36 0 0 0 24.10,75.00Z" style="fill:var(--dv-02)"/><path d="M0.00,49.12A50,50 0 0 1 49.12,0.00L49.37,14.00A36,36 0 0 0 14.00,49.37Z" style="fill:var(--dv-17)"/></svg><div class="bog-donut__center"><span class="bog-donut__value" style="font-size:13px">124 ₾</span></div></div><svg class="bog-sparkline" style="width:110px;height:64px" viewBox="0 0 228 144" preserveAspectRatio="none"><path class="bog-sparkline__area" d="M0,128.47 C3.45,120.94 13.81,90.82 20.72,83.29 C27.63,75.76 34.54,90.82 41.45,83.29 C48.36,75.76 55.27,50.66 62.18,38.11 C69.09,25.56 76,12.01 82.90,8 C89.81,3.98 96.72,9.00 103.63,14.02 C110.54,19.04 117.45,39.12 124.36,38.11 C131.27,37.11 138.18,2.98 145.09,8 C152,13.01 158.90,51.92 165.81,68.23 C172.72,84.54 179.63,98.35 186.54,105.88 C193.45,113.41 200.36,108.39 207.27,113.41 C214.18,118.43 224.54,132.23 228,136 L228,144 L0,144 Z"/><path class="bog-sparkline__line" d="M0,128.47 C3.45,120.94 13.81,90.82 20.72,83.29 C27.63,75.76 34.54,90.82 41.45,83.29 C48.36,75.76 55.27,50.66 62.18,38.11 C69.09,25.56 76,12.01 82.90,8 C89.81,3.98 96.72,9.00 103.63,14.02 C110.54,19.04 117.45,39.12 124.36,38.11 C131.27,37.11 138.18,2.98 145.09,8 C152,13.01 158.90,51.92 165.81,68.23 C172.72,84.54 179.63,98.35 186.54,105.88 C193.45,113.41 200.36,108.39 207.27,113.41 C214.18,118.43 224.54,132.23 228,136"/></svg></div>'
  },
  {
    id: "product-widget",
    updated: "2026-11-04",
    isNew: true,
    name: "Product Widget",
    page: "product-widget.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=57220-13185",
    desc: "Home-screen product tiles two to a row; an odd last tile spans the row; expired badge, notification, pressed, skeleton. In progress in Figma.",
    preview: '<div class="bog-products" style="width:230px"><span class="bog-product" style="padding:10px"><span class="bog-product__media" style="margin-bottom:8px"><span class="bog-card-art" data-size="32"></span></span><span class="bog-product__title">Accounts</span><span class="bog-product__amount" style="font-size:13px">1,000.00 ₾</span></span><span class="bog-product" style="padding:10px"><span class="bog-product__media" style="margin-bottom:8px"><span class="bog-card-art" data-size="32"></span></span><span class="bog-product__title">Deposits</span><span class="bog-product__amount" style="font-size:13px">5,200.00 ₾</span></span></div>'
  },
  {
    id: "section-page",
    updated: "2026-11-04",
    isNew: true,
    name: "Section Page",
    page: "section-page.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=67525-40008",
    desc: "The screen layout: sections 32px apart with headers (Medium, Small; description, dot, chevron, button slot), skeleton; Widget (BETA) card.",
    preview: '<div style="display:grid;gap:14px;width:220px"><section class="bog-section" style="gap:8px"><header class="bog-section__header" style="min-height:0"><span class="bog-section__heading" style="gap:2px"><span class="bog-section__title" style="font-size:14px">Section text</span><span class="bog-section__desc">Description</span></span></header><div class="bog-section__content" style="gap:6px"><span style="height:12px;border-radius:3px;background:#f1d6ea"></span><span style="height:12px;border-radius:3px;background:#f1d6ea"></span></div></section><section class="bog-section" data-state="skeleton"><header class="bog-section__header"><span class="bog-section__heading"><span class="bog-section__title">x</span></span></header></section></div>'
  },
  {
    id: "feature-notes",
    updated: "2026-11-04",
    isNew: true,
    motion: true,
    name: "Feature Notes Page",
    page: "feature-notes.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=64127-67532",
    desc: "What's new after an update: picture, slider dots, title, description and one button; notes swipe sideways; close with ×.",
    preview: '<div style="width:120px;height:170px;border-radius:12px;overflow:hidden;box-shadow:0 0 0 1px var(--border-alpha-01);display:flex;flex-direction:column;background:var(--layer-layer-01);font-family:var(--font-family-bog)"><div style="flex:1;background:#e8f5ec"></div><div style="display:flex;flex-direction:column;align-items:center;gap:5px;padding:8px"><div class="bog-dots" style="height:5px;gap:3px"><i aria-current style="width:5px;height:5px"></i><i style="width:5px;height:5px"></i><i style="width:5px;height:5px"></i></div><b style="font-size:9px">Release Title</b><span style="width:100%;height:14px;border-radius:4px;background:var(--button-primary-default)"></span></div></div>'
  },
  {
    id: "important-info",
    updated: "2026-11-04",
    isNew: true,
    name: "Important Information Page",
    page: "important-info.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=62752-24532",
    desc: "Terms in a bottom sheet that must be read to the end: fade and scroll-down button while Unread; Confirm and agreement unlock when Read.",
    preview: '<div style="width:130px;height:170px;border-radius:12px;overflow:hidden;background:#5b5f5c;display:flex;flex-direction:column;justify-content:flex-end;font-family:var(--font-family-bog)"><div style="height:145px;border-radius:12px 12px 0 0;background:var(--layer-layer-01);padding:10px;display:flex;flex-direction:column;gap:5px;box-sizing:border-box"><b style="font-size:9px">Important information</b><span style="height:4px;background:var(--layer-alpha-03);border-radius:2px"></span><span style="height:4px;background:var(--layer-alpha-03);border-radius:2px"></span><span style="height:4px;background:var(--layer-alpha-03);border-radius:2px;width:70%"></span><span style="height:4px;background:var(--layer-alpha-03);border-radius:2px"></span><span style="flex:1"></span><span style="height:16px;border-radius:4px;background:var(--layer-alpha-03)"></span></div></div>'
  },
  {
    id: "account-picker-page",
    updated: "2026-11-04",
    isNew: true,
    name: "Account Picker Page",
    page: "account-picker-page.html",
    figma: "https://www.figma.com/design/EI6tYmEC7DhjpnzeuF5C45/?node-id=60100-23937",
    desc: "Where the money comes from: wallet, add card, added cards and accounts with a sticky Choose; validation error and empty state.",
    preview: '<div style="width:130px;height:170px;border-radius:12px;overflow:hidden;box-shadow:0 0 0 1px var(--border-alpha-01);background:var(--layer-layer-01);padding:10px;box-sizing:border-box;display:flex;flex-direction:column;gap:5px;font-family:var(--font-family-bog)"><b style="font-size:9px">Where from?</b><span style="height:16px;border-radius:4px;box-shadow:inset 0 0 0 1px var(--border-border-03)"></span><span style="height:16px;border-radius:4px;box-shadow:inset 0 0 0 1px var(--border-border-03)"></span><span style="height:20px;border-radius:4px;background:var(--layer-layer-02)"></span><span style="height:28px;border-radius:4px;background:var(--layer-layer-02)"></span><span style="flex:1"></span><span style="height:14px;border-radius:4px;background:var(--button-primary-default)"></span></div>'
  },
  {
    id: "wizard-progress",
    updated: "2026-11-03",
    name: "Wizard Progress",
    page: "wizard-progress.html",
    figma: "https://www.figma.com/design/7ceZjESb4Ga9PwNw4vP0p4/?node-id=17658-72592",
    desc: "Step bar under the navigation bar: done, current (half) and upcoming steps.",
    preview: '<div class="bog-wizard" style="width:220px"><span class="bog-wizard__step" data-state="done"></span><span class="bog-wizard__step" data-state="current"></span></div>'
  },
  {
    id: "code-input",
    updated: "2026-11-03",
    name: "Code Input",
    page: "code-input.html",
    figma: "https://www.figma.com/design/7ceZjESb4Ga9PwNw4vP0p4/?node-id=17658-72586",
    desc: "4-digit cells for an SMS code (keyboard + autofill) or a masked passcode (with Keyboard Numeric).",
    preview: '<div class="bog-code" data-size="medium" style="transform:scale(.6)"><span class="bog-code__cell">1</span><span class="bog-code__cell">2</span><span class="bog-code__cell"></span><span class="bog-code__cell"></span></div>'
  },
  {
    id: "menu",
    updated: "2026-11-03",
    name: "Menu",
    page: "menu.html",
    figma: "https://www.figma.com/design/7ceZjESb4Ga9PwNw4vP0p4/?node-id=17748-73134",
    desc: "Grey pill that opens an iOS-style pull-down menu with a checkmark, e.g. SMS / Email / WhatsApp.",
    preview: '<span class="bog-menu"><span class="bog-menu__trigger"><span class="bog-menu__value">SMS კოდი</span></span></span>'
  }
];

/* Top-level sections of the workspace. Paths are from the bog-ui folder. */
window.BOG_SECTIONS = [
  { id: "components", name: "Mobile components", href: "index.html" },
  { id: "layout-animations", name: "Layout animations", href: "layout-animations.html" },
  { id: "tokens", name: "Tokens", href: "tokens.html" }
];

/* What's new on the start page — newest first. Add an entry whenever a component changes.
   kind: "motion" | "design" | "component" · page: path from the bog-ui folder */
window.BOG_UPDATES = [
  { date: "2026-11-11", kind: "motion", title: "Chip · On / off", page: "docs/chip.html",
    text: "Filter and icon chips check on and off with the Account Picker chip motion: the chip grows or shrinks to its new width with a small overshoot, the colour fades and the check draws in from the left." },
  { date: "2026-11-10", kind: "component", title: "Radio Button · Unselect is opt-in", page: "docs/radio.html",
    text: "Tapping the selected option again no longer clears it by default, following the BOG rule (\"no choice\" needs its own option). Turn it on with data-deselectable." },
  { date: "2026-11-09", kind: "motion", title: "Asset Card · Load-in", page: "docs/asset-card.html",
    text: "Cards fade in and move into place one after another — from the left, the right, below or above — with a small delay between cards. Try the options in the phone preview." },
  { date: "2026-11-04", kind: "motion", title: "Numeric Stepper · Press & roll", page: "docs/stepper.html#motion",
    text: "The pressed button dips to 90% and springs back; the digits that change roll — + down, − up — as in the motion guide (same as Number Input)." },
  { date: "2026-11-04", kind: "motion", title: "Feature Notes Page · Slide", page: "docs/feature-notes.html#motion",
    text: "Next now slides to the following note: the new picture sweeps in over the old one while the text drifts 50 px and cross-fades, as in the motion guide." },
  { date: "2026-11-04", kind: "motion", title: "Range Slider · Sound & haptics", page: "docs/slider.html",
    text: "Each notch the handle passes plays a soft click that rises in pitch from left to right, with a haptic tick on phones. data-feedback=\"off\" turns it off per slider." },
  { date: "2026-11-03", kind: "motion", title: "Feedback · Toast stack", page: "docs/feedback.html#motion",
    text: "With two or more toasts, closing one no longer makes the others jump: they slide into the gap with the same bounce as Toast In." },
  { date: "2026-11-03", kind: "motion", title: "Radio Button · Unselect", page: "docs/radio.html#motion",
    text: "Tapping the selected option again clears it and the dot shrinks away — on every radio button; data-deselectable=\"false\" turns it off. The slow-motion switch on the page works again." },
  { date: "2026-11-03", kind: "motion", title: "Checkbox · Motion", page: "docs/checkbox.html#motion",
    text: "Same speeds as Radio Button: the box turns orange and the check draws along its path while it grows in with an overshoot; unticking shrinks it away. The indeterminate dash grows from its centre. A BOG UI proposal until the Figma guide lands." },
  { date: "2026-11-03", kind: "motion", title: "Action Item · Selection strip", page: "docs/action-item.html#motion",
    text: "New selection strip for chosen recipients: avatars pop in with a small overshoot, the row slides along, and removing one closes the gap. Try it in the phone preview." },
  { date: "2026-11-03", kind: "motion", title: "Select & Account Select · Motion", page: "docs/select.html#motion",
    text: "Both now document the Bottom Sheet motion they open with: the sheet rises, overshoots 20 px and settles; picking an option drops it away. Same spec as Bottom Sheet." },
  { date: "2026-11-03", kind: "component", title: "Result Page", page: "docs/result.html",
    text: "New full-screen component with motion: the status appears, then the text blocks fade in and rise one after another. Success, Pending, Error and Custom (card flip)." },
  { date: "2026-11-03", kind: "component", title: "Radio Button", page: "docs/radio.html",
    text: "New component with motion: the ring turns orange and the dot grows in with an overshoot. Single buttons, labelled rows and groups, Themed and Inverse." },
  { date: "2026-11-03", kind: "motion", title: "Toggle Switch · Motion", page: "docs/toggle.html#motion",
    text: "The circle slides with a small overshoot and the track colour follows. In and out of Indeterminate it squashes into the bar, overshoots 1 px and settles." },
  { date: "2026-11-03", kind: "component", title: "Toggle Switch", page: "docs/toggle.html",
    text: "New component: on / off switches on their own, as setting rows with a label and description, and in groups. Themed and Inverse." },
  { date: "2026-10-28", kind: "motion", title: "Bottom Sheet · Open motion", page: "docs/bottom-sheet.html#motion",
    text: "Sheets rise from below the screen, overshoot 20 px and settle. Try every state in the new phone preview." },
  { date: "2026-10-28", kind: "motion", title: "Hero Area · Load and slide", page: "docs/hero.html#motion",
    text: "Slots load one after another, 66.7 ms apart for any number of slots; heroes slide between pages while the background cross-fades." },
  { date: "2026-10-28", kind: "motion", title: "Feedback · Toast motion", page: "docs/feedback.html#motion",
    text: "Toasts rise in, overshoot 20 px and settle; they drop back out after 3 s. Try every status in the new phone preview." },
  { date: "2026-10-28", kind: "motion", title: "Account Picker motion", page: "docs/picker.html#motion",
    text: "Chips check on and off, cards expand on select and minimize, the page loads in, and errors shake the list." },
  { date: "2026-10-28", kind: "design", title: "Flat workspace, dark mode and sections", page: "index.html",
    text: "Flat line-and-grid look, a light / dark switch, Motion badges, boxy state grids, and room for Layout animations and Tokens." },
  { date: "2026-10-28", kind: "motion", title: "Inputs · Focus and error motion", page: "docs/text-input.html#input-motion-section",
    text: "Text, Number, Currency, Password and Phone inputs animate Default ⇄ Active, errors, and helper text turning into error text." },
  { date: "2026-10-28", kind: "motion", title: "Modal Dialog · Open and close", page: "docs/modal.html#motion",
    text: "The dialog grows in from 60% while rising 70 px, and shrinks to 62% as it closes — the same for every layout." },
  { date: "2026-10-28", kind: "motion", title: "Number Input · Stepper motion", page: "docs/number-input.html#motion",
    text: "− / + squeeze the button and roll only the digits that change." }
];

/* "Motion" mark for components with motion: true — three outlined circles moving right: the leading
   one full strength, the two trailing ones fainter, on a violet chip. On start page thumbnails (corner) and sidebar rows (right edge). */
window.BOG_MOTION_ICON = '<svg class="docs-motion-icon" viewBox="0 0 22 11" aria-hidden="true" focusable="false"><circle cx="5.5" cy="5.5" r="4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-opacity="0.3"/><circle cx="11" cy="5.5" r="4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-opacity="0.6"/><circle cx="16.5" cy="5.5" r="4.5" fill="currentColor" stroke="currentColor" stroke-width="1.6"/></svg>';
window.BOG_MOTION_BADGE = '<span class="docs-motion-badge" title="Has motion" role="img" aria-label="Has motion">' + window.BOG_MOTION_ICON + "</span>";
// "New" mark for components added in the latest batch (isNew: true on the entry)
window.BOG_NEW_BADGE = '<span class="docs-new-badge" title="New component">New</span>';
window.BOG_NEW_CHIP = '<span class="docs-new" title="New component">New</span>';
window.BOG_MOTION_CHIP = '<span class="docs-m" title="Has motion" role="img" aria-label="Has motion">' + window.BOG_MOTION_ICON + "</span>";

/* Categories for the start page: chips filter the grid ("All" shows everything).
   Each component belongs to exactly one category (BOG_CATEGORY_OF); anything unlisted falls into "other". */
window.BOG_CATEGORIES = [
  { id: "actions",    name: "Actions",            items: ["button", "chip", "action-item", "keypad", "payment-method"] },
  { id: "inputs",     name: "Inputs",             items: ["text-input", "currency-input", "number-input", "password-input", "phone-input", "search", "textarea", "pin", "otp", "stepper", "slider", "file-uploader", "file-attachment", "code-input"] },
  { id: "selection",  name: "Selection",          items: ["checkbox", "radio", "toggle", "checkbox-card", "radio-card", "select", "wheel", "segmented", "picker", "account-select", "currency-option", "currency-selector"] },
  { id: "navigation", name: "Navigation",         items: ["navbar", "tabbar", "tabs", "dots", "stickybar", "wizard-progress"] },
  { id: "feedback",   name: "Feedback & status",  items: ["feedback", "inline-message", "banner", "empty-state", "badge", "status-badge", "notification-badge", "spinner", "progress", "progress-circular", "tracker", "skeleton"] },
  { id: "overlays",   name: "Overlays",           items: ["bottom-sheet", "modal", "tooltip", "tour", "menu"] },
  { id: "cards",      name: "Cards & lists",      items: ["list", "accordion", "static-list", "summary", "action-card", "product-card", "product-widget", "asset-card", "budget-card", "discovery-card", "feature-card", "task-card"] },
  { id: "content",    name: "Content & media",    items: ["amount", "avatar", "ui-elements", "hero", "chart"] },
  { id: "pages",      name: "Pages",              items: ["section-page", "result", "feature-notes", "important-info", "account-picker-page"] },
  { id: "other",      name: "Other",              items: [] }
];
window.BOG_CATEGORY_OF = {};
window.BOG_CATEGORIES.forEach(function (cat) { cat.items.forEach(function (id) { window.BOG_CATEGORY_OF[id] = cat.id; }); });
window.BOG_COMPONENTS.forEach(function (c) { c.category = window.BOG_CATEGORY_OF[c.id] || "other"; });

/* Sorting the component list: "name" (A–Z) or "updated" (newest first, then A–Z).
   The choice is shared by the start page and the sidebar and remembered. */
window.BOG_SORT = (function () {
  var KEY = "bog-ui-sort", listeners = [];
  function get() { try { return localStorage.getItem(KEY) === "updated" ? "updated" : "name"; } catch (e) { return "name"; } }
  function byName(a, b) { return a.name.localeCompare(b.name); }
  return {
    get: get,
    set: function (mode) {
      try { localStorage.setItem(KEY, mode); } catch (e) {}
      listeners.forEach(function (fn) { fn(mode); });
    },
    onChange: function (fn) { listeners.push(fn); },
    list: function (mode) {
      return window.BOG_COMPONENTS.slice().sort(mode === "updated"
        ? function (a, b) { return (b.updated || "").localeCompare(a.updated || "") || byName(a, b); }
        : byName);
    },
    // Segmented switch: <div class="docs-sort" data-sort-switch></div>
    html: function () {
      var m = get();
      return '<span class="docs-sort__label">Sort</span>' + [["name", "Name"], ["updated", "Updated"]].map(function (o) {
        return '<button type="button" data-sort="' + o[0] + '" aria-pressed="' + (m === o[0]) + '">' + o[1] + "</button>";
      }).join("");
    }
  };
})();
document.addEventListener("click", function (e) {
  var b = e.target.closest && e.target.closest("[data-sort-switch] [data-sort]");
  if (b) window.BOG_SORT.set(b.getAttribute("data-sort"));
});
// Search: every word must appear in the component's name or description (case-insensitive)
window.BOG_MATCH = function (c, query) {
  var cat = (window.BOG_CATEGORIES || []).find(function (k) { return k.id === c.category; });
  var hay = (c.name + " " + (c.desc || "") + " " + (cat ? cat.name : "")).toLowerCase();
  return String(query || "").toLowerCase().split(/\s+/).every(function (w) { return !w || hay.indexOf(w) >= 0; });
};
window.BOG_DATE = function (d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

(function () {
  function sections(prefix, current) {
    return window.BOG_SECTIONS.map(function (s) {
      return '<a href="' + prefix + s.href + '"' + (s.id === current ? ' aria-current="page"' : "") + ">" + s.name + "</a>";
    }).join("");
  }
  function theme() { return window.BOG_THEME ? window.BOG_THEME.button() : ""; }

  /* Sidebar for component pages: <nav id="bog-nav" data-current="button"></nav> */
  var navQuery = "";
  function filterNav(nav) {
    var shown = 0;
    nav.querySelectorAll("li[data-id]").forEach(function (li) {
      var c = window.BOG_COMPONENTS.find(function (x) { return x.id === li.getAttribute("data-id"); });
      li.hidden = !window.BOG_MATCH(c, navQuery);
      if (!li.hidden) shown++;
    });
    var empty = nav.querySelector(".docs-nav__empty");
    if (empty) empty.hidden = shown > 0;
  }
  function renderNav() {
    var nav = document.getElementById("bog-nav");
    if (!nav) return;
    var current = nav.getAttribute("data-current");
    var mode = window.BOG_SORT.get();
    var html = '<div class="docs-nav__sections">' + sections("../", "components") + "</div>" +
      '<div class="docs-nav__head"><a class="docs-nav__home" href="../index.html">Components</a>' +
      '<div class="docs-sort" data-sort-switch>' + window.BOG_SORT.html() + "</div></div>" +
      '<div class="docs-nav__search"><input type="search" class="docs-search" placeholder="Search components" aria-label="Search components" autocomplete="off"></div><ul>';
    window.BOG_SORT.list(mode).forEach(function (c) {
      html += '<li data-id="' + c.id + '"><a href="' + c.page + '"' + (c.id === current ? ' aria-current="page"' : "") +
        (mode === "updated" ? ' title="Updated ' + window.BOG_DATE(c.updated) + '"' : "") + ">" + c.name +
        (c.isNew ? window.BOG_NEW_CHIP : "") + (c.motion ? window.BOG_MOTION_CHIP : "") + "</a></li>";
    });
    nav.innerHTML = html + '<li class="docs-nav__empty" hidden>No components match</li></ul><div class="docs-nav__foot">' + theme() + "</div>";
    var input = nav.querySelector(".docs-search");
    input.value = navQuery;
    filterNav(nav);
    if (!nav._search) {   // listeners once; the list itself is re-rendered when the sort changes
      nav._search = true;
      nav.addEventListener("input", function (e) {
        if (!e.target.matches(".docs-search")) return;
        navQuery = e.target.value;
        filterNav(nav);
      });
      nav.addEventListener("keydown", function (e) {
        if (!e.target.matches(".docs-search")) return;
        if (e.key === "Enter") {   // open the first match
          var first = nav.querySelector("li[data-id]:not([hidden]) a");
          if (first) location.href = first.getAttribute("href");
        } else if (e.key === "Escape") {
          e.target.value = navQuery = "";
          filterNav(nav);
        }
      });
    }
    var me = window.BOG_COMPONENTS.find(function (c) { return c.id === current; });
    var link = document.getElementById("figma-link");
    if (me && link) link.href = me.figma;
  }

  /* Top bar for the start page and section pages: <header class="docs-top" id="bog-top" data-current="components"></header> */
  function renderTop() {
    var top = document.getElementById("bog-top");
    if (!top) return;
    top.innerHTML = '<a class="docs-top__brand" href="index.html">BOG UI</a>' +
      '<nav class="docs-sections">' + sections("", top.getAttribute("data-current")) + "</nav>" + theme();
  }

  function render() { renderNav(); renderTop(); }
  window.BOG_SORT.onChange(renderNav);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
