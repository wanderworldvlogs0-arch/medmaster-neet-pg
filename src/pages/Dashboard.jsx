import React, { useMemo, useState } from "react";
import {
  LayoutGrid, BookOpen, Layers, Brain, FileText, ClipboardList,
  BarChart3, Trophy, MessageSquareText, User, Settings, Moon, Sun,
  ChevronRight, Search, Flame, Award, Clock3, Target, ChevronLeft,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, Tooltip,
} from "recharts";

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

const SUBJECT_DEFS = [
  { name: "Anatomy", chapters: ["Upper Limb", "Lower Limb", "Thorax", "Abdomen", "Head and Neck", "Neuroanatomy"] },
  { name: "Physiology", chapters: ["General Physiology", "Nerve-Muscle", "CVS", "Respiratory", "Renal", "Endocrine"] },
  { name: "Biochemistry", chapters: ["Enzymes", "Carbohydrate Metabolism", "Lipid Metabolism", "Molecular Biology", "Vitamins"] },
  { name: "Pathology", chapters: ["General Pathology", "Hematology", "Neoplasia", "Systemic Pathology", "Cytopathology"] },
  { name: "Pharmacology", chapters: ["General Pharmacology", "ANS", "CVS Drugs", "Chemotherapy", "CNS Drugs"] },
  { name: "Microbiology", chapters: ["Bacteriology", "Virology", "Mycology", "Parasitology", "Immunology"] },
  { name: "Forensic Medicine", chapters: ["Thanatology", "Toxicology", "Forensic Psychiatry", "Identification"] },
  { name: "PSM", chapters: ["Epidemiology", "Biostatistics", "Nutrition", "MCH", "National Programs"] },
  { name: "Medicine", chapters: ["Cardiology", "Nephrology", "Gastroenterology", "Neurology", "Endocrinology", "Infectious Disease"] },
  { name: "Surgery", chapters: ["General Surgery", "Urology", "Neurosurgery", "Cardiothoracic", "Trauma"] },
  { name: "Obstetrics and Gynaecology", chapters: ["Antenatal Care", "Labour", "High Risk Pregnancy", "Gynae Oncology"] },
  { name: "Pediatrics", chapters: ["Growth and Development", "Neonatology", "Immunization", "Pediatric Nutrition"] },
  { name: "Orthopaedics", chapters: ["Fractures", "Joint Disorders", "Bone Tumors", "Spine"] },
  { name: "Dermatology", chapters: ["Infections", "Papulosquamous", "Bullous Disorders", "Pigmentary"] },
  { name: "Psychiatry", chapters: ["Mood Disorders", "Psychotic Disorders", "Anxiety Disorders", "Substance Use"] },
  { name: "Radiology", chapters: ["Chest Imaging", "GI Imaging", "Neuroimaging", "MSK Imaging"] },
  { name: "Anaesthesia", chapters: ["General Anaesthesia", "Regional Blocks", "Airway Management", "Critical Care"] },
  { name: "ENT", chapters: ["Ear", "Nose", "Throat", "Head and Neck Tumors"] },
  { name: "Ophthalmology", chapters: ["Cornea", "Glaucoma", "Retina", "Refraction"] },
];

function seededRand(seed) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

const SUBJECTS = SUBJECT_DEFS.map((s, si) => {
  const chapters = s.chapters.map((c, ci) => {
    const topicCount = 3 + Math.floor(seededRand(si * 31 + ci) * 4);
    const topics = Array.from({ length: topicCount }, (_, ti) => {
      const mastery = Math.round(seededRand(si * 71 + ci * 13 + ti) * 100);
      return {
        name: `${c} Topic ${ti + 1}`,
        mastery,
        questions: 20 + Math.floor(seededRand(si + ci + ti) * 60),
      };
    });
    const chMastery = Math.round(topics.reduce((a, t) => a + t.mastery, 0) / topics.length);
    return { name: c, topics, mastery: chMastery };
  });
  const mastery = Math.round(chapters.reduce((a, c) => a + c.mastery, 0) / chapters.length);
  const trace = Array.from({ length: 12 }, (_, i) => 30 + Math.round(seededRand(si * 5 + i) * 60));
  return { name: s.name, chapters, mastery, trace };
});

