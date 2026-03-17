(function () {
  'use strict';

  // Fade-in / slide-up on scroll
  const revealEls = document.querySelectorAll('.section, .card, .hero');
  const revealOpts = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, revealOpts);

  revealEls.forEach((el) => {
    el.classList.add('scroll-reveal');
    revealObserver.observe(el);
  });

  // Active nav link based on scroll position
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  function setActiveNav() {
    const scrollY = window.scrollY + 150;
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop;
      if (scrollY >= top) current = section.getAttribute('id');
    });
    if (!current && sections.length) current = sections[0].getAttribute('id');
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', setActiveNav);
  setActiveNav();
})();
