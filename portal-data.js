/*
 * SchoolPortal v2 - Demo data layer
 * Static GitHub Pages edition
 * ------------------------------------------------------------
 * Alle data in dit bestand is demo-data. De applicatie bewaart
 * wijzigingen lokaal in localStorage zodat de portal zonder
 * backend volledig interactief blijft op GitHub Pages.
 */

window.SchoolPortalData = (() => {
  const clone = (value) => JSON.parse(JSON.stringify(value));

  const subjects = [
    { id: 'ned', name: 'Nederlands', code: 'NED', teacher: 'Mevr. De Vries', room: 'B1.14', color: '#7c6cf6' },
    { id: 'wis', name: 'Wiskunde', code: 'WIS', teacher: 'Dhr. Jansen', room: 'A2.08', color: '#4f8df7' },
    { id: 'eng', name: 'Engels', code: 'ENG', teacher: 'Mevr. Bakker', room: 'C0.03', color: '#34b57a' },
    { id: 'bio', name: 'Biologie', code: 'BIO', teacher: 'Dhr. Smit', room: 'B2.21', color: '#eb9b34' },
    { id: 'ges', name: 'Geschiedenis', code: 'GES', teacher: 'Mevr. Vos', room: 'A1.11', color: '#e65c68' },
    { id: 'lo', name: 'Lichamelijke opvoeding', code: 'LO', teacher: 'Dhr. Peeters', room: 'Gymzaal 2', color: '#00a6a6' },
    { id: 'maa', name: 'Maatschappijleer', code: 'MAA', teacher: 'Mevr. Smits', room: 'A0.07', color: '#a16ae8' },
    { id: 'eco', name: 'Economie', code: 'ECO', teacher: 'Dhr. Van Dijk', room: 'C1.10', color: '#2ca58d' }
  ];

  const teachers = [
    { id: 1, name: 'Mevr. De Vries', short: 'DV', subject: 'Nederlands', email: 'devries@deltacollege.nl' },
    { id: 2, name: 'Dhr. Jansen', short: 'JA', subject: 'Wiskunde', email: 'jansen@deltacollege.nl' },
    { id: 3, name: 'Mevr. Bakker', short: 'BA', subject: 'Engels', email: 'bakker@deltacollege.nl' },
    { id: 4, name: 'Dhr. Smit', short: 'SM', subject: 'Biologie', email: 'smit@deltacollege.nl' },
    { id: 5, name: 'Mevr. Vos', short: 'VO', subject: 'Geschiedenis', email: 'vos@deltacollege.nl' },
    { id: 6, name: 'Dhr. Peeters', short: 'PE', subject: 'LO', email: 'peeters@deltacollege.nl' }
  ];

  const students = [
    'Daan Jansen','Sophie de Vries','Milan Smit','Noa Bakker','Finn Vos','Emma Peters',
    'Lucas Meijer','Lotte Bos','Sem de Boer','Julia Mulder','Max Hendriks','Sara Kuipers',
    'Luuk Verhoeven','Tess Jacobs','Sam Willems','Fleur van Leeuwen','Bram Dekker','Nina Visser',
    'Jesse Timmermans','Eva Martens','Mees Claassen','Saar Hoefnagels','Thijs van den Berg',
    'Yara van Loon','Levi Wassink','Mila van Hout'
  ].map((name, index) => ({
    id: 2026001 + index,
    name,
    className: '3M2',
    email: `${name.toLowerCase().replaceAll(' ','').replaceAll('é','e')}@leerling.deltacollege.nl`,
    mentor: 'Dhr. De Jong'
  }));

  const schedule = [
    { id: 1, day: 1, start: '08:30', end: '09:20', subject: 'Nederlands', room: 'B1.14', teacher: 'Mevr. De Vries', className: '3M2', status: 'normal' },
    { id: 2, day: 1, start: '09:20', end: '10:10', subject: 'Wiskunde', room: 'A2.08', teacher: 'Dhr. Jansen', className: '3M2', status: 'normal' },
    { id: 3, day: 1, start: '10:30', end: '11:20', subject: 'Engels', room: 'C0.03', teacher: 'Mevr. Bakker', className: '3M2', status: 'normal' },
    { id: 4, day: 1, start: '11:20', end: '12:10', subject: 'Biologie', room: 'B2.21', teacher: 'Dhr. Smit', className: '3M2', status: 'normal' },
    { id: 5, day: 1, start: '13:00', end: '13:50', subject: 'Geschiedenis', room: 'A1.11', teacher: 'Mevr. Vos', className: '3M2', status: 'normal' },
    { id: 6, day: 2, start: '08:30', end: '09:20', subject: 'Wiskunde', room: 'A2.08', teacher: 'Dhr. Jansen', className: '3M2', status: 'normal' },
    { id: 7, day: 2, start: '09:20', end: '10:10', subject: 'Nederlands', room: 'B1.14', teacher: 'Mevr. De Vries', className: '3M2', status: 'normal' },
    { id: 8, day: 2, start: '10:30', end: '11:20', subject: 'LO', room: 'Gymzaal 2', teacher: 'Dhr. Peeters', className: '3M2', status: 'normal' },
    { id: 9, day: 2, start: '11:20', end: '12:10', subject: 'LO', room: 'Gymzaal 2', teacher: 'Dhr. Peeters', className: '3M2', status: 'normal' },
    { id: 10, day: 2, start: '13:00', end: '13:50', subject: 'Economie', room: 'C1.10', teacher: 'Dhr. Van Dijk', className: '3M2', status: 'normal' },
    { id: 11, day: 3, start: '08:30', end: '09:20', subject: 'Engels', room: 'C0.03', teacher: 'Mevr. Bakker', className: '3M2', status: 'normal' },
    { id: 12, day: 3, start: '09:20', end: '10:10', subject: 'Biologie', room: 'B2.21', teacher: 'Dhr. Smit', className: '3M2', status: 'changed' },
    { id: 13, day: 3, start: '10:30', end: '11:20', subject: 'Nederlands', room: 'B1.14', teacher: 'Mevr. De Vries', className: '3M2', status: 'normal' },
    { id: 14, day: 3, start: '11:20', end: '12:10', subject: 'Geschiedenis', room: 'A1.11', teacher: 'Mevr. Vos', className: '3M2', status: 'cancelled' },
    { id: 15, day: 3, start: '13:00', end: '13:50', subject: 'Maatschappijleer', room: 'A0.07', teacher: 'Mevr. Smits', className: '3M2', status: 'normal' },
    { id: 16, day: 4, start: '08:30', end: '09:20', subject: 'Wiskunde', room: 'A2.08', teacher: 'Dhr. Jansen', className: '3M2', status: 'normal' },
    { id: 17, day: 4, start: '09:20', end: '10:10', subject: 'Engels', room: 'C0.03', teacher: 'Mevr. Bakker', className: '3M2', status: 'normal' },
    { id: 18, day: 4, start: '10:30', end: '11:20', subject: 'Economie', room: 'C1.10', teacher: 'Dhr. Van Dijk', className: '3M2', status: 'normal' },
    { id: 19, day: 4, start: '11:20', end: '12:10', subject: 'Nederlands', room: 'B1.14', teacher: 'Mevr. De Vries', className: '3M2', status: 'normal' },
    { id: 20, day: 5, start: '08:30', end: '09:20', subject: 'Biologie', room: 'B2.21', teacher: 'Dhr. Smit', className: '3M2', status: 'normal' },
    { id: 21, day: 5, start: '09:20', end: '10:10', subject: 'Wiskunde', room: 'A2.08', teacher: 'Dhr. Jansen', className: '3M2', status: 'normal' },
    { id: 22, day: 5, start: '10:30', end: '11:20', subject: 'Geschiedenis', room: 'A1.11', teacher: 'Mevr. Vos', className: '3M2', status: 'normal' },
    { id: 23, day: 5, start: '11:20', end: '12:10', subject: 'Maatschappijleer', room: 'A0.07', teacher: 'Mevr. Smits', className: '3M2', status: 'normal' }
  ];

  const homework = [
    { id: 1, subject: 'Nederlands', title: 'Lees hoofdstuk 4 en maak opdracht 12 t/m 18', due: '2026-08-27', priority: 'high', done: false, description: 'Neem je antwoorden mee naar de les.' },
    { id: 2, subject: 'Wiskunde', title: '§3.4 opdrachten 21, 22, 25 en 27', due: '2026-08-28', priority: 'medium', done: false, description: 'Gebruik de uitwerkingen pas na het maken.' },
    { id: 3, subject: 'Engels', title: 'Learn vocabulary Unit 2', due: '2026-08-31', priority: 'medium', done: true, description: 'Words 1–45.' },
    { id: 4, subject: 'Biologie', title: 'Werkblad cellen afronden', due: '2026-09-01', priority: 'low', done: false, description: 'Upload een foto van je werkblad.' },
    { id: 5, subject: 'Geschiedenis', title: 'Bronnen hoofdstuk 2 bestuderen', due: '2026-09-02', priority: 'medium', done: false, description: '' }
  ];

  const tests = [
    { id: 1, subject: 'Wiskunde', title: 'Toets algebra', date: '2026-08-30', weight: 3, room: 'A2.08', reminder: false },
    { id: 2, subject: 'Engels', title: 'Vocabulary Unit 2', date: '2026-09-02', weight: 1, room: 'C0.03', reminder: true },
    { id: 3, subject: 'Biologie', title: 'Practicum cellen', date: '2026-09-05', weight: 2, room: 'B2.21', reminder: false },
    { id: 4, subject: 'Geschiedenis', title: 'SO Middeleeuwen', date: '2026-09-09', weight: 1, room: 'A1.11', reminder: false }
  ];

  const grades = [
    { id: 1, subject: 'Wiskunde', title: 'Toets algebra', grade: 8.1, weight: 3, date: '2026-08-20', period: 1 },
    { id: 2, subject: 'Engels', title: 'Vocabulary Unit 1', grade: 8.3, weight: 1, date: '2026-08-18', period: 1 },
    { id: 3, subject: 'Nederlands', title: 'Leesvaardigheid', grade: 7.4, weight: 2, date: '2026-08-16', period: 1 },
    { id: 4, subject: 'Biologie', title: 'Cellen', grade: 7.8, weight: 2, date: '2026-08-13', period: 1 },
    { id: 5, subject: 'Geschiedenis', title: 'Middeleeuwen', grade: 6.9, weight: 2, date: '2026-08-10', period: 1 },
    { id: 6, subject: 'Wiskunde', title: 'SO hoofdstuk 2', grade: 6.4, weight: 1, date: '2026-08-06', period: 1 },
    { id: 7, subject: 'Economie', title: 'Vraag en aanbod', grade: 7.1, weight: 2, date: '2026-07-14', period: 1 }
  ];

  const messages = [
    { id: 1, contact: 'Mevr. De Vries', role: 'Docent Nederlands', unread: true, updated: '16:42', messages: [
      { id: 1, mine: false, text: 'Vergeet morgen je leesboek niet mee te nemen.', time: '16:42' }
    ]},
    { id: 2, contact: 'Dhr. Jansen', role: 'Docent Wiskunde', unread: false, updated: 'Gisteren', messages: [
      { id: 1, mine: false, text: 'De uitwerkingen van hoofdstuk 3 staan online.', time: 'Gisteren 14:10' },
      { id: 2, mine: true, text: 'Bedankt!', time: 'Gisteren 14:18' }
    ]},
    { id: 3, contact: 'Schooladministratie', role: 'Administratie', unread: false, updated: 'Maandag', messages: [
      { id: 1, mine: false, text: 'Nieuwe informatie over de studiedag staat bij mededelingen.', time: 'Maandag 09:02' }
    ]}
  ];

  const announcements = [
    { id: 1, title: 'Studiedag 11 september', body: 'Op vrijdag 11 september zijn alle lessen vervallen wegens een studiedag.', audience: 'Iedereen', date: '2026-08-25', pinned: true },
    { id: 2, title: 'Fietsenstalling ingang B', body: 'De fietsenstalling bij ingang B is deze week tijdelijk gesloten.', audience: 'Leerlingen', date: '2026-08-24', pinned: false },
    { id: 3, title: 'Schoolfotograaf', body: 'De schoolfotograaf komt op 3 september langs. Het rooster volgt later.', audience: 'Iedereen', date: '2026-08-22', pinned: false }
  ];

  const absences = [
    { id: 1, type: 'late', subject: 'Wiskunde', date: '2026-08-12', detail: '7 minuten te laat', approved: true },
    { id: 2, type: 'approved', subject: 'Tandarts', date: '2026-07-04', detail: '10:30 – 12:10', approved: true }
  ];

  const files = [
    { id: 1, type: 'PDF', name: 'Uitwerkingen hoofdstuk 3', subject: 'Wiskunde', size: '2,1 MB', date: '2026-08-25' },
    { id: 2, type: 'DOC', name: 'Boekverslag voorbeeld', subject: 'Nederlands', size: '840 KB', date: '2026-08-24' },
    { id: 3, type: 'PPT', name: 'Cellen en weefsels', subject: 'Biologie', size: '4,8 MB', date: '2026-08-22' },
    { id: 4, type: 'PDF', name: 'Studiewijzer periode 1', subject: 'School', size: '1,4 MB', date: '2026-08-20' }
  ];

  const assignments = [
    { id: 1, title: 'Boekverslag', className: '3M2', subject: 'Nederlands', due: '2026-08-28', submitted: 12, total: 26, published: true },
    { id: 2, title: 'Grammatica hoofdstuk 2', className: '2K1', subject: 'Nederlands', due: '2026-08-31', submitted: 17, total: 25, published: true },
    { id: 3, title: 'Betoog', className: '4M2', subject: 'Nederlands', due: '2026-09-04', submitted: 21, total: 24, published: false }
  ];

  const defaultState = {
    version: 2,
    role: 'student',
    activePage: 'dashboard',
    theme: 'light',
    sidebarCollapsed: false,
    accent: 'indigo',
    selectedConversation: 1,
    selectedClass: '3M2',
    weekOffset: 0,
    filters: { homework: 'all', grades: 'all', files: 'all' },
    profile: {
      student: { name: 'Levi Wassink', email: 'levi@leerling.deltacollege.nl', className: '3M2', number: '20263184', mentor: 'Dhr. De Jong' },
      teacher: { name: 'J. de Jong', email: 'j.dejong@deltacollege.nl', className: '3M2', number: 'D-1042', mentor: 'Mentor 3M2' }
    },
    settings: {
      notifications: true,
      emailNotifications: false,
      compact: false,
      animations: true,
      reducedMotion: false,
      showWeekends: false
    },
    homework: clone(homework),
    tests: clone(tests),
    grades: clone(grades),
    messages: clone(messages),
    announcements: clone(announcements),
    absences: clone(absences),
    files: clone(files),
    assignments: clone(assignments),
    attendance: {},
    teacherNotes: [],
    activity: [
      { id: 1, type: 'grade', text: 'Nieuw cijfer 8,1 voor Wiskunde', time: '2 uur geleden' },
      { id: 2, type: 'message', text: 'Nieuw bericht van Mevr. De Vries', time: '3 uur geleden' },
      { id: 3, type: 'homework', text: 'Huiswerk Biologie toegevoegd', time: 'Gisteren' }
    ]
  };

  return {
    clone,
    subjects,
    teachers,
    students,
    schedule,
    defaultState
  };
})();