const WEEKLY = [
  { d: "Mon", acc: 62 }, { d: "Tue", acc: 68 }, { d: "Wed", acc: 65 },
  { d: "Thu", acc: 74 }, { d: "Fri", acc: 71 }, { d: "Sat", acc: 79 }, { d: "Sun", acc: 83 },
];

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "subjects", label: "Subjects", icon: BookOpen },
  { key: "flashcards", label: "Flashcards", icon: Layers },
  { key: "ai", label: "AI Doubt Solver", icon: Brain },
  { key: "pdf", label: "PDF Library", icon: FileText },
  { key: "test", label: "Mock Test", icon: ClipboardList },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "rewards", label: "Rewards", icon: Trophy },
  { key: "aichat", label: "AI Chat", icon: MessageSquareText },
];

function VitalsTrace({ values, color, height = 34 }) {
  const w = 120, h = height, pad = 4;
  const max = Math.max(...values), min = Math.min(...values);
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    return [x, y];
  });
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill={color} />
    </svg>
  );
}

function RadialMastery({ value, color, track, size = 76 }) {
  const r = 30, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 76 76">
      <circle cx="38" cy="38" r={r} stroke={track} strokeWidth="7" fill="none" />
      <circle cx="38" cy="38" r={r} stroke={color} strokeWidth="7" fill="none"
        strokeDasharray={c} strokeDashoffset={c - (value / 100) * c}
        strokeLinecap="round" transform="rotate(-90 38 38)" />
    </svg>
  );
}

