/* ============================================================
   FINANCE-RL PORTFOLIO — Interactive JS
   Terminal/Hacker Aesthetic — Vanilla JS, no frameworks
   ============================================================ */

'use strict';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   1. MATRIX RAIN CANVAS
   ============================================================ */
(function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas || REDUCED_MOTION) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Katakana + digits + hex for authentic Matrix feel
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEF><{}[]|';
  const fontSize = 13;
  let cols = Math.floor(canvas.width / fontSize);
  let drops = Array(cols).fill(1);

  function draw() {
    // Semi-transparent black → creates fading trail
    ctx.fillStyle = 'rgba(10, 10, 10, 0.045)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px monospace';

    drops.forEach((y, i) => {
      // Brighter head char
      const isHead = Math.random() > 0.92;
      ctx.fillStyle = isHead ? '#88ffaa' : '#00ff41';
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, y * fontSize);

      // Randomly reset column after reaching bottom
      if (y * fontSize > canvas.height && Math.random() > 0.978) {
        drops[i] = 0;
      }
      drops[i]++;
    });
  }

  // Re-sync cols on resize
  window.addEventListener('resize', () => {
    cols  = Math.floor(canvas.width / fontSize);
    drops = Array(cols).fill(1);
  });

  setInterval(draw, 48); // ~20fps — visual effect without heavy CPU
})();


/* ============================================================
   2. TYPEWRITER — Hero title and subtitle
   ============================================================ */
(function initTypewriter() {
  const titleEl = document.getElementById('typewriter-title');
  const subEl   = document.getElementById('typewriter-sub');
  if (!titleEl) return;

  const titleLines = [
    'Reinforcement Learning',
    'for Stock Trading'
  ];
  const subtitle = 'DQN / PPO agents — MLP · CNN · CNN-LSTM — Sharpe-optimized returns';

  if (REDUCED_MOTION) {
    titleLines.forEach((line, i) => {
      const span = document.createElement('span');
      span.textContent = line;
      titleEl.appendChild(span);
      if (i < titleLines.length - 1) titleEl.appendChild(document.createElement('br'));
    });
    subEl.textContent = subtitle;
    return;
  }

  let lineIdx = 0;
  let charIdx = 0;
  let subIdx  = 0;
  let titleDone = false;

  function typeTitle() {
    if (lineIdx >= titleLines.length) {
      titleDone = true;
      setTimeout(() => typeSub(), 300);
      return;
    }
    const line = titleLines[lineIdx];
    if (charIdx < line.length) {
      // Find or create span for this line
      let spans = titleEl.querySelectorAll('span.tl');
      if (!spans[lineIdx]) {
        const span = document.createElement('span');
        span.className = 'tl';
        titleEl.appendChild(span);
        if (lineIdx > 0) titleEl.insertBefore(document.createElement('br'), span);
      }
      titleEl.querySelectorAll('span.tl')[lineIdx].textContent += line[charIdx];
      charIdx++;
      setTimeout(typeTitle, 48 + Math.random() * 32);
    } else {
      lineIdx++;
      charIdx = 0;
      setTimeout(typeTitle, 120);
    }
  }

  function typeSub() {
    if (!subEl) return;
    if (subIdx < subtitle.length) {
      subEl.textContent += subtitle[subIdx];
      subIdx++;
      setTimeout(typeSub, 22 + Math.random() * 18);
    }
  }

  setTimeout(typeTitle, 600);
})();


/* ============================================================
   3. BOOT SEQUENCE — Hero terminal window
   ============================================================ */
(function initBootSequence() {
  const el = document.getElementById('boot-sequence');
  if (!el) return;

  const lines = [
    { text: '$ python -c "import finance_rl"',           delay: 300,  cls: 'boot-white' },
    { text: '> Initializing trading environment...',      delay: 700,  cls: 'boot-green' },
    { text: '✓ gym env registered: StockTradingEnv-v0',   delay: 1100, cls: 'boot-dim'   },
    { text: '> Loading OHLCV market data feed...',        delay: 1400, cls: 'boot-green' },
    { text: '✓ Loaded 5y × 1d bars — AAPL, GOOG, etc.',  delay: 1700, cls: 'boot-dim'   },
    { text: '> Importing stable_baselines3 [DQN, PPO]',  delay: 2000, cls: 'boot-green' },
    { text: '✓ DQN  — off-policy, discrete actions',     delay: 2300, cls: 'boot-dim'   },
    { text: '✓ PPO  — on-policy, clipped surrogate',     delay: 2450, cls: 'boot-dim'   },
    { text: '> Building neural architectures...',         delay: 2700, cls: 'boot-green' },
    { text: '✓ MLP     [ 256 → 128 → 64 → |A| ]',       delay: 2950, cls: 'boot-dim'   },
    { text: '✓ CNN     [ Conv1D×3 → Flatten → FC ]',     delay: 3100, cls: 'boot-dim'   },
    { text: '✓ CNN-LSTM [ Conv1D → LSTM(256) → FC ]',    delay: 3250, cls: 'boot-dim'   },
    { text: '> Running 14 experiments...',                delay: 3500, cls: 'boot-amber' },
    { text: '✓ All experiments complete.',               delay: 4000, cls: 'boot-green' },
    { text: '$ _',                                        delay: 4300, cls: 'boot-white' },
  ];

  lines.forEach(({ text, delay, cls }) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'boot-line ' + cls;
      line.textContent = text;
      el.appendChild(line);
      el.scrollTop = el.scrollHeight;
    }, delay);
  });
})();


