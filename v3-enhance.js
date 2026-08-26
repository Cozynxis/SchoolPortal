/* SchoolPortal V3 — progressive UX enhancements */
(() => {
  function ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn();}
  ready(() => {
    const SP = window.SP;
    if (!SP || !window.SPApp) return;

    const modal = document.getElementById('modal');
    const icon = (name,size=18) => SP.ui.svgIcon ? SP.ui.svgIcon(name,size) : SP.ui.icon(name);

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

    modal?.addEventListener('click', (event) => {
      if (event.target === modal) modal.close();
    });

    document.addEventListener('keydown', (event) => {
      const meta = event.ctrlKey || event.metaKey;
      const tag = document.activeElement?.tagName;
      const typing = /INPUT|TEXTAREA|SELECT/.test(tag || '');

      if (meta && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (SP.state.role === 'teacher') document.querySelector('[data-command]')?.click();
        else document.querySelector('[data-student-search]')?.click();
      }

      if (meta && event.key.toLowerCase() === 'n' && SP.state.role === 'teacher') {
        event.preventDefault();
        document.querySelector('[data-quick-create]')?.click();
      }

      if (!typing && event.key === '/' && SP.state.role === 'teacher') {
        event.preventDefault();
        document.querySelector('[data-command]')?.click();
      }

      if (event.key === 'Escape') document.querySelector('.teacher-rail.mobile-open')?.classList.remove('mobile-open');
    });

    const originalRender = window.SPApp.render.bind(window.SPApp);
    window.SPApp.render = function(){
      originalRender();
      polishRenderedView();
    };

    function setIconOnly(selector,name,label){
      const el=document.querySelector(selector);
      if(!el)return;
      el.innerHTML=icon(name,18);
      if(label){el.setAttribute('aria-label',label);el.dataset.tooltip=label;}
    }

    function replaceLeadingSymbol(selector,name){
      document.querySelectorAll(selector).forEach(el=>{
        const first=el.querySelector(':scope > span:first-child');
        if(first)first.innerHTML=icon(name,17);
      });
    }

    function polishRenderedView(){
      requestAnimationFrame(() => {
        document.body.dataset.portalRole = SP.state.role;

        document.querySelectorAll('button,[role="button"]').forEach((button) => {
          if (!button.hasAttribute('type')) button.setAttribute('type','button');
        });

        document.querySelectorAll('[title]').forEach((node) => {
          if (!node.dataset.tooltip) node.dataset.tooltip = node.getAttribute('title');
        });

        document.querySelectorAll('.badge').forEach((badge) => badge.setAttribute('aria-label', badge.textContent.trim()));

        // Student chrome icons.
        setIconOnly('[data-student-search]','search','Zoeken');
        setIconOnly('[data-student-theme]',SP.state.theme==='dark'?'sun':'moon','Thema wisselen');
        const more=document.querySelector('.student-bottom [data-student-menu] > span:first-child');
        if(more)more.innerHTML=icon('more',19);

        // Teacher chrome icons.
        const mobile=document.querySelector('[data-teacher-mobile]');
        if(mobile){mobile.innerHTML=icon('menu',19);mobile.setAttribute('aria-label','Menu openen');}
        const command=document.querySelector('[data-command] > span:first-child');
        if(command)command.innerHTML=icon('search',16);
        const quick=document.querySelector('[data-quick-create]');
        if(quick){const text=quick.querySelector('span');quick.innerHTML=`${icon('plus',16)}${text?`<span>${text.textContent}</span>`:'<span>Nieuw</span>'}`;}
        setIconOnly('[data-notifications]','bell','Meldingen');
        setIconOnly('[data-teacher-theme]',SP.state.theme==='dark'?'sun':'moon','Thema wisselen');

        // Quick action cards.
        const quickMap={
          '[data-create-student]':'students',
          '[data-new-grade]':'grades',
          '[data-new-assignment]':'assignments',
          '[data-new-message]':'messages',
          '[data-new-test]':'tests',
          '[data-new-note]':'notes'
        };
        Object.entries(quickMap).forEach(([selector,name])=>replaceLeadingSymbol(`.teacher-quick-grid ${selector}`,name));

        // Search fields and common table actions.
        document.querySelectorAll('.search-field > span:first-child').forEach(s=>s.innerHTML=icon('search',15));
        document.querySelectorAll('.table-action').forEach(b=>{if(b.textContent.includes('•'))b.innerHTML=icon('more',17);});

        // Generic next arrows become consistent chevrons.
        document.querySelectorAll('.next-arrow').forEach(b=>{b.innerHTML=icon('chevron',20);b.setAttribute('aria-label','Open rooster');});
      });
    }

    const observer = new MutationObserver(() => {
      document.querySelectorAll('#modal button').forEach(b => {
        if (!b.hasAttribute('type')) b.setAttribute('type','button');
      });
      const autofocus=document.querySelector('#modal [autofocus]');
      if(autofocus && document.activeElement!==autofocus)setTimeout(()=>autofocus.focus(),20);
    });
    if (modal) observer.observe(modal,{childList:true,subtree:true});

    polishRenderedView();
  });
})();