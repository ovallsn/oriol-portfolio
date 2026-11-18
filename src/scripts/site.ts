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
    });
  });
}
