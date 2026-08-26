/* SchoolPortal V3 — advanced teacher workspace */
(() => {
  const SP=window.SP, U=SP.ui;
  const {esc,dateNL,studentName,className,weightedAverage,attendanceCounts,badge,empty,pageHead,sectionHead,stat}=U;

  const navGroups=[
    {label:'Werkdag',items:[
      {id:'today',label:'Vandaag',icon:'dashboard'},
      {id:'schedule',label:'Roosterbeheer',icon:'schedule'},
      {id:'lessons',label:'Lessen',icon:'lessons'}
    ]},
    {label:'Leerlingen',items:[
      {id:'classes',label:'Klassen',icon:'classes'},
      {id:'students',label:'Leerlingen',icon:'students'},
      {id:'attendance',label:'Presentie',icon:'attendance'},
      {id:'grades',label:'Resultaten',icon:'grades'},
      {id:'mentor',label:'Mentoraat',icon:'mentor'},
      {id:'notes',label:'Notitieboek',icon:'notes'}
    ]},
    {label:'Onderwijs',items:[
      {id:'tests',label:'Toetsen',icon:'tests'},
      {id:'assignments',label:'Opdrachten',icon:'assignments'},
      {id:'guides',label:'Studiewijzers',icon:'guide'},
      {id:'reports',label:'Rapportages',icon:'reports'}
    ]},
    {label:'School',items:[
      {id:'communication',label:'Communicatie',icon:'communication'},
      {id:'files',label:'Bestanden',icon:'files'},
      {id:'admin',label:'Administratie',icon:'admin'},
      {id:'settings',label:'Instellingen',icon:'settings'}
    ]}
  ];

  function shell(){
    const p=SP.state.profile.teacher;
    return `<div class="teacher-app ${SP.state.settings.teacherDenseTables?'dense':''}">
      <aside class="teacher-rail">
        <div class="teacher-brand"><span class="teacher-logo">S</span><div><strong>SchoolPortal</strong><small>DOCENT</small></div></div>
        <button class="teacher-school"><span class="school-icon">D</span><span><strong>Delta College</strong><small>2026–2027</small></span><i>⌄</i></button>
        <nav class="teacher-nav">${navGroups.map(group=>`<div class="teacher-nav-group"><span class="teacher-nav-label">${esc(group.label)}</span>${group.items.map(item=>`<button class="teacher-nav-item ${SP.state.teacherPage===item.id?'active':''}" data-teacher-page="${item.id}"><span class="teacher-nav-icon">${U.icon(item.icon)}</span><span>${esc(item.label)}</span></button>`).join('')}</div>`).join('')}</nav>
        <div class="teacher-rail-bottom"><button class="teacher-profile" data-teacher-menu><span class="teacher-avatar">${esc(p.initials)}</span><span><strong>${esc(p.name)}</strong><small>${esc(p.subject)}</small></span><i>•••</i></button></div>
      </aside>
      <section class="teacher-workspace">
        <header class="teacher-topbar"><div class="teacher-top-left"><button class="teacher-mobile-menu" data-teacher-mobile>☰</button><button class="teacher-command" data-command><span>⌕</span><span>Zoek leerling, klas of functie</span><kbd>Ctrl K</kbd></button></div><div class="teacher-top-actions"><button class="top-action" data-quick-create>＋ <span>Nieuw</span></button><button class="top-icon" data-notifications>●</button><button class="top-icon" data-teacher-theme>${SP.state.theme==='dark'?'☀':'☾'}</button><button class="top-switch" data-switch-role="student">Leerlingweergave ↗</button></div></header>
        <main class="teacher-main"><div id="teacherView"></div></main>
      </section>
      <button class="teacher-scrim" data-teacher-scrim></button>
    </div>`;
  }

  function today(){
    const lessons=U.scheduleForTeacher().filter(l=>l.day===3).sort((a,b)=>a.start.localeCompare(b.start));
    const pendingLessons=lessons.filter(l=>l.type==='lesson').length;
    const mentorStudents=SP.state.students.filter(s=>s.mentor===SP.state.profile.teacher.name);
    const flagged=mentorStudents.filter(s=>s.tags?.length);
    return `<div class="teacher-page">
      <div class="teacher-welcome"><div><span class="teacher-eyebrow">WOENSDAG 26 AUGUSTUS · WEEK 35</span><h1>Goedemorgen, ${esc(SP.state.profile.teacher.name)}</h1><p>Dit vraagt vandaag je aandacht.</p></div><div class="welcome-actions"><button class="btn teacher-primary" data-new-lesson>＋ Afspraak</button><button class="btn teacher-secondary" data-teacher-page="attendance">Presentie openen</button></div></div>
      <div class="teacher-kpis">${stat('Lessen vandaag',String(pendingLessons),'3 lesgroepen','blue')}${stat('Nog afsluiten','2','Presentie ontbreekt','amber')}${stat('Na te kijken','23','3 opdrachten','purple')}${stat('Mentorsignalen',String(flagged.length),'Extra aandacht','red')}</div>
      <div class="teacher-dashboard-grid">
        <section class="teacher-panel span-2">${sectionHead('Mijn dag','Je rooster en afspraken',`<button class="text-link" data-teacher-page="schedule">Rooster beheren</button>`)}<div class="teacher-day-agenda">${lessons.length?lessons.map((l,i)=>`<button class="agenda-row ${l.type}" data-edit-lesson="${l.id}"><div class="agenda-time"><strong>${esc(l.start)}</strong><span>${esc(l.end)}</span></div><span class="agenda-marker"></span><div class="agenda-main"><strong>${esc(l.subject)}</strong><span>${l.classId?`${esc(className(l.classId))} · `:''}${esc(l.room)}</span></div>${l.type==='lesson'&&i===0?badge('Nog afsluiten','warning'):badge(l.type==='meeting'?'Overleg':'Les','neutral')}<i>›</i></button>`).join(''):empty('▦','Geen afspraken','Je agenda is leeg.')}</div></section>
        <section class="teacher-panel">${sectionHead('Snelle acties','Veelgebruikte taken')}<div class="teacher-quick-grid"><button data-create-student><span>♙</span><strong>Leerling</strong><small>Aanmaken</small></button><button data-new-grade><span>7⁺</span><strong>Resultaat</strong><small>Invoeren</small></button><button data-new-assignment><span>▤</span><strong>Opdracht</strong><small>Publiceren</small></button><button data-new-message><span>✉</span><strong>Bericht</strong><small>Versturen</small></button><button data-new-test><span>□</span><strong>Toets</strong><small>Inplannen</small></button><button data-new-note><span>✎</span><strong>Notitie</strong><small>Vastleggen</small></button></div></section>
        <section class="teacher-panel">${sectionHead('Mentorklas 3M2','Laatste signalen',`<button class="text-link" data-teacher-page="mentor">Alles bekijken</button>`)}<div class="signal-list">${flagged.slice(0,4).map(s=>`<button data-open-student="${s.id}"><span class="mini-person">${esc(s.avatar)}</span><span><strong>${esc(studentName(s))}</strong><small>${esc(s.tags.join(' · '))}</small></span><i>›</i></button>`).join('')}${flagged.length===0?empty('♡','Geen signalen','Geen opvallende signalen in je mentorklas.'):''}</div></section>
        <section class="teacher-panel">${sectionHead('Nakijkwerk','Inleveropdrachten',`<button class="text-link" data-teacher-page="assignments">Open opdrachten</button>`)}<div class="review-list">${SP.state.assignments.slice(0,3).map(a=>`<button data-teacher-page="assignments"><span><strong>${esc(a.title)}</strong><small>${esc(className(a.classId))} · ${dateNL(a.due)}</small></span><b>${a.total-a.submitted}</b></button>`).join('')}</div></section>
      </div>
    </div>`;
  }

  function schedule(){
    const all=U.scheduleForTeacher();
    const times=['08:30','09:20','10:30','11:20','12:10','13:00','13:50','14:40','15:30'];
    return `<div class="teacher-page">${pageHead('Roosterbeheer','Plan, verplaats en bewerk je eigen lessen en afspraken.',`<button class="btn teacher-secondary" data-schedule-template>Week kopiëren</button><button class="btn teacher-primary" data-new-lesson>＋ Nieuwe afspraak</button>`)}
      <div class="schedule-toolbar"><div class="segmented"><button>‹</button><button class="active">Week 35</button><button>›</button></div><div class="schedule-filters"><select data-schedule-filter><option>Alles</option><option>Lessen</option><option>Afspraken</option><option>Mentor</option></select><button class="btn subtle">Vandaag</button></div></div>
      <section class="teacher-schedule-board"><div class="teacher-week-head"><div></div>${[1,2,3,4,5].map(d=>`<div class="${d===3?'today':''}"><span>${U.days[d]}</span><strong>${24+d} aug</strong></div>`).join('')}</div><div class="teacher-week-body">${times.map(time=>`<div class="teacher-time">${time}</div>${[1,2,3,4,5].map(day=>{const list=all.filter(x=>x.day===day&&x.start===time);return `<div class="teacher-slot" data-slot-day="${day}" data-slot-time="${time}">${list.map(l=>`<button class="teacher-event ${l.type} ${l.status||''}" draggable="true" data-drag-lesson="${l.id}" data-edit-lesson="${l.id}"><strong>${esc(l.subject)}</strong><span>${l.classId?esc(className(l.classId)):esc(l.room)}</span><small>${esc(l.start)}–${esc(l.end)}</small>${l.status==='cancelled'?'<em>Uitgevallen</em>':''}</button>`).join('')}<button class="slot-plus" data-slot-add="${day}|${time}">＋</button></div>`}).join('')}`).join('')}</div></section>
      <div class="teacher-hint">Tip: klik op een afspraak om details te bewerken. Sleep een item naar een ander leeg tijdvak om het te verplaatsen.</div>
    </div>`;
  }

  function lessons(){
    const rows=SP.state.schedule.filter(l=>l.teacher===SP.state.profile.teacher.name&&l.type==='lesson');
    return `<div class="teacher-page">${pageHead('Lessen','Lesplanning, presentie en materiaal per les.',`<button class="btn teacher-primary" data-new-lesson>＋ Les toevoegen</button>`)}
      <div class="teacher-filterbar"><input class="teacher-search-input" placeholder="Zoek lesgroep of lokaal" data-filter-table="lessons"><select><option>Deze week</option><option>Vandaag</option><option>Volgende week</option></select></div>
      <section class="teacher-table-card"><table class="teacher-table" data-table="lessons"><thead><tr><th>Dag</th><th>Tijd</th><th>Les</th><th>Lesgroep</th><th>Lokaal</th><th>Status</th><th></th></tr></thead><tbody>${rows.map((l,i)=>`<tr><td>${esc(U.days[l.day])}</td><td><strong>${esc(l.start)}</strong><br><small>${esc(l.end)}</small></td><td><strong>${esc(l.subject)}</strong></td><td>${esc(className(l.classId))}</td><td>${esc(l.room)}</td><td>${i%3===0?badge('Nog afsluiten','warning'):badge('Gereed','success')}</td><td><button class="table-action" data-edit-lesson="${l.id}">•••</button></td></tr>`).join('')}</tbody></table></section>
    </div>`;
  }

  function classes(){
    return `<div class="teacher-page">${pageHead('Klassen','Beheer lesgroepen en bekijk groepsinformatie.',`<button class="btn teacher-primary" data-create-class>＋ Nieuwe klas</button>`)}
      <div class="class-cards">${SP.state.classes.map(c=>{const students=SP.state.students.filter(s=>s.classId===c.id);const avg=students.map(s=>weightedAverage(s.id,'Nederlands')).filter(x=>x!==null);const mean=avg.length?avg.reduce((a,b)=>a+b,0)/avg.length:null;return `<article class="teacher-class-card" style="--class-color:${esc(c.color)}"><header><span>${esc(c.name)}</span>${c.mentor===SP.state.profile.teacher.name?badge('Mentorklas','blue'):badge(c.level,'neutral')}</header><h2>${students.length} leerlingen</h2><p>${esc(c.subject)} · Leerjaar ${c.year}</p><div class="class-card-metrics"><span><b>${mean?mean.toFixed(1).replace('.',','):'—'}</b> gemiddeld</span><span><b>${students.filter(s=>s.tags?.length).length}</b> signalen</span></div><div class="class-card-actions"><button data-select-class="${c.id}" data-teacher-page="students">Leerlingen</button><button data-select-class="${c.id}" data-teacher-page="attendance">Presentie</button><button data-edit-class="${c.id}">Bewerken</button></div></article>`}).join('')}</div>
    </div>`;
  }

  function students(){
    const cls=SP.state.selectedClassId, rows=SP.state.students.filter(s=>!cls||s.classId===cls);
    return `<div class="teacher-page">${pageHead('Leerlingen','Zoek, maak aan en beheer leerlinggegevens.',`<button class="btn teacher-secondary" data-import-students>Importeren</button><button class="btn teacher-primary" data-create-student>＋ Leerling aanmaken</button>`)}
      <div class="teacher-filterbar"><div class="search-field"><span>⌕</span><input placeholder="Zoek op naam, nummer of e-mail" data-student-filter></div><select data-class-filter><option value="">Alle klassen</option>${SP.state.classes.map(c=>`<option value="${c.id}" ${c.id===cls?'selected':''}>${esc(c.name)}</option>`).join('')}</select><select data-status-filter><option>Actief</option><option>Alles</option></select><button class="btn subtle" data-export-students>Exporteren</button></div>
      <section class="teacher-table-card"><table class="teacher-table student-admin-table"><thead><tr><th>Leerling</th><th>Leerlingnummer</th><th>Klas</th><th>Mentor</th><th>Signalen</th><th>Gem.</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(s=>{const avg=weightedAverage(s.id);return `<tr data-student-row data-search-text="${esc(`${studentName(s)} ${s.number} ${s.email}`.toLowerCase())}"><td><button class="student-cell" data-open-student="${s.id}"><span class="student-avatar-sm">${esc(s.avatar||U.initials(studentName(s)))}</span><span><strong>${esc(studentName(s))}</strong><small>${esc(s.email)}</small></span></button></td><td>${esc(s.number)}</td><td>${esc(className(s.classId))}</td><td>${esc(s.mentor)}</td><td>${s.tags?.length?s.tags.map(t=>badge(t,'warning')).join(''):badge('Geen','neutral')}</td><td><b class="table-grade ${avg===null?'':U.gradeColor(avg)}">${avg===null?'—':avg.toFixed(1).replace('.',',')}</b></td><td>${badge(s.status==='active'?'Actief':'Inactief',s.status==='active'?'success':'neutral')}</td><td><button class="table-action" data-student-actions="${s.id}">•••</button></td></tr>`}).join('')}</tbody></table></section>
      <div class="table-footer"><span>${rows.length} leerlingen weergegeven</span><span>Lokale demo-opslag</span></div>
    </div>`;
  }

  function attendance(){
    const classId=SP.state.selectedClassId||'cls_3m2', students=SP.state.students.filter(s=>s.classId===classId);
    const today='2026-08-26';
    return `<div class="teacher-page">${pageHead('Presentieregistratie',`${className(classId)} · Nederlands · 10:30–11:20`, `<button class="btn teacher-secondary" data-mark-all-present>Iedereen aanwezig</button><button class="btn teacher-primary" data-save-attendance>Les afsluiten</button>`)}
      <div class="attendance-top"><div class="attendance-progress"><span><b>${students.length}</b> leerlingen</span><span><b>${students.filter(s=>{const a=SP.state.attendance.find(x=>x.studentId===s.id&&x.date===today);return !a||a.status==='present'}).length}</b> aanwezig</span><span><b>${students.filter(s=>{const a=SP.state.attendance.find(x=>x.studentId===s.id&&x.date===today);return a&&a.status!=='present'}).length}</b> afwijkend</span></div><button class="btn subtle" data-attendance-history>Historie</button></div>
      <section class="attendance-sheet">${students.map(s=>{const a=SP.state.attendance.find(x=>x.studentId===s.id&&x.date===today);const status=a?.status||'present';return `<article class="attendance-row"><button class="attendance-student" data-open-student="${s.id}"><span class="student-avatar-sm">${esc(s.avatar)}</span><span><strong>${esc(studentName(s))}</strong><small>${esc(s.number)}</small></span></button><div class="attendance-buttons" data-attendance-student="${s.id}">${[['present','Aanwezig'],['late','Te laat'],['absent_excused','Geoorloofd'],['absent_unexcused','Ongeoorloofd']].map(([val,label])=>`<button class="${status===val?'selected':''} ${val}" data-set-attendance="${val}">${esc(label)}</button>`).join('')}</div><button class="attendance-note" data-attendance-note="${s.id}">${a?.note?'✎':'＋'} notitie</button></article>`}).join('')}</section>
    </div>`;
  }

  function grades(){
    const classId=SP.state.selectedClassId||'cls_3m2', students=SP.state.students.filter(s=>s.classId===classId);
    const tests=[...new Set(SP.state.grades.filter(g=>students.some(s=>s.id===g.studentId)&&g.subject==='Nederlands').map(g=>g.title))];
    return `<div class="teacher-page">${pageHead('Resultaten',`${className(classId)} · Nederlands`, `<button class="btn teacher-secondary" data-grade-settings>Instellingen</button><button class="btn teacher-primary" data-new-grade>＋ Resultaten invoeren</button>`)}
      <div class="result-toolbar"><select data-results-class>${SP.state.classes.map(c=>`<option value="${c.id}" ${c.id===classId?'selected':''}>${esc(c.name)}</option>`).join('')}</select><select><option>Nederlands</option></select><select><option>Huidige schooljaar</option><option>Periode 1</option></select></div>
      <section class="gradebook-wrap"><table class="gradebook"><thead><tr><th class="sticky-name">Leerling</th><th>Gemiddelde</th>${tests.map(t=>`<th><span>${esc(t)}</span><small>×2</small></th>`).join('')}<th><button data-new-test-column>＋ toets</button></th></tr></thead><tbody>${students.map(s=>{const avg=weightedAverage(s.id,'Nederlands');return `<tr><td class="sticky-name"><button data-open-student="${s.id}"><span class="student-avatar-xs">${esc(s.avatar)}</span>${esc(studentName(s))}</button></td><td><b class="gradebook-average ${avg!==null?U.gradeColor(avg):''}">${avg!==null?avg.toFixed(1).replace('.',','):'—'}</b></td>${tests.map(t=>{const g=SP.state.grades.find(x=>x.studentId===s.id&&x.title===t&&x.subject==='Nederlands');return `<td><button class="grade-cell ${g?U.gradeColor(g.grade):''}" data-edit-grade="${g?.id||''}" data-grade-student="${s.id}" data-grade-title="${esc(t)}">${g?Number(g.grade).toFixed(1).replace('.',','):'＋'}</button></td>`}).join('')}<td></td></tr>`}).join('')}</tbody></table></section>
    </div>`;
  }

  function tests(){
    return `<div class="teacher-page">${pageHead('Toetsen','Plan toetsen en beheer wegingen.',`<button class="btn teacher-primary" data-new-test>＋ Toets inplannen</button>`)}
      <div class="teacher-tabs"><button class="active">Aankomend</button><button>Afgerond</button><button>Concepten</button></div>
      <section class="teacher-table-card"><table class="teacher-table"><thead><tr><th>Datum</th><th>Toets</th><th>Vak</th><th>Lesgroepen</th><th>Weging</th><th>Status</th><th></th></tr></thead><tbody>${SP.state.tests.map(t=>`<tr><td><strong>${dateNL(t.date)}</strong></td><td><strong>${esc(t.title)}</strong></td><td>${esc(t.subject)}</td><td>${t.classIds.map(className).map(esc).join(', ')}</td><td>×${t.weight}</td><td>${badge(t.published?'Gepubliceerd':'Concept',t.published?'success':'neutral')}</td><td><button class="table-action" data-edit-test="${t.id}">•••</button></td></tr>`).join('')}</tbody></table></section>
    </div>`;
  }

  function assignments(){
    return `<div class="teacher-page">${pageHead('Inleveropdrachten','Maak opdrachten, volg inleveringen en kijk na.',`<button class="btn teacher-primary" data-new-assignment>＋ Nieuwe opdracht</button>`)}
      <div class="assignment-board">${SP.state.assignments.map(a=>{const pct=Math.round((a.submitted/a.total)*100);return `<article class="teacher-assignment"><header><div><span class="assignment-subject">${esc(a.subject)}</span><h2>${esc(a.title)}</h2><p>${esc(className(a.classId))} · deadline ${dateNL(a.due)}</p></div><button class="table-action" data-edit-assignment="${a.id}">•••</button></header><p>${esc(a.instructions)}</p><div class="submission-progress"><div><span>Ingeleverd</span><strong>${a.submitted}/${a.total}</strong></div><div class="progress"><i style="width:${pct}%"></i></div></div><footer><button class="btn teacher-secondary" data-review-assignment="${a.id}">Nakijken (${a.submitted})</button><button class="btn subtle" data-message-missing="${a.id}">Herinner ontbrekend</button></footer></article>`}).join('')}</div>
    </div>`;
  }

  function guides(){
    return `<div class="teacher-page">${pageHead('Studiewijzers','Plan lesstof, huiswerk, materiaal en toetsen.',`<button class="btn teacher-primary" data-new-guide>＋ Nieuwe studiewijzer</button>`)}
      <div class="teacher-guide-grid">${SP.state.studyGuides.map(g=>`<article class="teacher-guide"><header><span>${esc(g.subject)}</span>${badge(g.published?'Gepubliceerd':'Concept',g.published?'success':'neutral')}</header><h2>${esc(g.title)}</h2><p>${g.classIds.map(className).map(esc).join(', ')}</p><div class="guide-outline">${g.items.map(item=>`<div><span class="guide-type ${item.type}">${item.type==='homework'?'H':item.type==='test'?'T':'M'}</span><span><strong>${esc(item.title)}</strong><small>${dateNL(item.date)}</small></span></div>`).join('')}</div><footer><button class="btn teacher-secondary" data-edit-guide="${g.id}">Bewerken</button><button class="btn subtle" data-add-guide-item="${g.id}">＋ Onderdeel</button></footer></article>`).join('')}</div>
    </div>`;
  }

  function mentor(){
    const students=SP.state.students.filter(s=>s.mentor===SP.state.profile.teacher.name);
    return `<div class="teacher-page">${pageHead('Mentordashboard','3M2 · ontwikkeling en signalen van mentorleerlingen.',`<button class="btn teacher-secondary" data-mentor-export>Overzicht exporteren</button><button class="btn teacher-primary" data-new-note>＋ Mentornotitie</button>`)}
      <div class="mentor-overview">${stat('Mentorleerlingen',String(students.length),'3M2','blue')}${stat('Met signaal',String(students.filter(s=>s.tags?.length).length),'Deze periode','amber')}${stat('Gem. resultaat','7,1','Nederlands','green')}${stat('Open notities',String(SP.state.notes.filter(n=>students.some(s=>s.id===n.studentId)).length),'Logboek','purple')}</div>
      <section class="teacher-table-card"><table class="teacher-table mentor-table"><thead><tr><th>Leerling</th><th>Resultaten</th><th>Registraties</th><th>Signalen</th><th>Laatste notitie</th><th></th></tr></thead><tbody>${students.map(s=>{const avg=weightedAverage(s.id), att=attendanceCounts(s.id), note=SP.state.notes.find(n=>n.studentId===s.id);return `<tr><td><button class="student-cell" data-open-student="${s.id}"><span class="student-avatar-sm">${esc(s.avatar)}</span><span><strong>${esc(studentName(s))}</strong><small>${esc(s.number)}</small></span></button></td><td><b class="table-grade ${avg!==null?U.gradeColor(avg):''}">${avg!==null?avg.toFixed(1).replace('.',','):'—'}</b></td><td><span>${att.late} te laat · ${att.absent+att.excused} afwezig</span></td><td>${s.tags?.length?s.tags.map(t=>badge(t,'warning')).join(' '):badge('Geen','neutral')}</td><td><span class="note-preview">${esc(note?.text||'Geen notitie')}</span></td><td><button class="table-action" data-open-student="${s.id}">›</button></td></tr>`}).join('')}</tbody></table></section>
    </div>`;
  }

  function notes(){
    const notes=SP.state.notes;
    return `<div class="teacher-page">${pageHead('Notitieboek','Persoonlijke en mentorgerelateerde notities.',`<button class="btn teacher-primary" data-new-note>＋ Nieuwe notitie</button>`)}
      <div class="notes-layout"><aside class="notes-filter"><strong>Filters</strong><button class="active">Alle notities <b>${notes.length}</b></button><button>Mentor</button><button>Positief</button><button>Gesprek</button><button>Privé</button></aside><section class="notes-stream">${notes.length?notes.map(n=>{const s=U.studentById(n.studentId);return `<article class="note-card"><header><button data-open-student="${n.studentId}"><span class="student-avatar-sm">${esc(s?.avatar||'?')}</span><span><strong>${esc(studentName(s))}</strong><small>${dateNL(n.date)} · ${esc(n.author)}</small></span></button>${badge(n.category,n.category==='positief'?'success':'blue')}</header><p>${esc(n.text)}</p><footer><span>${n.private?'🔒 Privé':'Gedeeld'}</span><button data-edit-note="${n.id}">Bewerken</button></footer></article>`}).join(''):empty('✎','Nog geen notities','Maak een eerste notitie aan.')}</section></div>
    </div>`;
  }

  function reports(){
    const students=SP.state.students.filter(s=>s.classId===SP.state.selectedClassId);
    return `<div class="teacher-page">${pageHead('Rapportages','Groepsanalyse en voortgang.',`<button class="btn teacher-secondary" data-export-report>Exporteer CSV</button><button class="btn teacher-primary" data-generate-report>Rapport maken</button>`)}
      <div class="report-grid"><section class="teacher-panel span-2">${sectionHead('Resultaatspreiding','Nederlands · 3M2')}<div class="bar-chart">${students.map(s=>{const a=weightedAverage(s.id,'Nederlands')||0;return `<div><i style="height:${Math.max(8,a*9)}%" class="${U.gradeColor(a)}"></i><span>${esc(s.firstName)}</span></div>`}).join('')}</div></section><section class="teacher-panel">${sectionHead('Kerncijfers','Deze periode')}<div class="report-metrics"><div><span>Klasgemiddelde</span><b>7,1</b></div><div><span>Voldoendes</span><b>84%</b></div><div><span>Te laat</span><b>6</b></div><div><span>Open taken</span><b>14</b></div></div></section><section class="teacher-panel span-3">${sectionHead('Leerlingoverzicht','Signaleer snel wie aandacht nodig heeft')}<div class="risk-grid">${students.map(s=>{const avg=weightedAverage(s.id)||7, att=attendanceCounts(s.id), risk=avg<5.5||att.absent>1?'high':s.tags?.length?'medium':'low';return `<button data-open-student="${s.id}" class="risk-card ${risk}"><span class="student-avatar-sm">${esc(s.avatar)}</span><span><strong>${esc(studentName(s))}</strong><small>${risk==='high'?'Direct bekijken':risk==='medium'?'Aandachtspunt':'Geen signalen'}</small></span><b>${avg.toFixed(1).replace('.',',')}</b></button>`}).join('')}</div></section></div>
    </div>`;
  }

  function communication(){
    return `<div class="teacher-page">${pageHead('Communicatie','Berichten, groepen en schoolcommunicatie.',`<button class="btn teacher-primary" data-new-message>＋ Nieuw bericht</button>`)}
      <div class="communication-grid"><section class="teacher-panel span-2">${sectionHead('Verzonden & concepten','Recente communicatie')}<div class="teacher-message-list">${SP.state.teacherMessages.map(m=>`<button data-edit-teacher-message="${m.id}"><span class="message-status ${m.status}">${m.status==='sent'?'✓':'•'}</span><span><strong>${esc(m.subject)}</strong><small>Aan: ${esc(m.to)} · ${dateNL(m.date)}</small></span>${badge(m.status==='sent'?'Verzonden':'Concept',m.status==='sent'?'success':'neutral')}<i>›</i></button>`).join('')}</div></section><section class="teacher-panel">${sectionHead('Ontvangers','Snel selecteren')}<div class="recipient-list"><button data-new-message-to="Klas 3M2"><span>3M2</span><small>26 leerlingen</small></button><button data-new-message-to="Ouders 3M2"><span>Ouders 3M2</span><small>Verzorgers</small></button><button data-new-message-to="Team Nederlands"><span>Team Nederlands</span><small>8 collega's</small></button><button data-new-message-to="Alle leerlingen"><span>Alle leerlingen</span><small>Schoolbreed</small></button></div></section><section class="teacher-panel span-3">${sectionHead('Mededelingen','Schoolbrede berichten',`<button class="text-link" data-new-announcement>＋ Mededeling</button>`)}<div class="announcement-admin">${SP.state.announcements.map(a=>`<article><span class="announcement-icon">i</span><div><strong>${esc(a.title)}</strong><p>${esc(a.body)}</p><small>${dateNL(a.date)} · ${esc(a.audience)}</small></div><button data-edit-announcement="${a.id}">Bewerken</button></article>`).join('')}</div></section></div>
    </div>`;
  }

  function files(){
    const files=[['PDF','Lesplan leesvaardigheid','Nederlands · 1,2 MB'],['DOCX','Rubric boekverslag','3M2 · 640 KB'],['PPTX','Argumenteren - les 2','Nederlands · 4,6 MB'],['PDF','Mentorhandleiding','Mentoraat · 2,0 MB']];
    return `<div class="teacher-page">${pageHead('Bestanden','Lesmateriaal en gedeelde documenten.',`<button class="btn teacher-secondary" data-new-folder>＋ Map</button><button class="btn teacher-primary" data-upload-file>Upload bestand</button>`)}
      <div class="file-toolbar"><button class="active">Mijn bestanden</button><button>Gedeeld met mij</button><button>Lesgroepen</button><div class="search-field"><span>⌕</span><input placeholder="Zoek bestanden"></div></div><div class="file-grid">${files.map(f=>`<article class="file-card"><span class="file-type">${f[0]}</span><div><strong>${esc(f[1])}</strong><small>${esc(f[2])}</small></div><button>•••</button></article>`).join('')}</div>
    </div>`;
  }

  function admin(){
    return `<div class="teacher-page">${pageHead('Administratie','Demo-beheerfuncties voor leerlingen en schooldata.')}
      <div class="admin-grid"><button data-create-student><span>♙</span><strong>Nieuwe leerling</strong><small>Account en leerlinggegevens aanmaken</small></button><button data-create-class><span>♟</span><strong>Nieuwe klas</strong><small>Lesgroep toevoegen</small></button><button data-new-lesson><span>▦</span><strong>Roosteritem</strong><small>Les of afspraak plannen</small></button><button data-import-students><span>⇩</span><strong>Leerlingen importeren</strong><small>CSV-demo import</small></button><button data-backup><span>▧</span><strong>Back-up maken</strong><small>Alle lokale data exporteren</small></button><button data-restore><span>↻</span><strong>Back-up herstellen</strong><small>JSON-data importeren</small></button></div>
      <section class="teacher-panel audit-panel">${sectionHead('Activiteitenlog','Laatste wijzigingen')}<div class="audit-list">${SP.state.audit.slice(0,15).map(a=>`<div><span class="audit-dot"></span><span><strong>${esc(a.action)}</strong><small>${esc(a.actor)} · ${new Date(a.time).toLocaleString('nl-NL')}</small></span></div>`).join('')}</div></section>
    </div>`;
  }

  function settings(){
    return `<div class="teacher-page">${pageHead('Instellingen','Pas de docentenwerkruimte aan.')}
      <div class="settings-columns"><section class="teacher-panel"><h2>Werkruimte</h2><label class="setting-row"><span><strong>Donkere modus</strong><small>Donker kleurenschema</small></span><input type="checkbox" data-teacher-setting="theme" ${SP.state.theme==='dark'?'checked':''}></label><label class="setting-row"><span><strong>Compacte tabellen</strong><small>Meer regels tegelijk zichtbaar</small></span><input type="checkbox" data-teacher-setting="dense" ${SP.state.settings.teacherDenseTables?'checked':''}></label><label class="setting-row"><span><strong>Snelle acties</strong><small>Toon acties op dashboard</small></span><input type="checkbox" data-teacher-setting="quick" ${SP.state.settings.teacherQuickActions?'checked':''}></label></section><section class="teacher-panel"><h2>Data</h2><p class="muted">Deze GitHub Pages-versie bewaart gegevens lokaal in deze browser.</p><div class="stack-actions"><button class="btn teacher-secondary" data-backup>Back-up downloaden</button><button class="btn teacher-secondary" data-restore>Back-up importeren</button><button class="btn danger" data-reset-v3>Demo-data resetten</button></div></section><section class="teacher-panel"><h2>Profiel</h2><div class="teacher-setting-profile"><span class="teacher-avatar large">${esc(SP.state.profile.teacher.initials)}</span><div><strong>${esc(SP.state.profile.teacher.name)}</strong><small>${esc(SP.state.profile.teacher.email)}</small></div><button class="btn subtle" data-edit-teacher-profile>Bewerken</button></div></section></div>
    </div>`;
  }

  const pages={today,schedule,lessons,classes,students,attendance,grades,tests,assignments,guides,mentor,notes,reports,communication,files,admin,settings};
  SP.teacher={navGroups,shell,pages,render(){return (pages[SP.state.teacherPage]||today)();}};
})();