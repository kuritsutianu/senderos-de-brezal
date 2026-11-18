// Páginas web de Senderos de Brezal: elegir idioma, animaciones al bajar,
// hojas que caen en el cielo y botón para volver arriba. Sin dependencias.
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  // --- Idioma: el de la dirección (/privacy → inglés), el elegido antes o el del navegador ---
  var english = /privacy|delete-account|\/terms/.test(location.pathname);
  var saved = null;
  try { saved = localStorage.getItem("brezal-lang"); } catch (e) { /* sin almacenamiento */ }
  var lang = location.hash === "#en" ? "en" : location.hash === "#es" ? "es"
    : (saved || (english ? "en" : (navigator.language || "es").slice(0, 2) === "es" ? "es" : "en"));

  function setLang(code, animate) {
    lang = code;
    root.lang = code;
    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-lang") === code);
    });
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-set-lang") === code ? "true" : "false");
    });
    var title = document.querySelector("title[data-" + code + "]") || document.querySelector("title");
    if (title && title.getAttribute("data-" + code)) document.title = title.getAttribute("data-" + code);
    try { localStorage.setItem("brezal-lang", code); } catch (e) { /* nada */ }
    if (animate) {
      document.querySelectorAll("[data-lang].active .reveal").forEach(function (el) { el.classList.remove("visible"); });
      watch();
    }
  }
  document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-set-lang"), true);
      btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop");
    });
  });

  // --- Tarjetas que aparecen al bajar ---
  var observer = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 }) : null;
  function watch() {
    document.querySelectorAll(".reveal:not(.visible)").forEach(function (el, i) {
      if (observer) {
        el.style.transitionDelay = Math.min(i, 3) * 70 + "ms";
        observer.observe(el);
      } else {
        el.classList.add("visible");
      }
    });
  }

  // --- Hojas que caen en el cielo ---
  var sky = document.querySelector(".sky");
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (sky && !calm) {
    var colors = ["#8db872", "#bcd8a0", "#f1c55e", "#f2a97e"];
    for (var i = 0; i < 9; i++) {
      var leaf = document.createElement("span");
      leaf.className = "leaf";
      leaf.style.left = (5 + Math.random() * 90) + "%";
      leaf.style.background = colors[i % colors.length];
      leaf.style.animationDuration = (7 + Math.random() * 6) + "s";
      leaf.style.animationDelay = (-Math.random() * 10) + "s";
      sky.appendChild(leaf);
    }
  }

  // --- Volver arriba ---
  var top = document.querySelector(".to-top");
  if (top) {
    window.addEventListener("scroll", function () {
      top.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" }); });
  }

  setLang(lang, false);
  watch();
})();
