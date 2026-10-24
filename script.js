
(() => {
  "use strict";

  // ==========================================
  // 1. GET HTML ELEMENTS
  // ==========================================
  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-nav");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const progressBar = document.getElementById("scroll-progress-bar");
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  // ==========================================
  // 2. DARK / LIGHT THEME
  // ==========================================
  function applyTheme(theme) {
    const isLight = theme === "light";

    body.classList.toggle("light-theme", isLight);

    if (themeIcon) {
      themeIcon.textContent = isLight ? "☾" : "☼";
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
      );

      themeToggle.title = isLight
        ? "Switch to dark theme"
        : "Switch to light theme";
    }
  }

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("pranay-portfolio-theme");
  } catch (error) {
    console.warn("Theme storage is unavailable.");
  }

  const prefersLight =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;

  applyTheme(savedTheme || (prefersLight ? "light" : "dark"));

  themeToggle?.addEventListener("click", () => {
    const nextTheme = body.classList.contains("light-theme")
      ? "dark"
      : "light";

    applyTheme(nextTheme);

    try {
      localStorage.setItem("pranay-portfolio-theme", nextTheme);
    } catch (error) {
      console.warn("Could not save theme preference.");
    }
  });

  // ==========================================
  // 3. MOBILE NAVIGATION
  // ==========================================
  function closeMobileMenu() {
    nav?.classList.remove("open");

    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation menu");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("open") ?? false;

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Close menu when clicking outside it.
  document.addEventListener("click", (event) => {
    if (
      nav &&
      menuToggle &&
      !nav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMobileMenu();
    }
  });

  // Close menu with Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  // ==========================================
  // 4. SCROLL PROGRESS + STICKY HEADER
  // ==========================================
  function updateScrollUI() {
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage =
      scrollHeight > 0
        ? (window.scrollY / scrollHeight) * 100
        : 0;

    if (progressBar) {
      progressBar.style.width =
        `${Math.min(100, Math.max(0, percentage))}%`;
    }

    header?.classList.toggle("scrolled", window.scrollY > 12);
  }

  window.addEventListener("scroll", updateScrollUI, {
    passive: true
  });

  updateScrollUI();

  // ==========================================
  // 5. SCROLL REVEAL ANIMATIONS
  // ==========================================
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    // Fallback for older browsers.
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // ==========================================
  // 6. AUTOMATIC FOOTER YEAR
  // ==========================================
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ==========================================
  // 7. CONTACT FORM
  // ==========================================
  // This version opens the visitor's email app.
  // It does NOT send email directly from the website.
  // Replace the placeholder with your real email.

  function showFormStatus(message, type = "") {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.classList.remove("success", "error");

    if (type) {
      formStatus.classList.add(type);
    }
  }

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    // CHANGE THIS TO YOUR REAL EMAIL ADDRESS.
    const receiver = "your-email@example.com";

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {
      showFormStatus(
        "Please complete all required fields.",
        "error"
      );
      return;
    }

    if (receiver === "your-email@example.com") {
      showFormStatus(
        "Please update the receiver email in script.js before using this form.",
        "error"
      );
      return;
    }

    const emailBody = [
      "Hello Pranay,",
      "",
      "You received a new message from your portfolio website.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
      "",
      "Regards,",
      name
    ].join("\n");

    const mailtoURL =
      `mailto:${receiver}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(emailBody)}`;

    showFormStatus(
      "Opening your email application. Review the message and click Send.",
      "success"
    );

    window.location.href = mailtoURL;
  });

})();
