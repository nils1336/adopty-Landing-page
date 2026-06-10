'use strict';

// ─── Config ───────────────────────────────────────────────────────────────────
const CONTACT_ENDPOINT = '/api/contact.php';

// ─── Feature data (DE + EN) ───────────────────────────────────────────────────
const FEATURES_DE = [
  { label:'Social Discovery Feed',         core:true,  cat:'Adoption',    why:'Mitarbeiter entdecken Workflows von Kollegen — wie LinkedIn, aber intern.',        excel:'no',  conf:'no',  notion:'partial', notes:{notion:'Nur als Datenbank-Ansicht — kein Feed, keine Bewertungen, kein sozialer Kontext.'} },
  { label:'ROI-Messung (Stunden & €)',      core:true,  cat:'Analytics',   why:'Der CFO fragt nach Zahlen — Adopty liefert sie automatisch.',                        excel:'partial', conf:'no', notion:'partial', notes:{excel:'Manuell berechenbar, aber keine Live-Daten, kein automatisches Tracking.', notion:'Über Formeln möglich, aber aufwendig zu pflegen und nicht automatisch.'} },
  { label:'Adoption-Tracking',             core:true,  cat:'Analytics',   why:'Wer hat welchen Workflow tatsächlich übernommen und nutzt ihn?',                     excel:'no',  conf:'no',  notion:'no',      notes:{} },
  { label:'Freigabeprozess für Admins',    core:true,  cat:'Governance',  why:'Qualitätskontrolle: nur geprüfte Workflows erreichen den Feed.',                     excel:'no',  conf:'partial', notion:'partial', notes:{conf:'Seitenreview möglich, aber kein dedizierter Workflow-Freigabeprozess.', notion:'Database-Status anpassbar, aber kein nativer Approval-Flow.'} },
  { label:'Prompt-Bibliothek & Copy',      cat:'Adoption',    why:'Prompts strukturiert ablegen, versionieren, direkt per Klick kopieren.',            excel:'partial', conf:'partial', notion:'partial', notes:{excel:'Text in Zellen — kein Syntax-Highlighting, kein 1-Klick-Copy.', conf:'Code-Blöcke vorhanden, aber kein Prompt-spezifisches UX.', notion:'Code-Blöcke + Copy-Button, aber keine Versionierung oder Prompt-Kontext.'} },
  { label:'Webhook-Import (n8n / Zapier)', cat:'Adoption',    why:'Workflows automatisch aus bestehenden Tools importieren — 0 manueller Aufwand.',    excel:'no',  conf:'no',  notion:'partial', notes:{notion:'Notion API vorhanden, aber komplexe Einrichtung ohne nativen Webhook-Endpunkt.'} },
  { label:'Abteilungsfilter & KI-Empfehlungen', cat:'Adoption', why:'Marketing sieht Marketing-Workflows, HR die HR-relevanten — personalisiert.',   excel:'partial', conf:'partial', notion:'partial', notes:{excel:'Manuell filterbar — keine Personalisierung.', conf:'Spaces pro Team möglich, aber kein Empfehlungsalgorithmus.', notion:'Filter-Ansichten möglich, aber kein automatisches Empfehlungssystem.'} },
  { label:'EU AI Act Compliance',          cat:'Governance',  why:'Risikoeinstufung, Checklisten und Audit-Log pro Workflow — ab 2026 Pflicht.',       excel:'partial', conf:'partial', notion:'partial', notes:{excel:'Eigene Tabellen möglich, aber kein strukturiertes Compliance-Framework.', conf:'Dokumentation möglich, aber keine integrierten Risikobewertungen.', notion:'Flexible Datenbanken, aber keine eingebaute EU AI Act Logik.'} },
  { label:'Setup-Zeit bis erster Workflow', core:true, cat:'Onboarding', why:'Schneller Start = schnellerer ROI.',                                                 excel:'partial', conf:'partial', notion:'partial', notes:{excel:'1–2 Stunden für sinnvolle Struktur. Ohne IT-Kenntnisse schnell chaotisch.', conf:'Einrichtung + Schulung: oft mehrere Tage.', notion:'Flexibel, aber hohes Setup-Investment für sinnvolle KI-Workflow-Strukturen.'} },
  { label:'Skalierung auf 100+ Workflows', cat:'Onboarding', why:'Mit wachsendem Wissensschatz muss die Plattform mithalten.',                         excel:'no',  conf:'partial', notion:'partial', notes:{conf:'Viele Seiten werden schnell unübersichtlich ohne klare Governance.', notion:'Datenbanken skalieren gut, aber Discovery leidet ohne Feed-Mechanik.'} },
  { label:'Abteilungs-Onboarding',         cat:'Onboarding', why:'Neue Mitarbeitende starten strukturiert — mit Lernpfad für ihre Abteilung.',      excel:'no',  conf:'no',      notion:'partial', notes:{notion:'Manuell als Datenbank einrichtbar, aber kein automatischer Onboarding-Trigger.'} },
];

