"use strict";

/**
 * ConectaFlow - Demo Portfolio Script
 * Objetivo: simular CTA do WhatsApp sem expor número real.
 * (Em modo demo, nada abre WhatsApp de verdade — só mostra um alerta.)
 */

const IS_PORTFOLIO_DEMO = true;

function demoAction(message) {
  alert(
    "✅ DEMO (Portfólio)\n\n" +
      "Aqui seria aberto o WhatsApp com a mensagem:\n\n" +
      message
  );
}

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function buildLeadMessage({ name, phone, message }) {
  return (
    `Olá! Me chamo ${name}.\n` +
    `Meu WhatsApp: ${phone}\n\n` +
    `Quero automatizar: ${message}`
  );
}

document.addEventListener("DOMContentLoaded", () => {
  // Ano no footer
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // CTA principal (botão do FAQ box)
  const ctaWhatsapp = $("#ctaWhatsapp");

  // Botão flutuante (bolha)
  const waFloat = $("#waFloat");

  const defaultMsg =
    "Olá! Vi sua landing de automação e quero entender como funciona. Pode me explicar?";

  function handleCtaClick(e) {
    if (e) e.preventDefault();

    if (IS_PORTFOLIO_DEMO) {
      demoAction(defaultMsg);
      return;
    }

    // Futuro (quando quiser WhatsApp real):
    // const phone = "55DDDNUMERO";
    // const url = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;
    // window.open(url, "_blank", "noopener,noreferrer");
  }

  if (ctaWhatsapp) ctaWhatsapp.addEventListener("click", handleCtaClick);
  if (waFloat) waFloat.addEventListener("click", handleCtaClick);

  // Form (leadForm)
  const form = $("#leadForm");
  const formError = $("#formError");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const phone = String(fd.get("phone") || "").trim();
      const message = String(fd.get("message") || "").trim();

      const ok = name.length >= 2 && phone.length >= 8 && message.length >= 5;

      if (!ok) {
        if (formError) formError.hidden = false;
        return;
      }
      if (formError) formError.hidden = true;

      const msg = buildLeadMessage({ name, phone, message });

      if (IS_PORTFOLIO_DEMO) {
        demoAction(msg);
      } else {
        // Futuro: abrir WhatsApp real aqui.
      }

      form.reset();
    });
  }

  // FAQ (estrutura do seu HTML é .faq__item + button.faq__q + .faq__a)
  $all(".faq__item").forEach((item) => {
    const btn = $(".faq__q", item);
    const answer = $(".faq__a", item);
    const icon = $(".faq__icon", item);

    if (!btn || !answer) return;

    btn.addEventListener("click", () => {
      const isOpen = answer.hidden === false;

      // fecha todos (comportamento accordion)
      $all(".faq__a").forEach((a) => (a.hidden = true));
      $all(".faq__q").forEach((b) => b.setAttribute("aria-expanded", "false"));
      $all(".faq__icon").forEach((i) => (i.textContent = "+"));

      // abre o clicado se estava fechado
      if (!isOpen) {
        answer.hidden = false;
        btn.setAttribute("aria-expanded", "true");
        if (icon) icon.textContent = "–";
      }
    });
  });

  // Menu mobile
  const menuBtn = $(".menu-btn");
  const mobileNav = $(".mobile-nav");

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      const isHidden = mobileNav.hasAttribute("hidden");
      if (isHidden) {
        mobileNav.removeAttribute("hidden");
        menuBtn.setAttribute("aria-expanded", "true");
      } else {
        mobileNav.setAttribute("hidden", "");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Scroll suave para âncoras
  $all('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // fecha menu mobile ao clicar
      if (mobileNav && !mobileNav.hasAttribute("hidden")) {
        mobileNav.setAttribute("hidden", "");
        if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Reveal animation (IntersectionObserver)
  const revealEls = $all(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    // fallback: mostra tudo
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
});
