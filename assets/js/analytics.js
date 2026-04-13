"use strict";

(function () {
  if (window.__utsAnalyticsInitialized) {
    return;
  }
  window.__utsAnalyticsInitialized = true;

  function cleanParams(params) {
    var cleaned = {};
    Object.keys(params).forEach(function (key) {
      var value = params[key];
      if (value !== undefined && value !== null && value !== "") {
        cleaned[key] = value;
      }
    });
    return cleaned;
  }

  function sendEvent(eventName, params) {
    if (typeof window.gtag !== "function") {
      return;
    }
    window.gtag("event", eventName, cleanParams(params || {}));
  }

  function normalizeText(text) {
    return (text || "").replace(/\s+/g, " ").trim().slice(0, 120);
  }

  function getElementLabel(element) {
    return normalizeText(
      element.getAttribute("data-analytics-label") ||
        element.getAttribute("aria-label") ||
        element.title ||
        element.innerText ||
        element.textContent ||
        element.value ||
        element.id ||
        element.className
    );
  }

  function getElementType(element) {
    var tagName = (element.tagName || "").toLowerCase();
    var explicitType = element.getAttribute("type");
    return explicitType ? tagName + ":" + explicitType : tagName;
  }

  function getDestination(element) {
    if (element.tagName && element.tagName.toLowerCase() === "a") {
      return element.getAttribute("href") || "";
    }
    return "";
  }

  function buildBaseParams() {
    return {
      page_title: document.title,
      page_path: window.location.pathname,
      page_location: window.location.href
    };
  }

  function trackClickableElement(element, eventNameOverride, extraParams) {
    var label = getElementLabel(element);
    var params = Object.assign(buildBaseParams(), {
      event_category: "engagement",
      event_label: label,
      button_label: label,
      button_id: element.id || "",
      button_type: getElementType(element),
      destination_url: getDestination(element)
    }, extraParams || {});

    sendEvent(eventNameOverride || element.getAttribute("data-analytics-event") || "button_click", params);
  }

  document.addEventListener("click", function (event) {
    var clickable = event.target.closest("button, a, [role='button'], input[type='button'], input[type='submit']");
    if (!clickable || clickable.getAttribute("data-analytics") === "off") {
      return;
    }

    trackClickableElement(clickable);
  });

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || form.getAttribute("data-analytics") === "off") {
      return;
    }

    sendEvent(form.getAttribute("data-analytics-event") || "form_submit", {
      event_category: "engagement",
      event_label: normalizeText(form.getAttribute("data-analytics-label") || form.id || form.getAttribute("name") || "form_submit"),
      form_id: form.id || "",
      form_name: form.getAttribute("name") || "",
      form_action: form.getAttribute("action") || "",
      page_title: document.title,
      page_path: window.location.pathname,
      page_location: window.location.href
    });
  });

  window.trackAnalyticsEvent = function (eventName, params) {
    sendEvent(eventName, params);
  };

  window.trackButtonAnalytics = function (element, eventName, extraParams) {
    if (!element) {
      return;
    }
    trackClickableElement(element, eventName, extraParams);
  };
})();
