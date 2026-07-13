/* Fatima Elsheikh — portfolio interactions (vanilla JS, no dependencies) */
(function () {
  "use strict";

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reducedMotion = motionQuery.matches;

  // If the user enables reduced motion mid-session, stop hiding/animating.
  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", function (e) {
      reducedMotion = e.matches;
      if (e.matches) {
        document.querySelectorAll(".reveal--ready").forEach(function (el) {
          el.classList.add("is-visible");
        });
        var tlEl = document.querySelector(".tl");
        if (tlEl) tlEl.style.setProperty("--tl-progress", "1");
      }
    });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  }

  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("is-open", !open);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      closeMenu();
      toggle.focus();
    }
  });

  /* ---------- Smooth anchor scrolling ---------- */
  document.querySelectorAll("a[data-scroll]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      var behavior = reducedMotion ? "auto" : "smooth";
      var focusTarget = target;
      if (id === "#top") {
        // The header is position:fixed — scrollIntoView on it is a no-op.
        window.scrollTo({ top: 0, behavior: behavior });
        focusTarget = document.querySelector(".hero__name") || target;
      } else {
        target.scrollIntoView({ behavior: behavior, block: "start" });
      }
      history.replaceState(null, "", id);
      // Move focus for keyboard/screen-reader users without re-scrolling.
      if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
      focusTarget.focus({ preventScroll: true });
    });
  });

  /* ---------- Scroll reveals ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (!reducedMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.05 });

    reveals.forEach(function (el) {
      // Hidden state is applied from JS only, so the page is complete without it.
      el.classList.add("reveal--ready");
      revealObserver.observe(el);
    });
  }

  /* ---------- Animated KPI counters ---------- */
  var counters = document.querySelectorAll(".metric__num[data-count]");
  if (!reducedMotion && "IntersectionObserver" in window && counters.length) {
    var animateCount = function (el) {
      var end = parseInt(el.getAttribute("data-count"), 10);
      var duration = 1400;
      var start = null;
      function frame(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(end * eased));
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    };
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------- Nav scrollspy ---------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav__menu a[href^="#"]')
  );
  var spySections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && spySections.length) {
    var setCurrent = function (id) {
      navLinks.forEach(function (link) {
        if (link.getAttribute("href") === "#" + id) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    }, { rootMargin: "-40% 0px -55%", threshold: 0 });
    spySections.forEach(function (s) { spyObserver.observe(s); });
  }

  /* ---------- Case study expand / collapse ---------- */
  document.querySelectorAll(".case__toggle").forEach(function (btn) {
    var body = document.getElementById(btn.getAttribute("aria-controls"));
    var label = btn.querySelector(".case__toggle-label");
    var activeEnd = null;

    // A click mid-animation must cancel the previous transitionend handler,
    // or a stale collapse handler can hide a panel that was just re-expanded.
    function clearActiveEnd() {
      if (activeEnd) {
        body.removeEventListener("transitionend", activeEnd);
        activeEnd = null;
      }
    }

    function onTransitionEnd(fn) {
      clearActiveEnd();
      activeEnd = function (e) {
        if (e.target !== body || e.propertyName !== "height") return;
        clearActiveEnd();
        fn();
      };
      body.addEventListener("transitionend", activeEnd);
    }

    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      label.textContent = expanded
        ? label.getAttribute("data-open")
        : label.getAttribute("data-close");

      if (reducedMotion) {
        clearActiveEnd();
        body.classList.remove("is-animating");
        body.style.height = "";
        body.hidden = expanded;
        return;
      }

      if (expanded) {
        // collapse: fix current height, then animate to 0
        body.style.height = body.scrollHeight + "px";
        body.classList.add("is-animating");
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { body.style.height = "0px"; });
        });
        onTransitionEnd(function () {
          body.classList.remove("is-animating");
          body.style.height = "";
          body.hidden = true;
        });
      } else {
        // expand: animate 0 → content height
        body.hidden = false;
        body.classList.add("is-animating");
        body.style.height = "0px";
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { body.style.height = body.scrollHeight + "px"; });
        });
        onTransitionEnd(function () {
          body.classList.remove("is-animating");
          body.style.height = "";
        });
      }
    });
  });

  /* ---------- Timeline progress scrub ---------- */
  var tl = document.querySelector(".tl");
  if (tl) {
    if (reducedMotion) {
      tl.style.setProperty("--tl-progress", "1");
    } else {
      var ticking = false;
      var updateProgress = function () {
        ticking = false;
        var rect = tl.getBoundingClientRect();
        var vh = window.innerHeight;
        // 0 when the list top reaches ~80% viewport, 1 when its bottom reaches ~85%
        var total = rect.height - vh * 0.05;
        var passed = vh * 0.8 - rect.top;
        var p = Math.min(1, Math.max(0, passed / Math.max(total, 1)));
        tl.style.setProperty("--tl-progress", p.toFixed(3));
      };
      window.addEventListener("scroll", function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateProgress);
        }
      }, { passive: true });
      updateProgress();
    }
  }
})();