/* ============================================================
   4. EXPERIMENT FILTER SYSTEM
   ============================================================ */
(function initExperimentFilter() {
  const btns       = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.exp-card');
  const countEl    = document.getElementById('exp-count');
  const noResults  = document.getElementById('no-results');
  const grid       = document.getElementById('experiments-grid');
  if (!btns.length || !cards.length) return;

  // State: active filter per group (null = no filter for that group)
  const state = { arch: null, algo: null, reward: null };

  function applyFilters() {
    let visible = 0;

    cards.forEach(card => {
      const arch   = !state.arch   || card.dataset.arch   === state.arch;
      const algo   = !state.algo   || card.dataset.algo   === state.algo;
      const reward = !state.reward || card.dataset.reward === state.reward;
      const show   = arch && algo && reward;

      if (show) {
        card.hidden = false;
        card.style.animation = '';
        // Trigger reflow then apply animation
        void card.offsetWidth;
        card.style.animation = 'fade-in 0.25s ease both';
        visible++;
      } else {
        card.hidden = true;
      }
    });

    if (countEl) countEl.textContent = visible;
    if (noResults) noResults.hidden = visible > 0;
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const group  = btn.dataset.group;
      const filter = btn.dataset.filter;

      if (filter === 'all') {
        // Reset all filters
        state.arch = state.algo = state.reward = null;
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      } else {
        // Remove "ALL" active state
        document.getElementById('filter-all')?.classList.remove('active');

        if (state[group] === filter) {
          // Toggle off — deselect
          state[group] = null;
          btn.classList.remove('active');
        } else {
          // Select, deactivate others in same group
          btns.forEach(b => { if (b.dataset.group === group) b.classList.remove('active'); });
          state[group] = filter;
          btn.classList.add('active');
        }

        // If all groups are null, re-activate ALL button
        if (!state.arch && !state.algo && !state.reward) {
          document.getElementById('filter-all')?.classList.add('active');
        }
      }

      applyFilters();
    });
  });
})();


/* ============================================================
   5. SKILL BAR ANIMATIONS — IntersectionObserver
   ============================================================ */
(function initSkillBars() {
  const items = document.querySelectorAll('.skill-item');
  if (!items.length) return;

  if (REDUCED_MOTION) {
    // Set immediately without animation
    items.forEach(item => {
      const bar   = item.querySelector('.skill-bar');
      const level = item.dataset.level || '70';
      if (bar) bar.style.width = level + '%';
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item  = entry.target;
        const bar   = item.querySelector('.skill-bar');
        const level = item.dataset.level || '70';
        if (bar) {
          // Small delay so animation is perceivable
          setTimeout(() => { bar.style.width = level + '%'; }, 80);
        }
        observer.unobserve(item);
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -50px 0px' });

  items.forEach(item => observer.observe(item));
})();


/* ============================================================
   6. SMOOTH SCROLL + SCROLL SPY (Active nav link)
   ============================================================ */
(function initScrollBehavior() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth', block: 'start' });

      // Close mobile nav if open
      const navLinks = document.getElementById('nav-links');
      if (navLinks) navLinks.classList.remove('open');
    });
  });

  // Scroll spy — highlight active nav link
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + id
          );
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
})();


/* ============================================================
   7. MOBILE NAV TOGGLE
   ============================================================ */
(function initMobileNav() {
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen.toString());
    toggle.classList.toggle('open', isOpen);
  });
})();


/* ============================================================
   8. HERO SECTION ENTRANCE ANIMATION
   ============================================================ */
(function initHeroEntrance() {
  if (REDUCED_MOTION) return;

  const elements = [
    '.hero-tag',
    '.hero-title',
    '.hero-subtitle',
    '.hero-terminal',
    '.hero-cta',
    '.hero-stats'
  ];

  elements.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
    // Trigger after slight delay
    requestAnimationFrame(() => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100);
    });
  });
})();


/* ============================================================
   9. TERMINAL NOISE — Subtle random char flashes at screen edges
   ============================================================ */
(function initTerminalNoise() {
  if (REDUCED_MOTION) return;

  const noise = document.createElement('div');
  noise.setAttribute('aria-hidden', 'true');
  noise.style.cssText = [
    'position:fixed',
    'pointer-events:none',
    'z-index:1',
    'font-family:monospace',
    'font-size:10px',
    'color:rgba(0,255,65,0.12)',
    'transition:opacity 0.2s'
  ].join(';');
  document.body.appendChild(noise);

  const chars = '01アカサ<>{}|#$';

  setInterval(() => {
    // Only at extreme edges (top/bottom 8%, left/right 5%)
    const edge = Math.random() > 0.5;
    const x = edge
      ? (Math.random() > 0.5 ? Math.random() * 5 : 95 + Math.random() * 5)
      : Math.random() * 100;
    const y = edge
      ? Math.random() * 100
      : (Math.random() > 0.5 ? Math.random() * 8 : 92 + Math.random() * 8);

    noise.textContent = chars[Math.floor(Math.random() * chars.length)];
    noise.style.left = x + 'vw';
    noise.style.top  = y + 'vh';
    noise.style.opacity = '1';

    setTimeout(() => {
      noise.style.opacity = '0';
    }, 180);
  }, 400);
})();
