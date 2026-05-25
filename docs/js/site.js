(function () {
  const SUPPORTED_LOCALES = ["en", "zh-Hans", "zh-Hant"];
  const STORAGE_KEY = "learnnest-lang";

  const NAV_LABELS = {
    en: { support: "Support", privacy: "Privacy", terms: "Terms", footer: "LearnNest by New Tree" },
    "zh-Hans": { support: "支持", privacy: "隐私", terms: "条款", footer: "学巢 · New Tree 出品" },
    "zh-Hant": { support: "支援", privacy: "隱私", terms: "條款", footer: "學巢 · New Tree 出品" }
  };

  const PAGE_TITLES = {
    index: {
      en: "LearnNest Support",
      "zh-Hans": "学巢技术支持",
      "zh-Hant": "學巢技術支援"
    },
    privacy: {
      en: "LearnNest Privacy Policy",
      "zh-Hans": "学巢隐私政策",
      "zh-Hant": "學巢隱私權政策"
    },
    terms: {
      en: "LearnNest Terms of Use",
      "zh-Hans": "学巢使用条款",
      "zh-Hant": "學巢使用條款"
    }
  };

  function normalizeLocale(value) {
    if (!value) return null;
    const lower = value.toLowerCase();
    if (lower === "zh-hans" || lower.startsWith("zh-cn") || lower === "zh") return "zh-Hans";
    if (lower === "zh-hant" || lower.startsWith("zh-tw") || lower.startsWith("zh-hk")) return "zh-Hant";
    if (lower.startsWith("en")) return "en";
    return SUPPORTED_LOCALES.includes(value) ? value : null;
  }

  function detectLocale() {
    const params = new URLSearchParams(window.location.search);
    return (
      normalizeLocale(params.get("lang")) ||
      normalizeLocale(localStorage.getItem(STORAGE_KEY)) ||
      normalizeLocale(navigator.language || navigator.userLanguage) ||
      "en"
    );
  }

  function pageKey() {
    const file = window.location.pathname.split("/").pop() || "index.html";
    if (file.startsWith("privacy")) return "privacy";
    if (file.startsWith("terms")) return "terms";
    return "index";
  }

  function withLang(href, locale) {
    const url = new URL(href, window.location.href);
    url.searchParams.set("lang", locale);
    return url.pathname.split("/").pop() + url.search;
  }

  function setLocale(locale) {
    if (!SUPPORTED_LOCALES.includes(locale)) locale = "en";
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;

    document.querySelectorAll("[data-locale-content]").forEach(function (section) {
      section.hidden = section.getAttribute("data-locale-content") !== locale;
    });

    document.querySelectorAll(".lang-switcher button").forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.locale === locale ? "true" : "false");
    });

    const labels = NAV_LABELS[locale];
    document.querySelectorAll("[data-nav='support']").forEach(function (el) {
      el.textContent = labels.support;
    });
    document.querySelectorAll("[data-nav='privacy']").forEach(function (el) {
      el.textContent = labels.privacy;
    });
    document.querySelectorAll("[data-nav='terms']").forEach(function (el) {
      el.textContent = labels.terms;
    });
    document.querySelectorAll("[data-footer-brand]").forEach(function (el) {
      el.textContent = labels.footer;
    });

    document.querySelectorAll("[data-localized-href]").forEach(function (link) {
      link.setAttribute("href", withLang(link.getAttribute("data-localized-href"), locale));
    });

    const title = PAGE_TITLES[pageKey()][locale];
    if (title) document.title = title;
  }

  function init() {
    const locale = detectLocale();
    document.querySelectorAll(".lang-switcher button").forEach(function (button) {
      button.addEventListener("click", function () {
        setLocale(button.dataset.locale);
      });
    });
    setLocale(locale);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