const FEATURES_EN = [
  { label:'Social Discovery Feed',              core:true,  cat:'Adoption',    why:'Employees discover workflows from colleagues — like LinkedIn, but internal.',    excel:'no',  conf:'no',  notion:'partial', notes:{notion:'Database view only — no feed, no ratings, no social context.'} },
  { label:'ROI Tracking (hours & €)',           core:true,  cat:'Analytics',   why:'The CFO asks for numbers — Adopty delivers them automatically.',                  excel:'partial', conf:'no', notion:'partial', notes:{excel:'Manually calculable, but no live data, no automatic tracking.', notion:'Possible via formulas, but cumbersome to maintain and not automated.'} },
  { label:'Adoption Tracking',                  core:true,  cat:'Analytics',   why:'Who actually adopted which workflow and is using it?',                            excel:'no',  conf:'no',  notion:'no',      notes:{} },
  { label:'Admin Approval Workflow',            core:true,  cat:'Governance',  why:'Quality control: only reviewed workflows reach the feed.',                        excel:'no',  conf:'partial', notion:'partial', notes:{conf:'Page review possible, but no dedicated workflow approval process.', notion:'Database status customisable, but no native approval flow.'} },
  { label:'Prompt Library & Copy',              cat:'Adoption',    why:'Store prompts, version them, copy with one click.',                               excel:'partial', conf:'partial', notion:'partial', notes:{excel:'Text in cells — no syntax highlighting, no 1-click copy.', conf:'Code blocks available, but no prompt-specific UX.', notion:'Code blocks + copy button, but no versioning or prompt context.'} },
  { label:'Webhook Import (n8n / Zapier)',       cat:'Adoption',    why:'Auto-import workflows from existing tools — zero manual effort.',                 excel:'no',  conf:'no',  notion:'partial', notes:{notion:'Notion API available, but complex setup without a native webhook endpoint.'} },
  { label:'Department Filter & AI Recs',        cat:'Adoption',    why:'Marketing sees marketing workflows, HR sees HR-relevant ones — personalised.',   excel:'partial', conf:'partial', notion:'partial', notes:{excel:'Manually filterable — no personalisation.', conf:'Team spaces possible, but no recommendation engine.', notion:'Filter views possible, but no automatic recommendation system.'} },
  { label:'EU AI Act Compliance',               cat:'Governance',  why:'Risk classification, checklists & audit log per workflow — mandatory from 2026.',excel:'partial', conf:'partial', notion:'partial', notes:{excel:'Custom tables possible, but no structured compliance framework.', conf:'Documentation possible, but no integrated risk assessments.', notion:'Flexible databases, but no built-in EU AI Act logic.'} },
  { label:'Time-to-First-Workflow',             core:true,  cat:'Onboarding',  why:'Faster start = faster ROI.',                                                      excel:'partial', conf:'partial', notion:'partial', notes:{excel:'1–2 hours for a sensible structure. Gets chaotic fast without IT knowledge.', conf:'Setup + training: often several days.', notion:'Flexible, but high setup investment for meaningful AI workflow structures.'} },
  { label:'Scales to 100+ Workflows',           cat:'Onboarding',  why:'As the knowledge base grows, the platform must keep up.',                         excel:'no',  conf:'partial', notion:'partial', notes:{conf:'Many pages get messy fast without clear governance.', notion:'Databases scale well, but discovery suffers without feed mechanics.'} },
  { label:'Department Onboarding',              cat:'Onboarding',  why:'New employees start structured — with a learning path for their department.',  excel:'no',  conf:'no',      notion:'partial', notes:{notion:'Manually set up as a database, but no automatic onboarding trigger.'} },
];

