/* SchoolPortal V3 — student experience */
(() => {
  const SP=window.SP, U=SP.ui;
  const {esc,dateNL,relativeDue,gradeColor,weightedAverage,studentGrades,attendanceCounts,className,badge,empty,pageHead,sectionHead,stat}=U;

  const nav=[
    {id:'today',label:'Vandaag',icon:'today'},
    {id:'schedule',label:'Rooster',icon:'schedule'},
    {id:'guide',label:'Studiewijzer',icon:'guide'},
    {id:'grades',label:'Cijfers',icon:'grades'},
    {id:'messages',label:'Berichten',icon:'messages'},
    {id:'registrations',label:'Registraties',icon:'registrations'},
    {id:'profile',label:'Profiel',icon:'profile'},
    {id:'settings',label:'Instellingen',icon:'settings'}
  ];

  function me(){return U.studentById('stu_001')||SP.state.students[0]}
  function shell(){
    const profile=SP.state.profile.student;
    return `<div class="student-app">
      <header class="student-header">
        <div class="student-brand" data-page="today"><span class="brand-symbol">S</span><strong>SchoolPortal</strong></div>
        <nav class="student-tabs">${nav.slice(0,6).map(item=>`<button class="student-tab ${SP.state.studentPage===item.id?'active':''}" data-student-page="${item.id}"><span>${U.icon(item.icon)}</span>${esc(item.label)}</button>`).join('')}</nav>
        <div class="student-tools">
          <button class="round-action" data-student-search aria-label="Zoeken">⌕</button>
          <button class="round-action" data-student-theme aria-label="Thema">${SP.state.theme==='dark'?'☀':'☾'}</button>
          <button class="student-avatar" data-student-menu>${esc(profile.initials||'LW')}</button>
        </div>
      </header>
      <main class="student-main"><div id="studentView"></div></main>
      <nav class="student-bottom">${nav.slice(0,5).map(item=>`<button class="${SP.state.studentPage===item.id?'active':''}" data-student-page="${item.id}"><span>${U.icon(item.icon)}</span><small>${esc(item.label)}</small></button>`).join('')}<button data-student-menu><span>•••</span><small>Meer</small></button></nav>
    </div>`;
  }

  function today(){
    const student=me(), lessons=U.scheduleForStudent(student.id).filter(x=>x.day===3).sort((a,b)=>a.start.localeCompare(b.start));
    const open=SP.state.homework.filter(h=>h.studentId===student.id&&!h.done).slice(0,4);
    const announcements=SP.state.announcements.filter(a=>a.published&&(a.audience==='all'||a.audience==='students')).slice(0,2);
    return `<div class="student-page student-today">
      <div class="student-greeting"><div><span>Woensdag 26 augustus</span><h1>Hoi ${esc(student.firstName)}</h1><p>Dit staat er vandaag voor je klaar.</p></div><button class="student-date-pill" data-student-page="schedule"><strong>26</strong><span>AUG</span></button></div>
      <section class="next-block">
        <div class="next-label">VOLGENDE LES</div>
        <div class="next-time">09:20</div>
        <div class="next-content"><span class="subject-dot blue"></span><div><h2>Nederlands</h2><p>B1.14 · J. de Jong · 3M2</p></div></div>
        <button class="next-arrow" data-student-page="schedule">›</button>
      </section>
      <div class="student-two-col">
        <section class="plain-panel">
          ${sectionHead('Vandaag','Je lessen van vandaag',`<button class="text-link" data-student-page="schedule">Hele rooster</button>`)}
          <div class="day-list">${lessons.length?lessons.map((l,i)=>`<div class="day-lesson ${l.status==='cancelled'?'cancelled':''}"><div class="lesson-clock"><strong>${esc(l.start)}</strong><span>${esc(l.end)}</span></div><span class="subject-line ${i%4===0?'blue':i%4===1?'purple':i%4===2?'green':'orange'}"></span><div class="lesson-info"><strong>${esc(l.subject)}</strong><span>${esc(l.room)} · ${esc(l.teacher)}</span></div>${l.status==='cancelled'?badge('Uitgevallen','danger'):l.status==='changed'?badge('Gewijzigd','warning'):''}</div>`).join(''):empty('▦','Geen lessen','Je rooster is leeg voor vandaag.')}</div>
        </section>
        <section class="plain-panel">
          ${sectionHead('Te doen','Huiswerk en opdrachten',`<button class="text-link" data-student-page="guide">Alles bekijken</button>`)}
          <div class="student-task-list">${open.length?open.map(h=>`<button class="student-task" data-homework-toggle="${h.id}"><span class="task-check"></span><span><strong>${esc(h.subject)}</strong><em>${esc(h.title)}</em></span><small>${esc(relativeDue(h.due))}</small></button>`).join(''):empty('✓','Alles af','Je hebt geen openstaand huiswerk.')}</div>
        </section>
      </div>
      <section class="announcement-strip">${announcements.map(a=>`<article><span class="announcement-icon">i</span><div><strong>${esc(a.title)}</strong><p>${esc(a.body)}</p></div><small>${dateNL(a.date)}</small></article>`).join('')}</section>
    </div>`;
  }

  function schedule(){
    const student=me(), lessons=U.scheduleForStudent(student.id);
    const times=['08:30','09:20','10:30','11:20','12:10','13:00','13:50','14:40','15:30'];
    return `<div class="student-page">
      ${pageHead('Rooster','Week 35 · 24 t/m 28 augustus',`<button class="btn subtle">‹</button><button class="btn subtle">Vandaag</button><button class="btn subtle">›</button>`)}
      <div class="student-week"><div class="week-corner"></div>${[1,2,3,4,5].map(d=>`<div class="week-day ${d===3?'today':''}"><span>${U.shortDays[d]}</span><strong>${24+d}</strong></div>`).join('')}${times.map(time=>`<div class="week-time">${time}</div>${[1,2,3,4,5].map(day=>{const l=lessons.find(x=>x.day===day&&x.start===time);return `<div class="week-cell">${l?`<button class="week-lesson ${l.status}" data-lesson-info="${l.id}"><strong>${esc(l.subject)}</strong><span>${esc(l.room)}</span><small>${esc(l.start)}</small></button>`:''}</div>`}).join('')}`).join('')}</div>
      <div class="schedule-legend"><span><i class="legend normal"></i>Les</span><span><i class="legend changed"></i>Gewijzigd</span><span><i class="legend cancelled"></i>Uitgevallen</span></div>
    </div>`;
  }

  function guide(){
    const guides=SP.state.studyGuides.filter(g=>g.classIds.includes(me().classId)&&g.published);
    return `<div class="student-page">${pageHead('Studiewijzer','Huiswerk, toetsen en lesmateriaal bij elkaar.')}
      <div class="guide-grid">${guides.map(g=>`<article class="guide-card"><div class="guide-top"><span class="guide-subject">${esc(g.subject)}</span><span>${g.progress}%</span></div><h2>${esc(g.title)}</h2><div class="progress"><i style="width:${g.progress}%"></i></div><div class="guide-items">${g.items.map(item=>`<div class="guide-item"><span class="guide-type ${item.type}">${item.type==='homework'?'✓':item.type==='test'?'T':'↗'}</span><div><strong>${esc(item.title)}</strong><small>${dateNL(item.date)}</small></div></div>`).join('')}</div></article>`).join('')}</div>
    </div>`;
  }

  function grades(){
    const st=me(), grades=studentGrades(st.id), subjects=[...new Set(grades.map(g=>g.subject))];
    const avg=weightedAverage(st.id);
    return `<div class="student-page">${pageHead('Cijfers','Je resultaten van dit schooljaar.')}
      <div class="grade-summary"><div><span>Gemiddelde</span><strong>${avg?avg.toFixed(1).replace('.',','):'—'}</strong><small>Gewogen gemiddelde</small></div><div class="grade-mini-stats"><span><b>${grades.length}</b> cijfers</span><span><b>${grades.filter(g=>g.grade>=5.5).length}</b> voldoendes</span><span><b>${subjects.length}</b> vakken</span></div></div>
      <div class="student-grade-table"><div class="grade-table-head"><span>Vak</span><span>Onderdeel</span><span>Datum</span><span>Weging</span><span>Cijfer</span></div>${grades.map(g=>`<div class="grade-table-row"><strong>${esc(g.subject)}</strong><span>${esc(g.title)}</span><span>${dateNL(g.date)}</span><span>×${g.weight}</span><b class="grade-pill ${SP.state.settings.studentGradeColors?gradeColor(g.grade):'plain'}">${Number(g.grade).toFixed(1).replace('.',',')}</b></div>`).join('')}</div>
    </div>`;
  }

  function messages(){
    const conv=SP.state.conversations.find(c=>c.id===SP.state.selectedConversationId)||SP.state.conversations[0];
    return `<div class="student-page messages-page">${pageHead('Berichten','Persoonlijke berichten van school.')}
      <div class="student-messages"><aside>${SP.state.conversations.map(c=>`<button class="conversation-row ${c.id===conv.id?'active':''}" data-conversation="${c.id}"><span class="conversation-avatar">${esc(U.initials(c.title))}</span><span><strong>${esc(c.title)}</strong><small>${esc(c.messages.at(-1)?.text||'')}</small></span>${c.unread?`<b>${c.unread}</b>`:''}</button>`).join('')}</aside><section><div class="chat-head"><span class="conversation-avatar">${esc(U.initials(conv.title))}</span><div><strong>${esc(conv.title)}</strong><small>SchoolPortal bericht</small></div></div><div class="chat-stream">${conv.messages.map(m=>`<div class="student-bubble ${m.from===SP.state.profile.student.name?'mine':''}"><span>${esc(m.text)}</span><small>${U.timeNL(m.time)}</small></div>`).join('')}</div><form class="student-composer" data-student-message-form><input name="text" placeholder="Typ een bericht…" autocomplete="off"><button>Verstuur</button></form></section></div>
    </div>`;
  }

  function registrations(){
    const st=me(), rows=SP.state.attendance.filter(a=>a.studentId===st.id), counts=attendanceCounts(st.id);
    const label={present:'Aanwezig',late:'Te laat',absent:'Afwezig',absent_unexcused:'Ongeoorloofd afwezig',absent_excused:'Geoorloofd afwezig'};
    return `<div class="student-page">${pageHead('Registraties','Afwezigheid, te laat en andere registraties.')}
      <div class="registration-cards"><button><span class="reg-icon blue">×</span><strong>${counts.absent}x</strong><small>Ongeoorloofd</small></button><button><span class="reg-icon green">✓</span><strong>${counts.excused}x</strong><small>Geoorloofd</small></button><button><span class="reg-icon amber">◷</span><strong>${counts.late}x</strong><small>Te laat</small></button><button><span class="reg-icon orange">↗</span><strong>0x</strong><small>Verwijderd uit les</small></button></div>
      <section class="plain-panel registration-list">${sectionHead('Deze periode','Laatste registraties')}<div>${rows.length?rows.map(a=>{const l=U.lessonById(a.lessonId);return `<article><span class="status-dot ${a.status}"></span><div><strong>${esc(label[a.status]||a.status)}</strong><small>${esc(l?.subject||'Registratie')} · ${dateNL(a.date)}${a.minutes?` · ${a.minutes} min`:''}</small></div>${a.note?`<p>${esc(a.note)}</p>`:''}</article>`}).join(''):empty('◷','Geen registraties','Er zijn geen registraties gevonden.')}</div></section>
    </div>`;
  }

  function profile(){
    const p=SP.state.profile.student, st=me();
    return `<div class="student-page">${pageHead('Profiel','Jouw schoolgegevens.')}
      <div class="student-profile-card"><div class="profile-avatar large">${esc(p.initials)}</div><div><h2>${esc(p.name)}</h2><p>${esc(className(st.classId))} · ${esc(st.number)}</p></div></div>
      <div class="student-profile-grid"><section class="plain-panel"><h3>Contact</h3><dl><div><dt>E-mail</dt><dd>${esc(p.email)}</dd></div><div><dt>Telefoon</dt><dd>${esc(st.phone)}</dd></div><div><dt>Mentor</dt><dd>${esc(st.mentor)}</dd></div></dl></section><section class="plain-panel"><h3>School</h3><dl><div><dt>School</dt><dd>Delta College</dd></div><div><dt>Schooljaar</dt><dd>2026–2027</dd></div><div><dt>Klas</dt><dd>${esc(className(st.classId))}</dd></div></dl></section></div>
    </div>`;
  }

  function settings(){
    return `<div class="student-page">${pageHead('Instellingen','Maak SchoolPortal persoonlijk.')}
      <section class="plain-panel settings-list"><label><span><strong>Donkere modus</strong><small>Gebruik een donker kleurenschema.</small></span><input type="checkbox" data-student-setting="theme" ${SP.state.theme==='dark'?'checked':''}></label><label><span><strong>Meldingen</strong><small>Nieuwe cijfers, berichten en roosterwijzigingen.</small></span><input type="checkbox" data-student-setting="notifications" ${SP.state.settings.studentNotifications?'checked':''}></label><label><span><strong>Cijferkleuren</strong><small>Geef cijfers een subtiele kleur.</small></span><input type="checkbox" data-student-setting="gradeColors" ${SP.state.settings.studentGradeColors?'checked':''}></label></section>
      <section class="plain-panel about-panel"><h3>Over SchoolPortal</h3><p>SchoolPortal V3 · statische GitHub Pages-demo.</p><button class="btn subtle" data-switch-role="teacher">Open docentenomgeving</button></section>
    </div>`;
  }

  const pages={today,schedule,guide,grades,messages,registrations,profile,settings};
  SP.student={nav,shell,pages,render(){return (pages[SP.state.studentPage]||today)();}};
})();