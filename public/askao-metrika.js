/* Shared by source builds and existing production HTML shells. */
(function () {
  "use strict";

  var counterId = 113671476;
  var productionHosts = ["xn--80aa3arm.xn--p1ai", "www.xn--80aa3arm.xn--p1ai"];
  if (productionHosts.indexOf(location.hostname) === -1 || /^\/admin(?:\/|$)/.test(location.pathname)) return;
  if (window.__askaoMetrikaInstalled) return;
  window.__askaoMetrikaInstalled = true;

  window.ym = window.ym || function () {
    (window.ym.a = window.ym.a || []).push(arguments);
  };
  window.ym.l = window.ym.l || Date.now();

  if (!document.querySelector('script[src^="https://mc.yandex.ru/metrika/tag.js"]')) {
    var tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://mc.yandex.ru/metrika/tag.js?id=" + counterId;
    document.head.appendChild(tag);
  }

  window.ym(counterId, "init", {
    defer: true,
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: "dataLayer",
    accurateTrackBounce: true,
    trackLinks: true
  });

  var lastUrl = null;
  var pendingView = null;
  var pendingTimer = null;

  function pageUrl() {
    return location.origin + location.pathname + location.search;
  }

  function flushView() {
    if (!pendingView) return;
    clearTimeout(pendingTimer);
    var view = pendingView;
    pendingView = null;
    window.ym(counterId, "hit", view.url, {
      title: view.title,
      referer: lastUrl || document.referrer || undefined
    });
    lastUrl = view.url;
  }

  function scheduleView() {
    var url = pageUrl();
    if (pendingView && pendingView.url === url) return;
    // Preserve a quick intermediate visit before scheduling the next route.
    flushView();
    if (url === lastUrl || /^\/admin(?:\/|$)/.test(location.pathname)) return;
    pendingView = { url: url, title: document.title };
    pendingTimer = setTimeout(flushView, 1000);
  }

  function start() {
    pendingView = { url: pageUrl(), title: document.title };
    flushView();

    // React updates page titles after lazy routes mount. Wait for that title,
    // with a fallback for pages whose title does not change.
    new MutationObserver(function () {
      if (pendingView && pendingView.url === pageUrl() && pendingView.title !== document.title) {
        pendingView.title = document.title;
        flushView();
      }
    }).observe(document.head, { childList: true, subtree: true, characterData: true });

    ["pushState", "replaceState"].forEach(function (method) {
      var original = history[method];
      history[method] = function () {
        var result = original.apply(this, arguments);
        scheduleView();
        return result;
      };
    });
    window.addEventListener("popstate", scheduleView);
    window.addEventListener("pagehide", flushView);

    document.addEventListener("click", function (event) {
      if (event.button !== 0 || !(event.target instanceof Element)) return;
      var link = event.target.closest("a[href]");
      if (!link) return;
      var url;
      try { url = new URL(link.href, location.href); } catch (_) { return; }

      var goal;
      var params = { page_path: location.pathname };
      if (url.protocol === "tel:") goal = "contact_phone";
      else if (url.protocol === "mailto:") goal = "contact_email";
      else if (/\.pdf$/i.test(url.pathname)) {
        goal = link.hasAttribute("download") ? "pdf_download" : "pdf_open";
        params.file_path = url.pathname;
      } else if (url.hostname === "t.me" || url.hostname === "telegram.me") goal = "telegram_click";
      else if (url.hostname === "max.ru") goal = "max_click";
      else if (url.hostname === "yandex.ru" && url.pathname.indexOf("/maps") === 0) goal = "open_map";
      else if (url.hostname === "promfinforum.ru" || url.hostname === "www.promfinforum.ru") goal = "forum_website";
      else if (url.origin !== location.origin && /регистрац/i.test(link.textContent || "")) goal = "event_registration";

      if (goal) {
        flushView();
        window.ym(counterId, "reachGoal", goal, params);
      }
    }, true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
