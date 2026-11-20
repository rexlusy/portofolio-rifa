const siteMenu = document.querySelector('.site-menu');
const menuLinks = Array.from(siteMenu.querySelectorAll('a'));
const menuSections = menuLinks.map(link => document.getElementById(link.hash.slice(1)));
let currentMenuLink = menuLinks[0];
let menuFrame = 0;

function updateMenu() {
  menuFrame = 0;
  const boundary = siteMenu.getBoundingClientRect().bottom + 48;
  let activeIndex = 0;

  for (let index = 1; index < menuSections.length; index += 1) {
    if (menuSections[index].getBoundingClientRect().top <= boundary) activeIndex = index;
  }

  const bottomGap = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
  if (window.scrollY > 0 && bottomGap <= 2) activeIndex = menuLinks.length - 1;

  const activeLink = menuLinks[activeIndex];
  if (activeLink === currentMenuLink) return;
  currentMenuLink.removeAttribute('aria-current');
  activeLink.setAttribute('aria-current', 'location');
  currentMenuLink = activeLink;
}

function scheduleMenuUpdate() {
  if (!menuFrame) menuFrame = requestAnimationFrame(updateMenu);
}

window.addEventListener('scroll', scheduleMenuUpdate, { passive: true });
window.addEventListener('resize', scheduleMenuUpdate);
window.addEventListener('hashchange', scheduleMenuUpdate);
new ResizeObserver(scheduleMenuUpdate).observe(document.getElementById('konten'));
scheduleMenuUpdate();

const tabList = document.querySelector('.portfolio-tabs');
const tabs = Array.from(tabList.querySelectorAll('.portfolio-tab'));
const panels = tabs.map(tab => document.getElementById(tab.hash.slice(1)));

function selectTab(activeIndex) {
  tabs.forEach((tab, index) => {
    const selected = index === activeIndex;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    panels[index].hidden = !selected;
  });
}

function tabFromHash() {
  return tabs.findIndex(tab => tab.hash === window.location.hash);
}

tabList.setAttribute('role', 'tablist');
tabList.setAttribute('aria-label', 'Folder portofolio');
tabs.forEach((tab, index) => {
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', panels[index].id);
  panels[index].setAttribute('role', 'tabpanel');

  tab.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    selectTab(index);
  });

  tab.addEventListener('keydown', event => {
    const nextByKey = {
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
      ' ': index,
    };
    const next = nextByKey[event.key];
    if (typeof next !== 'number') return;
    event.preventDefault();
    selectTab(next);
    tabs[next].focus();
  });
});

selectTab(Math.max(0, tabFromHash()));
window.addEventListener('hashchange', () => {
  const index = tabFromHash();
  if (index < 0) return;
  selectTab(index);
  panels[index].scrollIntoView();
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

for (const carousel of document.querySelectorAll('.portfolio-carousel')) {
  const track = carousel.querySelector('.gallery-track');
  const controls = carousel.querySelector('.gallery-controls');
  const previous = carousel.querySelector('[data-gallery-prev]');
  const next = carousel.querySelector('[data-gallery-next]');

  function updateControls() {
    const overflow = track.scrollWidth - track.clientWidth;
    controls.hidden = overflow <= 2;
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= overflow - 2;
  }

  function move(direction) {
    const stride = track.children[1].offsetLeft - track.children[0].offsetLeft;
    track.scrollBy({ left: stride * direction, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', updateControls, { passive: true });
  new ResizeObserver(updateControls).observe(track);
}

const dialog = document.getElementById('project-detail');
const title = document.getElementById('detail-title');
const description = document.getElementById('detail-description');

for (const button of document.querySelectorAll('.project-card button.detail-button')) {
  button.addEventListener('click', () => {
    const card = button.closest('.project-card');
    title.textContent = card.querySelector('h3').textContent;
    description.replaceChildren(card.querySelector('template').content.cloneNode(true));
    dialog.showModal();
  });
}

const certificateDialog = document.getElementById('certificate-detail');
const certificateTitle = document.getElementById('certificate-title');
const certificatePreview = document.getElementById('certificate-preview');
const certificateOriginal = document.getElementById('certificate-original');

for (const link of document.querySelectorAll('.certificate-link')) {
  link.setAttribute('aria-haspopup', 'dialog');
  link.setAttribute('aria-controls', certificateDialog.id);
  link.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    const name = link.dataset.certificateTitle;
    const status = document.createElement('p');
    status.setAttribute('role', 'status');
    status.textContent = 'Memuat sertifikat…';

    const image = new Image();
    image.alt = `Sertifikat ${name} atas nama Muhammad Rifa Aqilla`;
    image.addEventListener('load', () => status.replaceWith(image), { once: true });
    image.addEventListener('error', () => {
      status.textContent = 'Pratinjau gagal dimuat. File asli tersedia di bawah.';
    }, { once: true });

    certificateTitle.textContent = name;
    certificatePreview.replaceChildren(status);
    certificateOriginal.href = link.href;
    image.src = link.dataset.preview || link.href;
    certificateDialog.showModal();
    event.preventDefault();
  });
}
