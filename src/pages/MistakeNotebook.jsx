import React, { useMemo, useState } from "react";
import {
  Sun, Moon, Search, ChevronDown, ChevronUp, Clock3, Calendar, RotateCcw,
  BookmarkPlus, TrendingDown, Layers, Target, Plus, AlertCircle, ChevronRight, ChevronLeft,
} from "lucide-react";

/* ---------------------------------------------------------------
   TOKENS (same "clinical chart" system as the other modules)
--------------------------------------------------------------- */
const palette = {
  dark: {
    bg: "#0E1626", panel: "#141F35", panelAlt: "#182545",
    border: "#25324F", text: "#EAF0F6", textDim: "#8593AC",
    teal: "#14B8AA", mint: "#3ACE85", coral: "#F26A50", amber: "#E9AE45",
  },
  light: {
    bg: "#EEF1F3", panel: "#FFFFFF", panelAlt: "#F5F7F8",
    border: "#DFE4E9", text: "#101826", textDim: "#5C6B80",
    teal: "#0E8F84", mint: "#1F9D5F", coral: "#D8452F", amber: "#B9791C",
  },
};
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');`;

/* ---------------------------------------------------------------
   MOCK MISTAKE NOTEBOOK — auto-populated from wrong attempts
--------------------------------------------------------------- */
const MISTAKES = [
  {
    id: 1, subject: "Medicine", chapter: "Cardiology", topic: "Heart Failure",
    stem: "Which drug class reduces mortality in HFrEF by targeting aldosterone?",
    wrongAnswer: "Thiazide diuretics", correctAnswer: "Mineralocorticoid receptor antagonists",
    wrongCount: 3, firstAttempt: "12 Jun 2026", lastAttempt: "2 Aug 2026", avgTime: 58,
    explanation: "MRAs (spironolactone/eplerenone) block aldosterone at the distal nephron and myocardium — RALES and EMPHASIS-HF showed a consistent mortality benefit in HFrEF.",
  },
  {
    id: 2, subject: "Pharmacology", chapter: "Anti-tubercular Drugs", topic: "Ethambutol",
    stem: "Which anti-TB drug is most associated with optic neuritis?",
    wrongAnswer: "Isoniazid", correctAnswer: "Ethambutol",
    wrongCount: 4, firstAttempt: "18 May 2026", lastAttempt: "3 Aug 2026", avgTime: 41,
    explanation: "Ethambutol causes dose-dependent retrobulbar optic neuritis presenting as red-green color blindness and reduced visual acuity — requires baseline and periodic visual testing.",
  },
  {
    id: 3, subject: "Pathology", chapter: "Neoplasia", topic: "Thyroid Tumors",
    stem: "Psammoma bodies are characteristic of which thyroid tumor?",
    wrongAnswer: "Medullary carcinoma", correctAnswer: "Papillary carcinoma",
    wrongCount: 2, firstAttempt: "20 Jul 2026", lastAttempt: "1 Aug 2026", avgTime: 47,
    explanation: "Papillary thyroid carcinoma shows Orphan Annie eye nuclei, nuclear grooves, and psammoma bodies (concentric calcified structures) — the most common thyroid malignancy.",
  },
  {
    id: 4, subject: "Anatomy", chapter: "Upper Limb", topic: "Nerve Injuries",
    stem: "Wrist drop results from injury to which nerve, and at what site?",
    wrongAnswer: "Ulnar nerve at the elbow", correctAnswer: "Radial nerve at the spiral groove",
    wrongCount: 5, firstAttempt: "2 May 2026", lastAttempt: "4 Aug 2026", avgTime: 52,
    explanation: "The radial nerve winds around the spiral (radial) groove of the humerus, making it vulnerable in mid-shaft humeral fractures — classic cause of wrist drop.",
  },
  {
    id: 5, subject: "Microbiology", chapter: "Mycology", topic: "Cryptococcus",
    stem: "Which stain demonstrates the capsule of Cryptococcus neoformans?",
    wrongAnswer: "Ziehl-Neelsen stain", correctAnswer: "India ink preparation",
    wrongCount: 2, firstAttempt: "29 Jun 2026", lastAttempt: "30 Jul 2026", avgTime: 39,
    explanation: "India ink creates a dark background against which the unstained polysaccharide capsule appears as a clear halo around the yeast cells.",
  },
  {
    id: 6, subject: "Medicine", chapter: "Cardiology", topic: "Pericardial Disease",
    stem: "Kussmaul's sign is classically seen in which condition?",
    wrongAnswer: "Cardiac tamponade", correctAnswer: "Constrictive pericarditis",
    wrongCount: 3, firstAttempt: "9 Jun 2026", lastAttempt: "28 Jul 2026", avgTime: 63,
    explanation: "In constrictive pericarditis, the rigid pericardium prevents the RA from accommodating increased venous return on inspiration, so JVP paradoxically rises (Kussmaul's sign) — typically absent in tamponade.",
  },
  {
    id: 7, subject: "Biochemistry", chapter: "Metabolism", topic: "Glycogen Storage Disease",
    stem: "Deficiency of which enzyme causes Von Gierke's disease?",
    wrongAnswer: "Debranching enzyme", correctAnswer: "Glucose-6-phosphatase",
    wrongCount: 1, firstAttempt: "31 Jul 2026", lastAttempt: "31 Jul 2026", avgTime: 55,
    explanation: "Glucose-6-phosphatase deficiency (Type I, Von Gierke's) blocks the final step of both gluconeogenesis and glycogenolysis, causing severe fasting hypoglycemia and hepatomegaly.",
  },
];

