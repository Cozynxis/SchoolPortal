'use client';

import { useMemo, useState } from 'react';
import {
  Bell, BookOpen, CalendarDays, CheckCircle2, ChevronRight, ClipboardCheck,
  GraduationCap, Home, LogOut, Menu, MessageSquare, Moon, Search, Settings,
  Sun, Users, X, Plus, Clock3, ChartNoAxesColumnIncreasing, CircleUserRound,
  School, FileText, UserCheck, LayoutDashboard, Sparkles
} from 'lucide-react';

type Role = 'leerling' | 'docent';
type NavItem = { id: string; label: string; icon: React.ComponentType<{size?: number}> };

const studentNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'rooster', label: 'Rooster', icon: CalendarDays },
  { id: 'huiswerk', label: 'Huiswerk', icon: BookOpen },
  { id: 'toetsen', label: 'Toetsen', icon: ClipboardCheck },
  { id: 'cijfers', label: 'Cijfers', icon: ChartNoAxesColumnIncreasing },
  { id: 'absenties', label: 'Absenties', icon: UserCheck },
  { id: 'vakken', label: 'Vakken', icon: GraduationCap },
  { id: 'berichten', label: 'Berichten', icon: MessageSquare },
  { id: 'bestanden', label: 'Bestanden', icon: FileText },
  { id: 'profiel', label: 'Profiel', icon: CircleUserRound },
  { id: 'instellingen', label: 'Instellingen', icon: Settings },
];

const teacherNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'rooster', label: 'Mijn rooster', icon: CalendarDays },
  { id: 'klassen', label: 'Klassen', icon: Users },
  { id: 'aanwezigheid', label: 'Aanwezigheid', icon: UserCheck },
  { id: 'opdrachten', label: 'Opdrachten', icon: BookOpen },
  { id: 'cijfers', label: 'Cijfers invoeren', icon: ChartNoAxesColumnIncreasing },
  { id: 'berichten', label: 'Berichten', icon: MessageSquare },
  { id: 'bestanden', label: 'Bestanden', icon: FileText },
  { id: 'profiel', label: 'Profiel', icon: CircleUserRound },
  { id: 'instellingen', label: 'Instellingen', icon: Settings },
];

const lessons = [
  { time: '08:30 – 09:20', subject: 'Nederlands', room: 'B1.14', teacher: 'Mevr. De Vries', color: 'purple' },
  { time: '09:20 – 10:10', subject: 'Wiskunde', room: 'A2.08', teacher: 'Dhr. Jansen', color: 'blue' },
  { time: '10:30 – 11:20', subject: 'Engels', room: 'C0.03', teacher: 'Mevr. Bakker', color: 'green' },
  { time: '11:20 – 12:10', subject: 'Biologie', room: 'B2.21', teacher: 'Dhr. Smit', color: 'orange' },
  { time: '13:00 – 13:50', subject: 'Geschiedenis', room: 'A1.11', teacher: 'Mevr. Vos', color: 'red' },
];

const homeworkSeed = [
  { id: 1, subject: 'Nederlands', title: 'Lees hoofdstuk 4 en maak opdracht 12 t/m 18', due: 'Morgen', done: false },
  { id: 2, subject: 'Wiskunde', title: '§3.4 opdrachten 21, 22, 25 en 27', due: 'Vrijdag', done: false },
  { id: 3, subject: 'Engels', title: 'Learn vocabulary Unit 2', due: 'Maandag', done: true },
  { id: 4, subject: 'Biologie', title: 'Werkblad cellen afronden', due: 'Dinsdag', done: false },
];

const grades = [
  ['Wiskunde', 'Toets algebra', '8,1', '×3'], ['Engels', 'Vocabulary Unit 1', '8,3', '×1'],
  ['Nederlands', 'Leesvaardigheid', '7,4', '×2'], ['Biologie', 'Cellen', '7,8', '×2'],
  ['Geschiedenis', 'Middeleeuwen', '6,9', '×2'], ['Wiskunde', 'SO hoofdstuk 2', '6,4', '×1'],
];

