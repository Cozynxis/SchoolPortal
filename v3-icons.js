/* SchoolPortal V3 — consistent inline SVG icon system */
(() => {
  const SP = window.SP;
  if (!SP || !SP.ui) return;

  const paths = {
    today:'<path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9 21v-7h6v7"/>',
    schedule:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="M7 14h3M14 14h3M7 18h3M14 18h3"/>',
    guide:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22Z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22Z"/>',
    grades:'<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/><path d="m17 6 2-2 2 2"/>',
    messages:'<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 9h8M8 13h5"/>',
    registrations:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.17.36.38.68.66.96.3.3.69.5 1.1.54H21v4h-.1A1.7 1.7 0 0 0 19.4 15Z"/>',
    dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    lessons:'<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    classes:'<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0M13.5 20a4.5 4.5 0 0 1 8 0"/>',
    students:'<circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/><path d="M19 5v4M17 7h4"/>',
    attendance:'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.6 2.6L16.5 9"/>',
    tests:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h5M8 16h8"/>',
    assignments:'<path d="M9 4h6l2 3h3v14H4V7h3Z"/><path d="M8 12h8M8 16h5"/>',
    mentor:'<path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z"/>',
    communication:'<path d="M4 5h16v12H8l-4 3Z"/><path d="M8 9h8M8 13h5"/>',
    notes:'<path d="M4 4h12l4 4v12H4Z"/><path d="M16 4v4h4M8 12h8M8 16h5"/>',
    reports:'<path d="M5 21V9M12 21V3M19 21v-6"/><path d="M2 21h20"/>',
    files:'<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v5h5"/>',
    admin:'<path d="m14.7 6.3 3 3M12 9l5.5-5.5a2.1 2.1 0 0 1 3 3L15 12"/><path d="M13 5 4 14l-1 5 5-1 9-9"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    edit:'<path d="M12 20h9"/><path d="m16.5 3.5 4 4L8 20l-5 1 1-5Z"/>',
    trash:'<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
    moon:'<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>',
    chevron:'<path d="m9 18 6-6-6-6"/>',
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>',
    download:'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>',
    upload:'<path d="M12 21V9M7 14l5-5 5 5"/><path d="M5 3h14"/>',
    filter:'<path d="M4 5h16l-6 7v5l-4 2v-7Z"/>',
    more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'
  };

  function svg(name, size=18, cls='sp-icon') {
    const body = paths[name] || paths.more;
    return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
  }

  SP.ui.icon = (name) => svg(name);
  SP.ui.svgIcon = svg;
})();