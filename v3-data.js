/* SchoolPortal V3 — static demo data and persistence model */
(() => {
  const STORAGE_KEY = 'schoolportal-v3';
  const now = () => new Date().toISOString();
  const id = prefix => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;

  const seed = {
    version: 3,
    role: 'student',
    studentPage: 'today',
    teacherPage: 'today',
    theme: 'light',
    accent: 'blue',
    compact: false,
    selectedStudentId: 'stu_001',
    selectedClassId: 'cls_3m2',
    selectedConversationId: 'conv_teacher',
    profile: {
      student: { name: 'Levi Wassink', initials: 'LW', email: 'levi@school.nl', classId: 'cls_3m2', number: '20263184' },
      teacher: { name: 'J. de Jong', initials: 'JD', email: 'j.dejong@school.nl', employeeNumber: 'D-1042', subject: 'Nederlands' }
    },
    classes: [
      { id:'cls_3m2', name:'3M2', year:3, level:'Mavo', mentor:'J. de Jong', subject:'Nederlands', color:'#0f74bd' },
      { id:'cls_2k1', name:'2K1', year:2, level:'Kader', mentor:'S. Vos', subject:'Nederlands', color:'#6f4bb8' },
      { id:'cls_3m1', name:'3M1', year:3, level:'Mavo', mentor:'M. Smit', subject:'Nederlands', color:'#198754' },
      { id:'cls_4m2', name:'4M2', year:4, level:'Mavo', mentor:'P. Bakker', subject:'Nederlands', color:'#cc6b16' }
    ],
    students: [
      {id:'stu_001',firstName:'Levi',lastName:'Wassink',classId:'cls_3m2',number:'20263184',email:'levi@school.nl',birthDate:'2011-03-14',status:'active',mentor:'J. de Jong',phone:'06 12345678',parent:'M. Wassink',parentEmail:'ouder1@example.nl',tags:['mentor'],notes:'',avatar:'LW'},
      {id:'stu_002',firstName:'Daan',lastName:'Jansen',classId:'cls_3m2',number:'20263185',email:'daan@school.nl',birthDate:'2011-06-03',status:'active',mentor:'J. de Jong',phone:'06 22345678',parent:'A. Jansen',parentEmail:'ouder2@example.nl',tags:[],notes:'',avatar:'DJ'},
      {id:'stu_003',firstName:'Sophie',lastName:'de Vries',classId:'cls_3m2',number:'20263186',email:'sophie@school.nl',birthDate:'2011-08-17',status:'active',mentor:'J. de Jong',phone:'06 32345678',parent:'T. de Vries',parentEmail:'ouder3@example.nl',tags:['extra aandacht'],notes:'',avatar:'SD'},
      {id:'stu_004',firstName:'Milan',lastName:'Smit',classId:'cls_3m2',number:'20263187',email:'milan@school.nl',birthDate:'2011-01-26',status:'active',mentor:'J. de Jong',phone:'06 42345678',parent:'R. Smit',parentEmail:'ouder4@example.nl',tags:[],notes:'',avatar:'MS'},
      {id:'stu_005',firstName:'Noa',lastName:'Bakker',classId:'cls_3m2',number:'20263188',email:'noa@school.nl',birthDate:'2011-09-05',status:'active',mentor:'J. de Jong',phone:'06 52345678',parent:'D. Bakker',parentEmail:'ouder5@example.nl',tags:[],notes:'',avatar:'NB'},
      {id:'stu_006',firstName:'Finn',lastName:'Vos',classId:'cls_3m2',number:'20263189',email:'finn@school.nl',birthDate:'2011-12-09',status:'active',mentor:'J. de Jong',phone:'06 62345678',parent:'K. Vos',parentEmail:'ouder6@example.nl',tags:['dyslexie'],notes:'',avatar:'FV'},
      {id:'stu_007',firstName:'Emma',lastName:'Peters',classId:'cls_3m2',number:'20263190',email:'emma@school.nl',birthDate:'2011-04-18',status:'active',mentor:'J. de Jong',phone:'06 72345678',parent:'J. Peters',parentEmail:'ouder7@example.nl',tags:[],notes:'',avatar:'EP'},
      {id:'stu_008',firstName:'Lucas',lastName:'Meijer',classId:'cls_3m2',number:'20263191',email:'lucas@school.nl',birthDate:'2011-11-20',status:'active',mentor:'J. de Jong',phone:'06 82345678',parent:'B. Meijer',parentEmail:'ouder8@example.nl',tags:[],notes:'',avatar:'LM'},
      {id:'stu_009',firstName:'Lotte',lastName:'Bos',classId:'cls_3m2',number:'20263192',email:'lotte@school.nl',birthDate:'2011-02-11',status:'active',mentor:'J. de Jong',phone:'06 92345678',parent:'P. Bos',parentEmail:'ouder9@example.nl',tags:[],notes:'',avatar:'LB'},
      {id:'stu_010',firstName:'Sem',lastName:'Mulder',classId:'cls_2k1',number:'20262101',email:'sem@school.nl',birthDate:'2012-03-01',status:'active',mentor:'S. Vos',phone:'06 11112222',parent:'M. Mulder',parentEmail:'ouder10@example.nl',tags:[],notes:'',avatar:'SM'},
      {id:'stu_011',firstName:'Yara',lastName:'Hoek',classId:'cls_2k1',number:'20262102',email:'yara@school.nl',birthDate:'2012-07-12',status:'active',mentor:'S. Vos',phone:'06 33334444',parent:'E. Hoek',parentEmail:'ouder11@example.nl',tags:[],notes:'',avatar:'YH'},
      {id:'stu_012',firstName:'Noud',lastName:'Kuiper',classId:'cls_3m1',number:'20263121',email:'noud@school.nl',birthDate:'2011-10-22',status:'active',mentor:'M. Smit',phone:'06 55556666',parent:'S. Kuiper',parentEmail:'ouder12@example.nl',tags:[],notes:'',avatar:'NK'}
    ],
    schedule: [
      {id:'les_001',day:1,start:'08:30',end:'09:20',subject:'Nederlands',classId:'cls_3m2',room:'B1.14',teacher:'J. de Jong',type:'lesson',studentVisible:true,status:'normal'},
      {id:'les_002',day:1,start:'09:20',end:'10:10',subject:'Wiskunde',classId:'cls_3m2',room:'A2.08',teacher:'Dhr. Jansen',type:'lesson',studentVisible:true,status:'normal'},
      {id:'les_003',day:1,start:'10:30',end:'11:20',subject:'Engels',classId:'cls_3m2',room:'C0.03',teacher:'Mevr. Bakker',type:'lesson',studentVisible:true,status:'normal'},
      {id:'les_004',day:1,start:'11:20',end:'12:10',subject:'Biologie',classId:'cls_3m2',room:'B2.21',teacher:'Dhr. Smit',type:'lesson',studentVisible:true,status:'changed'},
      {id:'les_005',day:2,start:'08:30',end:'09:20',subject:'Nederlands',classId:'cls_2k1',room:'B1.14',teacher:'J. de Jong',type:'lesson',studentVisible:true,status:'normal'},
      {id:'les_006',day:2,start:'09:20',end:'10:10',subject:'Nederlands',classId:'cls_3m1',room:'B1.14',teacher:'J. de Jong',type:'lesson',studentVisible:true,status:'normal'},
      {id:'les_007',day:2,start:'10:30',end:'11:20',subject:'Nederlands',classId:'cls_3m2',room:'B1.14',teacher:'J. de Jong',type:'lesson',studentVisible:true,status:'normal'},
      {id:'les_008',day:2,start:'13:00',end:'13:50',subject:'Mentoruur',classId:'cls_3m2',room:'A0.09',teacher:'J. de Jong',type:'mentor',studentVisible:true,status:'normal'},
      {id:'les_009',day:3,start:'08:30',end:'09:20',subject:'Nederlands',classId:'cls_4m2',room:'B1.14',teacher:'J. de Jong',type:'lesson',studentVisible:true,status:'normal'},
      {id:'les_010',day:3,start:'09:20',end:'10:10',subject:'Nederlands',classId:'cls_3m2',room:'B1.14',teacher:'J. de Jong',type:'lesson',studentVisible:true,status:'normal'},
      {id:'les_011',day:3,start:'11:20',end:'12:10',subject:'Teamoverleg',classId:null,room:'Personeelskamer',teacher:'J. de Jong',type:'meeting',studentVisible:false,status:'normal'},
      {id:'les_012',day:4,start:'08:30',end:'09:20',subject:'Nederlands',classId:'cls_2k1',room:'B1.14',teacher:'J. de Jong',type:'lesson',studentVisible:true,status:'normal'},
      {id:'les_013',day:4,start:'10:30',end:'11:20',subject:'Nederlands',classId:'cls_3m2',room:'B1.14',teacher:'J. de Jong',type:'lesson',studentVisible:true,status:'cancelled'},
      {id:'les_014',day:5,start:'09:20',end:'10:10',subject:'Nederlands',classId:'cls_3m1',room:'B1.14',teacher:'J. de Jong',type:'lesson',studentVisible:true,status:'normal'},
      {id:'les_015',day:5,start:'10:30',end:'11:20',subject:'Nederlands',classId:'cls_4m2',room:'B1.14',teacher:'J. de Jong',type:'lesson',studentVisible:true,status:'normal'}
    ],
    personalSchedule: [],
    studyGuides: [
      {id:'guide_1',subject:'Nederlands',title:'Periode 1 · Lezen & argumenteren',classIds:['cls_3m2'],published:true,progress:42,items:[
        {id:'g1i1',type:'homework',title:'Lees hoofdstuk 4',date:'2026-08-27',done:false},
        {id:'g1i2',type:'material',title:'Uitleg argumentatieschema',date:'2026-08-27',done:false},
        {id:'g1i3',type:'test',title:'Toets leesvaardigheid',date:'2026-09-03',done:false}
      ]},
      {id:'guide_2',subject:'Wiskunde',title:'Hoofdstuk 3 · Algebra',classIds:['cls_3m2'],published:true,progress:64,items:[
        {id:'g2i1',type:'homework',title:'§3.4 opdrachten 21–27',date:'2026-08-28',done:false},
        {id:'g2i2',type:'test',title:'Toets algebra',date:'2026-08-30',done:false}
      ]}
    ],
    homework: [
      {id:'hw_1',studentId:'stu_001',subject:'Nederlands',title:'Lees hoofdstuk 4 en maak opdracht 12 t/m 18',due:'2026-08-27',done:false,source:'guide_1'},
      {id:'hw_2',studentId:'stu_001',subject:'Wiskunde',title:'§3.4 opdrachten 21, 22, 25 en 27',due:'2026-08-28',done:false,source:'guide_2'},
      {id:'hw_3',studentId:'stu_001',subject:'Engels',title:'Learn vocabulary Unit 2',due:'2026-08-31',done:true,source:null}
    ],
    tests: [
      {id:'test_1',subject:'Wiskunde',title:'Toets algebra',date:'2026-08-30',weight:3,classIds:['cls_3m2'],published:true},
      {id:'test_2',subject:'Engels',title:'Vocabulary Unit 2',date:'2026-09-02',weight:1,classIds:['cls_3m2'],published:true},
      {id:'test_3',subject:'Nederlands',title:'Leesvaardigheid',date:'2026-09-03',weight:2,classIds:['cls_3m2'],published:true}
    ],
    grades: [
      {id:'gr_1',studentId:'stu_001',subject:'Nederlands',title:'Leesvaardigheid',grade:7.4,weight:2,date:'2026-08-18'},
      {id:'gr_2',studentId:'stu_001',subject:'Wiskunde',title:'SO hoofdstuk 2',grade:6.4,weight:1,date:'2026-08-14'},
      {id:'gr_3',studentId:'stu_001',subject:'Engels',title:'Vocabulary Unit 1',grade:8.3,weight:1,date:'2026-08-11'},
      {id:'gr_4',studentId:'stu_001',subject:'Biologie',title:'Cellen',grade:7.8,weight:2,date:'2026-08-06'},
      {id:'gr_5',studentId:'stu_002',subject:'Nederlands',title:'Leesvaardigheid',grade:6.8,weight:2,date:'2026-08-18'},
      {id:'gr_6',studentId:'stu_003',subject:'Nederlands',title:'Leesvaardigheid',grade:8.1,weight:2,date:'2026-08-18'},
      {id:'gr_7',studentId:'stu_004',subject:'Nederlands',title:'Leesvaardigheid',grade:5.7,weight:2,date:'2026-08-18'},
      {id:'gr_8',studentId:'stu_005',subject:'Nederlands',title:'Leesvaardigheid',grade:7.6,weight:2,date:'2026-08-18'},
      {id:'gr_9',studentId:'stu_006',subject:'Nederlands',title:'Leesvaardigheid',grade:6.2,weight:2,date:'2026-08-18'},
      {id:'gr_10',studentId:'stu_007',subject:'Nederlands',title:'Leesvaardigheid',grade:8.7,weight:2,date:'2026-08-18'}
    ],
    attendance: [
      {id:'att_1',studentId:'stu_001',lessonId:'les_001',date:'2026-08-25',status:'present',minutes:0,note:''},
      {id:'att_2',studentId:'stu_002',lessonId:'les_001',date:'2026-08-25',status:'late',minutes:6,note:'Bus vertraging'},
      {id:'att_3',studentId:'stu_003',lessonId:'les_001',date:'2026-08-25',status:'absent_excused',minutes:50,note:'Ziekgemeld'},
      {id:'att_4',studentId:'stu_001',lessonId:'les_002',date:'2026-08-12',status:'late',minutes:7,note:''}
    ],
    assignments: [
      {id:'as_1',classId:'cls_3m2',title:'Boekverslag',subject:'Nederlands',due:'2026-09-04',instructions:'Schrijf een boekverslag van 600-800 woorden.',published:true,submitted:12,total:26},
      {id:'as_2',classId:'cls_2k1',title:'Grammatica hoofdstuk 2',subject:'Nederlands',due:'2026-09-01',instructions:'Maak opdrachten 1 t/m 16.',published:true,submitted:17,total:25}
    ],
    notes: [
      {id:'note_1',studentId:'stu_003',author:'J. de Jong',date:'2026-08-21',category:'mentor',text:'Kort gesprek gehad over planning. Volgende week opnieuw checken.',private:true},
      {id:'note_2',studentId:'stu_001',author:'J. de Jong',date:'2026-08-19',category:'positief',text:'Actief meegedaan tijdens mentoruur.',private:true}
    ],
    announcements: [
      {id:'ann_1',title:'Studiedag vrijdag 18 september',body:'Op vrijdag 18 september zijn er geen reguliere lessen.',audience:'all',date:'2026-08-25',published:true},
      {id:'ann_2',title:'Nieuwe boeken ophalen',body:'Leerlingen uit leerjaar 3 kunnen donderdag hun aanvullende boeken ophalen.',audience:'students',date:'2026-08-24',published:true}
    ],
    conversations: [
      {id:'conv_teacher',title:'Mevr. De Vries',members:['stu_001','teacher_dev'],unread:1,messages:[
        {id:'m1',from:'Mevr. De Vries',text:'Vergeet morgen je leesboek niet mee te nemen.',time:'2026-08-26T16:42:00'},
        {id:'m2',from:'Levi Wassink',text:'Komt goed, bedankt!',time:'2026-08-26T16:48:00'}
      ]},
      {id:'conv_admin',title:'Schooladministratie',members:['stu_001'],unread:0,messages:[{id:'m3',from:'Schooladministratie',text:'Nieuwe informatie over de studiedag staat bij mededelingen.',time:'2026-08-25T10:20:00'}]}
    ],
    teacherMessages: [
      {id:'tm1',to:'Klas 3M2',subject:'Leesboek meenemen',body:'Neem morgen je leesboek mee.',date:'2026-08-26',status:'sent'},
      {id:'tm2',to:'Ouders 3M2',subject:'Mentoravond',body:'De uitnodiging volgt deze week.',date:'2026-08-25',status:'draft'}
    ],
    reports: [],
    audit: [
      {id:'au1',time:now(),actor:'Systeem',action:'SchoolPortal V3 demo geladen'}
    ],
    settings: {
      studentNotifications:true,
      studentGradeColors:true,
      teacherQuickActions:true,
      teacherDenseTables:false,
      confirmDeletes:true
    }
  };

  function deepClone(value){ return JSON.parse(JSON.stringify(value)); }
  function mergeSeed(saved){
    if(!saved || saved.version !== 3) return deepClone(seed);
    const merged = deepClone(seed);
    Object.keys(saved).forEach(key => { merged[key] = saved[key]; });
    merged.profile = {...seed.profile, ...(saved.profile||{})};
    merged.settings = {...seed.settings, ...(saved.settings||{})};
    return merged;
  }
  function load(){
    try { return mergeSeed(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
    catch { return deepClone(seed); }
  }
  function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.SP.state));
  }
  function reset(){
    localStorage.removeItem(STORAGE_KEY);
    window.SP.state = deepClone(seed);
    save();
  }
  function audit(action, actor='J. de Jong'){
    window.SP.state.audit.unshift({id:id('au'),time:now(),actor,action});
    window.SP.state.audit = window.SP.state.audit.slice(0,100);
    save();
  }

  window.SP = {
    seed,
    state: load(),
    save,
    reset,
    audit,
    id,
    storageKey: STORAGE_KEY
  };
})();