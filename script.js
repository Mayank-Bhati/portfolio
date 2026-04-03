(function () {
  'use strict';

  /* ================================================
     PARTICLE SYSTEM (shared between intro & background)
     ================================================ */
  class ParticleField {
    constructor(canvas, opts = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.color = opts.color || 'rgba(34, 211, 238, ';
      this.count = opts.count || 60;
      this.maxSize = opts.maxSize || 2;
      this.speed = opts.speed || 0.4;
      this.connectDist = opts.connectDist || 120;
      this.running = false;
      this._resize();
      window.addEventListener('resize', () => this._resize());
    }

    _resize() {
      this.w = this.canvas.width = this.canvas.offsetWidth;
      this.h = this.canvas.height = this.canvas.offsetHeight;
    }

    _seed() {
      this.particles = [];
      for (let i = 0; i < this.count; i++) {
        this.particles.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: (Math.random() - 0.5) * this.speed,
          vy: (Math.random() - 0.5) * this.speed,
          r: Math.random() * this.maxSize + 0.5,
          o: Math.random() * 0.5 + 0.2,
        });
      }
    }

    start() {
      this._seed();
      this.running = true;
      this._loop();
    }

    stop() {
      this.running = false;
    }

    _loop() {
      if (!this.running) return;
      this.ctx.clearRect(0, 0, this.w, this.h);

      for (const p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > this.w) p.vx *= -1;
        if (p.y < 0 || p.y > this.h) p.vy *= -1;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color + p.o + ')';
        this.ctx.fill();
      }

      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i], b = this.particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < this.connectDist) {
            const alpha = (1 - dist / this.connectDist) * 0.15;
            this.ctx.beginPath();
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.strokeStyle = this.color + alpha + ')';
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
      }

      requestAnimationFrame(() => this._loop());
    }
  }

  /* ================================================
     NAMASTE INTRO ANIMATION
     ================================================ */
  function runIntro() {
    const overlay = document.getElementById('namaste-overlay');
    if (!overlay) return;

    const introCanvas = document.getElementById('intro-particles');
    const introField = new ParticleField(introCanvas, {
      count: 50,
      maxSize: 1.5,
      speed: 0.3,
      connectDist: 100,
    });
    introField.start();

    const avEls = overlay.querySelectorAll('.av-el');
    const letters = overlay.querySelectorAll('.namaste-text span');
    const sub = overlay.querySelector('.namaste-sub');
    const avatarWrap = overlay.querySelector('.avatar-wrap');

    const tl = gsap.timeline({
      onComplete: () => {
        exitIntro(overlay, introField);
      },
    });

    tl.set(avatarWrap, { scale: 0.8, opacity: 0 });
    tl.to(avatarWrap, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }, 0.2);

    avEls.forEach((el, i) => {
      tl.to(el, {
        strokeDashoffset: 0,
        duration: 0.15 + Math.random() * 0.1,
        ease: 'power2.out',
      }, 0.4 + i * 0.06);
    });

    const lettersStart = 0.4 + avEls.length * 0.06 + 0.2;
    letters.forEach((span, i) => {
      tl.to(span, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.4,
        ease: 'back.out(2)',
      }, lettersStart + i * 0.06);
    });

    tl.to(sub, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, lettersStart + letters.length * 0.06 + 0.1);

    tl.to({}, { duration: 1.2 });

    overlay.addEventListener('click', () => {
      tl.progress(1);
    }, { once: true });
  }

  function exitIntro(overlay, introField) {
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        introField.stop();
        overlay.remove();
        revealPortfolio();
      },
    });
  }

  /* ================================================
     PORTFOLIO REVEAL (after intro)
     ================================================ */
  function revealPortfolio() {
    const nav = document.getElementById('nav');
    nav.classList.add('visible');

    initBackgroundParticles();
    initScrollProgress();
    initCursorGlow();
    initScrollAnimations();
    initActiveNav();
    initMagneticButtons();
  }

  /* ================================================
     BACKGROUND PARTICLES
     ================================================ */
  function initBackgroundParticles() {
    const canvas = document.getElementById('bg-particles');
    if (!canvas) return;
    const field = new ParticleField(canvas, {
      count: 40,
      maxSize: 1.2,
      speed: 0.2,
      connectDist: 140,
      color: 'rgba(34, 211, 238, ',
    });
    field.start();
  }

  /* ================================================
     SCROLL PROGRESS BAR
     ================================================ */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ================================================
     CURSOR GLOW
     ================================================ */
  function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

    let mx = -1000, my = -1000;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    }, { passive: true });

    function update() {
      glow.style.left = mx + 'px';
      glow.style.top = my + 'px';
      requestAnimationFrame(update);
    }
    update();
  }

  /* ================================================
     GSAP SCROLL ANIMATIONS
     ================================================ */
  function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.section').forEach((section) => {
      gsap.to(section, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    gsap.utils.toArray('.card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });

    gsap.utils.toArray('.pill').forEach((pill, i) => {
      gsap.from(pill, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        delay: i * 0.03,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: pill.closest('.skills-grid'),
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    const heroEls = ['.hero-badge', '.hero-title .line', '.tagline', '.sub', '.hero-links'];
    heroEls.forEach((sel, i) => {
      gsap.from(sel, {
        opacity: 0,
        y: 25,
        duration: 0.7,
        delay: i * 0.12,
        ease: 'power3.out',
      });
    });
  }

  /* ================================================
     ACTIVE NAV LINK
     ================================================ */
  function initActiveNav() {
    const sections = document.querySelectorAll('.section[id]');
    const links = document.querySelectorAll('.nav-links a');

    function update() {
      const scrollY = window.scrollY + 200;
      let current = '';
      sections.forEach((s) => {
        if (scrollY >= s.offsetTop) current = s.getAttribute('id');
      });
      if (!current && sections.length) current = sections[0].getAttribute('id');
      links.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ================================================
     MAGNETIC BUTTON HOVER
     ================================================ */
  function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ================================================
     BOOT
     ================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runIntro);
  } else {
    runIntro();
  }
})();