const messages = [
  { from: 'Mevr. De Vries', text: 'Vergeet morgen je leesboek niet mee te nemen.', time: '16:42', unread: true },
  { from: 'Dhr. Jansen', text: 'De uitwerkingen van hoofdstuk 3 staan online.', time: 'Gisteren', unread: false },
  { from: 'Schooladministratie', text: 'Nieuwe informatie over de studiedag.', time: 'Maandag', unread: false },
];

export default function SchoolPortal() {
  const [role, setRole] = useState<Role>('leerling');
  const [page, setPage] = useState('dashboard');
  const [dark, setDark] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [homework, setHomework] = useState(homeworkSeed);
  const [notice, setNotice] = useState('');
  const nav = role === 'leerling' ? studentNav : teacherNav;

  const pageTitle = nav.find(n => n.id === page)?.label ?? 'Dashboard';
  const completed = homework.filter(h => h.done).length;
  const average = useMemo(() => {
    const nums = grades.map(g => Number(g[2].replace(',', '.')));
    return (nums.reduce((a,b)=>a+b,0)/nums.length).toFixed(1).replace('.', ',');
  }, []);

  function switchRole(next: Role) {
    setRole(next); setPage('dashboard'); setNotice(`Gewisseld naar ${next}`);
    setTimeout(() => setNotice(''), 1800);
  }

  function toggleHomework(id: number) {
    setHomework(items => items.map(h => h.id === id ? { ...h, done: !h.done } : h));
  }

  return (
    <main className={dark ? 'app dark' : 'app'}>
      {notice && <div className="toast"><CheckCircle2 size={18}/>{notice}</div>}
      <aside className={sidebar ? 'sidebar open' : 'sidebar'}>
        <div className="brand"><div className="brandmark"><School size={23}/></div><div><strong>SchoolPortal</strong><span>Delta College</span></div></div>
        <nav>
          {nav.map(item => {
            const Icon = item.icon;
            return <button key={item.id} className={page === item.id ? 'navitem active' : 'navitem'} onClick={() => {setPage(item.id);setSidebar(false)}}><Icon size={19}/><span>{item.label}</span>{page === item.id && <span className="active-dot"/>}</button>
          })}
        </nav>
        <div className="sidebarBottom">
          <div className="roleSwitch"><span>Bekijk als</span><div><button className={role==='leerling'?'selected':''} onClick={()=>switchRole('leerling')}>Leerling</button><button className={role==='docent'?'selected':''} onClick={()=>switchRole('docent')}>Docent</button></div></div>
          <button className="navitem"><LogOut size={18}/>Uitloggen</button>
        </div>
      </aside>
      {sidebar && <button className="scrim" onClick={()=>setSidebar(false)} aria-label="Sluit menu"/>}

      <section className="workspace">
        <header>
          <div className="headerTitle"><button className="mobileMenu" onClick={()=>setSidebar(true)}><Menu/></button><div><span>{role === 'leerling' ? 'Leerlingportaal' : 'Docentenportaal'}</span><h1>{pageTitle}</h1></div></div>
          <div className="headerActions"><div className="search"><Search size={18}/><input placeholder="Zoeken..."/></div><button className="iconButton" onClick={()=>setDark(v=>!v)}>{dark?<Sun size={19}/>:<Moon size={19}/>}</button><button className="iconButton notify"><Bell size={19}/><i/></button><div className="avatar">{role==='leerling'?'LW':'JD'}</div></div>
        </header>

        <div className="content fadeIn">
          {page === 'dashboard' && (role === 'leerling' ? <StudentDashboard setPage={setPage} homework={homework} completed={completed} average={average}/> : <TeacherDashboard setPage={setPage}/>)}
          {page === 'rooster' && <Schedule teacher={role==='docent'}/>} 
          {page === 'huiswerk' && <Homework homework={homework} toggle={toggleHomework}/>} 
          {page === 'toetsen' && <Tests/>}
          {page === 'cijfers' && (role==='leerling'?<Grades average={average}/>:<TeacherGrades/>)}
          {page === 'absenties' && <Absences/>}
          {page === 'vakken' && <Subjects/>}
          {page === 'berichten' && <Messages/>}
          {page === 'bestanden' && <Files/>}
          {page === 'profiel' && <Profile role={role}/>} 
          {page === 'instellingen' && <SettingsPage dark={dark} setDark={setDark}/>} 
          {page === 'klassen' && <Classes/>}
          {page === 'aanwezigheid' && <Attendance/>}
          {page === 'opdrachten' && <Assignments/>}
        </div>
      </section>
    </main>
  );
}