export default function MedMasterDashboard() {
  const [dark, setDark] = useState(true);
  const t = dark ? palette.dark : palette.light;
  const [nav, setNav] = useState("dashboard");
  const [subjectIdx, setSubjectIdx] = useState(null);
  const [chapterIdx, setChapterIdx] = useState(null);

  const subject = subjectIdx !== null ? SUBJECTS[subjectIdx] : null;
  const chapter = subject && chapterIdx !== null ? subject.chapters[chapterIdx] : null;

  const view = nav !== "subjects" ? "dashboardHome"
    : chapter ? "topics" : subject ? "chapters" : "subjects";

  const totalQuestions = useMemo(
    () => SUBJECTS.reduce((a, s) => a + s.chapters.reduce((b, c) => b + c.topics.reduce((d, tp) => d + tp.questions, 0), 0), 0),
    []
  );

  const goSubjects = () => { setNav("subjects"); setSubjectIdx(null); setChapterIdx(null); };
  const openSubject = (i) => { setSubjectIdx(i); setChapterIdx(null); };
  const openChapter = (i) => setChapterIdx(i);

  return (
    <div style={{
      minHeight: "100vh", background: t.bg, color: t.text,
      fontFamily: "'Inter', sans-serif", display: "flex", transition: "background .25s,color .25s",
    }}>
      <style>{FONT_IMPORT}{`
        .disp { font-family:'Space Grotesk',sans-serif; }
        .mono { font-family:'IBM Plex Mono',monospace; }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar{width:8px;} ::-webkit-scrollbar-thumb{background:${t.border};border-radius:8px;}
      `}</style>

      <aside style={{
        width: 236, flexShrink: 0, borderRight: `1px solid ${t.border}`,
        padding: "22px 14px", display: "flex", flexDirection: "column", gap: 4,
        background: t.panel,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 10px 22px" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${t.teal}, ${t.mint})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <VitalsTrace values={[40, 20, 80, 15, 60, 40]} color="#fff" height={16} />
          </div>
          <div>
            <div className="disp" style={{ fontWeight: 700, fontSize: 15, lineHeight: 1 }}>MedMaster</div>
            <div className="mono" style={{ fontSize: 10, color: t.textDim, letterSpacing: 1 }}>NEET PG</div>
          </div>
        </div>

        {NAV.map(({ key, label, icon: Icon }) => {
          const active = nav === key;
          return (
            <button key={key}
              onClick={() => (key === "subjects" ? goSubjects() : setNav(key))}
              style={{
                display: "flex", alignItems: "center", gap: 11, padding: "10px 12px",
                borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left",
                background: active ? (dark ? t.panelAlt : "#E7F5F3") : "transparent",
                color: active ? t.teal : t.textDim, fontSize: 13.5, fontWeight: 500,
              }}>
              <Icon size={17} strokeWidth={2} />
              {label}
            </button>
          );
        })}

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          <button onClick={() => setNav("profile")} style={{
            display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 10,
            border: "none", background: "transparent", color: t.textDim, fontSize: 13.5, cursor: "pointer",
          }}><User size={17} />Profile</button>
          <button onClick={() => setNav("settings")} style={{
            display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 10,
            border: "none", background: "transparent", color: t.textDim, fontSize: 13.5, cursor: "pointer",
          }}><Settings size={17} />Settings</button>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0, padding: "22px 30px 40px", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: 9, background: t.panel,
            border: `1px solid ${t.border}`, borderRadius: 12, padding: "9px 14px", maxWidth: 380,
          }}>
            <Search size={15} color={t.textDim} />
            <span className="mono" style={{ fontSize: 12.5, color: t.textDim }}>Search subjects, topics, PYQs</span>
          </div>
          <div style={{ flex: 1 }} />
          <Pill icon={<Flame size={14} color={t.amber} />} label="18-day streak" t={t} />
          <Pill icon={<Award size={14} color={t.teal} />} label="4,120 XP" t={t} />
          <button onClick={() => setDark(!dark)} style={{
            width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`,
            background: t.panel, color: t.text, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${t.teal}, ${t.mint})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff",
          }} className="disp">R</div>
        </div>

        {view === "dashboardHome" && (
          <DashboardHome t={t} totalQuestions={totalQuestions} onOpenSubjects={goSubjects} />
        )}
        {view === "subjects" && (
          <SubjectGrid t={t} onOpen={openSubject} />
        )}
        {view === "chapters" && (
          <ChapterList t={t} subject={subject} onBack={goSubjects} onOpen={openChapter} />
        )}
        {view === "topics" && (
          <TopicList t={t} subject={subject} chapter={chapter} onBack={() => setChapterIdx(null)} />
        )}
      </main>
    </div>
  );
}

function Pill({ icon, label, t }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 7, padding: "8px 13px",
      borderRadius: 10, border: `1px solid ${t.border}`, background: t.panel,
    }}>
      {icon}
      <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{label}</span>
    </div>
  );
}

function DashboardHome({ t, totalQuestions, onOpenSubjects }) {
  const weakSubjects = [...SUBJECTS].sort((a, b) => a.mastery - b.mastery).slice(0, 3);
  const topSubjects = SUBJECTS.slice(0, 6);

  return (
    <div>
      <div className="disp" style={{ fontSize: 24, fontWeight: 700, marginBottom: 3 }}>Good evening, Riya</div>
      <div style={{ color: t.textDim, fontSize: 13.5, marginBottom: 24 }}>
        You are 6% off your weekly accuracy target. 14 flashcards are due today.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={cardStyle(t)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 12, color: t.textDim, marginBottom: 4 }}>Weekly accuracy</div>
              <div className="disp" style={{ fontSize: 26, fontWeight: 700 }}>83<span style={{ fontSize: 14 }}>%</span></div>
            </div>
            <div className="mono" style={{ fontSize: 11, color: t.mint, background: dark ? "#123023" : "#E4F6EC", padding: "3px 8px", borderRadius: 6 }}>up 6.2%</div>
          </div>
          <div style={{ height: 90, marginTop: 6, marginLeft: -10 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="accFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={t.teal} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={t.teal} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: t.textDim }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="acc" stroke={t.teal} strokeWidth={2.2} fill="url(#accFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={cardStyle(t)}>
          <div style={{ fontSize: 12, color: t.textDim, marginBottom: 10 }}>Overall mastery</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <RadialMastery value={68} color={t.teal} track={t.border} />
            <div>
              <div className="disp" style={{ fontSize: 22, fontWeight: 700 }}>68%</div>
              <div className="mono" style={{ fontSize: 11, color: t.textDim }}>{totalQuestions.toLocaleString()} Qs in bank</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
            <MiniStat icon={<Clock3 size={13} color={t.textDim} />} v="3.4h" l="today" t={t} />
            <MiniStat icon={<Target size={13} color={t.textDim} />} v="212" l="solved" t={t} />
          </div>
        </div>

        <div style={cardStyle(t)}>
          <div style={{ fontSize: 12, color: t.textDim, marginBottom: 10 }}>Revision queue</div>
          <div className="disp" style={{ fontSize: 26, fontWeight: 700, color: t.amber }}>14</div>
          <div style={{ fontSize: 12, color: t.textDim, marginBottom: 12 }}>flashcards due today</div>
          <button style={btnStyle(t.amber)}>Start revision <ChevronRight size={14} /></button>
        </div>
      </div>

      <SectionHead t={t} title="Weak subjects" subtitle="Lowest mastery, prioritize these" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {weakSubjects.map((s) => (
          <div key={s.name} style={{ ...cardStyle(t), borderLeft: `3px solid ${t.coral}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="disp" style={{ fontWeight: 600, fontSize: 14.5 }}>{s.name}</div>
              <span className="mono" style={{ fontSize: 12, color: t.coral, fontWeight: 600 }}>{s.mastery}%</span>
            </div>
            <VitalsTrace values={s.trace} color={t.coral} />
          </div>
        ))}
      </div>

      <SectionHead t={t} title="Continue studying" subtitle="Jump back into a subject" action={{ label: "View all subjects", onClick: onOpenSubjects }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {topSubjects.map((s) => (
          <div key={s.name} style={{ ...cardStyle(t), cursor: "pointer" }} onClick={onOpenSubjects}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div className="disp" style={{ fontWeight: 600, fontSize: 14.5 }}>{s.name}</div>
              <span className="mono" style={{ fontSize: 12, color: t.teal, fontWeight: 600 }}>{s.mastery}%</span>
            </div>
            <div style={{ fontSize: 11.5, color: t.textDim, marginBottom: 8 }}>{s.chapters.length} chapters</div>
            <VitalsTrace values={s.trace} color={t.teal} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniStat({ icon, v, l, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {icon}
      <span className="mono" style={{ fontSize: 12.5, fontWeight: 600 }}>{v}</span>
      <span style={{ fontSize: 11, color: t.textDim }}>{l}</span>
    </div>
  );
}

function SectionHead({ t, title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", margin: "6px 0 12px" }}>
      <div>
        <div className="disp" style={{ fontSize: 15.5, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 12, color: t.textDim }}>{subtitle}</div>
      </div>
      {action && (
        <button onClick={action.onClick} style={{
          background: "none", border: "none", color: t.teal, fontSize: 12.5, fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 3,
        }}>{action.label} <ChevronRight size={13} /></button>
      )}
    </div>
  );
}

const cardStyle = (t) => ({
  background: t.panel, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18,
});
const btnStyle = (color) => ({
  background: color, color: "#0E1626", border: "none", borderRadius: 9, padding: "8px 13px",
  fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
});

function SubjectGrid({ t, onOpen }) {
  return (
    <div>
      <div className="disp" style={{ fontSize: 22, fontWeight: 700, marginBottom: 3 }}>Subjects</div>
      <div style={{ color: t.textDim, fontSize: 13.5, marginBottom: 20 }}>{SUBJECTS.length} NEET PG subjects, tap to open chapters</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {SUBJECTS.map((s, i) => (
          <div key={s.name} onClick={() => onOpen(i)} style={{ ...cardStyle(t), cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div className="disp" style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
              <RadialMastery value={s.mastery} color={t.teal} track={t.border} size={40} />
            </div>
            <div style={{ fontSize: 11.5, color: t.textDim, marginBottom: 10 }}>{s.chapters.length} chapters</div>
            <VitalsTrace values={s.trace} color={t.teal} height={26} />
          </div>
        ))}
      </div>
  
