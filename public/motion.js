(() => {
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sections = document.querySelectorAll('main > section, .contact-layout > .window');
  const running = new Set();
  let observer;

  function reveal(section) {
    const children = section.matches('.hero')
      ? section.querySelectorAll('.hero-copy, .character')
      : section.querySelectorAll(':scope > header, :scope > .welcome-copy, :scope > .welcome-window, :scope > .portfolio-tabs');
    const elements = children.length ? children : [section];

    elements.forEach((element, index) => {
      const animation = element.animate(
        [
          { opacity: 0, transform: 'translateY(18px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        {
          duration: 480,
          delay: Math.min(index * 70, 210),
          easing: 'cubic-bezier(0.2, 0.7, 0.25, 1)',
          fill: 'backwards',
        },
      );
      running.add(animation);
      animation.onfinish = () => running.delete(animation);
      animation.oncancel = () => running.delete(animation);
    });
  }

  function updateMotion() {
    observer?.disconnect();
    running.forEach(animation => animation.cancel());
    if (preference.matches) return;

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        reveal(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });

    sections.forEach(section => observer.observe(section));
  }

  preference.addEventListener('change', updateMotion);
  updateMotion();
})();