function StudentDashboard({setPage, homework, completed, average}:{setPage:(p:string)=>void,homework:typeof homeworkSeed,completed:number,average:string}) {
  return <><div className="hero"><div><span className="eyebrow"><Sparkles size={15}/> Woensdag 26 augustus</span><h2>Goedemiddag, Levi</h2><p>Je hebt vandaag nog 3 lessen en 2 openstaande taken.</p></div><div className="heroOrb"><GraduationCap/></div></div>
  <div className="stats"><Stat label="Gemiddelde" value={average} hint="+0,2 deze periode"/><Stat label="Open huiswerk" value={String(homework.length-completed)} hint={`${completed} afgerond`}/><Stat label="Aanwezigheid" value="97%" hint="Dit schooljaar"/><Stat label="Volgende toets" value="4 d" hint="Wiskunde · Algebra"/></div>
  <div className="grid2"><Card title="Vandaag" action="Volledig rooster" onAction={()=>setPage('rooster')}><div className="timeline">{lessons.slice(2).map((l,i)=><div className="lesson" key={l.subject}><div className="time">{l.time.split(' – ')[0]}</div><div className={`lessonBar ${l.color}`}/><div><strong>{l.subject}</strong><span>{l.room} · {l.teacher}</span></div>{i===0&&<b className="now">VOLGENDE</b>}</div>)}</div></Card>
  <Card title="Huiswerk" action="Alles bekijken" onAction={()=>setPage('huiswerk')}><div className="taskList">{homework.slice(0,3).map(h=><div className="task" key={h.id}><span className={h.done?'check done':'check'}>{h.done&&'✓'}</span><div><strong>{h.subject}</strong><span>{h.title}</span></div><em>{h.due}</em></div>)}</div></Card></div>
  <div className="grid2"><Card title="Laatste cijfers" action="Cijferoverzicht" onAction={()=>setPage('cijfers')}><div className="gradeRows">{grades.slice(0,4).map(g=><div key={g[0]+g[1]}><div><strong>{g[0]}</strong><span>{g[1]}</span></div><b className={Number(g[2].replace(',','.'))>=7.5?'grade high':'grade'}>{g[2]}</b></div>)}</div></Card><Card title="Berichten" action="Inbox openen" onAction={()=>setPage('berichten')}><div className="messageRows">{messages.map(m=><div key={m.from}><div className="miniAvatar">{m.from.split(' ').slice(-1)[0][0]}</div><div><strong>{m.from}{m.unread&&<i className="unread"/>}</strong><span>{m.text}</span></div><em>{m.time}</em></div>)}</div></Card></div></>
}

