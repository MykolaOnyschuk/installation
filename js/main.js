// ── NAV: compact on scroll ────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('compact', window.scrollY > 80);
});

// ── REVEAL ON SCROLL ─────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── CONTACT FORM: basic submit handler ───────────────────────
// Replace the action URL below with your form backend (Formspree, Netlify, etc.)
document.querySelector('.f-submit')?.addEventListener('click', () => {
  const name  = document.querySelector('input[type="text"]')?.value;
  const email = document.querySelector('input[type="email"]')?.value;
  if (!name || !email) {
    alert('Please fill in at least your name and email.');
    return;
  }
  // TODO: wire up to a real form handler (Formspree / EmailJS / Netlify Forms)
  alert('Thanks! We\'ll be in touch within one business day.');
});

// ── RENDER CAROUSEL ──────────────────────────────────────────
(function () {
  const slides = Array.from(document.querySelectorAll('.render-slide'));
  if (!slides.length) return;
  const dotsContainer = document.getElementById('render-dots');
  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'render-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Render ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(d);
  });

  function goTo(n) {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4000);
  }

  document.getElementById('render-prev')?.addEventListener('click', () => goTo(current - 1));
  document.getElementById('render-next')?.addEventListener('click', () => goTo(current + 1));
  resetTimer();
})();

// ── GALLERY VIEW ALL ──────────────────────────────────────────
(function () {
  const btn  = document.getElementById('gallery-view-btn');
  const grid = document.getElementById('gallery-grid');
  if (!btn || !grid) return;

  const labelEl = btn.querySelector('span');

  btn.addEventListener('click', () => {
    const expanded = grid.classList.toggle('expanded');
    btn.classList.toggle('expanded', expanded);
    const textNode = btn.firstChild;
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      textNode.textContent = expanded ? 'Show Less ' : 'View All 23 Photos ';
    }
    if (labelEl) labelEl.textContent = '↓';
  });
})();

// ── GALLERY LIGHTBOX ─────────────────────────────────────────
(function () {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const lbLabel  = document.getElementById('lb-label');
  const lbClose  = document.getElementById('lb-close');
  const lbPrev   = document.getElementById('lb-prev');
  const lbNext   = document.getElementById('lb-next');
  let current    = 0;

  function visibleItems() {
    return Array.from(document.querySelectorAll('.gallery-item')).filter(
      el => el.offsetParent !== null
    );
  }

  function open(index) {
    const items = visibleItems();
    current = (index + items.length) % items.length;
    const img = items[current].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbLabel.textContent = items[current].dataset.label || img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('gallery-grid').addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    const items = visibleItems();
    open(items.indexOf(item));
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', () => open(current - 1));
  lbNext.addEventListener('click', () => open(current + 1));

  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   open(current - 1);
    if (e.key === 'ArrowRight')  open(current + 1);
  });
})();
