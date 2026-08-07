/**
 * MobileNav — toggles the mobile nav dropdown in the sticky header.
 *
 * Usage: a button with [data-mobile-menu-toggle] and a panel with
 * [data-mobile-menu] elsewhere in the header. Clicking the button toggles
 * the panel's visibility and swaps the button's open/close icon.
 */
(function () {
  function init() {
    var btn = document.querySelector('[data-mobile-menu-toggle]');
    var panel = document.querySelector('[data-mobile-menu]');
    if (!btn || !panel) return;

    var iconOpen = btn.querySelector('[data-icon-open]');
    var iconClose = btn.querySelector('[data-icon-close]');

    function setOpen(isOpen) {
      panel.classList.toggle('hidden', !isOpen);
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (iconOpen) iconOpen.classList.toggle('hidden', isOpen);
      if (iconClose) iconClose.classList.toggle('hidden', !isOpen);
    }

    btn.addEventListener('click', function () {
      setOpen(panel.classList.contains('hidden'));
    });

    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
