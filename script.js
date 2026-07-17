const body = document.body;
const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav__toggle');
const navPanel = document.querySelector('.nav__panel');
const scrollTopBtn = document.querySelector('.scroll-top');
const toast = document.querySelector('.toast');
const tabs = document.querySelector('.tabs');
const tabButtons = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.steps');
const form = document.querySelector('#contact-form');
const faqItems = document.querySelectorAll('.faq-item');
const revealItems = document.querySelectorAll('.reveal');
const splitHeadings = document.querySelectorAll('[data-split]');
const stats = document.querySelectorAll('.stat-card');
const heroBlob = document.querySelector('.hero__blob');
const heroVideo = document.querySelector('.hero__video');
const appLoops = document.querySelectorAll('.phone--app-loop');
const footerPhones = document.querySelectorAll('.phone--flip');
const particles = document.querySelector('.particles');

function setHeaderState() {
  if (window.scrollY > 10) header?.classList.add('scrolled');
  else header?.classList.remove('scrolled');
}

function toggleMenu(force) {
  const shouldOpen = typeof force === 'boolean' ? force : !navPanel?.classList.contains('is-open');
  navPanel?.classList.toggle('is-open', shouldOpen);
  navToggle?.setAttribute('aria-expanded', String(shouldOpen));
}

function handleScrollTop() {
  if (window.scrollY > 600) scrollTopBtn?.classList.add('is-visible');
  else scrollTopBtn?.classList.remove('is-visible');
}

function splitWords() {
  splitHeadings.forEach((heading) => {
    const text = heading.textContent.trim();
    heading.innerHTML = text
      .split(/(\s+)/)
      .map((part) => (part.trim() ? `<span class="word">${part}</span>` : part))
      .join('');
  });
  const words = document.querySelectorAll('.word');
  words.forEach((word, index) => {
    word.style.transitionDelay = `${index * 0.04}s`;
  });
}

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const delay = entry.target.dataset.delay || '0';
        entry.target.style.transitionDelay = delay;
        if (entry.target.classList.contains('word')) entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => observer.observe(item));
  document.querySelectorAll('.word').forEach((word) => observer.observe(word));
}

function animateStats() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const target = parseFloat(card.dataset.count || '0');
      const decimals = parseInt(card.dataset.decimals || '0', 10);
      const suffix = card.dataset.suffix || '';
      const number = card.querySelector('strong');
      const duration = 1600;
      const startTime = performance.now();
      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        number.textContent = value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.unobserve(card);
    });
  }, { threshold: 0.6 });

  stats.forEach((card) => observer.observe(card));
}

function setupTabs() {
  if (!tabs) return;
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const active = button.dataset.tab;
      tabs.dataset.active = active;
      tabButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
      panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === active));
    });
  });
}

function setupAppLoop() {
  appLoops.forEach((loop) => {
    const layers = loop.querySelectorAll('.layer');
    const dash = loop.querySelector('.layer--dash');
    const login = loop.querySelector('.layer--login');
    if (!layers.length) return;
    let activeIndex = 0;
    setInterval(() => {
      layers.forEach((layer) => layer.classList.remove('active'));
      activeIndex = (activeIndex + 1) % layers.length;
      layers[activeIndex].classList.add('active');
    }, 4000);
  });
}

function setupFooterPhones() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.35 });
  footerPhones.forEach((phone) => observer.observe(phone));
}

function setupFaq() {
  faqItems.forEach((item) => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach((faq) => faq.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function handleForm(event) {
  event.preventDefault();
  const formData = new FormData(form);
  if (!formData.get('name') || !formData.get('email') || !formData.get('message')) return;
  form.reset();
  showToast('Thanks! We\'ll reply within 24h.');
}

function createParticles() {
  if (!particles) return;
  particles.innerHTML = '';
  for (let i = 0; i < 10; i += 1) {
    const dot = document.createElement('span');
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.animationDelay = `${Math.random() * 1.4}s`;
    particles.appendChild(dot);
  }
}

function parallax() {
  const y = window.scrollY * 0.15;
  if (heroBlob) heroBlob.style.transform = `translateY(${y * 0.35}px)`;
  if (heroVideo) heroVideo.style.transform = `translateY(${y * 0.2}px)`;
}

function animateLine() {
  const line = document.querySelector('.steps-line');
  if (!line) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.4 });
  observer.observe(line);
}

function setupScrollBehavior() {
  scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

window.addEventListener('scroll', () => {
  setHeaderState();
  handleScrollTop();
  parallax();
});
window.addEventListener('resize', toggleMenu.bind(null, false));
navToggle?.addEventListener('click', () => toggleMenu());
window.addEventListener('DOMContentLoaded', () => {
  setHeaderState();
  handleScrollTop();
  splitWords();
  revealOnScroll();
  animateStats();
  setupTabs();
  setupAppLoop();
  setupFooterPhones();
  setupFaq();
  createParticles();
  animateLine();
  setupScrollBehavior();
  if (form) form.addEventListener('submit', handleForm);
});
