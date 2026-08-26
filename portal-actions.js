/* SchoolPortal v2 - Interactive actions */
window.SchoolPortalActions = (() => {
  function getId(button) {
    const raw = button.dataset.id;
    const num = Number(raw);
    return Number.isNaN(num) ? raw : num;
  }

  function field(root, selector) {
    return root.querySelector(selector)?.value?.trim?.() ?? '';
  }

  function modalForm(api, config) {
    api.openModal(config);
  }

  const actions = {
    'toggle-homework'(api, button) {
      const id = getId(button);
      const item = api.state.homework.find((x) => x.id === id);
      if (!item) return;
      item.done = !item.done;
      api.addActivity('homework', `${item.done ? 'Huiswerk afgerond' : 'Huiswerk heropend'}: ${item.title}`);
      api.saveState();
      api.render();
      api.toast(item.done ? 'Taak afgerond' : 'Taak opnieuw geopend', 'success');
    },

    'filter-homework'(api, button) {
      api.state.filters.homework = button.dataset.value;
      api.saveState();
      api.render();
    },

    'new-homework'(api) {
      modalForm(api, {
        title: 'Huiswerk toevoegen',
        confirmText: 'Toevoegen',
        body: `
          <div class="form-grid">
            <label><span>Vak</span><select id="hwSubject">${api.DATA.subjects.map((x) => `<option>${api.escapeHtml(x.name)}</option>`).join('')}</select></label>
            <label><span>Deadline</span><input id="hwDue" type="date" value="2026-08-28"></label>
            <label class="full"><span>Taak</span><input id="hwTitle" placeholder="Bijv. Maak opdracht 1 t/m 8"></label>
            <label><span>Prioriteit</span><select id="hwPriority"><option value="low">Laag</option><option value="medium" selected>Normaal</option><option value="high">Hoog</option></select></label>
            <label class="full"><span>Omschrijving</span><textarea id="hwDescription" rows="4" placeholder="Optionele toelichting"></textarea></label>
          </div>
        `,
        onConfirm(root) {
          const title = field(root, '#hwTitle');
          if (!title) {
            api.toast('Vul een taak in', 'error');
            return false;
          }
          api.state.homework.unshift({
            id: api.uid('homework'),
            subject: field(root, '#hwSubject'),
            title,
            due: field(root, '#hwDue') || '2026-08-28',
            priority: field(root, '#hwPriority') || 'medium',
            done: false,
            description: field(root, '#hwDescription')
          });
          api.addActivity('homework', `Nieuw huiswerk: ${title}`);
          api.saveState();
          api.render();
          api.toast('Huiswerk toegevoegd', 'success');
        }
      });
    },

    async 'delete-homework'(api, button) {
      const id = getId(button);
      const item = api.state.homework.find((x) => x.id === id);
      if (!item) return;
      if (!await api.confirmDialog('Huiswerk verwijderen', `Wil je “${item.title}” verwijderen?`, 'Verwijderen')) return;
      api.state.homework = api.state.homework.filter((x) => x.id !== id);
      api.saveState();
      api.render();
      api.toast('Huiswerk verwijderd', 'success');
    },

    'new-test'(api) {
      modalForm(api, {
        title: 'Toets toevoegen',
        confirmText: 'Toevoegen',
        body: `
          <div class="form-grid">
            <label><span>Vak</span><select id="testSubject">${api.DATA.subjects.map((x) => `<option>${api.escapeHtml(x.name)}</option>`).join('')}</select></label>
            <label><span>Datum</span><input id="testDate" type="date" value="2026-09-03"></label>
            <label class="full"><span>Naam toets</span><input id="testTitle" placeholder="Bijv. Toets hoofdstuk 4"></label>
            <label><span>Weging</span><input id="testWeight" type="number" min="1" max="5" value="1"></label>
            <label><span>Lokaal</span><input id="testRoom" value="A2.08"></label>
          </div>
        `,
        onConfirm(root) {
          const title = field(root, '#testTitle');
          if (!title) return api.toast('Vul een toetsnaam in', 'error'), false;
          api.state.tests.push({
            id: api.uid('test'),
            subject: field(root, '#testSubject'),
            title,
            date: field(root, '#testDate') || '2026-09-03',
            weight: Number(field(root, '#testWeight')) || 1,
            room: field(root, '#testRoom') || '-',
            reminder: false
          });
          api.saveState();
          api.render();
          api.toast('Toets toegevoegd', 'success');
        }
      });
    },

    'toggle-reminder'(api, button) {
      const item = api.state.tests.find((x) => x.id === getId(button));
      if (!item) return;
      item.reminder = !item.reminder;
      api.saveState();
      api.render();
      api.toast(item.reminder ? 'Herinnering ingeschakeld' : 'Herinnering uitgeschakeld', 'success');
    },

    async 'delete-test'(api, button) {
      const id = getId(button);
      if (!await api.confirmDialog('Toets verwijderen', 'Deze toets uit je lokale demo verwijderen?', 'Verwijderen')) return;
      api.state.tests = api.state.tests.filter((x) => x.id !== id);
      api.saveState();
      api.render();
    },

    'lesson-details'(api, button) {
      const lesson = api.DATA.schedule.find((x) => x.id === getId(button));
      if (!lesson) return;
      api.openModal({
        title: lesson.subject,
        body: `
          <div class="detail-grid">
            <div><span>Tijd</span><strong>${lesson.start} – ${lesson.end}</strong></div>
            <div><span>Lokaal</span><strong>${lesson.room}</strong></div>
            <div><span>Docent</span><strong>${api.escapeHtml(lesson.teacher)}</strong></div>
            <div><span>Klas</span><strong>${lesson.className}</strong></div>
            <div><span>Status</span><strong>${lesson.status === 'normal' ? 'Normaal' : lesson.status === 'changed' ? 'Gewijzigd' : 'Uitval'}</strong></div>
          </div>
        `
      });
    },

    'week-prev'(api) {
      api.state.weekOffset -= 1;
      api.saveState();
      api.toast('Vorige week geselecteerd', 'info');
    },

    'week-next'(api) {
      api.state.weekOffset += 1;
      api.saveState();
      api.toast('Volgende week geselecteerd', 'info');
    },

    'new-absence'(api) {
      modalForm(api, {
        title: 'Ziekmelding',
        confirmText: 'Melden',
        body: `
          <div class="form-grid">
            <label><span>Vanaf</span><input id="absenceDate" type="date" value="2026-08-26"></label>
            <label><span>Tot en met</span><input id="absenceUntil" type="date" value="2026-08-26"></label>
            <label class="full"><span>Toelichting</span><textarea id="absenceNote" rows="4" placeholder="Optioneel"></textarea></label>
          </div>
        `,
        onConfirm(root) {
          const date = field(root, '#absenceDate');
          api.state.absences.unshift({
            id: api.uid('absence'),
            type: 'sick',
            subject: 'Ziekmelding',
            date: date || '2026-08-26',
            detail: field(root, '#absenceNote') || `Tot ${field(root, '#absenceUntil') || date}`,
            approved: false
          });
          api.saveState();
          api.render();
          api.toast('Ziekmelding lokaal opgeslagen', 'success');
        }
      });
    },

    async 'delete-absence'(api, button) {
      const id = getId(button);
      if (!await api.confirmDialog('Ziekmelding verwijderen', 'Wil je deze lokale ziekmelding verwijderen?', 'Verwijderen')) return;
      api.state.absences = api.state.absences.filter((x) => x.id !== id);
      api.saveState();
      api.render();
    },

    'subject-details'(api, button) {
      const subject = api.DATA.subjects.find((x) => x.name === button.dataset.subject);
      if (!subject) return;
      const grades = api.state.grades.filter((x) => x.subject === subject.name);
      api.openModal({
        title: subject.name,
        wide: true,
        body: `
          <div class="subject-modal-head" style="--subject:${subject.color}">
            <div><span>${subject.code}</span><h3>${api.escapeHtml(subject.name)}</h3><p>${api.escapeHtml(subject.teacher)} · ${subject.room}</p></div>
            <strong>${api.subjectAverage(subject.name) ? api.formatNumber(api.subjectAverage(subject.name)) : '-'}</strong>
          </div>
          <div class="detail-section"><h4>Recente cijfers</h4>${grades.length ? grades.map((g) => `<div class="simple-row"><span>${api.escapeHtml(g.title)}</span><strong>${api.formatNumber(g.grade)}</strong></div>`).join('') : '<p>Geen cijfers.</p>'}</div>
        `
      });
    },

    'select-conversation'(api, button) {
      api.state.selectedConversation = getId(button);
      const conversation = api.state.messages.find((x) => x.id === api.state.selectedConversation);
      if (conversation) conversation.unread = false;
      api.saveState();
      api.render();
    },

    'send-message'(api) {
      const textarea = document.querySelector('#messageComposer');
      const text = textarea?.value.trim();
      if (!text) return api.toast('Typ eerst een bericht', 'error');
      const conversation = api.state.messages.find((x) => x.id === api.state.selectedConversation) || api.state.messages[0];
      conversation.messages.push({ id: api.uid('msg'), mine: true, text, time: 'Nu' });
      conversation.updated = 'Nu';
      api.addActivity('message', `Bericht verstuurd naar ${conversation.contact}`);
      api.saveState();
      api.render();
      api.toast('Bericht lokaal toegevoegd', 'success');
    },

    'new-conversation'(api) {
      modalForm(api, {
        title: 'Nieuw bericht',
        confirmText: 'Gesprek starten',
        body: `
          <div class="form-grid">
            <label class="full"><span>Ontvanger</span><input id="convContact" placeholder="Naam ontvanger"></label>
            <label class="full"><span>Rol</span><input id="convRole" placeholder="Bijv. Docent"></label>
            <label class="full"><span>Bericht</span><textarea id="convMessage" rows="5"></textarea></label>
          </div>
        `,
        onConfirm(root) {
          const contact = field(root, '#convContact');
          const text = field(root, '#convMessage');
          if (!contact || !text) return api.toast('Vul ontvanger en bericht in', 'error'), false;
          const id = api.uid('conversation');
          api.state.messages.unshift({ id, contact, role: field(root, '#convRole') || 'SchoolPortal', unread: false, updated: 'Nu', messages: [{ id: api.uid('msg'), mine: true, text, time: 'Nu' }] });
          api.state.selectedConversation = id;
          api.saveState();
          api.render();
          api.toast('Gesprek aangemaakt', 'success');
        }
      });
    },

    'filter-files'(api, button) {
      api.state.filters.files = button.dataset.value;
      api.saveState();
      api.render();
    },

    'new-file'(api) {
      modalForm(api, {
        title: 'Bestand toevoegen',
        confirmText: 'Toevoegen',
        body: `
          <p class="help-text">GitHub Pages kan geen echte privébestanden uploaden. Dit maakt daarom een lokaal demo-bestandsitem.</p>
          <div class="form-grid">
            <label class="full"><span>Naam</span><input id="fileName" placeholder="Bijv. Samenvatting hoofdstuk 3"></label>
            <label><span>Type</span><select id="fileType"><option>PDF</option><option>DOC</option><option>PPT</option><option>IMG</option></select></label>
            <label><span>Vak</span><select id="fileSubject">${api.DATA.subjects.map((x) => `<option>${api.escapeHtml(x.name)}</option>`).join('')}<option>School</option></select></label>
          </div>
        `,
        onConfirm(root) {
          const name = field(root, '#fileName');
          if (!name) return api.toast('Vul een bestandsnaam in', 'error'), false;
          api.state.files.unshift({ id: api.uid('file'), type: field(root, '#fileType'), name, subject: field(root, '#fileSubject'), size: 'Lokaal', date: '2026-08-26' });
          api.saveState();
          api.render();
          api.toast('Demo-bestand toegevoegd', 'success');
        }
      });
    },

    'open-file'(api, button) {
      const file = api.state.files.find((x) => x.id === getId(button));
      if (!file) return;
      api.openModal({ title: file.name, body: `<div class="file-preview"><span class="file-preview-icon">${api.escapeHtml(file.type)}</span><h3>${api.escapeHtml(file.name)}</h3><p>${api.escapeHtml(file.subject)} · ${api.escapeHtml(file.size)}</p><p class="help-text">Dit is een statische GitHub Pages-demo, dus er staat geen echt privébestand achter deze kaart.</p></div>` });
    },

    async 'delete-file'(api, button) {
      const id = getId(button);
      if (!await api.confirmDialog('Bestand verwijderen', 'Dit lokale demo-bestand verwijderen?', 'Verwijderen')) return;
      api.state.files = api.state.files.filter((x) => x.id !== id);
      api.saveState();
      api.render();
    },

    'save-profile'(api) {
      const form = document.querySelector('#profileForm');
      if (!form) return;
      const data = new FormData(form);
      const profile = api.state.role === 'teacher' ? api.state.profile.teacher : api.state.profile.student;
      profile.name = String(data.get('name') || profile.name).trim();
      profile.email = String(data.get('email') || profile.email).trim();
      profile.className = String(data.get('className') || profile.className).trim();
      api.saveState();
      api.render();
      api.toast('Profiel opgeslagen', 'success');
    },

    'toggle-theme'(api) {
      api.setTheme(api.state.theme === 'dark' ? 'light' : 'dark');
      api.render();
    },

    'toggle-setting'(api, button) {
      const key = button.dataset.setting;
      api.state.settings[key] = !api.state.settings[key];
      api.saveState();
      api.render();
    },

    'set-accent'(api, button) {
      api.state.accent = button.dataset.value;
      api.saveState();
      api.render();
      api.toast('Accentkleur aangepast', 'success');
    },

    'export-data'(api) {
      api.downloadJson();
    },

    async 'reset-data'(api) {
      if (!await api.confirmDialog('Demo-data resetten', 'Alle lokale wijzigingen worden verwijderd. Doorgaan?', 'Alles resetten')) return;
      api.resetState();
    },

    'open-class'(api, button) {
      api.state.selectedClass = button.dataset.class;
      api.state.activePage = 'attendanceTeacher';
      api.saveState();
      api.render();
    },

    'attendance-status'(api, button) {
      const id = getId(button);
      api.state.attendance[id] = button.dataset.value;
      api.saveState();
      api.render();
    },

    'mark-all-present'(api) {
      api.DATA.students.forEach((student) => { api.state.attendance[student.id] = 'present'; });
      api.saveState();
      api.render();
      api.toast('Iedereen op aanwezig gezet', 'success');
    },

    'save-attendance'(api) {
      api.addActivity('attendance', 'Aanwezigheid 3M2 opgeslagen');
      api.saveState();
      api.toast('Aanwezigheid lokaal opgeslagen', 'success');
    },

    'new-assignment'(api) {
      modalForm(api, {
        title: 'Nieuwe opdracht',
        confirmText: 'Opdracht maken',
        wide: true,
        body: `
          <div class="form-grid">
            <label class="full"><span>Titel</span><input id="assignmentTitle" placeholder="Bijv. Boekverslag"></label>
            <label><span>Klas</span><select id="assignmentClass"><option>3M2</option><option>2K1</option><option>3M1</option><option>4M2</option></select></label>
            <label><span>Vak</span><select id="assignmentSubject">${api.DATA.subjects.map((x) => `<option>${api.escapeHtml(x.name)}</option>`).join('')}</select></label>
            <label><span>Deadline</span><input id="assignmentDue" type="date" value="2026-09-04"></label>
            <label><span>Publiceren</span><select id="assignmentPublished"><option value="true">Direct publiceren</option><option value="false">Als concept</option></select></label>
            <label class="full"><span>Beschrijving</span><textarea rows="6" placeholder="Opdrachtomschrijving"></textarea></label>
          </div>
        `,
        onConfirm(root) {
          const title = field(root, '#assignmentTitle');
          if (!title) return api.toast('Vul een titel in', 'error'), false;
          api.state.assignments.unshift({ id: api.uid('assignment'), title, className: field(root, '#assignmentClass'), subject: field(root, '#assignmentSubject'), due: field(root, '#assignmentDue'), submitted: 0, total: 26, published: field(root, '#assignmentPublished') === 'true' });
          api.saveState();
          api.state.activePage = 'assignments';
          api.render();
          api.toast('Opdracht aangemaakt', 'success');
        }
      });
    },

    async 'delete-assignment'(api, button) {
      const id = getId(button);
      if (!await api.confirmDialog('Opdracht verwijderen', 'Deze opdracht verwijderen?', 'Verwijderen')) return;
      api.state.assignments = api.state.assignments.filter((x) => x.id !== id);
      api.saveState();
      api.render();
    },

    'toggle-publish-assignment'(api, button) {
      const item = api.state.assignments.find((x) => x.id === getId(button));
      if (!item) return;
      item.published = !item.published;
      api.saveState();
      api.render();
      api.toast(item.published ? 'Opdracht gepubliceerd' : 'Opdracht als concept opgeslagen', 'success');
    },

    'review-assignment'(api, button) {
      const item = api.state.assignments.find((x) => x.id === getId(button));
      if (!item) return;
      const submitted = api.DATA.students.slice(0, item.submitted);
      api.openModal({
        title: `Nakijken · ${item.title}`,
        wide: true,
        body: `<div class="review-list">${submitted.length ? submitted.map((student, index) => `<div class="review-row"><span class="mini-avatar">${student.name.split(' ').map((x) => x[0]).slice(0,2).join('')}</span><div><strong>${api.escapeHtml(student.name)}</strong><small>Ingeleverd ${index % 3 === 0 ? 'gisteren' : 'vandaag'}</small></div><button class="btn btn-soft" type="button">Open</button></div>`).join('') : api.emptyState('▤','Nog niets ingeleverd','Er zijn nog geen inzendingen voor deze opdracht.')}</div>`
      });
    },

    'save-quick-grade'(api) {
      const form = document.querySelector('#quickGradeForm');
      if (!form) return;
      const data = new FormData(form);
      const grade = Number(data.get('grade'));
      if (!grade || grade < 1 || grade > 10) return api.toast('Vul een geldig cijfer tussen 1 en 10 in', 'error');
      api.state.grades.unshift({ id: api.uid('grade'), subject: String(data.get('subject')), title: String(data.get('title') || 'Onderdeel'), grade, weight: Number(data.get('weight')) || 1, date: String(data.get('date') || '2026-08-26'), period: 1, className: String(data.get('className') || '3M2') });
      api.addActivity('grade', `Nieuw cijfer ${api.formatNumber(grade)} voor ${data.get('subject')}`);
      api.saveState();
      api.render();
      api.toast('Cijfer opgeslagen', 'success');
    },

    'new-grade'(api) {
      api.state.activePage = 'gradeEntry';
      api.saveState();
      api.render();
      setTimeout(() => document.querySelector('#quickGradeForm input[name="grade"]')?.focus(), 0);
    },

    async 'delete-grade'(api, button) {
      const id = getId(button);
      if (!await api.confirmDialog('Cijfer verwijderen', 'Dit cijfer uit de lokale demo verwijderen?', 'Verwijderen')) return;
      api.state.grades = api.state.grades.filter((x) => x.id !== id);
      api.saveState();
      api.render();
    },

    'new-announcement'(api) {
      modalForm(api, {
        title: 'Nieuwe mededeling',
        confirmText: 'Publiceren',
        body: `
          <div class="form-grid">
            <label class="full"><span>Titel</span><input id="annTitle"></label>
            <label><span>Doelgroep</span><select id="annAudience"><option>Iedereen</option><option>Leerlingen</option><option>Docenten</option><option>3M2</option></select></label>
            <label><span>Vastzetten</span><select id="annPinned"><option value="false">Nee</option><option value="true">Ja</option></select></label>
            <label class="full"><span>Bericht</span><textarea id="annBody" rows="6"></textarea></label>
          </div>
        `,
        onConfirm(root) {
          const title = field(root, '#annTitle');
          const body = field(root, '#annBody');
          if (!title || !body) return api.toast('Vul titel en bericht in', 'error'), false;
          api.state.announcements.unshift({ id: api.uid('announcement'), title, body, audience: field(root, '#annAudience'), date: '2026-08-26', pinned: field(root, '#annPinned') === 'true' });
          api.saveState();
          api.render();
          api.toast('Mededeling gepubliceerd', 'success');
        }
      });
    },

    'toggle-pin-announcement'(api, button) {
      const item = api.state.announcements.find((x) => x.id === getId(button));
      if (!item) return;
      item.pinned = !item.pinned;
      api.saveState();
      api.render();
    },

    async 'delete-announcement'(api, button) {
      const id = getId(button);
      if (!await api.confirmDialog('Mededeling verwijderen', 'Deze mededeling verwijderen?', 'Verwijderen')) return;
      api.state.announcements = api.state.announcements.filter((x) => x.id !== id);
      api.saveState();
      api.render();
    },

    'student-details'(api, button) {
      const student = api.DATA.students.find((x) => x.id === getId(button));
      if (!student) return;
      api.openModal({
        title: student.name,
        wide: true,
        body: `
          <div class="student-detail-head"><span class="profile-avatar-large small">${student.name.split(' ').map((x) => x[0]).slice(0,2).join('')}</span><div><h3>${api.escapeHtml(student.name)}</h3><p>${student.id} · ${student.className}</p></div></div>
          <div class="detail-grid"><div><span>Gemiddelde</span><strong>7,1</strong></div><div><span>Aanwezigheid</span><strong>96%</strong></div><div><span>Mentor</span><strong>${api.escapeHtml(student.mentor)}</strong></div><div><span>E-mail</span><strong>${api.escapeHtml(student.email)}</strong></div></div>
        `
      });
    },

    'new-mentor-note'(api) {
      modalForm(api, {
        title: 'Mentornotitie',
        confirmText: 'Opslaan',
        body: `
          <div class="form-grid">
            <label class="full"><span>Leerling</span><select id="noteStudent">${api.DATA.students.map((s) => `<option>${api.escapeHtml(s.name)}</option>`).join('')}</select></label>
            <label class="full"><span>Notitie</span><textarea id="noteText" rows="6"></textarea></label>
          </div>
        `,
        onConfirm(root) {
          const text = field(root, '#noteText');
          if (!text) return api.toast('Vul een notitie in', 'error'), false;
          api.state.teacherNotes.unshift({ id: api.uid('note'), student: field(root, '#noteStudent'), text, date: '26 augustus 2026' });
          api.saveState();
          api.render();
          api.toast('Mentornotitie opgeslagen', 'success');
        }
      });
    }
  };

  document.addEventListener('change', (event) => {
    if (event.target.matches('[data-action-file="import-data"]')) {
      window.SchoolPortal?.api().importJson(event.target.files?.[0]);
    }
    if (event.target.id === 'attendanceClass') {
      const api = window.SchoolPortal?.api();
      if (api) {
        api.state.selectedClass = event.target.value;
        api.saveState();
        api.render();
      }
    }
  });

  return actions;
})();
