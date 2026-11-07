// Defynd Tech - scroll pop sky + world lock + text reveals
const WHATSAPP = '27646836357';
document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const toggle = document.querySelector('.menu-toggle');
  const overlay = document.querySelector('.mobile-overlay');
  if (toggle && overlay) {
    toggle.addEventListener('click', () => overlay.classList.toggle('open'));
    overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => overlay.classList.remove('open')));
  }
  document.querySelectorAll('.faq-item button').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const open = item.classList.toggle('open');
      btn.querySelector('span').textContent = open ? '-' : '+';
    });
  });

  const isHome = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
  const hero = document.getElementById('hero');
  const sky = document.getElementById('heroSky');
  const pill = document.getElementById('skyPill');
  const pillBg = document.querySelector('.sky-pill-bg');
  const skyImg = sky ? sky.querySelector('img') : null;
  const world = document.querySelector('.sky-world');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scrub words ONLY on homepage. Subpages: text is always visible, never fades.
  if (isHome && hero) {
    const h1 = hero.querySelector('h1');
    if (h1) {
      const pillEl = h1.querySelector('.sky-pill-wrap');
      const getText = (n) => (h1.childNodes[n] ? h1.childNodes[n].textContent : '');
      const words = [getText(0), getText(2)].flatMap(s => s.split(/\s+/)).filter(Boolean);
      h1.innerHTML = words.map(w => `<span class="scrub-word">${w}</span>`).join(' ') + ' ' + (pillEl ? pillEl.outerHTML : '');
    }
    document.querySelectorAll('.section h2, .section p').forEach(el => {
      if (el.closest('footer')) return;
      el.classList.add('scrub');
    });
  } else {
    // Permanent pages: force everything visible, no scrub
    document.querySelectorAll('.scrub-word').forEach(w => { w.style.opacity = '1'; w.style.transform = 'translateY(0)'; });
    document.querySelectorAll('.scrub').forEach(el => { el.classList.remove('scrub'); el.classList.add('visible'); el.classList.add('in'); el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    document.querySelectorAll('.reveal').forEach(el => { el.classList.add('visible'); el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  const sectionIo = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); sectionIo.unobserve(e.target); } });
  }, { threshold: 0.05 });
  document.querySelectorAll('.section').forEach(s => sectionIo.observe(s));

  // Permanent pages: no IntersectionObserver hiding — force visible now
  if (!isHome) {
    document.querySelectorAll('.reveal, .section, .scrub, .scrub-word').forEach(el => {
      el.classList.add('visible'); el.classList.add('in');
      el.style.opacity = '1'; el.style.transform = 'translateY(0)';
    });
  }

  const updateSky = (raw) => {
    const p = Math.max(0, Math.min(1, raw));
    const isPermanent = !isHome;
    if (isPermanent) {
      document.body.classList.add('sky-permanent');
      if (sky) sky.style.opacity = '1';
      if (skyImg) skyImg.style.transform = 'scale(1)';
      return;
    }
    // Homepage pop: pill bursts quickly, sky fades strong
    if (sky) sky.style.opacity = String(Math.min(1, p * 1.45));
    if (skyImg) {
      const scale = 0.22 + p * 1.05;
      skyImg.style.transform = `scale(${scale}) translateY(${p * 26}px)`;
      skyImg.style.opacity = String(0.85 + p * 0.15);
    }
    if (pillBg) {
      const w = p * 145;
      pillBg.style.width = `${w}vw`;
      pillBg.style.height = `${w}vw`;
      pillBg.style.opacity = String(Math.min(1, p * 2));
      pillBg.style.borderRadius = p > 0.6 ? '0' : '999px';
    }
    if (pill) pill.style.opacity = String(1 - Math.min(1, p * 1.9));
    if (world) document.body.classList.toggle('sky-locked', p > 0.55);

    document.querySelectorAll('.scrub-word').forEach((w, i, arr) => {
      const t = (i / arr.length) * 0.35;
      const appear = p > t;
      w.style.opacity = appear ? '1' : '0.45';
      w.style.transform = appear ? 'translateY(0)' : 'translateY(6px)';
    });
  };
  updateSky(0);

  let ticking = false;
  const onScroll = () => {
    if (reduce) { updateSky(0); document.querySelectorAll('.scrub-word').forEach(w=>{w.style.opacity='1';w.style.transform='translateY(0)'}); return; }
    const y = window.scrollY;
    const h = hero ? hero.offsetHeight : window.innerHeight * 1.4;
    // Pop range: 1.4x hero to fully burst (faster than 1.6x slow, still smooth)
    const progress = y / (h * 1.4);
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => { updateSky(progress); ticking = false; });
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = Object.fromEntries(new FormData(form).entries());
      const subject = encodeURIComponent('Website enquiry: ' + data.name);
      const body = encodeURIComponent('Name: ' + data.name + '\nEmail: ' + data.email + '\nPhone: ' + (data.phone || '-') + '\nNeed: ' + data.service + '\n\n' + data.message);
      window.location.href = 'mailto:sales@defynd.co.za?subject=' + subject + '&body=' + body;
      const waText = encodeURIComponent('Hi Defynd Tech, I\'m ' + data.name + '. ' + data.service + '. ' + data.message + ' (Email: ' + data.email + ')');
      window.open('https://wa.me/' + WHATSAPP + '?text=' + waText, '_blank');
      const success = document.getElementById('form-success');
      if (success) success.style.display = 'block';
    });
  }
});
