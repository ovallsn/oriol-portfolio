const themeToggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
const siteNav = document.querySelector<HTMLDetailsElement>('[data-site-nav]');
const mobileNav = window.matchMedia('(max-width: 900px)');

const setNavState = () => {
  if (mobileNav.matches) {
    siteNav?.removeAttribute('open');
  } else {
    siteNav?.setAttribute('open', '');
  }
};

setNavState();
mobileNav.addEventListener('change', setNavState);

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    if (mobileNav.matches) {
      siteNav.removeAttribute('open');
    }
  });
});

if (siteNav) {
  const nav = siteNav.querySelector('nav');
  const links = Array.from(siteNav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
  const targets = links.flatMap((link) => {
    const section = document.getElementById(link.hash.slice(1));
    return section ? [{ link, section }] : [];
  }).sort((a, b) => a.section.compareDocumentPosition(b.section) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);

  let activeLink: HTMLAnchorElement | undefined;
  let hoveredLink: HTMLAnchorElement | undefined;
  let frame = 0;

  const positionIndicator = () => {
    const link = hoveredLink ?? activeLink;
    const show = nav && link && link.hash !== '#contact' && !mobileNav.matches;
    siteNav.toggleAttribute('data-indicator-visible', Boolean(show));
    if (show) {
      const bounds = link.getBoundingClientRect();
      nav.style.setProperty('--nav-indicator-left', `${bounds.left - nav.getBoundingClientRect().left}px`);
      nav.style.setProperty('--nav-indicator-width', `${bounds.width}px`);
    }
  };

  const updateActiveSection = () => {
    frame = 0;
    const readingLine = Math.min(250, window.innerHeight * 0.3);
    let next: HTMLAnchorElement | undefined;
    for (const { section, link } of targets) {
      if (section.getBoundingClientRect().top > readingLine) break;
      next = link;
    }

    if (next !== activeLink) {
      activeLink?.removeAttribute('aria-current');
      activeLink = next;
      activeLink?.setAttribute('aria-current', 'location');
    }
    positionIndicator();
  };

  const scheduleSectionUpdate = () => {
    if (!frame) frame = requestAnimationFrame(updateActiveSection);
  };

  for (const link of links) {
    link.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      hoveredLink = link;
      positionIndicator();
    });
  }
  siteNav.addEventListener('pointerleave', () => {
    hoveredLink = undefined;
    positionIndicator();
  });
  siteNav.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !mobileNav.matches || !siteNav.open) return;
    siteNav.open = false;
    siteNav.querySelector('summary')?.focus();
  });
  window.addEventListener('scroll', scheduleSectionUpdate, { passive: true });
  window.addEventListener('resize', scheduleSectionUpdate);
  document.fonts.ready.then(scheduleSectionUpdate);
  scheduleSectionUpdate();
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (typeof IntersectionObserver !== 'undefined') {
  const reveal = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      reveal.unobserve(target);
      if (reducedMotion.matches) continue;
      target.animate(
        [{ opacity: 0.45, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 520, easing: 'cubic-bezier(.16, 1, .3, 1)' },
      );
    }
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-scroll-reveal]').forEach((target) => {
    if (target.getBoundingClientRect().top >= window.innerHeight) reveal.observe(target);
  });

  const contactTrace = document.querySelector('[data-contact-trace]');
  if (contactTrace) {
    const contactEntrance = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      contactEntrance.disconnect();
      if (!reducedMotion.matches) contactTrace.classList.add('is-tracing');
    }, { threshold: 0.25 });
    contactEntrance.observe(contactTrace);
  }
}

if (themeToggle) {
  themeToggle.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'dark'));
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    themeToggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    try {
      localStorage.setItem('ovalls-theme', nextTheme);
    } catch {
      // The current page still updates if persistent storage is unavailable.
    }
  });
}

const skillFilters = document.querySelector<HTMLElement>('[data-skill-filters]');
const skillExample = document.querySelector<HTMLElement>('[data-skill-example]');
const skillCase = document.querySelector<HTMLElement>('[data-skill-case]');
const skillGroups = Array.from(document.querySelectorAll<HTMLElement>('[data-skill-group]'));

if (skillFilters && skillExample) {
  skillFilters.hidden = false;

  skillFilters.querySelectorAll<HTMLButtonElement>('[data-skill-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.skillFilter ?? 'all';

      skillFilters.querySelectorAll<HTMLButtonElement>('[data-skill-filter]').forEach((filter) => {
        filter.setAttribute('aria-pressed', String(filter === button));
      });

      skillGroups.forEach((group) => {
        group.hidden = selected !== 'all' && group.dataset.skillGroup !== selected;
      });

      skillExample.textContent = button.dataset.example ?? '';
      if (skillCase) skillCase.hidden = selected !== 'applications';
    });
  });
}
