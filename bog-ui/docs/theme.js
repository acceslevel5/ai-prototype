/* BOG UI docs — light / dark mode and brand theme.
   Load in <head> without defer so pages draw in the saved theme straight away.
   Sets <html data-theme="light|dark"> (docs.css + the components' colour tokens in tokens-colors.css)
   and <html data-bog-theme="business|solo|wealth|express-lombard"> (none = Retail).
   [data-theme-toggle] switches light/dark; a <select data-brand-select> picks the brand. Both are remembered. */
(function () {
  var KEY = "bog-ui-theme", BRAND_KEY = "bog-ui-brand", root = document.documentElement;
  var BRANDS = [["retail", "Retail"], ["business", "Business"], ["solo", "SOLO"], ["wealth", "Wealth"], ["express-lombard", "Express Lombard"]];
  var saved = null, brand = null;
  try { saved = localStorage.getItem(KEY); brand = localStorage.getItem(BRAND_KEY); } catch (e) {}
  root.setAttribute("data-theme", saved === "dark" ? "dark" : "light");
  applyBrand(brand);

  function label() { return root.getAttribute("data-theme") === "dark" ? "Light mode" : "Dark mode"; }
  function set(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { b.textContent = label(); });
    document.dispatchEvent(new CustomEvent("bogthemechange"));
  }
  function applyBrand(b) {
    var ok = BRANDS.some(function (x) { return x[0] === b; }) ? b : "retail";
    if (ok === "retail") root.removeAttribute("data-bog-theme"); else root.setAttribute("data-bog-theme", ok);
    return ok;
  }
  function setBrand(b) {
    b = applyBrand(b);
    try { localStorage.setItem(BRAND_KEY, b); } catch (e) {}
    document.querySelectorAll("[data-brand-select]").forEach(function (s) { s.value = b; });
    document.dispatchEvent(new CustomEvent("bogthemechange"));
  }
  function brandNow() { return root.getAttribute("data-bog-theme") || "retail"; }
  window.BOG_THEME = {
    get: function () { return root.getAttribute("data-theme"); },
    set: set,
    toggle: function () { set(root.getAttribute("data-theme") === "dark" ? "light" : "dark"); },
    brands: BRANDS,
    brand: brandNow,
    setBrand: setBrand,
    brandPicker: function () {
      return '<label class="docs-brand"><span class="docs-visually-hidden">Brand theme</span><select data-brand-select aria-label="Brand theme">' +
        BRANDS.map(function (b) { return '<option value="' + b[0] + '"' + (b[0] === brandNow() ? " selected" : "") + ">" + b[1] + "</option>"; }).join("") +
        "</select></label>";
    },
    // The theme controls in the docs bars: brand picker + light/dark switch
    button: function () { return '<span class="docs-theme-group">' + window.BOG_THEME.brandPicker() + '<button type="button" class="docs-theme" data-theme-toggle>' + label() + "</button></span>"; }
  };
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest("[data-theme-toggle]")) window.BOG_THEME.toggle();
  });
  document.addEventListener("change", function (e) {
    if (e.target.matches && e.target.matches("[data-brand-select]")) setBrand(e.target.value);
  });
})();


/* The start page rise-in plays on first paint only, not when search / chips re-render the cards */
window.addEventListener("load", function () {
  setTimeout(function () { document.documentElement.setAttribute("data-settled", ""); }, 1400);
});

/* Sidebar width (component pages): drag the right edge, double-click to reset, arrow keys when
   focused. Saved in localStorage and applied here in <head> so pages open at that width. */
(function () {
  var KEY = "bog-ui-nav-w", MIN = 200, MAX = 440, DEF = 264, root = document.documentElement;
  var clamp = function (w) { return Math.round(Math.min(MAX, Math.max(MIN, w))); };
  function set(w, save) {
    w = clamp(w);
    root.style.setProperty("--docs-nav-w", w + "px");
    if (save) { try { localStorage.setItem(KEY, w); } catch (e) {} }
    var h = document.querySelector(".docs-nav__resize");
    if (h) h.setAttribute("aria-valuenow", w);
  }
  try { var saved = +localStorage.getItem(KEY); if (saved) set(saved); } catch (e) {}
  function current() { return parseFloat(getComputedStyle(root).getPropertyValue("--docs-nav-w")) || DEF; }

  function add() {
    if (!document.querySelector(".docs > .docs-nav")) return;
    var h = document.createElement("button");
    h.type = "button";
    h.className = "docs-nav__resize";
    h.setAttribute("role", "separator");
    h.setAttribute("aria-orientation", "vertical");
    h.setAttribute("aria-label", "Resize sidebar");
    h.setAttribute("aria-valuemin", MIN);
    h.setAttribute("aria-valuemax", MAX);
    h.setAttribute("aria-valuenow", current());
    h.title = "Drag to resize · double-click to reset";
    h.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      e.preventDefault();
      h.setPointerCapture(e.pointerId);
      var x0 = e.clientX, w0 = current();
      h.setAttribute("data-dragging", "");
      root.setAttribute("data-nav-dragging", "");
      function move(ev) { set(w0 + ev.clientX - x0); }
      function up() {
        h.removeEventListener("pointermove", move);
        h.removeEventListener("pointerup", up);
        h.removeEventListener("pointercancel", up);
        h.removeAttribute("data-dragging");
        root.removeAttribute("data-nav-dragging");
        set(current(), true);
      }
      h.addEventListener("pointermove", move);
      h.addEventListener("pointerup", up);
      h.addEventListener("pointercancel", up);
    });
    h.addEventListener("dblclick", function () { set(DEF, true); });
    h.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowLeft" ? -16 : e.key === "ArrowRight" ? 16 : 0;
      if (e.key === "Home") { e.preventDefault(); set(MIN, true); }
      else if (e.key === "End") { e.preventDefault(); set(MAX, true); }
      else if (d) { e.preventDefault(); set(current() + d, true); }
    });
    document.querySelector(".docs").appendChild(h);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", add);
  else add();
})();