const TOOLS = [
  { key:'excel', label:'Excel',      bg:'#f0faf4', tc:'#165c38', color:'#217346' },
  { key:'conf',  label:'Confluence', bg:'#eff4ff', tc:'#0a3d8f', color:'#0052cc' },
  { key:'notion',label:'Notion',     bg:'#f7f6f3', tc:'#37352f', color:'#37352f' },
];

// ─── SVG helpers ──────────────────────────────────────────────────────────────
const svg = (paths, w=16, h=16, cls='') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cls}">${paths}</svg>`;

const CHECK_CIRCLE = svg('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>');
const CHECK_CIRCLE_SM = svg('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',14,14);
const MINUS = svg('<line x1="5" y1="12" x2="19" y2="12"/>');
const X_ICON = svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>');
const ZAP_SM = svg('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',14,14);

function supportIcon(s) {
  if (s==='full')    return `<span style="color:#10b981">${CHECK_CIRCLE_SM}</span>`;
  if (s==='partial') return `<span style="color:#f59e0b">${MINUS}</span>`;
  return `<span style="color:#d1d5db">${X_ICON}</span>`;
}

// ─── Comparison table renderer ────────────────────────────────────────────────
function initComparisonTable(lang) {
  const el = document.getElementById('comparison-table');
  if (!el) return;

  const features = lang === 'en' ? FEATURES_EN : FEATURES_DE;
  const cats = ['Adoption','Analytics','Governance','Onboarding'];
  const allLabel = lang === 'en' ? 'All Features' : 'Alle Features';
  const tapLabel = lang === 'en' ? 'Tap yellow cells for details' : 'Tippe auf gelbe Zellen für Details';
  const featureLabel = lang === 'en' ? 'Feature' : 'Feature';
  const resultLabel = lang === 'en' ? 'The Result' : 'Das Ergebnis';
  const coverageLabel = lang === 'en' ? 'Feature Coverage for AI Workflows' : 'Feature-Abdeckung für KI-Workflows';
  const resultText = lang === 'en'
    ? 'Adopty is the only tool <span style="color:#10b981">built for AI adoption.</span>'
    : 'Adopty ist das einzige Tool, das für KI-Adoption <span style="color:#10b981">gebaut wurde.</span>';
  const resultBody = lang === 'en'
    ? 'Not a wiki repurposed. Not a spreadsheet extended. Built from the ground up for the problem: helping teams share, measure, and scale AI knowledge.'
    : 'Nicht ein Wiki umfunktioniert. Nicht eine Tabelle erweitert. Von Grund auf für das Problem gebaut: Teams helfen, KI-Wissen zu teilen, zu messen und zu skalieren.';
  const yesLabel     = lang === 'en' ? 'Yes'     : 'Ja';
  const partialLabel = lang === 'en' ? 'Partial' : 'Teilweise';
  const noLabel      = lang === 'en' ? 'No'      : 'Nein';

  let activecat = 'all';
  let showAllFeatures = false;

  const showAllLabel  = lang === 'en' ? 'Show all features ↓' : 'Alle Features anzeigen ↓';
  const showLessLabel = lang === 'en' ? 'Show less ↑'         : 'Weniger anzeigen ↑';

  function score(key) {
    return features.filter(f=>f[key]==='full').length + features.filter(f=>f[key]==='partial').length * 0.5;
  }
  const max = features.length;

  function cellBadge(support, tooltip, isAdopty=false) {
    const label = support==='full' ? yesLabel : support==='partial' ? partialLabel : noLabel;
    const bg    = support==='full'    ? 'background:#ecfdf5;color:#065f46'
                : support==='partial' ? 'background:#fffbeb;color:#92400e'
                : 'background:#f5f5f5;color:rgba(0,0,0,.3)';
    const ring  = isAdopty ? 'box-shadow:0 0 0 1px #a7f3d0;' : '';
    const hover = tooltip  ? 'cursor:pointer;' : 'cursor:default;';
    const dataAttr = tooltip ? `data-tooltip="${escHtml(tooltip)}"` : '';
    return `<div class="tooltip-wrap">
      <button class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
        style="${bg};${ring}${hover}" ${dataAttr}
        onclick="this.closest('.tooltip-wrap').classList.toggle('tt-open')">
        ${supportIcon(support)}
        <span class="hidden sm:inline">${label}</span>
      </button>
      ${tooltip ? `<div class="tooltip-bubble">${escHtml(tooltip)}</div>` : ''}
    </div>`;
  }

  function render() {
    // Core-only mode: show 5 key features unless user expanded
    let filtered = activecat === 'all'
      ? (showAllFeatures ? features : features.filter(f=>f.core))
      : features.filter(f=>f.cat===activecat);

    // Filter buttons
    const filterHtml = ['all',...cats].map(cat => {
      const active = cat===activecat;
      const label  = cat==='all' ? allLabel : cat;
      return `<button data-cat="${cat}" class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all
        ${active ? 'bg-[#0a0a0a] text-white' : 'bg-white border border-[rgba(0,0,0,.1)] text-[rgba(0,0,0,.5)] hover:border-[rgba(0,0,0,.3)]'}"
        style="${active ? 'background:#0a0a0a;color:#fff;' : ''}"
        onclick="window._ctFilter('${cat}')">${label}</button>`;
    }).join('');

    // Table rows
    let rowsHtml = '';
    filtered.forEach((f,idx) => {
      const prevCat = idx>0 ? filtered[idx-1].cat : null;
      const showCat = f.cat !== prevCat && activecat==='all';
      if (showCat) {
        rowsHtml += `<div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;background:#fafafa;border-top:1px solid rgba(0,0,0,.05);border-bottom:1px solid rgba(0,0,0,.05)">
          <div style="grid-column:1/-1;padding:8px 20px">
            <span style="font-size:10px;font-weight:700;color:rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.15em">${f.cat}</span>
          </div>
        </div>`;
      }
      const border = idx<filtered.length-1 ? 'border-bottom:1px solid rgba(0,0,0,.05);' : '';
      rowsHtml += `<div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;${border}">
        <div style="padding:16px 20px">
          <p style="font-size:14px;font-weight:600;color:#0a0a0a;margin:0">${escHtml(f.label)}</p>
          <p style="font-size:12px;color:rgba(0,0,0,.38);margin:4px 0 0;line-height:1.3">${escHtml(f.why)}</p>
        </div>
        ${TOOLS.map(t=>`<div style="display:flex;align-items:center;justify-content:center;padding:16px 8px">
          ${cellBadge(f[t.key],f.notes[t.key])}
        </div>`).join('')}
        <div style="display:flex;align-items:center;justify-content:center;padding:16px 8px;background:rgba(236,253,245,.4)">
          ${cellBadge('full','',true)}
        </div>
      </div>`;
    });

    // Score bars
    const scoreHtml = (toolLabel, s, col) => {
      const pct = Math.round((s/max)*100);
      return `<div class="score-bar-row flex items-center gap-3" data-pct="${pct}" data-color="${col}">
        <span style="font-size:12px;font-weight:600;color:rgba(0,0,0,.5);width:80px;flex-shrink:0">${toolLabel}</span>
        <div style="flex:1;height:8px;background:#f0f0f0;border-radius:9999px;overflow:hidden">
          <div class="score-bar-fill" style="width:0%;height:100%;border-radius:9999px;background:${col}"></div>
        </div>
        <span style="font-size:12px;font-weight:700;color:rgba(0,0,0,.4);width:32px;text-align:right;flex-shrink:0">${pct}%</span>
      </div>`;
    };

    el.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 mb-6">${filterHtml}</div>
      <div style="overflow-x:auto;margin:0 -8px;padding:0 8px">
        <div style="background:#fff;border-radius:16px;border:1px solid rgba(0,0,0,.08);overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.05);min-width:600px">
          <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;border-bottom:1px solid rgba(0,0,0,.07)">
            <div style="padding:16px 20px;font-size:12px;font-weight:600;color:rgba(0,0,0,.35);text-transform:uppercase;letter-spacing:.06em">${featureLabel}</div>
            ${TOOLS.map(t=>`<div style="display:flex;align-items:center;justify-content:center;padding:16px 8px;background:${t.bg}">
              <span style="font-size:12px;font-weight:700;color:${t.tc}">${t.label}</span>
            </div>`).join('')}
            <div style="display:flex;align-items:center;justify-content:center;padding:16px 8px;background:#0a0a0a">
              <div style="display:flex;align-items:center;gap:6px">
                ${ZAP_SM.replace('stroke="currentColor"','stroke="#10b981"')}
                <span style="font-size:12px;font-weight:700;color:#fff">Adopty</span>
              </div>
            </div>
          </div>
          ${rowsHtml}
        </div>
      </div>
      ${activecat === 'all' ? `
      <div style="text-align:center;margin-top:16px">
        <button onclick="window._ctToggleAll()" style="font-size:13px;font-weight:600;color:rgba(0,0,0,.45);background:none;border:1px solid rgba(0,0,0,.12);border-radius:9999px;padding:8px 20px;cursor:pointer;transition:all .15s" onmouseover="this.style.borderColor='rgba(0,0,0,.35)';this.style.color='#0a0a0a'" onmouseout="this.style.borderColor='rgba(0,0,0,.12)';this.style.color='rgba(0,0,0,.45)'">${showAllFeatures ? showLessLabel : showAllLabel}</button>
      </div>` : ''}
      <div style="margin-top:32px;display:grid;gap:32px" class="grid-cols-1 sm:grid-cols-2">
        <div style="background:#fff;border-radius:16px;border:1px solid rgba(0,0,0,.08);padding:24px">
          <p style="font-size:11px;font-weight:600;color:rgba(0,0,0,.35);text-transform:uppercase;letter-spacing:.06em;margin:0 0 16px">${coverageLabel}</p>
          <div style="display:flex;flex-direction:column;gap:12px">
            ${scoreHtml('Excel',score('excel'),'#217346')}
            ${scoreHtml('Confluence',score('conf'),'#0052cc')}
            ${scoreHtml('Notion',score('notion'),'#37352f')}
            <div style="border-top:1px solid rgba(0,0,0,.06);padding-top:12px">
              ${scoreHtml('Adopty',max,'#10b981')}
            </div>
          </div>
        </div>
        <div style="background:#0a0a0a;border-radius:16px;padding:24px;display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <p style="font-size:11px;font-weight:600;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.06em;margin:0 0 12px">${resultLabel}</p>
            <p style="font-size:22px;font-weight:900;color:#fff;line-height:1.3;margin:0 0 12px">${resultText}</p>
            <p style="font-size:14px;color:rgba(255,255,255,.5);line-height:1.6;margin:0">${resultBody}</p>
          </div>
          <div style="margin-top:24px;display:flex;align-items:center;gap:8px;font-size:14px;color:rgba(255,255,255,.3)">
            <span style="color:#10b981">${CHECK_CIRCLE_SM}</span> ${tapLabel}
          </div>
        </div>
      </div>
    `;

    // Score bar animation
    initScoreBars();
  }

  window._ctFilter    = (cat) => { activecat = cat; render(); };
  window._ctToggleAll = ()    => { showAllFeatures = !showAllFeatures; render(); };

  render();
}

function escHtml(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Score bars ───────────────────────────────────────────────────────────────
function initScoreBars() {
  document.querySelectorAll('.score-bar-row').forEach(row => {
    const pct   = parseFloat(row.dataset.pct);
    const color = row.dataset.color;
    const fill  = row.querySelector('.score-bar-fill');
    if (!fill) return;
    fill.style.background = color;
    fill.style.width = '0%';
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => { fill.style.width = pct + '%'; }, 150);
          obs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    obs.observe(row);
  });
}

// ─── Reveal sections ──────────────────────────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('is-visible'), delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal-section').forEach(el => obs.observe(el));
}

// ─── Count-up ────────────────────────────────────────────────────────────────
function initCountUps() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const to       = parseFloat(el.dataset.count);
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    let done = false;

    const obs = new IntersectionObserver(entries => {
      if (done) return;
      entries.forEach(e => {
        if (e.isIntersecting) {
          done = true;
          obs.disconnect();
          const t0 = performance.now(), dur = 1500;
          const tick = (now) => {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = to * eased;
            const fmt = decimals > 0 ? val.toFixed(decimals).replace('.',',') : Math.round(val).toString();
            el.textContent = prefix + fmt + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = prefix + (decimals>0 ? to.toFixed(decimals).replace('.',',') : to.toString()) + suffix;
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });
}

// ─── Navbar scroll ────────────────────────────────────────────────────────────
function initNavbar() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }, { passive: true });
}

// ─── Scroll to CTA ───────────────────────────────────────────────────────────
function initScrollToCTA() {
  document.querySelectorAll('[data-scroll-cta]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cta = document.getElementById('cta-section');
      if (cta) cta.scrollIntoView({ behavior:'smooth', block:'center' });
    });
  });
}

// ─── Waitlist forms ───────────────────────────────────────────────────────────
function initForms() {
  document.querySelectorAll('.waitlist-form').forEach(form => {
    const input  = form.querySelector('input[type="email"]');
    const btn    = form.querySelector('button[type="submit"]');
    const errEl  = form.querySelector('.form-error');
    const wrap   = form.closest('.form-wrap');
    const successEl = wrap && wrap.querySelector('.form-success');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!input || !input.value.trim()) return;
      if (btn) { btn.disabled = true; btn.textContent = form.dataset.loadingText || 'Einen Moment…'; }
      try {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type':'application/json', 'Accept':'application/json' },
          body: JSON.stringify({ email: input.value }),
        });
        if (res.ok) {
          if (wrap && successEl) {
            form.style.display = 'none';
            successEl.style.display = 'flex';
          }
        } else {
          throw new Error('not ok');
        }
      } catch {
        if (errEl) { errEl.style.display = 'block'; }
        if (btn)   { btn.disabled = false; btn.innerHTML = form.dataset.submitHtml || 'Früher Zugang sichern'; }
      }
    });
  });
}

// ─── App Mockup ───────────────────────────────────────────────────────────────
function initAppMockup() {
  const shareBtn    = document.getElementById('mockup-share-btn');
  const compose     = document.getElementById('mockup-compose');
  const typingText  = document.getElementById('mockup-typing-text');
  const cursor      = document.getElementById('mockup-cursor');
  const promptEl    = document.getElementById('mockup-prompt');
  const submitBtn   = document.getElementById('mockup-submit-btn');
  const newCard     = document.getElementById('mockup-new-card');
  const countEl     = document.getElementById('mockup-card-count');
  if (!shareBtn) return;

  const typed   = shareBtn.dataset.typed || 'E-Mails mit KI priorisieren';
  const shared  = shareBtn.dataset.shared || '✓ Geteilt!';
  const sharing = shareBtn.dataset.sharing || 'Im Team teilen →';

  let alive = true;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function loop() {
    while (alive) {
      await sleep(1500);
      // highlight share btn
      Object.assign(shareBtn.style, { background:'#0a0a0a', color:'#fff', transform:'scale(1.04)' });
      await sleep(800);
      // show compose
      Object.assign(shareBtn.style, { background:'#f0f0f0', color:'rgba(0,0,0,.5)', transform:'scale(1)' });
      Object.assign(compose.style, { height:'152px', opacity:'1', marginBottom:'12px' });
      await sleep(1000);
      // typing done
      typingText.textContent = typed;
      typingText.style.opacity = '1';
      if (cursor) cursor.style.display = 'none';
      if (promptEl) promptEl.style.opacity = '1';
      await sleep(2200);
      // hover submit
      Object.assign(submitBtn.style, { background:'#0a0a0a', color:'#fff', transform:'scale(1.04)' });
      await sleep(900);
      // done
      Object.assign(submitBtn.style, { background:'#10b981', color:'#fff', transform:'scale(1)' });
      submitBtn.textContent = shared;
      await sleep(1200);
      // hide compose
      Object.assign(compose.style, { height:'0', opacity:'0', marginBottom:'0' });
      typingText.textContent = shareBtn.dataset.placeholder || 'Workflow-Titel...';
      typingText.style.opacity = '0.15';
      if (cursor) cursor.style.display = 'inline';
      if (promptEl) promptEl.style.opacity = '0';
      await sleep(400);
      // show new card
      Object.assign(newCard.style, { height:'62px', opacity:'1', marginBottom:'10px' });
      if (countEl) countEl.textContent = '5';
      await sleep(3000);
      // reset
      Object.assign(newCard.style, { height:'0', opacity:'0', marginBottom:'0' });
      if (countEl) countEl.textContent = '4';
      Object.assign(submitBtn.style, { background:'#f0f0f0', color:'rgba(0,0,0,.45)', transform:'scale(1)' });
      submitBtn.textContent = sharing;
      await sleep(1200);
    }
  }
  loop();
  window.addEventListener('pagehide', () => { alive = false; });
}

// ─── Governance mockup ───────────────────────────────────────────────────────
function initGovernanceMockup() {
  const card         = document.getElementById('gov-card');
  const riskBar      = document.getElementById('gov-risk-bar');
  const riskChecks   = document.getElementById('gov-risk-checks');
  const approveBtn   = document.getElementById('gov-approve-btn');
  const statusBadge  = document.getElementById('gov-status-badge');
  const successEl    = document.getElementById('gov-success');
  const pendingLabel = document.getElementById('gov-pending-label');
  const pendingChip  = document.getElementById('gov-pending-chip');
  const govBadge     = document.getElementById('gov-badge');
  if (!card) return;

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let alive = true;

  function reset() {
    card.style.opacity        = '1';
    card.style.transform      = 'translateY(0)';
    riskBar.style.width       = '0%';
    riskChecks.style.opacity  = '0';
    statusBadge.textContent   = 'Ausstehend';
    statusBadge.style.cssText = 'flex-shrink:0;font-size:9px;padding:4px 8px;border-radius:9999px;font-weight:700;white-space:nowrap;transition:all .3s;background:#fefce8;color:#92400e;border:1px solid #fde68a';
    approveBtn.style.background  = '#0a0a0a';
    approveBtn.style.transform   = 'scale(1)';
    successEl.style.display      = 'none';
    pendingLabel.textContent     = '3 ausstehende Workflows';
    pendingChip.textContent      = '3 ausstehend';
    pendingChip.style.background = '#fefce8';
    pendingChip.style.color      = '#92400e';
    govBadge.textContent         = '3';
    govBadge.style.background    = '#10b981';
  }

  async function loop() {
    while (alive) {
      reset();
      await sleep(2000);

      // Risk bar animates in
      riskBar.style.width = '28%';
      await sleep(900);

      // Compliance checks appear
      riskChecks.style.opacity = '1';
      await sleep(1300);

      // Approve button highlights
      approveBtn.style.background = '#10b981';
      approveBtn.style.transform  = 'scale(1.05)';
      await sleep(750);

      // Click — approve
      approveBtn.style.transform = 'scale(1)';
      statusBadge.textContent   = '✓ Freigegeben';
      statusBadge.style.cssText = 'flex-shrink:0;font-size:9px;padding:4px 8px;border-radius:9999px;font-weight:700;white-space:nowrap;transition:all .3s;background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0';
      await sleep(500);

      // Card out, success in
      card.style.opacity        = '0';
      card.style.transform      = 'translateY(-8px)';
      successEl.style.display   = 'flex';
      pendingLabel.textContent  = '2 ausstehende Workflows';
      pendingChip.textContent   = '2 ausstehend';
      pendingChip.style.color   = '#92400e';
      govBadge.textContent      = '2';
      await sleep(3800);
    }
  }

  loop();
  window.addEventListener('pagehide', () => { alive = false; });
}

// ─── Mockup bar animations (Dashboard + Report) ───────────────────────────────
function initMockupBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // Animate dash-bar-fill elements inside this container
      entry.target.querySelectorAll('.dash-bar-fill, .rep-bar-fill').forEach(el => {
        const w = el.dataset.barWidth;
        if (w) el.style.width = w + '%';
      });
      // Animate maturity bar
      const maturity = entry.target.querySelector('#rep-maturity-bar');
      if (maturity) maturity.style.width = '74%';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.dash-bar-fill, .rep-bar-fill, #rep-maturity-bar').forEach(el => {
    const section = el.closest('section');
    if (section && !section.dataset.barsObserved) {
      section.dataset.barsObserved = '1';
      observer.observe(section);
    }
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReveal();
  initCountUps();
  initForms();
  initAppMockup();
  initGovernanceMockup();
  initMockupBars();
  initAnchorNav();
  initROICalc();
  initScrollToCTA();

  const lang = document.documentElement.lang || 'de';
  initComparisonTable(lang);
});

// ─── ROI Calculator ───────────────────────────────────────────────────────────
function initROICalc() {
  const usersEl = document.getElementById('calc-users');
  const rateEl  = document.getElementById('calc-rate');
  const hoursEl = document.getElementById('calc-hours');
  if (!usersEl) return;

  const PRICE_PER_USER = 19; // € pro Nutzer / Monat

  function fmtNum(n) {
    return n.toLocaleString('de-DE');
  }

  function update() {
    const users = +usersEl.value;
    const rate  = +rateEl.value;
    const hours = +hoursEl.value;

    document.getElementById('calc-users-val').textContent = users;
    document.getElementById('calc-rate-val').textContent  = '€' + rate;
    document.getElementById('calc-hours-val').textContent = hours.toString().replace('.',',') + 'h / Person';

    const activeUsers   = Math.round(users * 0.35);  // 35 % Aktivierungsrate
    const hoursPerMonth = activeUsers * hours * 4;     // 4 Wochen/Monat
    const valuePerMonth = hoursPerMonth * rate * 0.5;  // 50 % Realisierungsfaktor
    const valuePerYear  = valuePerMonth * 12;

    const cost   = users * PRICE_PER_USER;
    const factor = (valuePerMonth / cost).toFixed(1).replace('.',',');
    const paybackDays  = (cost / valuePerMonth) * 30;
    const paybackLabel = paybackDays < 7
      ? '< 1 Woche'
      : paybackDays < 30
        ? Math.ceil(paybackDays / 7) + ' Wochen'
        : Math.ceil(paybackDays / 30) + ' Monate';

    document.getElementById('calc-out-hours').textContent   = fmtNum(Math.round(hoursPerMonth)) + ' h';
    document.getElementById('calc-out-monthly').textContent = '€ ' + fmtNum(Math.round(valuePerMonth));
    document.getElementById('calc-out-yearly').textContent  = '€ ' + fmtNum(Math.round(valuePerYear));
    document.getElementById('calc-out-cost').textContent    = '€ ' + fmtNum(cost) + ' / Monat';
    document.getElementById('calc-out-factor').textContent  = factor + '×';
    document.getElementById('calc-out-payback').textContent = paybackLabel;
  }

  [usersEl, rateEl, hoursEl].forEach(el => el.addEventListener('input', update));
  update();
}

// ─── Anchor sub-navigation ────────────────────────────────────────────────────
function initAnchorNav() {
  const nav    = document.getElementById('anchor-nav');
  const hero   = document.querySelector('section.relative.pt-28');
  if (!nav || !hero) return;

  const threshold = () => hero.offsetHeight * 0.55;
  const links = nav.querySelectorAll('a.an-link');

  // Show / hide on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > threshold()) {
      nav.classList.add('an-visible');
    } else {
      nav.classList.remove('an-visible');
    }
    updateActiveLink();
  }, { passive: true });

  // Highlight the link whose section is currently in view
  function updateActiveLink() {
    let current = null;
    links.forEach(link => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      if (target.getBoundingClientRect().top <= 100) {
        current = link;
      }
    });
    links.forEach(l => l.classList.remove('an-active'));
    if (current) current.classList.add('an-active');
  }
}
