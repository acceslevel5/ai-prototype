/* BOG UI docs — Radio Button · Documentation tab.
   A copy of "Radio button — Documentation" in the BOG Mobile Component Documentation file
   (XG60TsYQZlOFopL9HpDDQI, node 104:15927), read 2026-11-10: same sections, copy, examples and
   geometry (1348px wide page, 360 × 820 Device Visuals, the same stages and Do / Don't cards).
   Every example is built from real, working bog-ui components — tap the radios, open the Select.
   The page is laid out at Figma size and scaled to fit the column (CSS zoom). Renders into #radio-doc. */
(function () {
  var host = document.getElementById("radio-doc");
  if (!host) return;
  var uid = 0, W = 1348;

  // ---- Real library components ---------------------------------------------------------
  // o: [title, desc, checked] or { title, desc, on, right, disabled, label, tap }
  function norm(o) { return Array.isArray(o) ? { title: o[0], desc: o[1], on: o[2] } : o; }
  function option(o, name) {
    o = norm(o);
    return '<label class="bog-radio"' + (o.right ? ' data-align="right"' : "") + (o.tap ? ' data-tap="' + o.tap + '"' : "") + ">" +
      (o.label ? '<span class="bog-radio__label">' + o.label + "</span>" : "") +
      '<span class="bog-radio__row"><input type="radio" class="bog-radio__input" name="' + name + '"' + (o.on ? " checked" : "") + (o.disabled ? " disabled" : "") + ">" +
      '<span class="bog-radio__text"><span class="bog-radio__title">' + o.title + "</span>" +
      (o.desc ? '<span class="bog-radio__desc">' + o.desc + "</span>" : "") + "</span></span></label>";
  }
  function group(g) {
    var name = "doc-rd" + uid++;
    var attrs = (g.state ? ' data-state="' + g.state + '"' : "") + (g.horizontal ? ' data-direction="horizontal"' : "") + (g.style ? ' style="' + g.style + '"' : "");
    return '<fieldset class="bog-radio-group"' + attrs + ">" +
      (g.label ? '<legend class="bog-radio-group__label">' + g.label + "</legend>" : "") +
      '<div class="bog-radio-group__options"' + (g.gap != null ? ' style="gap:' + g.gap + 'px"' : "") + ">" + g.options.map(function (o) {
        o = norm(o);
        if (g.right) o.right = true;
        if (g.disabled) o.disabled = true;
        if (g.optionLabel) o.label = g.optionLabel;
        return option(o, name);
      }).join("") + "</div>" +
      (g.message ? '<p class="bog-radio-group__message">' + g.message + "</p>" : "") + "</fieldset>";
  }
  // one Radio Button + Label (state matrix)
  function single(o) {
    var st = o.state && o.state !== "disabled" ? ' data-state="' + o.state + '"' : "";
    return '<label class="bog-radio"' + st + "><span class=\"bog-radio__row\">" +
      '<input type="radio" class="bog-radio__input" name="doc-rs' + uid++ + '"' + (o.on ? " checked" : "") + (o.state === "disabled" ? " disabled" : "") + ">" +
      '<span class="bog-radio__text"><span class="bog-radio__title">' + (o.title || "") + "</span></span></span>" +
      (o.message ? '<span class="bog-radio__message">' + o.message + "</span>" : "") + "</label>";
  }
  // the radio button alone
  function bare(on, state) {
    return '<input type="radio" class="bog-radio__input" name="doc-rb' + uid++ + '" aria-label="Option"' + (on ? " checked" : "") +
      (state === "disabled" ? " disabled" : state ? ' data-state="' + state + '"' : "") + ">";
  }
  var iconBtn = function (icon, label) { return '<button type="button" class="bog-icon-btn" data-type="neutral" data-size="small" aria-label="' + label + '" tabindex="-1"><span class="bog-icon" data-icon="' + icon + '"></span></button>'; };
  var btn = function (t) { return '<button type="button" class="bog-btn" data-type="primary" data-width="fill">' + t + "</button>"; };
  // a titled block inside a screen: 17 SemiBold title (+ description) above its content
  function part(title, inner, desc) {
    return '<div class="rd-part"><div class="rd-part__head"><h4>' + title + "</h4>" + (desc ? "<p>" + desc + "</p>" : "") + "</div>" + inner + "</div>";
  }

  // ---- Documentation elements ------------------------------------------------------------
  // Device Visual: 360 × 820 (iOS 402), Android or iOS status bar, themed navigation header
  function device(o) {
    return '<div class="rd-device bog-sheet-host"' + (o.ios ? ' data-os="ios"' : "") + (o.scale ? ' data-scale="' + o.scale + '"' : "") + ">" +
      '<header class="bog-navbar">' + (o.ios ? '<div class="bog-statusbar"></div>' : '<div class="rd-android"><span>Bog DS</span><span>02:20</span></div>') +
      '<div class="bog-navbar__header">' + (o.back ? iconBtn("chevron-left", "Back") : "") +
      '<div class="bog-navbar__titles">' + (o.title ? '<span class="bog-navbar__title">' + o.title + "</span>" : "") + "</div>" +
      '<div class="bog-navbar__actions">' + iconBtn("chat", "Chat") + "</div></div></header>" +
      '<div class="rd-page">' + o.body + "</div>" +
      (o.button ? '<div class="rd-device__cta">' + btn(o.button) + "</div>" : "") + (o.over || "") + "</div>";
  }
  // Marker Text: caption with a tick above each device
  function fig(caption, dev) { return '<figure class="rd-fig"><figcaption class="rd-cap">' + caption + "</figcaption>" + dev + "</figure>"; }
  // Layout stage (grey) — clip: the Visual frame shows the top 600px of the 988px stage
  function stage(figs, clip) { return '<div class="rd-visual"' + (clip ? " data-clip" : "") + '><div class="rd-stage">' + figs.join("") + "</div></div>"; }
  function copy(title, items, wide) {
    return '<div class="rd-copy"' + (wide ? ' data-wide="' + wide + '"' : "") + ">" + (title ? "<h3 class=\"rd-h\">" + title + "</h3>" : "") +
      items.map(function (t) { return "<p>" + t + "</p>"; }).join("") + "</div>";
  }
  // Section content: text column beside the visual (side) or above it (stack)
  var side = function (text, visual) { return '<div class="rd-content" data-layout="side">' + text + visual + "</div>"; };
  var stack = function (text, visual) { return '<div class="rd-content" data-layout="stack">' + text + visual + "</div>"; };
  function heading(title, subtitle) {
    return '<div class="rd-heading"><h2 class="rd-h">' + title + "</h2>" + (subtitle ? '<p class="rd-subtitle">' + subtitle + "</p>" : "") + "</div>";
  }
  function section(id, title, subtitle, inner) {
    return '<section class="rd-section" id="doc-' + id + '">' + heading(title, subtitle) + inner + "</section>";
  }
  // Anatomy: numbered markers with a leader line, on the side of the part they name
  function pin(n, sideName, len, y) {
    return '<span class="rd-pin" data-side="' + sideName + '" style="--l:' + (len || 60) + "px" + (y != null ? ";--y:" + y + "px" : "") + '"><i>' + n + "</i></span>";
  }
  function legend(items) { return '<ol class="rd-legend">' + items.map(function (t, i) { return "<li><i>" + (i + 1) + "</i>" + t + "</li>"; }).join("") + "</ol>"; }
  function anatomy(items, height, top, inner) {
    return side('<div class="rd-copy">' + legend(items) + "</div>",
      '<div class="rd-box rd-anat" style="height:' + height + "px;padding-top:" + top + 'px">' + inner + "</div>");
  }
  // Do / Don't pair
  function dd(title, items, doHtml, doNote, dontHtml, dontNote, align) {
    var card = function (kind, html, note) {
      return '<div class="rd-dd__card" data-kind="' + kind + '"><div class="rd-dd__slot"' + (align && align[kind] ? ' data-align="' + align[kind] + '"' : "") + ">" + html + "</div>" +
        '<div class="rd-dd__note"><b><i class="bog-icon" data-icon="' + (kind === "do" ? "check" : "close") + '"></i>' + (kind === "do" ? "Do" : "Don’t") + "</b>" + note + "</div></div>";
    };
    return '<div class="rd-dd">' + copy(title, items, "680") + '<div class="rd-dd__row">' + card("do", doHtml, doNote) + card("dont", dontHtml, dontNote) + "</div></div>";
  }

  var html = "";

  // ---- Header ------------------------------------------------------------------------
  var done = '<span class="rd-done">Done</span>';
  html += '<div class="rd-header" id="doc-overview">' +
    '<div class="rd-title"><h1>Radio button</h1><p>Radio Button Group lets users choose exactly one option from a set of mutually exclusive choices, shown all at once under one label.</p></div>' +
    '<dl class="rd-meta"><div><dt>Status</dt><dd><span class="rd-pill">In-production</span></dd></div><div><dt>Platform</dt><dd>Mobile</dd></div>' +
    "<div><dt>Development — iOS</dt><dd>" + done + "</dd></div><div><dt>Development — Android</dt><dd>" + done + "</dd></div></dl>" +
    '<div class="rd-overview">' + heading("Overview") +
    '<div class="rd-box rd-preview"><span>' + bare(false) + "</span><span>" + bare(true) + "</span></div></div></div>";

  // ---- Anatomy -----------------------------------------------------------------------
  html += section("anatomy", "Anatomy", "",
    anatomy(["Radio button", "Tap area"], 190, 118,
      '<span class="rd-target">' + bare(true) + pin(1, "top", 64) + pin(2, "right", 60) + "</span>") +
    anatomy(["Label (optional)", "Radio button", "Radio text", "Description (optional)"], 288, 117,
      '<span class="rd-target">' + option({ label: "Card delivery", title: "Courier delivery", desc: "3 - 5 business days", on: true }, "doc-an" + uid++) +
        pin(1, "top", 38) + pin(2, "left", 60, 30) + pin(3, "right", 60, 30) + pin(4, "bottom", 38) + "</span>") +
    anatomy(["Label (optional)", "Radio button Container", "Helper text (optional)"], 380, 117,
      '<span class="rd-target">' + group({ label: "Card delivery", options: [["Courier delivery", "", true], ["Pick up at a branch"], ["Post office"]], message: "You can change it later." }) +
        pin(1, "top", 38) + pin(2, "left", 60, 68) + pin(3, "bottom", 38) + "</span>"));

  // ---- Variants & Types ----------------------------------------------------------------
  var STATES = [["Enabled", ""], ["Error", "error"], ["Read Only", "readonly"], ["Disabled", "disabled"], ["Skeleton", "skeleton"]];
  var M = '<div class="rd-matrix">' +
    '<span class="rd-mh" style="grid-column:2/4">Radio button</span><span class="rd-mh" style="grid-column:4/6">Radio Button + Label</span>' +
    '<span></span><span class="rd-mh">Unselected</span><span class="rd-mh">Selected</span><span class="rd-mh">Unselected</span><span class="rd-mh">Selected</span>';
  STATES.forEach(function (s) {
    M += '<span class="rd-ms">' + s[0] + "</span>";
    [false, true].forEach(function (on) { M += '<span class="rd-mc">' + bare(on, s[1]) + "</span>"; });
    [false, true].forEach(function (on) {
      M += '<span class="rd-mc" data-wide>' + single({ title: "Courier delivery", on: on, state: s[1],
        message: s[1] === "error" ? (on ? "Courier delivery isn’t available at your address." : "Choose an option.") : "" }) + "</span>";
    });
  });
  M += "</div>";
  var FREQ = [["Monthly", "", true], ["Quarterly"], ["Half-yearly"], ["Yearly"]];
  html += section("variants", "Variants & Types", "States",
    '<div class="rd-box rd-states">' + M + "</div>" +
    stack(copy("Alignment and direction", ["Place the radio button to the left or right of its label to match the screen’s layout, and keep one alignment within a group.",
      "Use the horizontal layout only for two short options that fit on one line; otherwise, stack the options vertically."], "396 lists"),
      stage([
        fig("Left Alignment", device({ title: "Cards", body: group({ label: "Card delivery", options: [["Courier delivery", "", true], ["Pick up at a branch"], ["Post office"], ["Digital card only"]] }) })),
        fig("Right Alignment", device({ title: "Cards", body: group({ label: "Statement frequency", right: true, options: FREQ }) })),
        fig("Horizontal", device({ title: "Cards", body: group({ label: "Send the code by", horizontal: true, options: [["SMS"], ["Email", "", true]] }) }))
      ], true)));

  // ---- Behavior ------------------------------------------------------------------------
  var cards = function (on, tap) {
    return part("Card type", group({ options: ["Debit card", "Credit card", "Virtual card"].map(function (t, i) { return { title: t, on: i === on, tap: tap && i === on ? "radio" : "" }; }) })) +
      part("Card delivery", group({ options: [["Courier delivery", "", true], ["Pick up at a branch"]] }));
  };
  html += section("behavior", "Behavior", "Selection",
    side(copy("Selecting an option", ["Tapping an option selects it and clears the previous choice, so only one option in a group is selected.",
      "Users can’t clear a selection by tapping it again. If “no choice” is a valid answer, add an option for it, like None.",
      "Each group works on its own: choosing in one group doesn’t change another."], "396"),
      stage([fig("Debit card selected", device({ title: "Cards", body: cards(0) })),
        fig("Tap Credit card — Debit card clears", device({ title: "Cards", body: cards(1, true) }))], true)));

  // ---- Usage ---------------------------------------------------------------------------
  var tx = function (rows) { return '<div class="rd-tx">' + rows.map(function (r) { return "<div><span>" + r[0] + "</span><b>" + r[1] + "</b></div>"; }).join("") + "</div>"; };
  html += section("usage", "Usage", "Choosing one option",
    side(copy("When to use", ["Use radio buttons when users must choose exactly one option from a set of mutually exclusive choices.",
      "Show all options at once, so users can compare them before they choose.",
      "Ask a clear question above the group, and place options side by side only when there are two short ones, like SMS and Email."], "396"),
      stage([fig("All options visible at once", device({ title: "Cards", body: cards(0) })),
        fig("Two short options, side by side", device({ title: "Security", body: part("Verification", group({ label: "Where should we send the verification code?", horizontal: true, options: [["SMS"], ["Email", "", true]] })) }))], true)) +
    side(copy("Radio button or Filter chip", ["Use radio buttons for an answer users submit — one option from a visible set, compared with its details and confirmed with Continue, like card delivery.",
      "Use filter chips when the choice only changes what’s shown, like transaction types in History — the list updates right away. See the Filter chip documentation."], "396"),
      stage([fig("An answer to submit: Radio button", device({ title: "Order a card", button: "Continue", body: group({ label: "Card delivery", options: [
          ["Courier delivery", "3 - 5 business days · 5.00 ₾", true], ["Pick up at a branch", "Ready in 2 business days · Free"], ["Post office", "5 - 7 business days · Free"], ["Digital card only", "Ready to use right away · Free"]] }) })),
        fig("A filter on the list: Filter chip", device({ title: "History", body: part("Transactions",
          '<div class="bog-chip-group" data-wrap role="group" aria-label="Transaction type">' + [["Income", true], ["Expenses"], ["Transfers", true], ["Card payments"]].map(function (c) {
            return '<button type="button" class="bog-chip" data-type="filter" aria-pressed="' + !!c[1] + '">' + c[0] + "</button>"; }).join("") + "</div>" +
          tx([["Salary · 1 October", "+2,450.00 ₾"], ["Transfer from Giorgi Kapanadze", "+300.00 ₾"], ["Transfer to Nino Beridze", "−120.00 ₾"]])) }))])) +
    side(copy("Read Only State", ["Use Read-only when users need to see the chosen option but can’t change it — for example, an account type set when the account was opened, or a choice already confirmed.",
      "Keep the selected option clearly marked and legible, and explain why it can’t be changed. Unlike Disabled, Read-only still shows which option was chosen; use Disabled only for options that are unavailable."], "396"),
      stage([fig("Read-only with a reason", device({ title: "Statements", body:
          part("Account type", group({ state: "readonly", options: [["Personal", "", true], ["Business"]] }), "Set when you opened the account. Contact us to change it.") +
          part("Statement delivery", group({ options: [["Email", "", true], ["Post"]] })) })),
        fig("Read-only vs Disabled", device({ title: "Cards", body:
          part("Read-only", group({ state: "readonly", options: [["Monthly", "", true], ["Quarterly"]] }), "The chosen option stays clear, but can’t be changed.") +
          part("Disabled", group({ disabled: true, options: [["Express delivery"], ["Standard delivery"]] }), "Not available at the moment.") }))], true)) +
    side(copy("Read-only on the summary", ["Once the form is filled in, show each chosen option on a summary step as read-only, so users can check their answers without changing them by accident.",
      "Keep one main action, like Confirm, at the bottom; users can go back to the form to change an answer."], "396"),
      stage([fig("Form, filled in", device({ title: "Cards", button: "Continue", body:
          part("Card type", group({ options: [["Debit card", "", true], ["Credit card"]] })) +
          part("Card delivery", group({ options: [["Courier delivery", "", true], ["Pick up at a branch"]] })) +
          part("Statement frequency", group({ options: [["Monthly", "", true], ["Quarterly"], ["Yearly"]] })) })),
        fig("Summary: answers read-only", device({ back: true, button: "Confirm", body:
          part("Card type", group({ state: "readonly", options: [["Debit card", "", true], ["Credit card"]] }), "Check your answers before you confirm.") +
          part("Card delivery", group({ state: "readonly", options: [["Courier delivery", "", true], ["Pick up at a branch"]] })) +
          part("Statement frequency", group({ state: "readonly", options: [["Monthly", "", true], ["Quarterly"], ["Yearly"]] })) }))])));

  // ---- Best practices ------------------------------------------------------------------
  var CITIES = ["Tbilisi", "Batumi", "Kutaisi", "Rustavi", "Gori", "Zugdidi", "Telavi"];
  var citySelect = '<div class="bog-select"><button type="button" class="bog-select__box"><span class="bog-select__text"><span class="bog-select__label">Select a city</span><span class="bog-select__value"></span></span><span class="bog-select__chevron"></span></button>' +
    '<select class="bog-select__native" name="doc-city' + uid++ + '" aria-label="Pick-up city"><option value="" selected hidden></option>' + CITIES.map(function (c) { return "<option>" + c + "</option>"; }).join("") + "</select></div>";
  var sheet = '<div class="rd-scrim"></div><div class="rd-sheet"><span class="rd-sheet__handle"></span><div class="rd-sheet__nav"><h4>Pick-up city</h4>' +
    '<button type="button" class="bog-icon-btn" data-type="neutral" aria-label="Close" tabindex="-1"><span class="bog-icon" data-icon="close"></span></button></div>' +
    '<div class="rd-sheet__body">' + group({ options: CITIES.map(function (c) { return [c]; }) }) + '</div><span class="rd-sheet__home"></span></div>';
  html += section("best", "Best practices", "Number of options",
    stack(copy("Short and long lists", ["Show up to five options, like card delivery, as radio buttons, so they are easy to compare at a glance.",
      "For longer lists, like seven pick-up cities, use a select field that opens the options in a bottom sheet.",
      "Don’t preselect an option in a long list: people may not notice that they haven’t made a choice themselves."], "680"),
      stage([fig("Up to five options: radio buttons", device({ title: "Cards", button: "Continue", body:
          part("Pick-up city", group({ options: CITIES.slice(0, 5).map(function (c) { return [c]; }) })) +
          part("Card delivery", group({ options: [["Courier delivery"], ["Pick up at a branch"], ["Post office"], ["Digital card only"]] })) })),
        fig("Longer list: a select field", device({ title: "Cards", body: part("Pick-up city", citySelect) })),
        fig("Options open in a bottom sheet", device({ title: "Cards", body: part("Pick-up city", citySelect.replace(/name="doc-city\d+"/, 'name="doc-city' + uid++ + '"')), over: sheet }))])));

  // ---- Accessibility -------------------------------------------------------------------
  html += section("a11y", "Accessibility", "Text scaling",
    side(copy("Typography scaling", ["Labels grow with the system text size — on Android with no limit — and stay fully readable.",
      "Labels wrap onto more lines and rows grow with the text; the radio button stays aligned with the first line."], "400"),
      stage([fig("Android", device({ title: "Cards", scale: "android", body:
          part("Card delivery", group({ options: [["Courier delivery", "", true], ["Pick up at a branch — ready in 2 business days"], ["Digital card only"]] }), "Choose how you’d like to receive your new card.") +
          part("Statement language", group({ options: [["Georgian", "", true], ["English"]] }), "We’ll send your account statements in this language.") })),
        fig("iOS", device({ title: "Statements", ios: true, scale: "ios", body:
          part("Statement language", group({ horizontal: true, options: [["Georgian"], ["English", "", true]] }), "We’ll send your account statements in this language.") }))])));

  // ---- Do / Don't ----------------------------------------------------------------------
  var WRAP = "Pick up at a branch — your card is ready in 2 business days";
  var CARDOPT = [["Courier delivery", "", true], ["Pick up at a branch"], ["Post office"], ["Digital card only"]];
  var ACCOUNTS = [["Personal account", "", true], ["Business account"], ["Joint account"], ["Savings account"]];
  var tapGroup = function (where) { return group({ options: CARDOPT.map(function (o, i) { o = norm(o); if (i === 0) o.tap = where; return o; }) }); };
  html += '<section class="rd-section" id="doc-dodont">' + heading("Do / Don't") + '<div class="rd-dd-list">' +
    dd("Overflow content", ["Keep radio button labels short — a few words is best. If a label wraps, keep the radio button aligned with the first line."],
      group({ style: "width:330px", options: [[WRAP, "", true], ["Courier delivery"]] }), "Align the radio button with the first line of a label that wraps.",
      group({ style: "width:330px", state: "", options: [[WRAP, "", true], ["Courier delivery"]] }).replace('class="bog-radio-group"', 'class="bog-radio-group rd-center-rows"'), "Don’t center the radio button on a label that wraps to several lines.") +
    dd("Arrangement", ["Stack radio buttons vertically, so each label sits right next to its own button. Place options side by side only when there are two short ones."],
      group({ options: FREQ }), "Stack options vertically — each label is easy to match to its radio button.",
      group({ horizontal: true, options: FREQ }), "Don’t place more than two options side by side — the row is hard to scan and labels are easy to mismatch.", { dont: "center" }) +
    dd("Label", ["Give the group one clear label that asks the question, and give each option its own short label."],
      group({ label: "Statement frequency", options: FREQ }), "Use one label for the whole group.",
      group({ optionLabel: "Statement frequency", options: FREQ }), "Don’t repeat the group label above each option.") +
    dd("Spacing between elements", ["Keep the standard form spacing between radio buttons, so every option is easy to read and tap."],
      group({ label: "Card delivery", options: CARDOPT }), "Keep the form-gap spacing between options.",
      group({ label: "Card delivery", options: CARDOPT, gap: 2 }), "Don’t reduce the spacing — options become harder to tap and tell apart.") +
    dd("Read Only State", ["Use Read-only when users need to see the chosen option but can’t change it.", "Read-only keeps the selected option clear and readable. Disabled fades it out — use Disabled only for options that are unavailable."],
      group({ state: "readonly", options: ACCOUNTS }), "Use Read-only to show a chosen option that can’t be changed.",
      group({ disabled: true, options: ACCOUNTS }), "Don’t use Disabled for information users need to read — it’s too faint.") +
    dd("Tap Area", ["Make the whole row — the radio button and its label — one tap target, so users can select an option by tapping either."],
      tapGroup("label"), "Make the radio button and its label one tap target.",
      tapGroup("radio"), "Don’t limit the tap area to the radio button alone.") +
    "</div></section>";

  // ---- Changelog -----------------------------------------------------------------------
  html += '<section class="rd-section" id="doc-changelog">' + heading("Changelog") +
    '<div class="rd-log"><div class="rd-log__head"><span>Date</span><span>Change</span><span>Detail</span></div>' +
    '<div class="rd-log__row"><b>2026-10-05</b><span>Component published</span><span></span></div></div></section>';

  host.innerHTML = '<div class="rdoc">' + html + "</div>";
  var doc = host.firstChild;

  // Tap indicator follows the tap: in the Behavior example and the Tap Area pair it moves to
  // the option that was just chosen
  doc.addEventListener("change", function (e) {
    var row = e.target.closest(".bog-radio"), grp = row && row.closest(".bog-radio-group");
    var was = grp && grp.querySelector(".bog-radio[data-tap]");
    if (!was || was === row) return;
    row.setAttribute("data-tap", was.getAttribute("data-tap"));
    was.removeAttribute("data-tap");
  });

  // Laid out at Figma width, scaled to the column
  function layout() {
    var w = host.clientWidth;
    if (!w) return;                                  // tab hidden: done when it opens
    doc.style.zoom = Math.min(1, w / W);
  }
  if (window.ResizeObserver) new ResizeObserver(layout).observe(host);
  window.addEventListener("resize", layout);
  document.addEventListener("visibilitychange", layout);
  layout();
  window.BOG_RADIO_DOC = { layout: layout };
})();