/* ---------------------------------------------------------------
   MOCK WEAK-AREA TREE — subject → chapter → topic mastery
--------------------------------------------------------------- */
const WEAK_TREE = [
  { subject: "Anatomy", mastery: 38, chapters: [
    { name: "Upper Limb", mastery: 34, topics: [{ name: "Nerve Injuries", mastery: 28 }, { name: "Brachial Plexus", mastery: 41 }, { name: "Axilla", mastery: 55 }] },
    { name: "Neuroanatomy", mastery: 42, topics: [{ name: "Brainstem", mastery: 33 }, { name: "Cranial Nerves", mastery: 50 }] },
  ]},
  { subject: "Pharmacology", mastery: 44, chapters: [
    { name: "Chemotherapy", mastery: 39, topics: [{ name: "Anti-tubercular Drugs", mastery: 31 }, { name: "Antifungals", mastery: 47 }] },
    { name: "ANS", mastery: 49, topics: [{ name: "Cholinergics", mastery: 45 }, { name: "Adrenergics", mastery: 53 }] },
  ]},
  { subject: "Medicine", mastery: 52, chapters: [
    { name: "Cardiology", mastery: 46, topics: [{ name: "Heart Failure", mastery: 40 }, { name: "Pericardial Disease", mastery: 51 }] },
    { name: "Nephrology", mastery: 58, topics: [{ name: "Glomerulonephritis", mastery: 55 }, { name: "AKI/CKD", mastery: 61 }] },
  ]},
  { subject: "Pathology", mastery: 61, chapters: [
    { name: "Neoplasia", mastery: 57, topics: [{ name: "Thyroid Tumors", mastery: 52 }, { name: "Breast Tumors", mastery: 62 }] },
  ]},
];

const SUBJECT_COLOR = (t) => ({ Medicine: t.teal, Pharmacology: t.amber, Pathology: "#9C8CF0", Anatomy: t.mint, Microbiology: "#6AA6F0", Biochemistry: "#A6D68C" });

function masteryColor(t, m) { return m < 45 ? t.coral : m < 60 ? t.amber : t.mint; }

