/* SchoolPortal V3 — progressive UX enhancements */
(() => {
  function ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn();}
  ready(() => {
    const SP = window.SP;
    if (!SP || !window.SPApp) return;

    const appRoot = document.getElementById('app');
    const modal = document.getElementById('modal');

    // Ripple feedback on interactive controls.
    document.addEventListener('pointerdown', (event) => {
      const target = event.target.closest('button,.btn,[role="button"],.student-tab,.teacher-nav-item');
      if (!target || target.disabled) return;
      const rect = target.getBoundingClientRect();
      const dot = document.createElement('span');
      dot.className = 'ui-ripple';
      dot.style.left = `${event.clientX - rect.left}px`;
      dot.style.top = `${event.clientY - rect.top}px`;
      target.appendChild(dot);
      setTimeout(() => dot.remove(), 520);
    }, {passive:true});

    // Close dialog when clicking its backdrop.
    modal?.addEventListener('click', (event) => {
      if (event.target === modal) modal.close();
    });

    // Global keyboard shortcuts.
    document.addEventListener('keydown', (event) => {
      const meta = event.ctrlKey || event.metaKey;
      const tag = document.activeElement?.tagName;
      const typing = /INPUT|TEXTAREA|SELECT/.test(tag || '');

      if (meta && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (SP.state.role === 'teacher') {
          document.querySelector('[data-command]')?.click();
        } else {
          document.querySelector('[data-student-search]')?.click();
        }
      }

      if (meta && event.key.toLowerCase() === 'n' && SP.state.role === 'teacher') {
        event.preventDefault();
        document.querySelector('[data-quick-create]')?.click();
      }

      if (!typing && event.key === '/' && SP.state.role === 'teacher') {
        event.preventDefault();
        document.querySelector('[data-command]')?.click();
      }

      if (event.key === 'Escape') {
        document.querySelector('.teacher-rail.mobile-open')?.classList.remove('mobile-open');
      }
    });

    // Add keyboard shortcut hints and page context after every render.
    const originalRender = window.SPApp.render.bind(window.SPApp);
    window.SPApp.render = function(){
      originalRender();
      polishRenderedView();
    };

    function polishRenderedView(){
      requestAnimationFrame(() => {
        document.body.dataset.portalRole = SP.state.role;

        document.querySelectorAll('button,[role="button"]').forEach((button) => {
          if (!button.hasAttribute('type')) button.setAttribute('type','button');
        });

        document.querySelectorAll('[title]').forEach((node) => {
          if (!node.dataset.tooltip) node.dataset.tooltip = node.getAttribute('title');
        });

        document.querySelectorAll('table').forEach((table) => {
          table.closest('.table-shell,.table-wrap')?.classList.add('has-modern-table');
        });

        document.querySelectorAll('.badge').forEach((badge) => {
          badge.setAttribute('aria-label', badge.textContent.trim());
        });
      });
    }

    // Mutation observer keeps polish applied to modal contents too.
    const observer = new MutationObserver(() => {
      document.querySelectorAll('#modal button').forEach(b => {
        if (!b.hasAttribute('type')) b.setAttribute('type','button');
      });
    });
    if (modal) observer.observe(modal,{childList:true,subtree:true});

    polishRenderedView();
  });
})();