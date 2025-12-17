(function () {
  const toggle = document.getElementById('navToggle');
  const panel = document.getElementById('navPanel');
  const backdrop = document.getElementById('navBackdrop');

  function closeMenu() {
    panel.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    panel.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('show');
    toggle.setAttribute('aria-expanded', 'true');
  }

  // Toggle button
  toggle.addEventListener('click', () => {
    const isHidden = panel.getAttribute('aria-hidden') === 'true';
    isHidden ? openMenu() : closeMenu();
  });

  // Click outside menu
  backdrop.addEventListener('click', closeMenu);

  // Close menu when a link is clicked
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
})();