/* ---------------------------------------------------------------
   APP
--------------------------------------------------------------- */
export default function MedMasterMistakeNotebook() {
  const [dark, setDark] = useState(true);
  const t = dark ? palette.dark : palette.light;
  const [tab, setTab] = useState("notebook"); // notebook | weak

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter',sans-serif" }}>
      <style>{FONT_IMPORT}{`
        .disp{font-family:'Space Grotesk',sans-serif;} .mono{font-family:'IBM Plex Mono',monospace;}
        * { box-sizing:border-box; }
        .btn{transition:all .12s;} .btn:active{transform:scale(.96);}
        .row{transition:all .12s;} .row:hover{transform:translateY(-1px);}
        ::-webkit-scrollbar{width:8px;} ::-webkit-scrollbar-thumb{background:${t.border};border-radius:8px;}
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 26px", borderBottom: `1px solid ${t.border}`, background: t.panel, position: "sticky", top: 0, zIndex: 5 }}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 15.5 }}>Mistake Notebook</div>
        <button onClick={() => setDark(!dark)} className="btn" style={iconBtn(t)}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "22px 20px 60px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <TabBtn t={t} active={tab === "notebook"} onClick={() => setTab("notebook")} icon={AlertCircle} label="Mistake Notebook" />
          <TabBtn t={t} active={tab === "weak"} onClick={() => setTab("weak")} icon={TrendingDown} label="Weak Areas" />
        </div>

        {tab === "notebook" ? <NotebookTab t={t} /> : <WeakAreasTab t={t} />}
      </div>
    </div>
  );
}

function iconBtn(t) {
  return { width: 34, height: 34, borderRadius: 9, border: `1px solid ${t.border}`, background: t.panelAlt, color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
}
function TabBtn({ t, active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} className="btn" style={{
      display: "flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 10,
      border: `1px solid ${active ? t.teal : t.border}`, background: active ? `${t.teal}18` : t.panel,
      color: active ? t.teal : t.textDim, fontSize: 13, fontWeight: 600, cursor: "pointer",
    }}><Icon size={15} />{label}</button>
  );
}
const cardStyle = (t) => ({ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18 });
const primaryBtn = (color) => ({ background: color, color: "#0E1626", border: "none", borderRadius: 10, padding: "9px 15px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 });
const ghostBtn = (t) => ({ background: "transparent", color: t.text, border: `1px solid ${t.border}`, borderRadius: 10, padding: "9px 15px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 });

/* ---------------------------------------------------------------
   MISTAKE NOTEBOOK TAB
--------------------------------------------------------------- */
function NotebookTab({ t }) {
  const [query, setQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [expanded, setExpanded] = useState({});
  const [sortBy, setSortBy] = useState("wrongCount"); // wrongCount | recent

  const subjects = ["All", ...Array.from(new Set(MISTAKES.map((m) => m.subject)))];

  const filtered = useMemo(() => {
    let list = MISTAKES.filter((m) =>
      (subjectFilter === "All" || m.subject === subjectFilter) &&
      (query === "" || m.stem.toLowerCase().includes(query.toLowerCase()) || m.topic.toLowerCase().includes(query.toLowerCase()))
    );
    list = [...list].sort((a, b) => sortBy === "wrongCount" ? b.wrongCount - a.wrongCount : new Date(b.lastAttempt) - new Date(a.lastAttempt));
    return list;
  }, [query, subjectFilter, sortBy]);

  return (
    <div>
      <div style={{ color: t.textDim, fontSize: 13.5, marginBottom: 16 }}>
        Every wrong answer is logged automatically — {MISTAKES.length} questions currently need revision.
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.panel, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 12px", flex: 1, minWidth: 200 }}>
          <Search size={14} color={t.textDim} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search mistakes by topic or question…"
            style={{ border: "none", outline: "none", background: "transparent", color: t.text, fontSize: 12.5, flex: 1 }} />
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{
          border: `1px solid ${t.border}`, borderRadius: 10, background: t.panel, color: t.text, fontSize: 12.5, padding: "8px 10px",
        }}>
          <option value="wrongCount">Most wrong</option>
          <option value="recent">Most recent</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 18 }}>
        {subjects.map((s) => (
          <button key={s} onClick={() => setSubjectFilter(s)} className="btn" style={{
            padding: "6px 12px", borderRadius: 8, fontSize: 11.5, fontWeight: 600, cursor: "pointer",
            border: `1px solid ${subjectFilter === s ? t.teal : t.border}`,
            background: subjectFilter === s ? `${t.teal}18` : "transparent",
            color: subjectFilter === s ? t.teal : t.textDim,
          }}>{s}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((m) => {
          const open = !!expanded[m.id];
          const color = SUBJECT_COLOR(t)[m.subject] || t.teal;
          return (
            <div key={m.id} className="row" style={cardStyle(t)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer" }}
                onClick={() => setExpanded((p) => ({ ...p, [m.id]: !p[m.id] }))}>
                <div style={{ flex: 1, paddingRight: 14 }}>
                  <div style={{ display: "flex", gap: 7, marginBottom: 7, flexWrap: "wrap" }}>
                    <Badge color={color}>{m.subject}</Badge>
                    <Badge color={t.textDim}>{m.topic}</Badge>
                  </div>
                  <div style={{ fontSize: 13.8, lineHeight: 1.5 }}>{m.stem}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: t.coral, background: `${t.coral}18`, borderRadius: 7, padding: "3px 8px" }}>
                    wrong ×{m.wrongCount}
                  </span>
                  {open ? <ChevronUp size={16} color={t.textDim} /> : <ChevronDown size={16} color={t.textDim} />}
                </div>
              </div>

              {open && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px dashed ${t.border}` }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
                    <AnswerRow label="Your answer" value={m.wrongAnswer} color={t.coral} />
                    <AnswerRow label="Correct answer" value={m.correctAnswer} color={t.mint} />
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: t.text, marginBottom: 12 }}>{m.explanation}</div>
                  <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 14 }}>
                    <MetaItem icon={<Calendar size={12.5} />} label="First attempt" value={m.firstAttempt} t={t} />
                    <MetaItem icon={<Calendar size={12.5} />} label="Last attempt" value={m.lastAttempt} t={t} />
                    <MetaItem icon={<Clock3 size={12.5} />} label="Avg. time" value={`${m.avgTime}s`} t={t} />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn" style={primaryBtn(t.teal)}><RotateCcw size={13} /> Retry similar Qs</button>
                    <button className="btn" style={ghostBtn(t)}><BookmarkPlus size={13} /> Add to revision queue</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: t.textDim, fontSize: 13, padding: "30px 0" }}>No mistakes match this filter.</div>
        )}
      </div>
    </div>
  );
}
function Badge({ color, children }) {
  return <span className="mono" style={{ fontSize: 10.5, fontWeight: 600, color, border: `1px solid ${color}55`, background: `${color}14`, borderRadius: 7, padding: "3.5px 9px" }}>{children}</span>;
}
function AnswerRow({ label, value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 11.5, color: "#8593AC", width: 110, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color }}>{value}</span>
    </div>
  );
}
function MetaItem({ icon, label, value, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ color: t.textDim, display: "flex" }}>{icon}</span>
      <span style={{ fontSize: 11.5, color: t.textDim }}>{label}:</span>
      <span className="mono" style={{ fontSize: 11.5, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

/* ---------------------------------------------------------------
   WEAK AREAS TAB — subject → chapter → topic drill-down
--------------------------------------------------------------- */
function WeakAreasTab({ t }) {
  const [subjectIdx, setSubjectIdx] = useState(null);
  const [chapterIdx, setChapterIdx] = useState(null);

  const sortedSubjects = [...WEAK_TREE].sort((a, b) => a.mastery - b.mastery);
  const subject = subjectIdx !== null ? WEAK_TREE[subjectIdx] : null;
  const chapter = subject && chapterIdx !== null ? subject.chapters[chapterIdx] : null;

  if (chapter) {
    return (
      <div>
        <Crumb t={t} items={[
          { label: "Weak Subjects", onClick: () => { setSubjectIdx(null); setChapterIdx(null); } },
          { label: subject.subject, onClick: () => setChapterIdx(null) },
          { label: chapter.name },
        ]} />
        <div className="disp" style={{ fontSize: 18, fontWeight: 700, marginBottom: 3 }}>{chapter.name} — weak topics</div>
        <div style={{ color: t.textDim, fontSize: 13, marginBottom: 16 }}>Sorted by lowest mastery first</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {[...chapter.topics].sort((a, b) => a.mastery - b.mastery).map((tp) => (
            <WeakRow key={tp.name} t={t} name={tp.name} mastery={tp.mastery}
              action={<button className="btn" style={primaryBtn(t.teal)}>Practice <ChevronRight size={13} /></button>} />
          ))}
        </div>
        <button className="btn" style={{ ...ghostBtn(t), marginTop: 16 }}><Plus size={13} /> Add all to revision queue</button>
      </div>
    );
  }

  if (subject) {
    return (
      <div>
        <Crumb t={t} items={[{ label: "Weak Subjects", onClick: () => setSubjectIdx(null) }, { label: subject.subject }]} />
        <button onClick={() => setSubjectIdx(null)} className="btn" style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: t.textDim, fontSize: 12, cursor: "pointer", marginBottom: 8, padding: 0 }}>
          <ChevronLeft size={13} /> Back to subjects
        </button>
        <div className="disp" style={{ fontSize: 18, fontWeight: 700, marginBottom: 3 }}>{subject.subject} — chapters</div>
        <div style={{ color: t.textDim, fontSize: 13, marginBottom: 16 }}>Sorted by lowest mastery first</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {[...subject.chapters].sort((a, b) => a.mastery - b.mastery).map((c, i) => (
            <WeakRow key={c.name} t={t} name={c.name} mastery={c.mastery} sub={`${c.topics.length} topics`}
              onClick={() => setChapterIdx(subject.chapters.indexOf(c))}
              action={<ChevronRight size={15} color={t.textDim} />} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ color: t.textDim, fontSize: 13.5, marginBottom: 16 }}>
        Subjects, chapters and topics ranked by mastery — lowest first. Tap into any subject to drill down.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {sortedSubjects.map((s) => (
          <WeakRow key={s.subject} t={t} name={s.subject} mastery={s.mastery} sub={`${s.chapters.length} chapters`}
            onClick={() => setSubjectIdx(WEAK_TREE.indexOf(s))}
            action={<ChevronRight size={15} color={t.textDim} />} />
        ))}
      </div>
    </div>
  );
}

function Crumb({ t, items }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.textDim, marginBottom: 12, flexWrap: "wrap" }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight size={11} />}
          {it.onClick ? (
            <button onClick={it.onClick} style={{ background: "none", border: "none", color: t.teal, cursor: "pointer", fontSize: 12, fontWeight: 600, padding: 0 }}>{it.label}</button>
          ) : <span style={{ color: t.text, fontWeight: 600 }}>{it.label}</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function WeakRow({ t, name, mastery, sub, action, onClick }) {
  const color = masteryColor(t, mastery);
  return (
    <div className="row" onClick={onClick} style={{
      ...cardStyle(t), cursor: onClick ? "pointer" : "default", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "14px 18px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Target size={15} color={color} />
        </div>
        <div>
          <div className="disp" style={{ fontWeight: 600, fontSize: 13.8 }}>{name}</div>
          {sub && <div style={{ fontSize: 11, color: t.textDim }}>{sub}</div>}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 90, height: 6, borderRadius: 3, background: t.border, overflow: "hidden" }}>
          <div style={{ width: `${mastery}%`, height: "100%", background: color, borderRadius: 3 }} />
        </div>
        <span className="mono" style={{ fontSize: 12.5, fontWeight: 700, color, width: 34, textAlign: "right" }}>{mastery}%</span>
        {action}
      </div>
    </div>
  );
}
