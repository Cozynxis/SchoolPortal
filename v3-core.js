/* SchoolPortal V3 — shared UI helpers */
(() => {
  const SP = window.SP;
  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const days = ['','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag'];
  const shortDays = ['','Ma','Di','Wo','Do','Vr'];
  const monthNames = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];

  function dateNL(value,withYear=false){
    if(!value) return '—';
    const d = new Date(`${value}T12:00:00`);
    if(Number.isNaN(d.getTime())) return esc(value);
    return `${d.getDate()} ${monthNames[d.getMonth()]}${withYear?` ${d.getFullYear()}`:''}`;
  }
  function timeNL(value){
    const d = new Date(value);
    if(Number.isNaN(d.getTime())) return value;
    return d.toLocaleTimeString('nl-NL',{hour:'2-digit',minute:'2-digit'});
  }
  function studentName(st){ return st ? `${st.firstName} ${st.lastName}` : 'Onbekende leerling'; }
  function classById(id){ return SP.state.classes.find(c=>c.id===id); }
  function studentById(id){ return SP.state.students.find(s=>s.id===id); }
  function lessonById(id){ return SP.state.schedule.find(l=>l.id===id) || SP.state.personalSchedule.find(l=>l.id===id); }
  function className(id){ return classById(id)?.name || '—'; }
  function gradeColor(g){ return g >= 7.5 ? 'good' : g < 5.5 ? 'bad' : 'mid'; }
  function studentGrades(studentId){ return SP.state.grades.filter(g=>g.studentId===studentId); }
  function weightedAverage(studentId,subject=null){
    const arr = studentGrades(studentId).filter(g=>!subject||g.subject===subject);
    const weight = arr.reduce((n,g)=>n+Number(g.weight||1),0);
    if(!weight) return null;
    return arr.reduce((n,g)=>n+(Number(g.grade)*Number(g.weight||1)),0)/weight;
  }
  function attendanceCounts(studentId){
    const arr=SP.state.attendance.filter(a=>a.studentId===studentId);
    return {
      late:arr.filter(a=>a.status==='late').length,
      absent:arr.filter(a=>a.status==='absent'||a.status==='absent_unexcused').length,
      excused:arr.filter(a=>a.status==='absent_excused').length,
      total:arr.length
    };
  }
  function initials(name){
    return String(name||'?').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
  }
  function icon(name){
    const map={
      today:'⌂',schedule:'▦',guide:'▤',grades:'7⁺',messages:'✉',registrations:'◷',profile:'○',settings:'⚙',
      dashboard:'⌂',lessons:'▣',classes:'♟',students:'♙',attendance:'✓',tests:'□',assignments:'▤',mentor:'♡',
      communication:'✉',notes:'✎',reports:'▥',files:'▧',admin:'⚒',calendar:'◫',plus:'＋',edit:'✎',trash:'×',search:'⌕',bell:'●'
    };
    return map[name]||'•';
  }
  function toast(message,type='default'){
    const root=$('#toast');
    if(!root) return;
    root.textContent=message;
    root.dataset.type=type;
    root.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>root.classList.remove('show'),2200);
  }
  function confirmAction(message,fn){
    if(!SP.state.settings.confirmDeletes || confirm(message)) fn();
  }
  function modal(title,body,{wide=false,onOpen=null}={}){
    const dialog=$('#modal');
    const box=$('#modalBody');
    if(!dialog||!box) return;
    dialog.classList.toggle('wide',wide);
    box.innerHTML=`<div class="modal-title"><div><span class="micro-label">SchoolPortal</span><h2>${esc(title)}</h2></div><button type="button" class="modal-x" data-close-modal>×</button></div>${body}`;
    $('[data-close-modal]',box)?.addEventListener('click',()=>dialog.close());
    dialog.showModal();
    if(onOpen) onOpen(box,dialog);
  }
  function field(label,name,value='',opts={}){
    const {type='text',placeholder='',required=false,full=false,min='',max='',step='',readonly=false}=opts;
    return `<label class="field ${full?'field-full':''}"><span>${esc(label)}</span><input name="${esc(name)}" type="${esc(type)}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${required?'required':''} ${readonly?'readonly':''} ${min!==''?`min="${esc(min)}"`:''} ${max!==''?`max="${esc(max)}"`:''} ${step!==''?`step="${esc(step)}"`:''}></label>`;
  }
  function selectField(label,name,options,value='',full=false){
    return `<label class="field ${full?'field-full':''}"><span>${esc(label)}</span><select name="${esc(name)}">${options.map(o=>{const v=typeof o==='string'?o:o.value,t=typeof o==='string'?o:o.label;return `<option value="${esc(v)}" ${String(v)===String(value)?'selected':''}>${esc(t)}</option>`}).join('')}</select></label>`;
  }
  function textareaField(label,name,value='',placeholder='',full=true){
    return `<label class="field ${full?'field-full':''}"><span>${esc(label)}</span><textarea name="${esc(name)}" placeholder="${esc(placeholder)}">${esc(value)}</textarea></label>`;
  }
  function form(title,content,submitLabel='Opslaan',extra=''){
    return `<form class="modal-form" data-modal-form><div class="form-grid">${content}</div><div class="modal-actions">${extra}<button type="button" class="btn ghost" data-close-modal>Annuleren</button><button class="btn primary" type="submit">${esc(submitLabel)}</button></div></form>`;
  }
  function badge(text,tone='neutral'){ return `<span class="badge ${tone}">${esc(text)}</span>`; }
  function empty(iconChar,title,text){ return `<div class="empty-state"><div class="empty-icon">${iconChar}</div><strong>${esc(title)}</strong><p>${esc(text)}</p></div>`; }
  function skeleton(lines=4){ return `<div class="skeleton-stack">${Array.from({length:lines},(_,i)=>`<div class="skeleton" style="width:${92-i*6}%"></div>`).join('')}</div>`; }
  function stat(label,value,sub='',tone=''){ return `<div class="stat-card ${tone}"><span>${esc(label)}</span><strong>${esc(value)}</strong>${sub?`<small>${esc(sub)}</small>`:''}</div>`; }
  function pageHead(title,subtitle='',actions=''){ return `<div class="page-head"><div><h1>${esc(title)}</h1>${subtitle?`<p>${esc(subtitle)}</p>`:''}</div><div class="page-actions">${actions}</div></div>`; }
  function sectionHead(title,subtitle='',action=''){ return `<div class="section-head"><div><h2>${esc(title)}</h2>${subtitle?`<p>${esc(subtitle)}</p>`:''}</div>${action}</div>`; }
  function saveAndRender(message='Opgeslagen',type='success'){
    SP.save();
    if(window.SPApp) window.SPApp.render();
    toast(message,type);
  }
  function download(filename,text,type='application/json'){
    const blob=new Blob([text],{type});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  }
  function relativeDue(date){
    const today=new Date('2026-08-26T12:00:00');
    const d=new Date(`${date}T12:00:00`);
    const diff=Math.round((d-today)/86400000);
    if(diff===0)return 'Vandaag';if(diff===1)return 'Morgen';if(diff<0)return `${Math.abs(diff)} d te laat`;return `Over ${diff} dagen`;
  }
  function scheduleForStudent(studentId){
    const st=studentById(studentId);if(!st)return[];
    return SP.state.schedule.filter(l=>l.classId===st.classId && l.studentVisible!==false);
  }
  function scheduleForTeacher(){
    return [...SP.state.schedule.filter(l=>l.teacher===SP.state.profile.teacher.name),...SP.state.personalSchedule];
  }
  function nextNumber(){
    const nums=SP.state.students.map(s=>Number(s.number)).filter(Number.isFinite);
    return String((Math.max(20260000,...nums)+1));
  }
  function addAudit(text){ SP.audit(text); }

  SP.ui={$, $$, esc, days, shortDays, dateNL, timeNL, studentName, classById, studentById, lessonById, className,
    gradeColor, studentGrades, weightedAverage, attendanceCounts, initials, icon, toast, confirmAction, modal, field,
    selectField, textareaField, form, badge, empty, skeleton, stat, pageHead, sectionHead, saveAndRender, download,
    relativeDue, scheduleForStudent, scheduleForTeacher, nextNumber, addAudit};
})();