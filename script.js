// ===== Portfolio interactions =====

// Current year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Scroll progress + navigation shadow
const progressBar = document.getElementById("progressBar");
const nav = document.getElementById("siteNav");

function onScroll() {
  const h = document.documentElement;
  const scrollable = h.scrollHeight - h.clientHeight;
  const scrolled = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;

  if (progressBar) progressBar.style.width = `${scrolled}%`;
  if (nav) nav.classList.toggle("scrolled", h.scrollTop > 10);
}

document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile menu
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !navToggle.contains(e.target)) {
      mobileMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Smooth section scrolling with fixed-header offset
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const selector = link.getAttribute("href");
    if (!selector || selector === "#") return;

    const target = document.querySelector(selector);
    if (!target) return;

    e.preventDefault();

    if (mobileMenu) mobileMenu.classList.remove("open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");

    const navHeight = document.getElementById("siteNav")?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

    window.scrollTo({ top, behavior: "smooth" });
  });
});

// Scroll reveal animation using native IntersectionObserver.
// This keeps the site dependency-free while giving an AOS-like effect.
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

// Project images: show a clean fallback when a screenshot hasn't been added yet.
document.querySelectorAll(".project-image img").forEach((img) => {
  img.addEventListener("error", () => {
    img.style.display = "none";
  });
});

// Back to top
const backTop = document.getElementById("backTop");
if (backTop) {
  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Respect reduced-motion preference.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (reducedMotion.matches) {
  document.documentElement.style.scrollBehavior = "auto";
}
