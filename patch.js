// SchoolPortal GitHub Pages upgrade layer
(function(){
  const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
  const uid=()=>Date.now()+Math.floor(Math.random()*1000);
  const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // Migrate older localStorage data without breaking existing users.
  state.tests=Array.isArray(state.tests)?state.tests:[
    {id:1,subject:'Wiskunde',title:'Toets algebra',date:'30 augustus',weight:3,reminder:false},
    {id:2,subject:'Engels',title:'Vocabulary Unit 2',date:'2 september',weight:1,reminder:false},
    {id:3,subject:'Biologie',title:'Practicum cellen',date:'5 september',weight:2,reminder:false}
  ];
  state.absences=Array.isArray(state.absences)?state.absences:[
    {id:1,type:'Te laat',detail:'Wiskunde',date:'12 augustus · 09:27',duration:'7 minuten'},
    {id:2,type:'Geoorloofd',detail:'Tandarts',date:'4 juli · 10:30 – 12:10',duration:'1 uur 40 min'}
  ];
  state.files=Array.isArray(state.files)?state.files:[
    {id:1,type:'PDF',name:'Uitwerkingen hoofdstuk 3',meta:'Wiskunde · 2,1 MB'},
    {id:2,type:'DOC',name:'Boekverslag voorbeeld',meta:'Nederlands · 840 KB'},
    {id:3,type:'PPT',name:'Cellen en weefsels',meta:'Biologie · 4,8 MB'},
    {id:4,type:'PDF',name:'Studiewijzer periode 1',meta:'School · 1,4 MB'}
  ];
  state.profile=state.profile||{studentName:'Levi Wassink',studentEmail:'levi@school.nl',teacherName:'J. de Jong',teacherEmail:'j.dejong@school.nl'};
  save();

  function showForm(title,body,onSubmit){
    const d=q('#modal'), box=q('#modalContent');
    box.innerHTML=`<h2 style="margin:0 0 18px">${safe(title)}</h2>${body}`;
    const form=box.querySelector('form');
    if(form) form.addEventListener('submit',e=>{e.preventDefault();onSubmit(new FormData(form));d.close();});
    if(typeof d.showModal==='function') d.showModal();
  }
  function field(label,name,type='text',value='',extra=''){
    return `<div class="field"><label>${label}</label><input name="${name}" type="${type}" value="${safe(value)}" ${extra}></div>`;
  }

  window.openHomeworkModal=function(){showForm('Nieuw huiswerk',`<form class="form-grid">${field('Vak','subject','text','','required')}${field('Deadline','due','text','','required placeholder="Vrijdag"')}<div class="field full"><label>Omschrijving</label><textarea name="title" required></textarea></div><div class="field full"><button class="primary-btn">Toevoegen</button></div></form>`,fd=>{state.homework.unshift({id:uid(),subject:fd.get('subject'),title:fd.get('title'),due:fd.get('due'),done:false});save();render();toast('Huiswerk toegevoegd')})};
  window.openTestModal=function(){showForm('Toets toevoegen',`<form class="form-grid">${field('Vak','subject','text','','required')}${field('Datum','date','text','','required placeholder="4 september"')}${field('Onderdeel','title','text','','required')}${field('Weging','weight','number','1','min="1" max="5"')}<div class="field full"><button class="primary-btn">Toevoegen</button></div></form>`,fd=>{state.tests.push({id:uid(),subject:fd.get('subject'),date:fd.get('date'),title:fd.get('title'),weight:Number(fd.get('weight'))||1,reminder:false});save();render();toast('Toets toegevoegd')})};
  window.openAbsenceModal=function(){showForm('Ziekmelding',`<form class="form-grid">${field('Datum','date','date','','required')}<div class="field"><label>Duur</label><select name="duration"><option>Hele dag</option><option>Ochtend</option><option>Middag</option><option>1 lesuur</option></select></div><div class="field full"><label>Reden</label><textarea name="detail" placeholder="Bijvoorbeeld: ziek"></textarea></div><div class="field full"><button class="primary-btn">Melden</button></div></form>`,fd=>{state.absences.unshift({id:uid(),type:'Ziek',detail:fd.get('detail')||'Ziekmelding',date:fd.get('date'),duration:fd.get('duration')});save();render();toast('Ziekmelding opgeslagen')})};
  window.openFileModal=function(){showForm('Bestand toevoegen',`<form class="form-grid">${field('Naam','name','text','','required')}<div class="field"><label>Type</label><select name="type"><option>PDF</option><option>DOC</option><option>PPT</option><option>LINK</option></select></div>${field('Beschrijving','meta','text','','placeholder="Vak · omschrijving"')}<div class="field full"><button class="primary-btn">Toevoegen</button></div></form>`,fd=>{state.files.unshift({id:uid(),name:fd.get('name'),type:fd.get('type'),meta:fd.get('meta')||'Lokaal demo-item'});save();render();toast('Bestand toegevoegd')})};

  pages.huiswerk=function(){return pageHeader('Huiswerk','Bekijk, voltooi en beheer je taken.',`<button class="primary-btn" onclick="openHomeworkModal()">Nieuw huiswerk</button>`)+card('Alle taken',`<div class="list">${state.homework.length?state.homework.map(h=>`<div class="list-row"><button class="check ${h.done?'done':''}" data-homework="${h.id}">${h.done?'✓':''}</button><div class="grow ${h.done?'done-text':''}"><strong>${safe(h.subject)}</strong><span>${safe(h.title)}</span></div><span class="badge ${h.done?'green':''}">${h.done?'KLAAR':safe(h.due)}</span><button class="mini-delete" data-del-homework="${h.id}">×</button></div>`).join(''):'<div class="empty">Geen huiswerk meer.</div>'}</div>`)};

  pages.toetsen=function(){return pageHeader('Toetsen','Aankomende toetsen en herinneringen.',`<button class="primary-btn" onclick="openTestModal()">Toets toevoegen</button>`)+`<div class="grid3">${state.tests.map(t=>card(safe(t.subject),`<div class="list-row"><div class="grow"><strong>${safe(t.title)}</strong><span>${safe(t.date)}</span></div><span class="badge">×${t.weight}</span></div><button class="soft-btn" data-reminder="${t.id}">${t.reminder?'Herinnering actief':'Herinner mij'}</button>`)).join('')}</div>`};

  pages.absenties=function(){return pageHeader('Absenties','Overzicht van aanwezigheid en meldingen.',`<button class="primary-btn" onclick="openAbsenceModal()">Ziekmelding</button>`)+`<div class="stats">${stat('Aanwezig','97%','Dit schooljaar')}${stat('Registraties',state.absences.length,'Totaal')}${stat('Te laat',state.absences.filter(a=>a.type==='Te laat').length,'Registraties')}${stat('Ziek',state.absences.filter(a=>a.type==='Ziek').length,'Meldingen')}</div>`+card('Registraties',`<div class="list">${state.absences.map(a=>`<div class="list-row"><span class="badge ${a.type==='Ziek'?'yellow':'green'}">${safe(a.type).toUpperCase()}</span><div class="grow"><strong>${safe(a.detail)}</strong><span>${safe(a.date)} · ${safe(a.duration)}</span></div><button class="mini-delete" data-del-absence="${a.id}">×</button></div>`).join('')}</div>`)};

  pages.bestanden=function(){return pageHeader('Bestanden','Lesmateriaal en lokale demo-bestanden.',`<button class="primary-btn" onclick="openFileModal()">Bestand toevoegen</button>`)+card('Bestanden',`<div class="list">${state.files.map(f=>`<div class="list-row"><span class="badge">${safe(f.type)}</span><div class="grow"><strong>${safe(f.name)}</strong><span>${safe(f.meta)}</span></div><button class="soft-btn" data-open-file="${f.id}">Open</button><button class="mini-delete" data-del-file="${f.id}">×</button></div>`).join('')}</div>`)};

  pages.profiel=function(){const docent=state.role==='docent',name=docent?state.profile.teacherName:state.profile.studentName,email=docent?state.profile.teacherEmail:state.profile.studentEmail;return pageHeader('Profiel','Je account- en schoolgegevens.')+`<div class="grid2">${card('Persoonlijke gegevens',`<form id="profileUpgrade" class="form-grid">${field('Naam','name','text',name,'required')}${field('E-mail','email','email',email,'required')}<div class="field"><label>Rol</label><input value="${docent?'Docent':'Leerling'}" disabled></div><div class="field"><label>${docent?'Mentorklas':'Klas'}</label><input value="3M2" disabled></div><div class="field full"><button class="primary-btn">Opslaan</button></div></form>`)}${card('Schoolgegevens',`<div class="list"><div class="list-row"><div class="grow"><strong>Delta College</strong><span>Schooljaar 2026–2027</span></div></div><div class="list-row"><div class="grow"><strong>${docent?'Personeelsnummer':'Leerlingnummer'}</strong><span>${docent?'D-1042':'20263184'}</span></div></div></div>`)}</div>`};

  const oldAssignments=pages.opdrachten;
  pages.opdrachten=function(){return pageHeader('Opdrachten','Maak opdrachten en beheer de inleverstatus.',`<button class="primary-btn" onclick="openAssignmentModal()">Nieuwe opdracht</button>`)+`<div class="grid3">${state.assignments.map(a=>card(safe(a.title),`<div class="list-row"><div class="grow"><strong>${safe(a.className)}</strong><span>Deadline ${safe(a.due)}</span></div><span class="badge">${a.submitted}/${a.total}</span></div><div style="display:flex;gap:8px;margin-top:12px"><button class="soft-btn" data-review="${a.id}">1 nakijken</button><button class="mini-delete" data-del-assignment="${a.id}">×</button></div>`)).join('')}</div>`};

  const baseBind=bindPage;
  bindPage=function(){
    baseBind();
    qa('[data-del-homework]').forEach(b=>b.onclick=()=>{state.homework=state.homework.filter(x=>x.id!=b.dataset.delHomework);save();render();toast('Huiswerk verwijderd')});
    qa('[data-reminder]').forEach(b=>b.onclick=()=>{const t=state.tests.find(x=>x.id==b.dataset.reminder);if(!t)return;t.reminder=!t.reminder;save();render();toast(t.reminder?'Herinnering ingesteld':'Herinnering uitgezet')});
    qa('[data-del-absence]').forEach(b=>b.onclick=()=>{state.absences=state.absences.filter(x=>x.id!=b.dataset.delAbsence);save();render();toast('Registratie verwijderd')});
    qa('[data-del-file]').forEach(b=>b.onclick=()=>{state.files=state.files.filter(x=>x.id!=b.dataset.delFile);save();render();toast('Bestand verwijderd')});
    qa('[data-open-file]').forEach(b=>b.onclick=()=>toast('Demo-bestand geopend'));
    qa('[data-review]').forEach(b=>b.onclick=()=>{const a=state.assignments.find(x=>x.id==b.dataset.review);if(!a)return;a.submitted=Math.min(a.total,a.submitted+1);save();render();toast('Inzending nagekeken')});
    qa('[data-del-assignment]').forEach(b=>b.onclick=()=>{state.assignments=state.assignments.filter(x=>x.id!=b.dataset.delAssignment);save();render();toast('Opdracht verwijderd')});
    q('#profileUpgrade')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);if(state.role==='docent'){state.profile.teacherName=f.get('name');state.profile.teacherEmail=f.get('email')}else{state.profile.studentName=f.get('name');state.profile.studentEmail=f.get('email')}save();render();toast('Profiel opgeslagen')});
  };

  // Better global search: Enter opens the first matching page.
  const search=q('#searchInput');
  search?.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const term=search.value.trim().toLowerCase();const items=state.role==='leerling'?studentNav:teacherNav;const found=items.find(x=>x[2].toLowerCase().includes(term));if(found){setPage(found[0]);search.value=''}else toast('Geen pagina gevonden')});

  // Reset local demo data from Settings without affecting GitHub files.
  const oldSettings=pages.instellingen;
  pages.instellingen=function(){return oldSettings()+card('Demo-data',`<p style="color:var(--muted)">Wis alle wijzigingen die alleen in deze browser zijn opgeslagen.</p><button id="resetLocalData" class="danger-btn">Lokale data resetten</button>`)};
  const previousBind=bindPage;
  bindPage=function(){previousBind();q('#resetLocalData')?.addEventListener('click',()=>{if(confirm('Alle lokale SchoolPortal-data wissen?')){localStorage.removeItem('schoolportal-state');location.reload()}})};

  render();
})();