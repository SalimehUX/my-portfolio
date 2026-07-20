/**
 * ChapterNav — sticky left-rail chapter navigation for case study pages.
 *
 * Usage: drop a mount point anywhere on the page —
 *   <div data-chapter-nav data-chapter-nav-target="#case-study-main"></div>
 * — and mark each scrollable section inside the target container with
 *   <section id="unique-anchor" data-chapter="Label">
 * The nav is built entirely from those [data-chapter] sections at render
 * time; there is no hardcoded label list and no per-page configuration.
 */
(function () {
  var HEADER_OFFSET = 96; // px clearance below the sticky site header

  function buildNav(root) {
    var targetSelector = root.getAttribute('data-chapter-nav-target') || 'main';
    var container = document.querySelector(targetSelector);
    if (!container) return;

    var sections = Array.prototype.slice.call(container.querySelectorAll('[data-chapter]'));
    if (sections.length === 0) return;

    var nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Case study chapters');
    nav.className =
      'sticky border-r border-black/[0.07] overflow-y-auto py-2';
    nav.style.top = HEADER_OFFSET + 'px';
    nav.style.maxHeight = 'calc(100vh - ' + (HEADER_OFFSET + 32) + 'px)';

    var entries = sections.map(function (section) {
      var label = section.getAttribute('data-chapter');

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.setAttribute('aria-current', 'false');
      btn.className =
        'block w-full text-left pl-6 pr-4 py-3.5 text-[11px] font-mono uppercase tracking-widest ' +
        'border-l-2 border-transparent text-ink/75 hover:text-ink transition-colors ' +
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet focus-visible:-outline-offset-2';

      btn.addEventListener('click', function () {
        var headerEl = document.querySelector('header.sticky');
        var offset = headerEl ? headerEl.offsetHeight + 24 : HEADER_OFFSET;
        var top = section.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });

      nav.appendChild(btn);
      return { section: section, btn: btn };
    });

    root.innerHTML = '';
    root.appendChild(nav);

    var activeEntry = null;
    function setActive(entry) {
      if (entry === activeEntry) return;
      activeEntry = entry;
      entries.forEach(function (e) {
        var isActive = e === entry;
        e.btn.setAttribute('aria-current', isActive ? 'true' : 'false');
        e.btn.classList.toggle('text-ink', isActive);
        e.btn.classList.toggle('font-semibold', isActive);
        e.btn.classList.toggle('border-violet', isActive);
        e.btn.classList.toggle('text-ink/75', !isActive);
        e.btn.classList.toggle('border-transparent', !isActive);
      });
    }

    var observer = new IntersectionObserver(
      function (observerEntries) {
        observerEntries.forEach(function (observerEntry) {
          if (observerEntry.isIntersecting) {
            var match = entries.find(function (e) {
              return e.section === observerEntry.target;
            });
            if (match) setActive(match);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });

    setActive(entries[0]);
  }

  function init() {
    document.querySelectorAll('[data-chapter-nav]').forEach(buildNav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