function TeacherDashboard({setPage}:{setPage:(p:string)=>void}) {
  return <><div className="hero teacher"><div><span className="eyebrow"><Sparkles size={15}/> Woensdag 26 augustus</span><h2>Goedemiddag, meneer De Jong</h2><p>Vandaag geef je 5 lessen aan 4 verschillende klassen.</p></div><div className="heroOrb"><Users/></div></div><div className="stats"><Stat label="Lessen vandaag" value="5" hint="Eerste om 08:30"/><Stat label="Na te kijken" value="23" hint="3 opdrachten"/><Stat label="Mentorleerlingen" value="26" hint="Klas 3M2"/><Stat label="Ongelezen" value="4" hint="Nieuwe berichten"/></div><div className="grid2"><Card title="Mijn lessen" action="Rooster" onAction={()=>setPage('rooster')}><div className="timeline">{lessons.slice(0,4).map((l,i)=><div className="lesson" key={l.subject}><div className="time">{l.time.split(' – ')[0]}</div><div className={`lessonBar ${l.color}`}/><div><strong>{['3M2','2K1','3M1','4M2'][i]} · {l.subject}</strong><span>{l.room} · {i===0?'28':'25'} leerlingen</span></div>{i===0&&<b className="now">VOLGENDE</b>}</div>)}</div></Card><Card title="Snelle acties"><div className="quickGrid"><button onClick={()=>setPage('aanwezigheid')}><UserCheck/><strong>Aanwezigheid</strong><span>Registreren</span></button><button onClick={()=>setPage('cijfers')}><ChartNoAxesColumnIncreasing/><strong>Cijfers</strong><span>Invoeren</span></button><button onClick={()=>setPage('opdrachten')}><Plus/><strong>Opdracht</strong><span>Aanmaken</span></button><button onClick={()=>setPage('berichten')}><MessageSquare/><strong>Bericht</strong><span>Versturen</span></button></div></Card></div><div className="grid2"><Card title="Nog nakijken"><div className="taskList"><div className="task"><span className="count">12</span><div><strong>3M2 · Boekverslag</strong><span>Ingeleverd gisteren</span></div><em>12/26</em></div><div className="task"><span className="count">8</span><div><strong>2K1 · Grammatica</strong><span>Ingeleverd maandag</span></div><em>17/25</em></div><div className="task"><span className="count">3</span><div><strong>4M2 · Betoog</strong><span>Deadline vrijdag</span></div><em>21/24</em></div></div></Card><Card title="Mentorklas 3M2" action="Open klas" onAction={()=>setPage('klassen')}><div className="classSummary"><div><b>26</b><span>leerlingen</span></div><div><b>7,2</b><span>gemiddeld</span></div><div><b>96%</b><span>aanwezig</span></div></div></Card></div></>
}

function Stat({label,value,hint}:{label:string,value:string,hint:string}){return <div className="stat card"><span>{label}</span><strong>{value}</strong><small>{hint}</small></div>}
function Card({title,action,onAction,children}:{title:string,action?:string,onAction?:()=>void,children:React.ReactNode}){return <section className="card panel"><div className="cardHead"><h3>{title}</h3>{action&&<button onClick={onAction}>{action}<ChevronRight size={15}/></button>}</div>{children}</section>}

