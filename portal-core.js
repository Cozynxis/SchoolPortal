/*
 * SchoolPortal v2 - Application core
 * ------------------------------------------------------------
 * GitHub Pages compatible. Geen framework, buildstap of backend.
 */

window.SchoolPortal = (() => {
  const DATA = window.SchoolPortalData;
  const STORAGE_KEY = 'schoolportal-v2-state';

  const studentNav = [
    ['dashboard', '⌂', 'Dashboard'],
    ['schedule', '▦', 'Rooster'],
    ['homework', '✓', 'Huiswerk'],
    ['tests', '◫', 'Toetsen'],
    ['grades', '★', 'Cijfers'],
    ['attendanceStudent', '◌', 'Absenties'],
    ['subjects', '◆', 'Vakken'],
    ['announcements', '!', 'Mededelingen'],
    ['messages', '✉', 'Berichten'],
    ['files', '▤', 'Bestanden'],
    ['profile', '◎', 'Profiel'],
    ['settings', '⚙', 'Instellingen']
  ];

  const teacherNav = [
    ['dashboardTeacher', '⌂', 'Dashboard'],
    ['scheduleTeacher', '▦', 'Mijn rooster'],
    ['classes', '♟', 'Klassen'],
    ['attendanceTeacher', '✓', 'Aanwezigheid'],
    ['assignments', '▤', 'Opdrachten'],
    ['gradeEntry', '★', 'Cijfers invoeren'],
    ['mentor', '◇', 'Mentorklas'],
    ['announcementsTeacher', '!', 'Mededelingen'],
    ['messages', '✉', 'Berichten'],
    ['files', '▤', 'Bestanden'],
    ['profile', '◎', 'Profiel'],
    ['settings', '⚙', 'Instellingen']
  ];

  let state = loadState();
  let searchQuery = '';
  let modalResolve = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DATA.clone(DATA.defaultState);
      const parsed = JSON.parse(raw);
      const base = DATA.clone(DATA.defaultState);
      return deepMerge(base, parsed);
    } catch (error) {
      console.warn('SchoolPortal state kon niet worden geladen:', error);
      return DATA.clone(DATA.defaultState);
    }
  }

  function deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    Object.keys(source).forEach((key) => {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        target[key] &&
        typeof target[key] === 'object' &&
        !Array.isArray(target[key])
      ) {
        target[key] = deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
    return target;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      toast('Opslaan in browser is mislukt', 'error');
      console.error(error);
    }
  }

  function resetState() {
    state = DATA.clone(DATA.defaultState);
    saveState();
    render();
    toast('Demo-data is hersteld', 'success');
  }

  function el(selector, root = document) {
    return root.querySelector(selector);
  }

  function els(selector, root = document) {
    return [...root.querySelectorAll(selector)];
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[char]));
  }

  function formatDate(value, options = {}) {
    if (!value) return '-';
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: options.short ? 'short' : 'long',
      ...(options.year ? { year: 'numeric' } : {})
    }).format(date);
  }

  function formatNumber(value, digits = 1) {
    return Number(value).toFixed(digits).replace('.', ',');
  }

  function uid(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function getProfile() {
    return state.role === 'teacher' ? state.profile.teacher : state.profile.student;
  }

  function getNav() {
    return state.role === 'teacher' ? teacherNav : studentNav;
  }

  function weightedAverage(items = state.grades) {
    const valid = items.filter((grade) => Number.isFinite(Number(grade.grade)));
    const denominator = valid.reduce((sum, grade) => sum + Number(grade.weight || 1), 0);
    if (!denominator) return null;
    const numerator = valid.reduce((sum, grade) => sum + Number(grade.grade) * Number(grade.weight || 1), 0);
    return numerator / denominator;
  }

  function subjectAverage(subject) {
    return weightedAverage(state.grades.filter((grade) => grade.subject === subject));
  }

  function subjectMeta(subject) {
    return DATA.subjects.find((item) => item.name === subject) || {
      id: subject.toLowerCase(),
      name: subject,
      code: subject.slice(0, 3).toUpperCase(),
      teacher: 'Onbekend',
      room: '-',
      color: '#5b5cf0'
    };
  }

  function priorityLabel(priority) {
    return ({ high: 'Hoog', medium: 'Normaal', low: 'Laag' })[priority] || 'Normaal';
  }

  function absenceLabel(type) {
    return ({ late: 'Te laat', approved: 'Geoorloofd', sick: 'Ziek', unapproved: 'Ongeoorloofd' })[type] || type;
  }

  function toast(message, type = 'info') {
    const node = el('#toast');
    if (!node) return;
    node.textContent = message;
    node.dataset.type = type;
    node.classList.remove('show');
    requestAnimationFrame(() => node.classList.add('show'));
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('show'), 2400);
  }

  function card(title, body, action = '') {
    return `
      <section class="panel card reveal">
        <div class="card-header">
          <div>
            <h3>${escapeHtml(title)}</h3>
          </div>
          ${action}
        </div>
        <div class="card-content">${body}</div>
      </section>
    `;
  }

  function pageHeader(title, subtitle, action = '') {
    return `
      <div class="page-header reveal">
        <div>
          <div class="eyebrow">SchoolPortal</div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(subtitle)}</p>
        </div>
        <div class="page-actions">${action}</div>
      </div>
    `;
  }

  function statCard(label, value, note = '', tone = '') {
    return `
      <div class="stat-card ${tone}">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
        <small>${escapeHtml(note)}</small>
      </div>
    `;
  }

  function badge(text, tone = 'default') {
    return `<span class="badge badge-${tone}">${escapeHtml(text)}</span>`;
  }

  function emptyState(icon, title, text, action = '') {
    return `
      <div class="empty-state">
        <div class="empty-icon">${icon}</div>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(text)}</p>
        ${action}
      </div>
    `;
  }

  function openModal({ title, body, confirmText = '', cancelText = 'Sluiten', onConfirm = null, wide = false }) {
    const dialog = el('#portalModal');
    const titleNode = el('#portalModalTitle');
    const bodyNode = el('#portalModalBody');
    const footer = el('#portalModalFooter');
    if (!dialog || !titleNode || !bodyNode || !footer) return;

    titleNode.textContent = title;
    bodyNode.innerHTML = body;
    dialog.classList.toggle('wide', wide);

    footer.innerHTML = `
      <button type="button" class="btn btn-ghost" data-modal-cancel>${escapeHtml(cancelText)}</button>
      ${confirmText ? `<button type="button" class="btn btn-primary" data-modal-confirm>${escapeHtml(confirmText)}</button>` : ''}
    `;

    const cancel = el('[data-modal-cancel]', footer);
    if (cancel) cancel.addEventListener('click', () => dialog.close());

    const confirm = el('[data-modal-confirm]', footer);
    if (confirm) {
      confirm.addEventListener('click', async () => {
        if (!onConfirm) {
          dialog.close();
          return;
        }
        const result = await onConfirm(bodyNode, dialog);
        if (result !== false) dialog.close();
      });
    }

    dialog.showModal();
    requestAnimationFrame(() => dialog.classList.add('visible'));
  }

  function closeModal() {
    const dialog = el('#portalModal');
    if (dialog?.open) dialog.close();
  }

  function confirmDialog(title, text, confirmText = 'Bevestigen') {
    return new Promise((resolve) => {
      modalResolve = resolve;
      openModal({
        title,
        body: `<p class="modal-copy">${escapeHtml(text)}</p>`,
        confirmText,
        cancelText: 'Annuleren',
        onConfirm: () => {
          modalResolve?.(true);
          modalResolve = null;
          return true;
        }
      });
      const dialog = el('#portalModal');
      const once = () => {
        if (modalResolve) {
          modalResolve(false);
          modalResolve = null;
        }
        dialog.removeEventListener('close', once);
      };
      dialog.addEventListener('close', once);
    });
  }

  function addActivity(type, text) {
    state.activity.unshift({
      id: uid('activity'),
      type,
      text,
      time: 'Nu'
    });
    state.activity = state.activity.slice(0, 20);
  }

  function switchRole(role) {
    state.role = role;
    state.activePage = role === 'teacher' ? 'dashboardTeacher' : 'dashboard';
    saveState();
    render();
    toast(role === 'teacher' ? 'Docentenportaal geopend' : 'Leerlingportaal geopend', 'success');
  }

  function navigate(page) {
    state.activePage = page;
    saveState();
    render();
    closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: state.settings.reducedMotion ? 'auto' : 'smooth' });
  }

  function renderNavigation() {
    const nav = el('#sideNav');
    if (!nav) return;
    nav.innerHTML = getNav().map(([id, icon, label]) => `
      <button class="nav-item ${state.activePage === id ? 'active' : ''}" data-nav="${id}">
        <span class="nav-icon">${icon}</span>
        <span class="nav-label">${escapeHtml(label)}</span>
        <span class="nav-active-dot"></span>
      </button>
    `).join('');

    els('[data-nav]', nav).forEach((button) => {
      button.addEventListener('click', () => navigate(button.dataset.nav));
    });
  }

  function renderRoleControl() {
    els('[data-role-switch]').forEach((button) => {
      button.classList.toggle('active', button.dataset.roleSwitch === state.role);
    });
  }

  function renderShellMeta() {
    const profile = getProfile();
    const avatar = el('#userAvatar');
    const name = el('#userName');
    const role = el('#userRole');
    const breadcrumb = el('#portalBreadcrumb');
    const pageTitle = el('#topPageTitle');

    const navItem = getNav().find(([id]) => id === state.activePage);
    const title = navItem ? navItem[2] : 'SchoolPortal';

    if (avatar) avatar.textContent = profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
    if (name) name.textContent = profile.name;
    if (role) role.textContent = state.role === 'teacher' ? 'Docent' : `Leerling · ${profile.className}`;
    if (breadcrumb) breadcrumb.textContent = state.role === 'teacher' ? 'Docentenportaal' : 'Leerlingportaal';
    if (pageTitle) pageTitle.textContent = title;

    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.accent = state.accent;
    document.body.classList.toggle('compact', !!state.settings.compact);
    document.body.classList.toggle('reduce-motion', !!state.settings.reducedMotion);
    el('#sidebar')?.classList.toggle('collapsed', !!state.sidebarCollapsed);
  }

  function renderPage() {
    const root = el('#pageContent');
    if (!root) return;
    const renderer = window.SchoolPortalPages?.[state.activePage];
    if (!renderer) {
      root.innerHTML = emptyState('?', 'Pagina niet gevonden', 'Deze pagina bestaat niet in de demo.');
      return;
    }
    root.innerHTML = renderer(api());
    bindPageActions(root);
    applySearch(searchQuery);
  }

  function render() {
    renderNavigation();
    renderRoleControl();
    renderShellMeta();
    renderPage();
  }

  function openMobileSidebar() {
    el('#sidebar')?.classList.add('mobile-open');
    el('#sidebarScrim')?.classList.add('show');
    document.body.classList.add('menu-open');
  }

  function closeMobileSidebar() {
    el('#sidebar')?.classList.remove('mobile-open');
    el('#sidebarScrim')?.classList.remove('show');
    document.body.classList.remove('menu-open');
  }

  function toggleSidebar() {
    if (window.matchMedia('(max-width: 920px)').matches) {
      openMobileSidebar();
      return;
    }
    state.sidebarCollapsed = !state.sidebarCollapsed;
    saveState();
    renderShellMeta();
  }

  function setTheme(theme) {
    state.theme = theme;
    saveState();
    renderShellMeta();
  }

  function toggleTheme() {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  }

  function applySearch(query) {
    searchQuery = query.trim().toLowerCase();
    const searchable = els('[data-searchable]');
    if (!searchQuery) {
      searchable.forEach((node) => node.classList.remove('search-hidden'));
      return;
    }
    searchable.forEach((node) => {
      node.classList.toggle('search-hidden', !node.textContent.toLowerCase().includes(searchQuery));
    });
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `schoolportal-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    toast('Backup gedownload', 'success');
  }

  function importJson(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        state = deepMerge(DATA.clone(DATA.defaultState), imported);
        saveState();
        render();
        toast('Backup geïmporteerd', 'success');
      } catch (error) {
        toast('Dit is geen geldige SchoolPortal-backup', 'error');
      }
    };
    reader.readAsText(file);
  }

  function bindPageActions(root) {
    els('[data-action]', root).forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        const handler = window.SchoolPortalActions?.[action];
        if (handler) handler(api(), button);
      });
    });

    els('[data-page]', root).forEach((button) => {
      button.addEventListener('click', () => navigate(button.dataset.page));
    });
  }

  function bindGlobalEvents() {
    el('#sidebarToggle')?.addEventListener('click', toggleSidebar);
    el('#mobileMenuButton')?.addEventListener('click', openMobileSidebar);
    el('#sidebarScrim')?.addEventListener('click', closeMobileSidebar);
    el('#themeToggle')?.addEventListener('click', toggleTheme);
    el('#globalSearch')?.addEventListener('input', (event) => applySearch(event.target.value));

    els('[data-role-switch]').forEach((button) => {
      button.addEventListener('click', () => switchRole(button.dataset.roleSwitch));
    });

    el('#notificationButton')?.addEventListener('click', () => {
      openModal({
        title: 'Meldingen',
        body: `
          <div class="notification-list">
            ${state.activity.slice(0, 6).map((item) => `
              <div class="notification-row">
                <span class="notification-dot"></span>
                <div>
                  <strong>${escapeHtml(item.text)}</strong>
                  <small>${escapeHtml(item.time)}</small>
                </div>
              </div>
            `).join('')}
          </div>
        `
      });
    });

    el('#profileButton')?.addEventListener('click', () => navigate('profile'));

    el('#portalModal')?.addEventListener('close', () => {
      el('#portalModal')?.classList.remove('visible', 'wide');
    });

    window.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        el('#globalSearch')?.focus();
      }
      if (event.key === 'Escape') closeMobileSidebar();
    });
  }

  function api() {
    return {
      DATA,
      state,
      saveState,
      render,
      navigate,
      switchRole,
      toast,
      card,
      pageHeader,
      statCard,
      badge,
      emptyState,
      openModal,
      closeModal,
      confirmDialog,
      escapeHtml,
      formatDate,
      formatNumber,
      weightedAverage,
      subjectAverage,
      subjectMeta,
      priorityLabel,
      absenceLabel,
      uid,
      getProfile,
      addActivity,
      resetState,
      downloadJson,
      importJson,
      setTheme
    };
  }

  function init() {
    bindGlobalEvents();
    render();
  }

  return {
    init,
    api,
    render,
    navigate,
    switchRole
  };
})();
