// =========================================================
// Shared site behaviour: mobile nav, footer year, skill bars
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Footer year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close menu after a link is tapped (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Animate skill bars into view (About page) ----
  const skillFills = document.querySelectorAll('.skill');
  if (skillFills.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const level = entry.target.getAttribute('data-level') || 0;
          const fill = entry.target.querySelector('.skill-fill');
          if (fill) fill.style.width = level + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillFills.forEach(skill => observer.observe(skill));
  }

});
