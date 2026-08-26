/* SchoolPortal v2 - Page renderers */
window.SchoolPortalPages = (() => {
  function heroStudent(api) {
    const { state, escapeHtml } = api;
    const open = state.homework.filter((item) => !item.done).length;
    return `
      <section class="hero hero-student reveal">
        <div class="hero-copy">
          <span class="hero-kicker">✦ Woensdag 26 augustus 2026</span>
          <h2>Goedemiddag, ${escapeHtml(state.profile.student.name.split(' ')[0])}</h2>
          <p>Je hebt vandaag 5 lessen en ${open} openstaande taken.</p>
          <div class="hero-actions">
            <button class="btn btn-light" data-page="schedule">Bekijk rooster</button>
            <button class="btn btn-glass" data-page="homework">Open huiswerk</button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-orb">S</div>
          <span class="hero-chip chip-one">3M2</span>
          <span class="hero-chip chip-two">97% aanwezig</span>
        </div>
      </section>
    `;
  }

  function heroTeacher(api) {
    const { state, escapeHtml } = api;
    return `
      <section class="hero hero-teacher reveal">
        <div class="hero-copy">
          <span class="hero-kicker">✦ Woensdag 26 augustus 2026</span>
          <h2>Goedemiddag, ${escapeHtml(state.profile.teacher.name)}</h2>
          <p>Vandaag geef je 5 lessen aan 4 verschillende klassen.</p>
          <div class="hero-actions">
            <button class="btn btn-light" data-page="attendanceTeacher">Aanwezigheid</button>
            <button class="btn btn-glass" data-page="gradeEntry">Cijfers invoeren</button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-orb">D</div>
          <span class="hero-chip chip-one">Mentor 3M2</span>
          <span class="hero-chip chip-two">23 na te kijken</span>
        </div>
      </section>
    `;
  }

  function lessonRows(api, day = 3, teacherMode = false) {
    const { DATA, subjectMeta, badge } = api;
    return DATA.schedule
      .filter((lesson) => lesson.day === day)
      .map((lesson, index) => {
        const meta = subjectMeta(lesson.subject);
        let status = '';
        if (lesson.status === 'cancelled') status = badge('Uitval', 'red');
        if (lesson.status === 'changed') status = badge('Gewijzigd', 'yellow');
        return `
          <div class="lesson-row ${lesson.status}" data-searchable>
            <div class="lesson-time"><strong>${lesson.start}</strong><small>${lesson.end}</small></div>
            <span class="lesson-color" style="--subject:${meta.color}"></span>
            <div class="lesson-main">
              <strong>${teacherMode ? `${lesson.className} · ${lesson.subject}` : lesson.subject}</strong>
              <span>${teacherMode ? `${lesson.room} · ${26 - index} leerlingen` : `${lesson.room} · ${lesson.teacher}`}</span>
            </div>
            ${status || (index === 0 ? badge('Volgende', 'purple') : '')}
          </div>
        `;
      }).join('');
  }

  function activityRows(api) {
    const { state, escapeHtml } = api;
    return state.activity.slice(0, 6).map((item) => `
      <div class="activity-row" data-searchable>
        <span class="activity-icon activity-${item.type}">${item.type === 'grade' ? '★' : item.type === 'message' ? '✉' : '✓'}</span>
        <div><strong>${escapeHtml(item.text)}</strong><small>${escapeHtml(item.time)}</small></div>
      </div>
    `).join('');
  }

  function dashboard(api) {
    const { state, statCard, card, weightedAverage, formatNumber, badge, escapeHtml } = api;
    const avg = weightedAverage();
    const openHomework = state.homework.filter((item) => !item.done).length;
    const unread = state.messages.filter((conv) => conv.unread).length;
    const recentGrades = state.grades.slice().sort((a, b) => b.id - a.id).slice(0, 4);
    return `
      ${heroStudent(api)}
      <div class="stats-grid reveal">
        ${statCard('Gemiddelde', avg ? formatNumber(avg) : '-', '+0,2 deze periode', 'primary')}
        ${statCard('Open huiswerk', String(openHomework), `${state.homework.length - openHomework} afgerond`, 'warning')}
        ${statCard('Aanwezigheid', '97%', 'Dit schooljaar', 'success')}
        ${statCard('Ongelezen', String(unread), 'Nieuwe berichten', 'info')}
      </div>
      <div class="dashboard-grid two-col">
        ${card('Vandaag', `<div class="lesson-list">${lessonRows(api)}</div>`, '<button class="link-button" data-page="schedule">Volledig rooster →</button>')}
        ${card('Huiswerk', `
          <div class="task-stack">
            ${state.homework.slice(0, 4).map((item) => `
              <div class="task-row" data-searchable>
                <button class="task-check ${item.done ? 'checked' : ''}" data-action="toggle-homework" data-id="${item.id}">${item.done ? '✓' : ''}</button>
                <div class="task-copy ${item.done ? 'completed' : ''}"><strong>${escapeHtml(item.subject)}</strong><span>${escapeHtml(item.title)}</span></div>
                ${badge(item.done ? 'Klaar' : api.formatDate(item.due, { short: true }), item.done ? 'green' : item.priority === 'high' ? 'red' : 'default')}
              </div>
            `).join('')}
          </div>
        `, '<button class="link-button" data-page="homework">Alles bekijken →</button>')}
      </div>
      <div class="dashboard-grid two-col">
        ${card('Laatste cijfers', `
          <div class="grade-list">
            ${recentGrades.map((grade) => `
              <div class="grade-row" data-searchable>
                <div><strong>${escapeHtml(grade.subject)}</strong><span>${escapeHtml(grade.title)} · ×${grade.weight}</span></div>
                <span class="grade-pill ${grade.grade >= 7.5 ? 'good' : grade.grade < 5.5 ? 'bad' : ''}">${formatNumber(grade.grade)}</span>
              </div>
            `).join('')}
          </div>
        `, '<button class="link-button" data-page="grades">Cijferoverzicht →</button>')}
        ${card('Recente activiteit', `<div class="activity-list">${activityRows(api)}</div>`, '<button class="link-button" data-page="announcements">Mededelingen →</button>')}
      </div>
    `;
  }

  function dashboardTeacher(api) {
    const { state, statCard, card, badge, escapeHtml } = api;
    const pending = state.assignments.reduce((sum, item) => sum + Math.max(0, item.submitted - Math.floor(item.submitted * 0.65)), 0);
    return `
      ${heroTeacher(api)}
      <div class="stats-grid reveal">
        ${statCard('Lessen vandaag', '5', 'Eerste om 08:30', 'primary')}
        ${statCard('Na te kijken', String(pending + 18), '3 opdrachten', 'warning')}
        ${statCard('Mentorleerlingen', '26', 'Klas 3M2', 'success')}
        ${statCard('Ongelezen', String(state.messages.filter((conv) => conv.unread).length + 2), 'Nieuwe berichten', 'info')}
      </div>
      <div class="dashboard-grid two-col">
        ${card('Mijn lessen', `<div class="lesson-list">${lessonRows(api, 3, true)}</div>`, '<button class="link-button" data-page="scheduleTeacher">Rooster →</button>')}
        ${card('Snelle acties', `
          <div class="quick-actions">
            <button data-page="attendanceTeacher"><span>✓</span><strong>Aanwezigheid</strong><small>Registreren</small></button>
            <button data-page="gradeEntry"><span>★</span><strong>Cijfers</strong><small>Invoeren</small></button>
            <button data-action="new-assignment"><span>＋</span><strong>Opdracht</strong><small>Aanmaken</small></button>
            <button data-page="messages"><span>✉</span><strong>Bericht</strong><small>Versturen</small></button>
          </div>
        `)}
      </div>
      <div class="dashboard-grid two-col">
        ${card('Opdrachten', `
          <div class="assignment-mini-list">
            ${state.assignments.slice(0, 3).map((item) => `
              <div class="assignment-mini" data-searchable>
                <div class="progress-ring" style="--progress:${Math.round((item.submitted / item.total) * 100)}%"><span>${item.submitted}/${item.total}</span></div>
                <div><strong>${escapeHtml(item.title)}</strong><span>${item.className} · ${api.formatDate(item.due, { short: true })}</span></div>
                ${badge(item.published ? 'Actief' : 'Concept', item.published ? 'green' : 'yellow')}
              </div>
            `).join('')}
          </div>
        `, '<button class="link-button" data-page="assignments">Beheer →</button>')}
        ${card('Mentorklas 3M2', `
          <div class="mentor-summary">
            <div><strong>26</strong><span>leerlingen</span></div>
            <div><strong>7,2</strong><span>gemiddeld</span></div>
            <div><strong>96%</strong><span>aanwezig</span></div>
          </div>
          <div class="alert-box info"><strong>2 aandachtspunten</strong><span>Bekijk leerlingen met recente absenties of dalende resultaten.</span></div>
        `, '<button class="link-button" data-page="mentor">Open mentorklas →</button>')}
      </div>
    `;
  }

  function scheduleGrid(api, teacherMode = false) {
    const { DATA, subjectMeta, badge } = api;
    const days = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];
    const starts = ['08:30', '09:20', '10:30', '11:20', '13:00'];
    return `
      <div class="schedule-shell">
        <div class="schedule-toolbar">
          <div class="segmented">
            <button class="active">Week</button><button>Dag</button>
          </div>
          <div class="week-nav"><button class="icon-small" data-action="week-prev">‹</button><strong>Week 35</strong><button class="icon-small" data-action="week-next">›</button></div>
        </div>
        <div class="schedule-scroll">
          <div class="schedule-grid-v2">
            <div class="schedule-head time-head">Tijd</div>
            ${days.map((day, index) => `<div class="schedule-head ${index === 2 ? 'today' : ''}"><span>${day}</span><small>${24 + index} aug</small></div>`).join('')}
            ${starts.map((start) => `
              <div class="schedule-time"><strong>${start}</strong></div>
              ${days.map((day, dayIndex) => {
                const lesson = DATA.schedule.find((item) => item.day === dayIndex + 1 && item.start === start);
                if (!lesson) return '<div class="schedule-empty"></div>';
                const meta = subjectMeta(lesson.subject);
                return `
                  <button class="schedule-lesson ${lesson.status}" style="--subject:${meta.color}" data-action="lesson-details" data-id="${lesson.id}" data-searchable>
                    <span class="schedule-subject">${teacherMode ? lesson.className : lesson.subject}</span>
                    <small>${teacherMode ? lesson.subject : lesson.room}</small>
                    <small>${lesson.start}–${lesson.end}</small>
                    ${lesson.status === 'cancelled' ? '<em>Uitval</em>' : lesson.status === 'changed' ? '<em>Gewijzigd</em>' : ''}
                  </button>
                `;
              }).join('')}
            `).join('')}
          </div>
        </div>
        <div class="schedule-legend">
          ${badge('Normaal', 'purple')} ${badge('Gewijzigd', 'yellow')} ${badge('Uitval', 'red')}
        </div>
      </div>
    `;
  }

  function schedule(api) {
    return `${api.pageHeader('Rooster', 'Je volledige lesrooster, lokalen en wijzigingen.')} ${api.card('Week 35', scheduleGrid(api, false))}`;
  }

  function scheduleTeacher(api) {
    return `${api.pageHeader('Mijn rooster', 'Je lessen, klassen, lokalen en roosterwijzigingen.')} ${api.card('Week 35', scheduleGrid(api, true))}`;
  }

  function homework(api) {
    const { state, escapeHtml, badge, formatDate } = api;
    const filtered = state.filters.homework === 'open' ? state.homework.filter((x) => !x.done) : state.filters.homework === 'done' ? state.homework.filter((x) => x.done) : state.homework;
    return `
      ${api.pageHeader('Huiswerk', 'Bekijk, filter en beheer je taken.', '<button class="btn btn-primary" data-action="new-homework">＋ Huiswerk toevoegen</button>')}
      <div class="filter-bar reveal">
        <div class="segmented" data-filter-group="homework">
          <button class="${state.filters.homework === 'all' ? 'active' : ''}" data-action="filter-homework" data-value="all">Alles</button>
          <button class="${state.filters.homework === 'open' ? 'active' : ''}" data-action="filter-homework" data-value="open">Open</button>
          <button class="${state.filters.homework === 'done' ? 'active' : ''}" data-action="filter-homework" data-value="done">Afgerond</button>
        </div>
        <span class="filter-count">${filtered.length} taken</span>
      </div>
      ${api.card('Taken', `
        <div class="task-table">
          ${filtered.length ? filtered.map((item) => `
            <div class="task-card-row ${item.done ? 'done' : ''}" data-searchable>
              <button class="task-check large ${item.done ? 'checked' : ''}" data-action="toggle-homework" data-id="${item.id}">${item.done ? '✓' : ''}</button>
              <span class="subject-dot" style="--subject:${api.subjectMeta(item.subject).color}"></span>
              <div class="task-card-copy">
                <div class="task-title-line"><strong>${escapeHtml(item.title)}</strong>${badge(item.subject, 'soft')}</div>
                <p>${escapeHtml(item.description || 'Geen extra omschrijving.')}</p>
                <small>Deadline ${formatDate(item.due)} · Prioriteit ${api.priorityLabel(item.priority)}</small>
              </div>
              <div class="row-actions">
                ${badge(item.done ? 'Klaar' : api.priorityLabel(item.priority), item.done ? 'green' : item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'yellow' : 'default')}
                <button class="icon-small danger" data-action="delete-homework" data-id="${item.id}" title="Verwijderen">×</button>
              </div>
            </div>
          `).join('') : api.emptyState('✓', 'Geen taken', 'Er staan geen taken in dit filter.')}
        </div>
      `)}
    `;
  }

  function tests(api) {
    const { state, escapeHtml, formatDate, badge } = api;
    return `
      ${api.pageHeader('Toetsen', 'Aankomende toetsen, deadlines en herinneringen.', '<button class="btn btn-primary" data-action="new-test">＋ Toets toevoegen</button>')}
      <div class="cards-grid three-col">
        ${state.tests.map((test) => `
          <section class="test-card panel reveal" data-searchable>
            <div class="test-topline"><span class="subject-dot big" style="--subject:${api.subjectMeta(test.subject).color}"></span>${badge(test.subject, 'soft')}</div>
            <h3>${escapeHtml(test.title)}</h3>
            <div class="test-date"><strong>${formatDate(test.date)}</strong><span>${test.room}</span></div>
            <div class="test-meta"><span>Weging ×${test.weight}</span><span>${test.reminder ? 'Herinnering aan' : 'Geen herinnering'}</span></div>
            <div class="test-actions">
              <button class="btn btn-soft" data-action="toggle-reminder" data-id="${test.id}">${test.reminder ? '🔔 Aan' : '🔕 Herinner mij'}</button>
              <button class="icon-small danger" data-action="delete-test" data-id="${test.id}">×</button>
            </div>
          </section>
        `).join('')}
      </div>
    `;
  }

  function grades(api) {
    const { state, weightedAverage, formatNumber, escapeHtml, subjectAverage } = api;
    const avg = weightedAverage();
    const highest = Math.max(...state.grades.map((x) => x.grade));
    const passPercent = Math.round((state.grades.filter((x) => x.grade >= 5.5).length / state.grades.length) * 100);
    const subjects = [...new Set(state.grades.map((x) => x.subject))];
    return `
      ${api.pageHeader('Cijfers', 'Bekijk resultaten, wegingsfactoren en gemiddelden.')}
      <div class="stats-grid reveal">
        ${api.statCard('Gewogen gemiddelde', avg ? formatNumber(avg) : '-', 'Alle vakken', 'primary')}
        ${api.statCard('Hoogste cijfer', formatNumber(highest), 'Dit schooljaar', 'success')}
        ${api.statCard('Voldoendes', `${passPercent}%`, 'Percentage', 'info')}
        ${api.statCard('Aantal cijfers', String(state.grades.length), 'Periode 1', 'warning')}
      </div>
      <div class="dashboard-grid grades-layout">
        ${api.card('Alle cijfers', `
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Vak</th><th>Onderdeel</th><th>Datum</th><th>Weging</th><th>Cijfer</th></tr></thead>
              <tbody>
                ${state.grades.map((grade) => `
                  <tr data-searchable>
                    <td><span class="subject-inline"><i style="--subject:${api.subjectMeta(grade.subject).color}"></i>${escapeHtml(grade.subject)}</span></td>
                    <td>${escapeHtml(grade.title)}</td>
                    <td>${api.formatDate(grade.date, { short: true })}</td>
                    <td>×${grade.weight}</td>
                    <td><span class="grade-pill ${grade.grade >= 7.5 ? 'good' : grade.grade < 5.5 ? 'bad' : ''}">${formatNumber(grade.grade)}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `)}
        ${api.card('Gemiddelde per vak', `
          <div class="subject-average-list">
            ${subjects.map((subject) => {
              const value = subjectAverage(subject);
              const pct = Math.max(10, Math.min(100, (value / 10) * 100));
              return `
                <div class="subject-average" data-searchable>
                  <div><strong>${escapeHtml(subject)}</strong><span>${formatNumber(value)}</span></div>
                  <div class="progress"><i style="width:${pct}%;--subject:${api.subjectMeta(subject).color}"></i></div>
                </div>
              `;
            }).join('')}
          </div>
        `)}
      </div>
    `;
  }

  function attendanceStudent(api) {
    const { state, badge, escapeHtml } = api;
    const sick = state.absences.filter((x) => x.type === 'sick').length;
    const late = state.absences.filter((x) => x.type === 'late').length;
    return `
      ${api.pageHeader('Absenties', 'Overzicht van aanwezigheid, te laat en ziekmeldingen.', '<button class="btn btn-primary" data-action="new-absence">＋ Ziekmelding</button>')}
      <div class="stats-grid reveal">
        ${api.statCard('Aanwezigheid', '97%', 'Dit schooljaar', 'success')}
        ${api.statCard('Te laat', String(late), 'Registraties', 'warning')}
        ${api.statCard('Ziekmeldingen', String(sick), 'Zelf gemeld', 'info')}
        ${api.statCard('Ongeoorloofd', '0', 'Geen meldingen', 'primary')}
      </div>
      ${api.card('Registraties', `
        <div class="timeline-list">
          ${state.absences.map((item) => `
            <div class="timeline-item" data-searchable>
              <span class="timeline-dot ${item.type}"></span>
              <div><strong>${escapeHtml(api.absenceLabel(item.type))} · ${escapeHtml(item.subject)}</strong><span>${api.formatDate(item.date)} · ${escapeHtml(item.detail)}</span></div>
              ${badge(item.approved ? 'Goedgekeurd' : 'In behandeling', item.approved ? 'green' : 'yellow')}
              ${item.type === 'sick' ? `<button class="icon-small danger" data-action="delete-absence" data-id="${item.id}">×</button>` : ''}
            </div>
          `).join('')}
        </div>
      `)}
    `;
  }

  function subjects(api) {
    const { DATA, subjectAverage, formatNumber, escapeHtml } = api;
    return `
      ${api.pageHeader('Vakken', 'Je vakken, docenten, lokalen en resultaten.')}
      <div class="cards-grid three-col">
        ${DATA.subjects.map((subject) => {
          const avg = subjectAverage(subject.name);
          return `
            <section class="subject-card panel reveal" data-searchable>
              <div class="subject-card-top" style="--subject:${subject.color}"><span>${subject.code}</span><i></i></div>
              <h3>${escapeHtml(subject.name)}</h3>
              <p>${escapeHtml(subject.teacher)}</p>
              <div class="subject-details"><span>${subject.room}</span><span>3 lessen p/w</span></div>
              <div class="subject-footer"><span>Gemiddelde</span><strong>${avg ? formatNumber(avg) : '-'}</strong></div>
              <button class="btn btn-soft full" data-action="subject-details" data-subject="${escapeHtml(subject.name)}">Open vak</button>
            </section>
          `;
        }).join('')}
      </div>
    `;
  }

  function announcements(api, teacherMode = false) {
    const { state, escapeHtml, badge } = api;
    return `
      ${api.pageHeader(teacherMode ? 'Mededelingen beheren' : 'Mededelingen', teacherMode ? 'Publiceer updates voor leerlingen en collega’s.' : 'Belangrijke updates van school.', teacherMode ? '<button class="btn btn-primary" data-action="new-announcement">＋ Nieuwe mededeling</button>' : '')}
      <div class="announcement-stack">
        ${state.announcements.map((item) => `
          <article class="announcement panel reveal ${item.pinned ? 'pinned' : ''}" data-searchable>
            <div class="announcement-icon">${item.pinned ? '📌' : '!'}</div>
            <div class="announcement-copy">
              <div class="announcement-title"><h3>${escapeHtml(item.title)}</h3>${badge(item.audience, 'soft')}</div>
              <p>${escapeHtml(item.body)}</p>
              <small>${api.formatDate(item.date, { year: true })}</small>
            </div>
            ${teacherMode ? `<div class="row-actions"><button class="btn btn-soft" data-action="toggle-pin-announcement" data-id="${item.id}">${item.pinned ? 'Losmaken' : 'Vastzetten'}</button><button class="icon-small danger" data-action="delete-announcement" data-id="${item.id}">×</button></div>` : ''}
          </article>
        `).join('')}
      </div>
    `;
  }

  function announcementsTeacher(api) {
    return announcements(api, true);
  }

  function messages(api) {
    const { state, escapeHtml } = api;
    const selected = state.messages.find((x) => x.id === state.selectedConversation) || state.messages[0];
    return `
      ${api.pageHeader('Berichten', 'Communiceer binnen het schoolportaal.', '<button class="btn btn-primary" data-action="new-conversation">＋ Nieuw bericht</button>')}
      <section class="messenger panel reveal">
        <aside class="conversation-list">
          <div class="conversation-search"><input placeholder="Zoek gesprek..." data-action-input="conversation-search"></div>
          ${state.messages.map((conv) => {
            const last = conv.messages[conv.messages.length - 1];
            return `
              <button class="conversation ${conv.id === selected.id ? 'active' : ''}" data-action="select-conversation" data-id="${conv.id}" data-searchable>
                <span class="conversation-avatar">${escapeHtml(conv.contact.split(' ').map((p) => p[0]).slice(-2).join(''))}</span>
                <span class="conversation-main"><strong>${escapeHtml(conv.contact)}${conv.unread ? '<i></i>' : ''}</strong><small>${escapeHtml(last?.text || '')}</small></span>
                <time>${escapeHtml(conv.updated)}</time>
              </button>
            `;
          }).join('')}
        </aside>
        <div class="chat-panel">
          <header class="chat-header"><div class="conversation-avatar large">${escapeHtml(selected.contact[0])}</div><div><strong>${escapeHtml(selected.contact)}</strong><span>${escapeHtml(selected.role)}</span></div></header>
          <div class="chat-messages">
            ${selected.messages.map((msg) => `<div class="chat-bubble ${msg.mine ? 'mine' : ''}"><p>${escapeHtml(msg.text)}</p><small>${escapeHtml(msg.time)}</small></div>`).join('')}
          </div>
          <div class="chat-composer"><textarea id="messageComposer" rows="1" placeholder="Typ een bericht..."></textarea><button class="btn btn-primary" data-action="send-message">Verstuur</button></div>
        </div>
      </section>
    `;
  }

  function files(api) {
    const { state, escapeHtml, badge } = api;
    const filter = state.filters.files;
    const list = filter === 'all' ? state.files : state.files.filter((x) => x.subject === filter);
    const subjects = ['all', ...new Set(state.files.map((x) => x.subject))];
    return `
      ${api.pageHeader('Bestanden', 'Lesmateriaal en lokaal opgeslagen demo-bestanden.', '<button class="btn btn-primary" data-action="new-file">＋ Bestand toevoegen</button>')}
      <div class="filter-bar reveal"><div class="chip-row">${subjects.map((subject) => `<button class="chip ${filter === subject ? 'active' : ''}" data-action="filter-files" data-value="${escapeHtml(subject)}">${subject === 'all' ? 'Alles' : escapeHtml(subject)}</button>`).join('')}</div></div>
      ${api.card('Bestanden', `
        <div class="file-grid">
          ${list.map((file) => `
            <div class="file-card" data-searchable>
              <span class="file-type type-${file.type.toLowerCase()}">${escapeHtml(file.type)}</span>
              <div><strong>${escapeHtml(file.name)}</strong><span>${escapeHtml(file.subject)} · ${escapeHtml(file.size)}</span><small>${api.formatDate(file.date, { short: true })}</small></div>
              <div class="row-actions"><button class="btn btn-soft" data-action="open-file" data-id="${file.id}">Open</button>${String(file.id).startsWith('file-') ? `<button class="icon-small danger" data-action="delete-file" data-id="${file.id}">×</button>` : ''}</div>
            </div>
          `).join('')}
        </div>
      `)}
    `;
  }

  function profile(api) {
    const { getProfile, state, escapeHtml } = api;
    const profile = getProfile();
    return `
      ${api.pageHeader('Profiel', 'Beheer je persoonlijke en schoolgegevens.')}
      <div class="dashboard-grid profile-layout">
        <section class="profile-card panel reveal">
          <div class="profile-cover"></div>
          <div class="profile-avatar-large">${profile.name.split(' ').map((x) => x[0]).slice(0, 2).join('')}</div>
          <h3>${escapeHtml(profile.name)}</h3>
          <p>${state.role === 'teacher' ? 'Docent Nederlands · Mentor 3M2' : `Leerling · ${escapeHtml(profile.className)}`}</p>
          <div class="profile-badges"><span>Delta College</span><span>2026–2027</span></div>
        </section>
        ${api.card('Persoonlijke gegevens', `
          <form class="form-grid" id="profileForm">
            <label><span>Naam</span><input name="name" value="${escapeHtml(profile.name)}"></label>
            <label><span>E-mail</span><input name="email" type="email" value="${escapeHtml(profile.email)}"></label>
            <label><span>${state.role === 'teacher' ? 'Mentorklas' : 'Klas'}</span><input name="className" value="${escapeHtml(profile.className)}"></label>
            <label><span>${state.role === 'teacher' ? 'Personeelsnummer' : 'Leerlingnummer'}</span><input value="${escapeHtml(profile.number)}" disabled></label>
            <label class="full"><span>Mentor / rol</span><input value="${escapeHtml(profile.mentor)}" disabled></label>
            <div class="full form-actions"><button type="button" class="btn btn-primary" data-action="save-profile">Wijzigingen opslaan</button></div>
          </form>
        `)}
      </div>
    `;
  }

  function settings(api) {
    const { state } = api;
    const s = state.settings;
    return `
      ${api.pageHeader('Instellingen', 'Pas weergave, meldingen en lokale data aan.')}
      <div class="settings-layout">
        ${api.card('Weergave', `
          <div class="setting-row"><div><strong>Donkere modus</strong><span>Gebruik een donker kleurenschema.</span></div><button class="toggle ${state.theme === 'dark' ? 'on' : ''}" data-action="toggle-theme"><i></i></button></div>
          <div class="setting-row"><div><strong>Compacte modus</strong><span>Minder witruimte tussen onderdelen.</span></div><button class="toggle ${s.compact ? 'on' : ''}" data-action="toggle-setting" data-setting="compact"><i></i></button></div>
          <div class="setting-row"><div><strong>Animaties</strong><span>Gebruik subtiele overgangen en effecten.</span></div><button class="toggle ${s.animations ? 'on' : ''}" data-action="toggle-setting" data-setting="animations"><i></i></button></div>
          <div class="setting-row"><div><strong>Verminder beweging</strong><span>Schakel grotere bewegingseffecten uit.</span></div><button class="toggle ${s.reducedMotion ? 'on' : ''}" data-action="toggle-setting" data-setting="reducedMotion"><i></i></button></div>
        `)}
        ${api.card('Meldingen', `
          <div class="setting-row"><div><strong>Portaalmeldingen</strong><span>Nieuwe cijfers, berichten en roosterwijzigingen.</span></div><button class="toggle ${s.notifications ? 'on' : ''}" data-action="toggle-setting" data-setting="notifications"><i></i></button></div>
          <div class="setting-row"><div><strong>E-mailmeldingen</strong><span>Demo-instelling; GitHub Pages verstuurt geen mail.</span></div><button class="toggle ${s.emailNotifications ? 'on' : ''}" data-action="toggle-setting" data-setting="emailNotifications"><i></i></button></div>
        `)}
        ${api.card('Accentkleur', `
          <div class="accent-picker">
            ${[['indigo','#5b5cf0'],['blue','#2f80ed'],['green','#1f9d73'],['purple','#8a56d8'],['orange','#d9822b']].map(([id, color]) => `<button class="accent-dot ${state.accent === id ? 'active' : ''}" style="--dot:${color}" data-action="set-accent" data-value="${id}" aria-label="${id}"></button>`).join('')}
          </div>
        `)}
        ${api.card('Lokale data', `
          <div class="data-actions"><button class="btn btn-soft" data-action="export-data">Backup downloaden</button><label class="btn btn-soft upload-label">Backup importeren<input type="file" accept="application/json" data-action-file="import-data"></label><button class="btn btn-danger" data-action="reset-data">Demo-data resetten</button></div>
          <p class="help-text">Deze GitHub Pages-versie bewaart data alleen in je browser. Een echte schooldatabase vereist later een externe backend.</p>
        `)}
      </div>
    `;
  }

  function classes(api) {
    const classes = [
      { name: '3M2', students: 26, subject: 'Mentorklas', average: 7.2, attendance: 96 },
      { name: '2K1', students: 25, subject: 'Nederlands', average: 6.8, attendance: 95 },
      { name: '3M1', students: 27, subject: 'Nederlands', average: 7.0, attendance: 97 },
      { name: '4M2', students: 24, subject: 'Nederlands', average: 6.9, attendance: 94 }
    ];
    return `
      ${api.pageHeader('Klassen', 'Bekijk klassen, leerlingaantallen en voortgang.')}
      <div class="cards-grid two-col">
        ${classes.map((item) => `
          <section class="class-card panel reveal" data-searchable>
            <div class="class-card-head"><div><span class="class-code">${item.name}</span><h3>${item.subject}</h3></div>${api.badge('Actief', 'green')}</div>
            <div class="class-stats"><div><strong>${item.students}</strong><span>leerlingen</span></div><div><strong>${api.formatNumber(item.average)}</strong><span>gemiddeld</span></div><div><strong>${item.attendance}%</strong><span>aanwezig</span></div></div>
            <div class="class-actions"><button class="btn btn-soft" data-action="open-class" data-class="${item.name}">Open klas</button><button class="btn btn-soft" data-page="attendanceTeacher">Aanwezigheid</button></div>
          </section>
        `).join('')}
      </div>
    `;
  }

  function attendanceTeacher(api) {
    const { DATA, state, escapeHtml } = api;
    const className = state.selectedClass || '3M2';
    return `
      ${api.pageHeader('Aanwezigheid', `${className} · Nederlands · 08:30–09:20`, '<button class="btn btn-primary" data-action="save-attendance">Registratie opslaan</button>')}
      <div class="attendance-toolbar reveal"><select id="attendanceClass"><option>3M2</option><option>2K1</option><option>3M1</option><option>4M2</option></select><span>${DATA.students.length} leerlingen</span><button class="btn btn-soft" data-action="mark-all-present">Iedereen aanwezig</button></div>
      ${api.card('Leerlingen', `
        <div class="table-wrap"><table class="data-table attendance-table"><thead><tr><th>Leerling</th><th>Nummer</th><th>Status</th><th>Opmerking</th></tr></thead><tbody>
          ${DATA.students.map((student) => {
            const value = state.attendance[student.id] || 'present';
            return `<tr data-searchable><td><div class="student-cell"><span class="mini-avatar">${escapeHtml(student.name.split(' ').map((x) => x[0]).slice(0,2).join(''))}</span><strong>${escapeHtml(student.name)}</strong></div></td><td>${student.id}</td><td><div class="presence-control" data-student="${student.id}"><button class="${value === 'present' ? 'active present' : ''}" data-action="attendance-status" data-value="present" data-id="${student.id}">Aanwezig</button><button class="${value === 'late' ? 'active late' : ''}" data-action="attendance-status" data-value="late" data-id="${student.id}">Te laat</button><button class="${value === 'absent' ? 'active absent' : ''}" data-action="attendance-status" data-value="absent" data-id="${student.id}">Afwezig</button></div></td><td><input class="table-input" placeholder="Optioneel"></td></tr>`;
          }).join('')}
        </tbody></table></div>
      `)}
    `;
  }

  function assignments(api) {
    const { state, escapeHtml, badge } = api;
    return `
      ${api.pageHeader('Opdrachten', 'Maak opdrachten en volg de inleverstatus.', '<button class="btn btn-primary" data-action="new-assignment">＋ Nieuwe opdracht</button>')}
      <div class="cards-grid three-col">
        ${state.assignments.map((item) => {
          const percent = Math.round((item.submitted / item.total) * 100);
          return `<section class="assignment-card panel reveal" data-searchable><div class="assignment-top"><div>${badge(item.className, 'soft')} ${badge(item.published ? 'Gepubliceerd' : 'Concept', item.published ? 'green' : 'yellow')}</div><button class="icon-small danger" data-action="delete-assignment" data-id="${item.id}">×</button></div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.subject)}</p><div class="assignment-progress"><div><span>Ingeleverd</span><strong>${item.submitted}/${item.total}</strong></div><div class="progress"><i style="width:${percent}%"></i></div></div><small>Deadline ${api.formatDate(item.due)}</small><div class="assignment-actions"><button class="btn btn-soft" data-action="review-assignment" data-id="${item.id}">Nakijken</button><button class="btn btn-soft" data-action="toggle-publish-assignment" data-id="${item.id}">${item.published ? 'Depubliceren' : 'Publiceren'}</button></div></section>`;
        }).join('')}
      </div>
    `;
  }

  function gradeEntry(api) {
    const { state, escapeHtml, formatNumber } = api;
    return `
      ${api.pageHeader('Cijfers invoeren', 'Voeg cijfers toe en beheer recente invoer.', '<button class="btn btn-primary" data-action="new-grade">＋ Nieuw cijfer</button>')}
      <div class="dashboard-grid two-col">
        ${api.card('Snel invoeren', `
          <form id="quickGradeForm" class="form-grid">
            <label><span>Vak</span><select name="subject">${api.DATA.subjects.map((x) => `<option>${escapeHtml(x.name)}</option>`).join('')}</select></label>
            <label><span>Onderdeel</span><input name="title" value="Leesvaardigheid"></label>
            <label><span>Cijfer</span><input name="grade" type="number" min="1" max="10" step="0.1" value="7.5"></label>
            <label><span>Weging</span><input name="weight" type="number" min="1" max="5" value="1"></label>
            <label><span>Klas</span><select name="className"><option>3M2</option><option>2K1</option><option>3M1</option><option>4M2</option></select></label>
            <label><span>Datum</span><input name="date" type="date" value="2026-08-26"></label>
            <div class="full form-actions"><button type="button" class="btn btn-primary" data-action="save-quick-grade">Cijfer opslaan</button></div>
          </form>
        `)}
        ${api.card('Recente invoer', `
          <div class="grade-list">
            ${state.grades.slice(0, 8).map((grade) => `<div class="grade-row" data-searchable><div><strong>${escapeHtml(grade.subject)}</strong><span>${escapeHtml(grade.title)} · ×${grade.weight}</span></div><span class="grade-pill ${grade.grade >= 7.5 ? 'good' : grade.grade < 5.5 ? 'bad' : ''}">${formatNumber(grade.grade)}</span><button class="icon-small danger" data-action="delete-grade" data-id="${grade.id}">×</button></div>`).join('')}
          </div>
        `)}
      </div>
    `;
  }

  function mentor(api) {
    const { DATA, state, escapeHtml } = api;
    return `
      ${api.pageHeader('Mentorklas 3M2', 'Resultaten, aanwezigheid en mentoropmerkingen.')}
      <div class="stats-grid reveal">${api.statCard('Leerlingen','26','Mentorklas','primary')}${api.statCard('Gemiddelde','7,2','Klasgemiddelde','success')}${api.statCard('Aanwezigheid','96%','Deze periode','info')}${api.statCard('Aandachtspunten','2','Deze week','warning')}</div>
      <div class="dashboard-grid mentor-layout">
        ${api.card('Leerlingen', `<div class="mentor-student-list">${DATA.students.map((student, index) => `<button class="mentor-student" data-action="student-details" data-id="${student.id}" data-searchable><span class="mini-avatar">${escapeHtml(student.name.split(' ').map((x) => x[0]).slice(0,2).join(''))}</span><div><strong>${escapeHtml(student.name)}</strong><small>${index % 7 === 0 ? 'Aandachtspunt · 2 absenties' : 'Geen bijzonderheden'}</small></div><span class="grade-pill ${index % 7 === 0 ? 'bad' : 'good'}">${api.formatNumber(index % 7 === 0 ? 5.4 : 6.8 + ((index % 9) / 10))}</span></button>`).join('')}</div>`)}
        ${api.card('Mentornotities', `<div class="note-list">${state.teacherNotes.length ? state.teacherNotes.map((note) => `<div class="note-row"><strong>${escapeHtml(note.student)}</strong><p>${escapeHtml(note.text)}</p><small>${escapeHtml(note.date)}</small></div>`).join('') : api.emptyState('◇','Nog geen notities','Voeg een mentoropmerking toe bij een leerling.')}</div>`, '<button class="link-button" data-action="new-mentor-note">＋ Notitie</button>')}
      </div>
    `;
  }

  return {
    dashboard,
    dashboardTeacher,
    schedule,
    scheduleTeacher,
    homework,
    tests,
    grades,
    attendanceStudent,
    subjects,
    announcements,
    announcementsTeacher,
    messages,
    files,
    profile,
    settings,
    classes,
    attendanceTeacher,
    assignments,
    gradeEntry,
    mentor
  };
})();
