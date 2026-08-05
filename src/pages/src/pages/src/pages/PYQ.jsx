import React, { useMemo, useState } from "react";
import {
  Sun, Moon, Search, ChevronDown, ChevronUp, CheckCircle2, XCircle, Calendar,
  GraduationCap, SlidersHorizontal, X,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

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
   MOCK PYQ BANK
--------------------------------------------------------------- */
const PYQS = [
  { id: 1, year: 2024, exam: "NEET PG", subject: "Medicine", chapter: "Cardiology", topic: "Heart Failure", difficulty: "hard",
    stem: "In a patient with HFrEF already on ACE-I, beta-blocker and MRA, which additional drug class showed a mortality benefit in the DAPA-HF trial?",
    options: ["Loop diuretics", "SGLT2 inhibitors", "Calcium channel blockers", "Nitrates alone"], correct: 1,
    explanation: "DAPA-HF demonstrated that dapagliflozin (an SGLT2 inhibitor) reduced cardiovascular death and HF hospitalization in HFrEF patients, regardless of diabetes status, cementing SGLT2 inhibitors as a fourth pillar of GDMT." },
  { id: 2, year: 2024, exam: "INI-CET", subject: "Surgery", chapter: "GI Surgery", topic: "Meckel's Diverticulum", difficulty: "medium",
    stem: "The 'rule of 2s' for Meckel's diverticulum does NOT include which of the following?",
    options: ["2% of population", "Within 2 feet of ileocecal valve", "Presents by age 2 years only", "2 inches in length"], correct: 2,
    explanation: "Meckel's diverticulum can present at any age, though it's most often symptomatic in the first 2 years of life — 'presents by age 2 years only' overstates the rule, which is a classic PYQ trap." },
  { id: 3, year: 2023, exam: "AIIMS", subject: "Pathology", chapter: "Neoplasia", topic: "Thyroid Tumors", difficulty: "easy",
    stem: "Orphan Annie eye nuclei and psammoma bodies are seen in which thyroid malignancy?",
    options: ["Follicular carcinoma", "Papillary carcinoma", "Medullary carcinoma", "Anaplastic carcinoma"], correct: 1,
    explanation: "Papillary thyroid carcinoma is the most common thyroid cancer, characterized histologically by nuclear grooves, Orphan Annie eye nuclei, and psammoma bodies." },
  { id: 4, year: 2023, exam: "NEET PG", subject: "Pharmacology", chapter: "Chemotherapy", topic: "Anti-tubercular Drugs", difficulty: "medium",
    stem: "Which first-line anti-TB drug requires baseline and periodic visual acuity/color vision testing?",
    options: ["Isoniazid", "Rifampicin", "Ethambutol", "Pyrazinamide"], correct: 2,
    explanation: "Ethambutol can cause dose-dependent retrobulbar optic neuritis, presenting first as red-green color blindness, so visual function is monitored throughout therapy." },
  { id: 5, year: 2023, exam: "FMGE", subject: "Anatomy", chapter: "Upper Limb", topic: "Brachial Plexus", difficulty: "hard",
    stem: "'Waiter's tip' deformity following a difficult forceps delivery indicates injury to which nerve roots?",
    options: ["C5-C6 (Erb's palsy)", "C8-T1 (Klumpke's palsy)", "C7 alone", "T1-T2"], correct: 0,
    explanation: "Erb's (Erb-Duchenne) palsy results from traction injury to the upper trunk of the brachial plexus (C5-C6), producing the classic 'waiter's tip' posture — adducted, medially rotated arm with pronated forearm." },
  { id: 6, year: 2022, exam: "AIIMS", subject: "Medicine", chapter: "Cardiology", topic: "Pericardial Disease", difficulty: "hard",
    stem: "Kussmaul's sign — a paradoxical rise in JVP on inspiration — is most characteristic of which condition?",
    options: ["Cardiac tamponade", "Constrictive pericarditis", "Acute pericarditis", "Dilated cardiomyopathy"], correct: 1,
    explanation: "In constrictive pericarditis the rigid, non-compliant pericardium prevents the right atrium from accommodating the inspiratory increase in venous return, producing a paradoxical JVP rise — typically absent in tamponade." },
  { id: 7, year: 2022, exam: "NEET PG", subject: "Microbiology", chapter: "Mycology", topic: "Cryptococcus", difficulty: "easy",
    stem: "Which staining technique is used to visualize the capsule of Cryptococcus neoformans?",
    options: ["Ziehl-Neelsen stain", "India ink preparation", "Silver stain", "Giemsa stain"], correct: 1,
    explanation: "India ink provides a dark background against which the unstained polysaccharide capsule of Cryptococcus appears as a clear halo surrounding the yeast cell." },
  { id: 8, year: 2021, exam: "INI-CET", subject: "Obstetrics", chapter: "Malpresentations", topic: "Breech Presentation", difficulty: "medium",
    stem: "In a term primigravida with an uncomplicated breech presentation, current guidelines favor which mode of delivery?",
    options: ["Elective cesarean section", "Assisted vaginal breech always", "Induction at 34 weeks", "External cephalic version is contraindicated"], correct: 0,
    explanation: "Following the Term Breech Trial, elective cesarean section is generally recommended for term breech presentation in primigravidae, given lower perinatal morbidity compared with planned vaginal breech delivery." },
  { id: 9, year: 2021, exam: "NEET PG", subject: "Biochemistry", chapter: "Metabolism", topic: "Glycogen Storage Disease", difficulty: "hard",
    stem: "A child with severe fasting hypoglycemia, hepatomegaly and lactic acidosis most likely has a deficiency of which enzyme?",
    options: ["Debranching enzyme", "Glucose-6-phosphatase", "Acid maltase", "Glycogen phosphorylase"], correct: 1,
    explanation: "Glucose-6-phosphatase deficiency (Von Gierke's disease, GSD type I) blocks the terminal step of both glycogenolysis and gluconeogenesis, producing severe fasting hypoglycemia, hepatomegaly, and lactic acidosis." },
  { id: 10, year: 2020, exam: "FMGE", subject: "Orthopaedics", chapter: "Pediatric Fractures", topic: "Supracondylar Fracture", difficulty: "medium",
    stem: "A supracondylar fracture of the humerus in a child most commonly injures which nerve?",
    options: ["Ulnar nerve", "Median nerve proper", "Anterior interosseous nerve", "Radial nerve"], correct: 2,
    explanation: "The anterior interosseous nerve (a branch of the median nerve) is most commonly injured in supracondylar humeral fractures, presenting as an isolated inability to flex the thumb and index finger DIP joints (pincer grasp)." },
  { id: 11, year: 2020, exam: "AIIMS", subject: "Medicine", chapter: "Respiratory", topic: "ARDS vs Cardiogenic Edema", difficulty: "hard",
    stem: "On chest X-ray, which finding favors cardiogenic pulmonary edema over ARDS?",
    options: ["Diffuse peripheral ground-glass opacities", "Cardiomegaly with upper lobe venous diversion", "Normal heart size", "Pneumothorax"], correct: 1,
    explanation: "Cardiomegaly with cephalization of pulmonary vessels reflects elevated left atrial pressure, pointing to a cardiac cause; ARDS typically shows a normal heart size with diffuse, peripheral, patchy opacities from capillary leak." },
  { id: 12, year: 2020, exam: "NEET PG", subject: "Pediatrics", chapter: "Respiratory Infections", topic: "Croup", difficulty: "easy",
    stem: "A 2-year-old with a barking cough, inspiratory stridor and low-grade fever, worse at night, most likely has:",
    options: ["Epiglottitis", "Croup (laryngotracheobronchitis)", "Bacterial tracheitis", "Foreign body aspiration"], correct: 1,
    explanation: "Croup, usually caused by parainfluenza virus, classically presents with a barking cough, inspiratory stridor and hoarseness, often worse at night, in children 6 months to 3 years." },
];

const SUBJECT_COLOR = (t) => ({
  Medicine: t.teal, Surgery: t.coral, Pathology: "#9C8CF0", Pharmacology: t.amber,
  Anatomy: t.mint, Microbiology: "#6AA6F0", Obstetrics: "#F0A6D0", Biochemistry: "#A6D68C",
  Orthopaedics: "#D6A68C", Pediatrics: "#F0C46A",
});
const DIFF_COLOR = (t) => ({ easy: t.mint, medium: t.amber, hard: t.coral });

/* ---------------------------------------------------------------
   APP
--------------------------------------------------------------- */
export default function MedMasterPYQ() {
  const [dark, setDark] = useState(true);
  const t = dark ? palette.dark : palette.light;

  const [query, setQuery] = useState("");
  const [years, setYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [diffs, setDiffs] = useState([]);
  const [exam, setExam] = useState("All");
  const [sortBy, setSortBy] = useState("yearDesc");
  const [expanded, setExpanded] = useState({});
  const [showFilters, setShowFilters] = useState(true);

  const allYears = [...new Set(PYQS.map((q) => q.year))].sort((a, b) => b - a);
  const allSubjects = [...new Set(PYQS.map((q) => q.subject))].sort();
  const allExams = ["All", ...new Set(PYQS.map((q) => q.exam))];

  const toggle = (arr, setArr, val) => setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    let list = PYQS.filter((q) =>
      (years.length === 0 || years.includes(q.year)) &&
      (subjects.length === 0 || subjects.includes(q.subject)) &&
      (diffs.length === 0 || diffs.includes(q.difficulty)) &&
      (exam === "All" || q.exam === exam) &&
      (query === "" || q.stem.toLowerCase().includes(query.toLowerCase()) || q.topic.toLowerCase().includes(query.toLowerCase()) || q.chapter.toLowerCase().includes(query.toLowerCase()))
    );
    list = [...list].sort((a, b) => sortBy === "yearDesc" ? b.year - a.year : sortBy === "yearAsc" ? a.year - b.year : a.subject.localeCompare(b.subject));
    return list;
  }, [query, years, subjects, diffs, exam, sortBy]);

  const yearChartData = allYears.map((y) => ({ year: String(y), count: PYQS.filter((q) => q.year === y).length })).reverse();

  const clearFilters = () => { setYears([]); setSubjects([]); setDiffs([]); setExam("All"); setQuery(""); };
  const activeFilterCount = years.length + subjects.length + diffs.length + (exam !== "All" ? 1 : 0);

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
        <div className="disp" style={{ fontWeight: 700, fontSize: 15.5 }}>Previous Year Questions</div>
        <button onClick={() => setDark(!dark)} className="btn" style={iconBtn(t)}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "22px 20px 60px" }}>
        {/* stats + year distribution */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14, marginBottom: 20 }}>
          <div style={cardStyle(t)}>
            <div style={{ fontSize: 12, color: t.textDim, marginBottom: 4 }}>Total PYQs</div>
            <div className="disp" style={{ fontSize: 26, fontWeight: 700 }}>{PYQS.length}</div>
            <div style={{ fontSize: 11.5, color: t.textDim, marginTop: 2 }}>{filtered.length} matching current filters</div>
          </div>
          <div style={cardStyle(t)}>
            <div style={{ fontSize: 12, color: t.textDim, marginBottom: 6 }}>By year</div>
            <div style={{ height: 66 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearChartData} margin={{ top: 2, right: 4, left: -30, bottom: 0 }}>
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: t.textDim }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                    {yearChartData.map((d, i) => <Cell key={i} fill={t.teal} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* search + sort + filter toggle */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.panel, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 12px", flex: 1, minWidth: 200 }}>
            <Search size={14} color={t.textDim} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by topic, chapter, or question text…"
              style={{ border: "none", outline: "none", background: "transparent", color: t.text, fontSize: 12.5, flex: 1 }} />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ border: `1px solid ${t.border}`, borderRadius: 10, background: t.panel, color: t.text, fontSize: 12.5, padding: "8px 10px" }}>
            <option value="yearDesc">Newest first</option>
            <option value="yearAsc">Oldest first</option>
            <option value="subject">Subject A–Z</option>
          </select>
          <button onClick={() => setShowFilters(!showFilters)} className="btn" style={{
            display: "flex", alignItems: "center", gap: 6, border: `1px solid ${t.border}`, borderRadius: 10,
            background: t.panel, color: t.text, fontSize: 12.5, padding: "8px 12px", cursor: "pointer",
          }}>
            <SlidersHorizontal size={14} /> Filters {activeFilterCount > 0 && <span className="mono" style={{ color: t.teal }}>({activeFilterCount})</span>}
          </button>
        </div>

        {showFilters && (
          <div style={{ ...cardStyle(t), marginBottom: 18 }}>
            <FilterGroup t={t} label="Exam" >
              {allExams.map((e) => (
                <Chip key={e} t={t} active={exam === e} onClick={() => setExam(e)}>{e}</Chip>
              ))}
            </FilterGroup>
            <FilterGroup t={t} label="Year">
              {allYears.map((y) => (
                <Chip key={y} t={t} active={years.includes(y)} onClick={() => toggle(years, setYears, y)}>{y}</Chip>
              ))}
            </FilterGroup>
            <FilterGroup t={t} label="Subject">
              {allSubjects.map((s) => (
                <Chip key={s} t={t} active={subjects.includes(s)} onClick={() => toggle(subjects, setSubjects, s)} dot={SUBJECT_COLOR(t)[s]}>{s}</Chip>
              ))}
            </FilterGroup>
            <FilterGroup t={t} label="Difficulty" last>
              {["easy", "medium", "hard"].map((d) => (
                <Chip key={d} t={t} active={diffs.includes(d)} onClick={() => toggle(diffs, setDiffs, d)} dot={DIFF_COLOR(t)[d]}>{d[0].toUpperCase() + d.slice(1)}</Chip>
              ))}
            </FilterGroup>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="btn" style={{ background: "none", border: "none", color: t.coral, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                <X size={13} /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((q) => {
            const open = !!expanded[q.id];
            const color = SUBJECT_COLOR(t)[q.subject] || t.teal;
            return (
              <div key={q.id} className="row" style={cardStyle(t)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer" }}
                  onClick={() => setExpanded((p) => ({ ...p, [q.id]: !p[q.id] }))}>
                  <div style={{ flex: 1, paddingRight: 14 }}>
                    <div style={{ display: "flex", gap: 7, marginBottom: 7, flexWrap: "wrap" }}>
                      <Badge color={t.textDim}><Calendar size={10} style={{ marginRight: 3, verticalAlign: -1 }} />{q.year}</Badge>
                      <Badge color={t.textDim}><GraduationCap size={10} style={{ marginRight: 3, verticalAlign: -1 }} />{q.exam}</Badge>
                      <Badge color={color}>{q.subject}</Badge>
                      <Badge color={DIFF_COLOR(t)[q.difficulty]}>{q.difficulty[0].toUpperCase() + q.difficulty.slice(1)}</Badge>
                    </div>
                    <div style={{ fontSize: 13.8, lineHeight: 1.5 }}>{q.stem}</div>
                    <div style={{ fontSize: 11, color: t.textDim, marginTop: 4 }}>{q.chapter} · {q.topic}</div>
                  </div>
                  {open ? <ChevronUp size={16} color={t.textDim} /> : <ChevronDown size={16} color={t.textDim} />}
                </div>

                {open && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px dashed ${t.border}` }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                      {q.options.map((opt, oi) => {
                        const isCorrect = oi === q.correct;
                        return (
                          <div key={oi} style={{
                            display: "flex", alignItems: "center", gap: 9, padding: "9px 13px", borderRadius: 9,
                            border: `1.5px solid ${isCorrect ? t.mint : t.border}`, background: isCorrect ? `${t.mint}14` : "transparent",
                          }}>
                            <span style={{ fontSize: 13 }}>{opt}</span>
                            {isCorrect && <CheckCircle2 size={14} color={t.mint} style={{ marginLeft: "auto" }} />}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.6 }}>{q.explanation}</div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", color: t.textDim, fontSize: 13, padding: "30px 0" }}>No PYQs match these filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function iconBtn(t) {
  return { width: 34, height: 34, borderRadius: 9, border: `1px solid ${t.border}`, background: t.panelAlt, color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
}
const cardStyle = (t) => ({ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18 });
function Badge({ color, children }) {
  return <span className="mono" style={{ fontSize: 10.5, fontWeight: 600, color, border: `1px solid ${color}55`, background: `${color}14`, borderRadius: 7, padding: "3.5px 9px", display: "inline-flex", alignItems: "cent
