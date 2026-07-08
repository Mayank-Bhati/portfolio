/* ============================================================
   Mayank Bhati — Portfolio interactions
   ------------------------------------------------------------
   The signature: a generative distributed-system graphic.
   Nodes drift, discover their nearest peers, and self-organize
   from scattered chaos toward a connected, ordered network while
   event-packets flow along the edges. It's the thesis of the page
   in motion — engineering brings order to complexity — expressed
   in the visual language of a backend system (nodes, edges,
   events), with no cultural specificity.
   ============================================================ */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Boot intro ---------- */
  const bootLines = [
    { t: "$ initializing runtime", cls: "" },
    { t: "→ loading distributed systems ................ ", tail: "ok", tcls: "ok" },
    { t: "→ establishing event pipeline ............... ", tail: "ok", tcls: "ok" },
    { t: "→ warming caches ........................... ", tail: "ok", tcls: "ok" },
    { t: "→ circuit breakers ......................... ", tail: "armed", tcls: "amber" },
    { t: "→ from chaos, order.", cls: "amber" },
  ];
  const bootEl = document.getElementById("boot");
  let bootDone = false;

  function runBoot(idx) {
    if (!bootEl) return;
    if (idx >= bootLines.length) {
      setTimeout(dismissIntro, 650);
      return;
    }
    const line = bootLines[idx];
    const div = document.createElement("div");
    bootEl.appendChild(div);
    let i = 0;
    const full = line.t;
    (function typeChar() {
      if (i <= full.length) {
        let html = "";
        if (line.cls) html = `<span class="${line.cls}">${full.slice(0, i)}</span>`;
        else html = full.slice(0, i);
        div.innerHTML = html + '<span class="type-cursor"></span>';
        i++;
        setTimeout(typeChar, 16);
      } else {
        let html = line.cls ? `<span class="${line.cls}">${full}</span>` : full;
        if (line.tail) html += `<span class="${line.tcls}">${line.tail}</span>`;
        div.innerHTML = html;
        setTimeout(() => runBoot(idx + 1), 90);
      }
    })();
  }

  function dismissIntro() {
    if (bootDone) return;
    bootDone = true;
    const intro = document.getElementById("intro");
    if (intro) intro.classList.add("gone");
  }

  const introEl = document.getElementById("intro");
  if (introEl) {
    introEl.addEventListener("click", dismissIntro);
    if (prefersReduced) { dismissIntro(); }
    else { runBoot(0); setTimeout(dismissIntro, 5200); } // safety timeout
  }

  /* ---------- Nav shadow ---------- */
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
  });

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((n) => io.observe(n));

  /* ---------- Rotating engineering credo ---------- */
  const credos = [
    "measure, don't guess — profile before you optimize",
    "make it correct, then make it fast",
    "every retry must be safe — idempotent by default",
    "systems that heal themselves outlive systems that don't",
    "bound everything: pools, payloads, blast radius",
    "you can't fix what you can't see",
    "derive from first principles — understand, don't memorize",
    "good engineering quietly makes someone's day better",
  ];
  const credoEl = document.getElementById("credo");
  let credoIdx = 0;
  function rotateCredo() {
    if (!credoEl) return;
    credoEl.style.opacity = 0;
    setTimeout(() => {
      credoEl.innerHTML = `<span class="prefix">// </span>${credos[credoIdx]}`;
      credoEl.style.transition = "opacity .5s";
      credoEl.style.opacity = 1;
      credoIdx = (credoIdx + 1) % credos.length;
    }, 500);
  }
  if (credoEl) { rotateCredo(); if (!prefersReduced) setInterval(rotateCredo, 3800); }

  /* ---------- Signature: generative network canvas ---------- */
  const canvas = document.getElementById("netcanvas");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let W, H, dpr;
    const COLORS = { signal: "#38E1D6", violet: "#8B7CF6", amber: "#FFB454", line: "#2E3D5E", node: "#131A2B" };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const N = 26;
    const nodes = [];
    for (let i = 0; i < N; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2 + 2.5,
        pulse: Math.random() * Math.PI * 2,
        hub: i < 4, // a few nodes are hubs (brokers)
      });
    }
    // event packets travel along active edges
    const packets = [];
    function spawnPacket(a, b) {
      packets.push({ a, b, t: 0, speed: 0.012 + Math.random() * 0.01, color: [COLORS.signal, COLORS.amber, COLORS.violet][Math.floor(Math.random() * 3)] });
    }

    let mouse = { x: -999, y: -999 };
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener("mouseleave", () => { mouse.x = -999; mouse.y = -999; });

    const LINK_DIST = 130;
    let frame = 0;

    function tick() {
      ctx.clearRect(0, 0, W, H);
      frame++;

      // move nodes
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 10 || n.x > W - 10) n.vx *= -1;
        if (n.y < 10 || n.y > H - 10) n.vy *= -1;
        // gentle attraction to mouse (order emerging around attention)
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d < 140 && d > 1) { n.x += (dx / d) * 0.4; n.y += (dy / d) * 0.4; }
        n.pulse += 0.03;
      }

      // draw edges + occasionally spawn packets
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = nodes[i], b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.5;
            ctx.strokeStyle = `rgba(46,61,94,${alpha + 0.1})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            if ((a.hub || b.hub) && Math.random() < 0.0018) spawnPacket(a, b);
          }
        }
      }

      // draw + advance packets
      for (let k = packets.length - 1; k >= 0; k--) {
        const p = packets[k];
        p.t += p.speed;
        if (p.t >= 1) { packets.splice(k, 1); continue; }
        const x = p.a.x + (p.b.x - p.a.x) * p.t;
        const y = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.shadowBlur = 10; ctx.shadowColor = p.color;
        ctx.fill(); ctx.shadowBlur = 0;
      }

      // draw nodes
      for (const n of nodes) {
        const glow = (Math.sin(n.pulse) + 1) / 2;
        if (n.hub) {
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(56,225,214,${0.3 + glow * 0.4})`; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.fillStyle = COLORS.signal; ctx.shadowBlur = 12; ctx.shadowColor = COLORS.signal;
        } else {
          ctx.fillStyle = `rgba(138,152,184,${0.5 + glow * 0.4})`; ctx.shadowBlur = 0;
        }
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      }

      requestAnimationFrame(tick);
    }
    tick();
  } else if (canvas && prefersReduced) {
    // static fallback frame for reduced-motion
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width; canvas.height = rect.height;
    ctx.fillStyle = "#38E1D6";
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * rect.width, Math.random() * rect.height, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
})();