function Schedule({teacher}:{teacher:boolean}){return <><div className="toolbar"><div><button className="chip active">Deze week</button><button className="chip">Volgende week</button></div><button className="primary"><Plus size={17}/>{teacher?'Les toevoegen':'Agenda-item'}</button></div><div className="weekGrid">{['Ma 24','Di 25','Wo 26','Do 27','Vr 28'].map((d,di)=><div className={di===2?'day today':'day'} key={d}><div className="dayHead"><strong>{d}</strong>{di===2&&<span>Vandaag</span>}</div>{lessons.slice(0,di===2?5:3+(di%2)).map((l,i)=><div className={`slot ${l.color}`} key={i}><small>{l.time}</small><strong>{teacher?`${['3M2','2K1','4M2','3M1'][i%4]} · `:''}{l.subject}</strong><span>{l.room}</span></div>)}</div>)}</div></>}
function Homework({homework,toggle}:{homework:typeof homeworkSeed,toggle:(id:number)=>void}){return <><div className="toolbar"><div><button className="chip active">Openstaand</button><button className="chip">Alles</button><button className="chip">Afgerond</button></div></div><div className="listCard card">{homework.map(h=><button className="homeworkRow" key={h.id} onClick={()=>toggle(h.id)}><span className={h.done?'bigCheck checked':'bigCheck'}>{h.done&&'✓'}</span><div><strong>{h.subject}</strong><p>{h.title}</p></div><span className="due"><Clock3 size={15}/>{h.due}</span></button>)}</div></>}
function Tests(){return <div className="cards3">{[['Wiskunde','Algebra hoofdstuk 4','31 augustus','09:20'],['Engels','Vocabulary Unit 2','3 september','10:30'],['Biologie','Organen en stelsels','8 september','11:20']].map(t=><div className="card exam" key={t[0]}><span className="subjectTag">{t[0]}</span><h3>{t[1]}</h3><div><CalendarDays size={17}/>{t[2]}</div><div><Clock3 size={17}/>{t[3]}</div><button className="secondary">Details bekijken</button></div>)}</div>}
function Grades({average}:{average:string}){return <><div className="gradeHero card"><div><span>Gewogen gemiddelde</span><strong>{average}</strong><small>Schooljaar 2026–2027</small></div><div className="fakeChart">{[54,63,58,72,68,81,76,86].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div></div><div className="listCard card"><div className="tableHead"><span>Vak</span><span>Omschrijving</span><span>Weging</span><span>Cijfer</span></div>{grades.map(g=><div className="gradeTableRow" key={g[0]+g[1]}><strong>{g[0]}</strong><span>{g[1]}</span><span>{g[3]}</span><b className="grade">{g[2]}</b></div>)}</div></>}
function TeacherGrades(){const [saved,setSaved]=useState(false);return <><div className="toolbar"><select><option>3M2 · Nederlands</option><option>2K1 · Nederlands</option><option>4M2 · Nederlands</option></select><select><option>Toets leesvaardigheid</option><option>Boekverslag</option></select><button className="primary" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),1500)}}>{saved?<><CheckCircle2 size={17}/>Opgeslagen</>:<>Wijzigingen opslaan</>}</button></div><div className="listCard card teacherTable">{['Sophie de Wit','Noah Jansen','Mila Smit','Daan Bakker','Lotte Vos','Sem de Boer','Fenna Jacobs','Timo Peters'].map((n,i)=><div className="studentGrade" key={n}><div className="miniAvatar">{n.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><strong>{n}</strong><input defaultValue={['7.8','6.4','8.1','7.2','9.0','5.8','7.5','6.9'][i]}/><span>×2</span></div>)}</div></>}
function Absences(){return <div className="grid2"><Card title="Overzicht"><div className="classSummary"><div><b>2</b><span>afwezig</span></div><div><b>3</b><span>te laat</span></div><div><b>97%</b><span>aanwezig</span></div></div></Card><Card title="Registraties"><div className="taskList"><div className="task"><span className="status red">A</span><div><strong>Ziek</strong><span>12 mei · hele dag</span></div><em>Geoorloofd</em></div><div className="task"><span className="status orange">T</span><div><strong>Te laat</strong><span>4 april · 08:37</span></div><em>7 min</em></div></div></Card></div>}
function Subjects(){return <div className="cards3">{['Nederlands','Wiskunde','Engels','Biologie','Geschiedenis','Lichamelijke opvoeding'].map((s,i)=><div className="card subjectCard" key={s}><div className={`subjectIcon c${i}`}><BookOpen/></div><h3>{s}</h3><span>{['Mevr. De Vries','Dhr. Jansen','Mevr. Bakker','Dhr. Smit','Mevr. Vos','Dhr. Kuiper'][i]}</span><button className="secondary">Open vak</button></div>)}</div>}
function Messages(){const [selected,setSelected]=useState(0);return <div className="messages card"><aside>{messages.map((m,i)=><button className={selected===i?'msg active':''} onClick={()=>setSelected(i)} key={m.from}><div className="miniAvatar">{m.from[0]}</div><div><strong>{m.from}</strong><span>{m.text}</span></div>{m.unread&&<i/>}</button>)}</aside><section><div className="conversationHead"><div className="miniAvatar">{messages[selected].from[0]}</div><div><strong>{messages[selected].from}</strong><span>Online</span></div></div><div className="bubble">{messages[selected].text}</div><div className="composer"><input placeholder="Typ een bericht..."/><button className="primary">Verstuur</button></div></section></div>}
function Files(){return <><div className="toolbar"><div><button className="chip active">Alle bestanden</button><button className="chip">Gedeeld met mij</button></div><button className="primary"><Plus size={17}/>Uploaden</button></div><div className="listCard card">{[['Uitwerkingen hoofdstuk 3.pdf','PDF · 2,4 MB'],['Planning periode 1.docx','Word · 184 KB'],['Presentatie cellen.pptx','PowerPoint · 8,1 MB'],['Schoolgids 2026-2027.pdf','PDF · 4,8 MB']].map(f=><div className="fileRow" key={f[0]}><div className="fileIcon"><FileText/></div><div><strong>{f[0]}</strong><span>{f[1]}</span></div><button className="secondary">Open</button></div>)}</div></>}
function Profile({role}:{role:Role}){return <div className="profileGrid"><div className="card profileCard"><div className="profileAvatar">{role==='leerling'?'LW':'JD'}</div><h2>{role==='leerling'?'Levi Wassink':'Jeroen de Jong'}</h2><span>{role==='leerling'?'Leerling · 3M2':'Docent Nederlands · Mentor 3M2'}</span><button className="secondary">Profielfoto wijzigen</button></div><div className="card detailCard"><h3>Persoonlijke gegevens</h3>{[['E-mailadres',role==='leerling'?'levi@schoolportal.nl':'j.dejong@schoolportal.nl'],['School','Delta College'],['Rol',role==='leerling'?'Leerling':'Docent'],['Accountstatus','Actief']].map(x=><div key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong></div>)}</div></div>}
function SettingsPage({dark,setDark}:{dark:boolean,setDark:(v:boolean)=>void}){return <div className="settingsGrid"><Card title="Weergave"><label className="settingRow"><div><strong>Donkere modus</strong><span>Gebruik een donkere interface</span></div><button className={dark?'toggle on':'toggle'} onClick={()=>setDark(!dark)}><i/></button></label><label className="settingRow"><div><strong>Compact rooster</strong><span>Toon meer lessen tegelijk</span></div><button className="toggle"><i/></button></label></Card><Card title="Notificaties"><label className="settingRow"><div><strong>Nieuwe cijfers</strong><span>Melding wanneer een cijfer wordt geplaatst</span></div><button className="toggle on"><i/></button></label><label className="settingRow"><div><strong>Roosterwijzigingen</strong><span>Melding bij uitval of lokaalwijziging</span></div><button className="toggle on"><i/></button></label></Card></div>}
function Classes(){return <div className="cards3">{[['3M2','26','Mentorklas'],['2K1','25','Nederlands'],['3M1','27','Nederlands'],['4M2','24','Nederlands']].map(c=><div className="card classCard" key={c[0]}><div className="classIcon"><Users/></div><h2>{c[0]}</h2><span>{c[1]} leerlingen · {c[2]}</span><div className="progress"><i style={{width:`${80+Number(c[0][0])*3}%`}}/></div><button className="secondary">Klas openen</button></div>)}</div>}
function Attendance(){const [present,setPresent]=useState<Record<string,boolean>>({});const names=['Sophie de Wit','Noah Jansen','Mila Smit','Daan Bakker','Lotte Vos','Sem de Boer','Fenna Jacobs','Timo Peters'];return <><div className="toolbar"><div><select><option>3M2 · Nederlands · 08:30</option></select><span className="attendanceCount">{Object.values(present).filter(Boolean).length}/{names.length} aanwezig gemarkeerd</span></div><button className="primary"><CheckCircle2 size={17}/>Registratie opslaan</button></div><div className="listCard card">{names.map(n=><div className="attendanceRow" key={n}><div className="miniAvatar">{n.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><strong>{n}</strong><div><button className={present[n]===true?'present selected':'present'} onClick={()=>setPresent(p=>({...p,[n]:true}))}>Aanwezig</button><button className={present[n]===false?'absent selected':'absent'} onClick={()=>setPresent(p=>({...p,[n]:false}))}>Afwezig</button></div></div>)}</div></>}
function Assignments(){return <><div className="toolbar"><div><button className="chip active">Actief</button><button className="chip">Concepten</button><button className="chip">Gesloten</button></div><button className="primary"><Plus size={17}/>Nieuwe opdracht</button></div><div className="cards3">{[['3M2','Boekverslag','12 / 26','Morgen'],['2K1','Grammatica hoofdstuk 2','17 / 25','Vrijdag'],['4M2','Betoog schrijven','21 / 24','3 sep']].map(a=><div className="card exam" key={a[1]}><span className="subjectTag">{a[0]}</span><h3>{a[1]}</h3><div><ClipboardCheck size={17}/>{a[2]} ingeleverd</div><div><Clock3 size={17}/>Deadline {a[3]}</div><button className="secondary">Nakijken</button></div>)}</div></>}
