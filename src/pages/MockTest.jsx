import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock3, Sun, Moon, Flag, ChevronRight, ChevronLeft, CheckCircle2, XCircle,
  AlertTriangle, Layers, BookOpen, Target, SlidersHorizontal, ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";

const palette = {
  dark: {
    bg: "#0E1626", panel: "#141F35", panelAlt: "#182545",
    border: "#25324F", text: "#EAF0F6", textDim: "#8593AC",
    teal: "#14B8AA", mint: "#3ACE85", coral: "#F26A50", amber: "#E9AE45", violet: "#9C8CF0",
  },
  light: {
    bg: "#EEF1F3", panel: "#FFFFFF", panelAlt: "#F5F7F8",
    border: "#DFE4E9", text: "#101826", textDim: "#5C6B80",
    teal: "#0E8F84", mint: "#1F9D5F", coral: "#D8452F", amber: "#B9791C", violet: "#6E5CD6",
  },
};
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');`;

const TEST_TYPES = [
  { key: "full", label: "Full Length Test", icon: Layers, desc: "180 Qs, all subjects, exam-pattern", questions: 12, duration: 900, marksCorrect: 1, marksWrong: -0.33 },
  { key: "subject", label: "Subject Test", icon: BookOpen, desc: "Single subject, fixed length", questions: 8, duration: 600, marksCorrect: 1, marksWrong: -0.33 },
  { key: "chapter", label: "Chapter Test", icon: Target, desc: "One chapter, focused practice", questions: 6, duration: 420, marksCorrect: 1, marksWrong: 0 },
  { key: "topic", label: "Topic Test", icon: Target, desc: "Single topic, quick check", questions: 5, duration: 300, marksCorrect: 1, marksWrong: 0 },
  { key: "custom", label: "Custom Test", icon: SlidersHorizontal, desc: "Choose subjects, count and marking", questions: 10, duration: 600, marksCorrect: 1, marksWrong: -0.25 },
];

const BANK = [
  { subject: "Medicine", stem: "A patient with STEMI develops complete heart block 2 days post-MI involving the inferior wall. Which coronary artery is most likely occluded?", options: ["Left anterior descending", "Right coronary artery", "Left circumflex", "Left main"], correct: 1 },
  { subject: "Surgery", stem: "Which is the most common site for a Meckel diverticulum to be found during laparotomy?", options: ["Jejunum", "60 cm from ileocecal valve", "Duodenum", "Sigmoid colon"], correct: 1 },
  { subject: "Pathology", stem: "Psammoma bodies are characteristically seen in which of the following tumors?", options: ["Papillary carcinoma thyroid", "Follicular carcinoma thyroid", "Medullary carcinoma thyroid", "Anaplastic carcinoma thyroid"], correct: 0 },
  { subject: "Pharmacology", stem: "Which anti-tubercular drug is most commonly associated with optic neuritis?", options: ["Isoniazid", "Rifampicin", "Ethambutol", "Pyrazinamide"], correct: 2 },
  { subject: "Anatomy", stem: "The recurrent laryngeal nerve is at greatest risk of injury during thyroidectomy near which structure?", options: ["Superior thyroid artery", "Inferior thyroid artery", "Middle thyroid vein", "Thyroid ima artery"], correct: 1 },
  { subject: "PSM", stem: "As per the epidemiological triad, which factor is best described as agent factor in tuberculosis?", options: ["Overcrowding", "Mycobacterium tuberculosis virulence", "Malnutrition", "Poor ventilation"], correct: 1 },
  { subject: "Pediatrics", stem: "A 2-year-old presents with barking cough, stridor and low-grade fever, worse at night. Most likely diagnosis?", options: ["Epiglottitis", "Croup (laryngotracheobronchitis)", "Foreign body aspiration", "Bacterial tracheitis"], correct: 1 },
  { subject: "Obstetrics", stem: "In a primigravida with a breech presentation at term, which is the preferred mode of delivery per current recommendations?", options: ["Elective cesarean section", "Assisted vaginal breech always", "External cephalic version contraindicated", "Induction of labour at 34 weeks"], correct: 0 },
  { subject: "Microbiology", stem: "Which stain is used to demonstrate the capsule of Cryptococcus neoformans?", options: ["Ziehl-Neelsen stain", "India ink preparation", "Gram stain", "Giemsa stain"], correct: 1 },
  { subject: "Orthopaedics", stem: "A supracondylar fracture of the humerus in a child most commonly injures which nerve?", options: ["Ulnar nerve", "Median nerve", "Anterior interosseous nerve", "Radial nerve"], correct: 2 },
  { subject: "Medicine", stem: "Kussmaul sign (paradoxical rise in JVP on inspiration) is classically seen in which condition?", options: ["Cardiac tamponade", "Constrictive pericarditis", "Left ventricular failure", "Mitral stenosis"], correct: 1 },
  { subject: "Biochemistry", stem: "Deficiency of which enzyme causes Von Gierke disease (Glycogen Storage Disease Type I)?", options: ["Glycogen phosphorylase", "Glucose-6-phosphatase", "Debranching enzyme", "Acid maltase"], correct: 1 },
];

const SUBJECT_COLOR = (t) => ({
  Medicine: t.teal, Surgery: t.coral, Pathology: t.violet, Pharmacology: t.amber,
  Anatomy: t.mint, PSM: "#6AA6F0", Pediatrics: "#F0A6D0", Obstetrics: "#F0C46A",
  Microbiology: "#8CD6C4", Orthopaedics: "#D6A68C", Biochemistry: "#A6D68C",
});

export default function MedMasterMockTest() {
  const [dark, setDark] = useState(true);
  const t = dark ? palette.dark : palette.light;
  const [phase, setPhase] = useState("setup");
  const [config, setConfig] = useState(TEST_TYPES[0]);
  const [negMarking, setNegMarking] = useState(true);

  const questions = useMemo(() => BANK.slice(0, config.questions), [config]);

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState({});
  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [submittedAt, setSubmittedAt] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase !== "testing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) { clearInterval(timerRef.current); finishTest(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const startTest = () => {
    setAnswers({}); setStatus({}); setIdx(0);
    setTimeLeft(config.duration);
    setPhase("testing");
  };

  const selectOption = (oi) => {
    setAnswers((p) => ({ ...p, [idx]: oi }));
  };

  const saveNext = () => {
    setStatus((p) => ({ ...p, [idx]: answers[idx] !== undefined ? "answered" : p[idx] }));
    if (idx < questions.length - 1) setIdx(idx + 1);
  };
  const markReview = () => {
    setStatus((p) => ({ ...p, [idx]: answers[idx] !== undefined ? "answeredMarked" : "marked" }));
    if (idx < questions.length - 1) setIdx(idx + 1);
  };
  const clearResponse = () => {
    setAnswers((p) => { const c = { ...p }; delete c[idx]; return c; });
    setStatus((p) => { const c = { ...p }; delete c[idx]; return c; });
  };

  const finishTest = () => {
    clearInterval(timerRef.current);
    setSubmittedAt(config.duration - timeLeft);
    setPhase("result");
  };

  const results = useMemo(() => {
    let correct = 0, wrong = 0, skipped = 0, marks = 0;
    const bySubject = {};
    questions.forEach((q, qi) => {
      const a = answers[qi];
      if (!bySubject[q.subject]) bySubject[q.subject] = { correct: 0, wrong: 0, skipped: 0, total: 0 };
      bySubject[q.subject].total++;
      if (a === undefined) { skipped++; bySubject[q.subject].skipped++; return; }
      if (a === q.correct) { correct++; marks += config.marksCorrect; bySubject[q.subject].correct++; }
      else { wrong++; if (negMarking) marks += config.marksWrong; bySubject[q.subject].wrong++; }
    });
    const maxMarks = questions.length * config.marksCorrect;
    const accuracy = correct + wrong ? Math.round((correct / (correct + wrong)) * 100) : 0;
    return { correct, wrong, skipped, marks: Math.round(marks * 100) / 100, maxMarks, accuracy, bySubject };
  }, [answers, questions, config, negMarking]);

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter',sans-serif" }}>
      <style>{FONT_IMPORT}{`
        .disp{font-family:'Space Grotesk',sans-serif;} .mono{font-family:'IBM Plex Mono',monospace;}
        * { box-sizing:border-box; }
        .btn{transition:all .12s;} .btn:active{transform:scale(.97);}
        .opt{transition:all .12s;} .opt:hover{filter:brightness(1.03);}
        .pcell{transition:all .1s;} .pcell:hover{transform:scale(1.08);}
        ::-webkit-scrollbar{width:8px;} ::-webkit-scrollbar-thumb{background:${t.border};border-radius:8px;}
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 26px", borderBottom: `1px solid ${t.border}`, background: t.panel, position: "sticky", top: 0, zIndex: 5 }}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 15.5 }}>Mock Test</div>
        <button onClick={() => setDark(!dark)} className="btn" style={iconBtn(t)}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
      </div>

      {phase === "setup" && (
        <SetupView t={t} config={config} setConfig={setConfig} negMarking={negMarking} setNegMarking={setNegMarking} onStart={startTest} />
      )}
      {phase === "testing" && (
        <TestingView t={t} config={config} questions={questions} idx={idx} setIdx={setIdx}
          answers={answers} status={status} timeLeft={timeLeft}
          selectOption={selectOption} saveNext={saveNext} markReview={markReview}
          clearResponse={clearResponse} onSubmit={finishTest} />
      )}
      {phase === "result" && (
        <ResultView t={t} dark={dark} config={config} negMarking={negMarking} questions={questions}
          answers={answers} results={results} submittedAt={submittedAt}
          onRetake={() => setPhase("setup")} />
      )}
    </div>
  );
}

function SetupView({ t, config, setConfig, negMarking, setNegMarking, onStart }) {
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div className="disp" style={{ fontSize: 22, fontWeight: 700, marginBottom: 3 }}>Choose a test format</div>
      <div style={{ color: t.textDim, fontSize: 13.5, marginBottom: 22 }}>Timed, exam-pattern tests with instant analysis</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 24 }}>
        {TEST_TYPES.map((tt) => {
          const active = config.key === tt.key;
          const Icon = tt.icon;
          return (
            <div key={tt.key} className="btn" onClick={() => setConfig(tt)} style={{
              cursor: "pointer", borderRadius: 16, padding: 16, border: `1.5px solid ${active ? t.teal : t.border}`,
              background: active ? (t === palette.dark ? "#123833" : "#E5F5F2") : t.panel,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: `${t.teal}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color={t.teal} />
                </div>
                <div className="disp" style={{ fontWeight: 700, fontSize: 14.5 }}>{tt.label}</div>
              </div>
              <div style={{ fontSize: 12, color: t.textDim, marginBottom: 8 }}>{tt.desc}</div>
              <div style={{ display: "flex", gap: 10 }}>
                <span className="mono" style={{ fontSize: 11, color: t.textDim }}>{tt.questions} Qs</span>
                <span className="mono" style={{ fontSize: 11, color: t.textDim }}>{Math.round(tt.duration / 60)} min</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18, marginBottom: 22 }}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 12 }}>Marking scheme</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13 }}>+{config.marksCorrect} for each correct answer</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13 }}>Negative marking {negMarking ? `(${config.marksWrong})` : "off"}</span>
          <button onClick={() => setNegMarking(!negMarking)} className="btn" style={{
            width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
            background: negMarking ? t.teal : t.border, position: "relative",
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3,
              left: negMarking ? 21 : 3, transition: "left .15s",
            }} />
          </button>
        </div>
      </div>

      <button onClick={onStart} className="btn" style={{ ...primaryBtn(t.teal), width: "100%", justifyContent: "center", padding: "13px 20px", fontSize: 14.5 }}>
        Start test <ArrowRight size={16} />
      </button>
    </div>
  );
}

function TestingView({ t, config, questions, idx, setIdx, answers, status, timeLeft, selectOption, saveNext, markReview, clearResponse, onSubmit }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const q = questions[idx];
  const mins = Math.floor(timeLeft / 60), secs = timeLeft % 60;
  const low = timeLeft < 60;

  return (
    <div style={{ display: "flex", height: "calc(100vh - 65px)" }}>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: `1px solid ${t.border}` }}>
          <div>
            <div className="mono" style={{ fontSize: 10.5, color: t.textDim, letterSpacing: 1 }}>{config.label.toUpperCase()}</div>
            <div className="disp" style={{ fontSize: 14.5, fontWeight: 700 }}>Question {idx + 1} of {questions.length}</div>
          </div>
          <div className="mono" style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 700,
            color: low ? t.coral : t.text, padding: "7px 14px", borderRadius: 10,
            background: low ? `${t.coral}18` : t.panelAlt, border: `1px solid ${low ? t.coral : t.border}`,
          }}>
            <Clock3 size={15} /> {mins}:{String(secs).padStart(2, "0")}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "22px 26px" }}>
          <Badge t={t} color={SUBJECT_COLOR(t)[q.subject] || t.teal}>{q.subject}</Badge>
          <div style={{ fontSize: 15.5, lineHeight: 1.55, margin: "14px 0 18px" }}>{q.stem}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {q.options.map((opt, oi) => {
              const isSel = answers[idx] === oi;
              return (
                <div key={oi} className="opt" onClick={() => selectOption(oi)} style={{
                  display: "flex", alignItems: "center", gap: 11, padding: "12px 14px", borderRadius: 11,
                  border: `1.5px solid ${isSel ? t.teal : t.border}`,
                  background: isSel ? (t === palette.dark ? "#123833" : "#E5F5F2") : t.panel, cursor: "pointer",
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", border: `2px solid ${isSel ? t.teal : t.textDim}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {isSel && <div style={{ width: 9, height: 9, borderRadius: "50%", background: t.teal }} />}
                  </div>
                  <span style={{ fontSize: 13.8 }}>{opt}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 24px", borderTop: `1px solid ${t.border}`, gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={clearResponse} style={{ ...ghostBtn(t) }}>Clear response</button>
            <button className="btn" onClick={markReview} style={{ ...ghostBtn(t), color: t.amber, borderColor: `${t.amber}66` }}>
              <Flag size={13} /> Mark for review and next
            </button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" disabled={idx === 0} onClick={() => setIdx(idx - 1)} style={{ ...ghostBtn(t), opacity: idx === 0 ? 0.4 : 1 }}><ChevronLeft size={14} /> Previous</button>
            {idx < questions.length - 1 ? (
              <button className="btn" onClick={saveNext} style={primaryBtn(t.teal)}>Save and next <ChevronRight size={14} /></button>
            ) : (
              <button className="btn" onClick={() => setConfirmOpen(true)} style={primaryBtn(t.coral)}>Submit test</button>
            )}
          </div>
        </div>
      </div>

      <div style={{ width: 250, flexShrink: 0, borderLeft: `1px solid ${t.border}`, background: t.panel, padding: 18, overflowY: "auto" }}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Question palette</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 7, marginBottom: 16 }}>
          {questions.map((_, qi) => {
            const st = status[qi];
            let bg = t.panelAlt, color = t.text, border = t.border;
            if (st === "answered") { bg = t.mint; color = "#0E1626"; border = t.mint; }
            else if (st === "marked") { bg = t.violet; color = "#0E1626"; border = t.violet; }
            else if (st === "answeredMarked") { bg = t.amber; color = "#0E1626"; border = t.amber; }
            if (qi === idx) border = t.teal;
            return (
              <button key={qi} className="pcell" onClick={() => setIdx(qi)} style={{
                width: 34, height: 34, borderRadius: 8, border: `2px solid ${border}`, background: bg, color,
                fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>{qi + 1}</button>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 11.5, color: t.textDim, marginBottom: 18 }}>
          <LegendRow color={t.mint} label="Answered" />
          <LegendRow color={t.panelAlt} border={t.border} label="Not answered" />
          <LegendRow color={t.violet} label="Marked for review" />
          <LegendRow color={t.amber} label="Answered and marked" />
        </div>
        <button className="btn" onClick={() => setConfirmOpen(true)} style={{ ...primaryBtn(t.coral), width: "100%", justifyContent: "center" }}>Submit test</button>
      </div>

        {confirmOpen && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
          <div style={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24, width: 340 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <AlertTriangle size={18} color={t.amber} />
              <div className="disp" style={{ fontWeight: 700, fontSize: 15 }}>Submit test?</div>
            </div>
            <div style={{ fontSize: 13, color: t.textDim, marginBottom: 18 }}>
              You have answered {Object.keys(answers).length} of {questions.length} questions. This cannot be undone.
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="btn" onClick={() => setConfirmOpen(false)} style={ghostBtn(t)}>Cancel</button>
              <button className="btn" onClick={onSubmit} style={primaryBtn(t.coral)}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function LegendRow({ color, border, label }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ width: 13, height: 13, borderRadius: 4, background: color, border: border ? `1.5px solid ${border}` : "none" }} />
    {label}
  </div>;
}

function ResultView({ t, dark, config, negMarking, questions, answers, results, submittedAt, onRetake }) {
  const [showSolutions, setShowSolutions] = useState(false);
  const mins = Math.floor((submittedAt || 0) / 60), secs = (submittedAt || 0) % 60;
  const pieData = [
    { name: "Correct", value: results.correct, color: t.mint },
    { name: "Wrong", value: results.wrong, color: t.coral },
    { name: "Skipped", value: results.skipped, color: t.textDim },
  ].filter((d) => d.value > 0);

  const subjectData = Object.entries(results.bySubject).map(([name, s]) => ({
    name, accuracy: s.correct + s.wrong ? Math.round((s.correct / (s.correct + s.wrong)) * 100) : 0,
  }));

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "26px 20px 60px" }}>
      <div className="disp" style={{ fontSize: 22, fontWeight: 700, marginBottom: 3 }}>{config.label} Result</div>
      <div style={{ color: t.textDim, fontSize: 13.5, marginBottom: 22 }}>Submitted in {mins}m {secs}s, {negMarking ? `negative marking ${config.marksWrong}` : "no negative marking"}</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: 14, marginBottom: 22 }}>
        <div style={cardStyle(t)}>
          <div style={{ fontSize: 12, color: t.textDim, marginBottom: 4 }}>Score</div>
          <div className="disp" style={{ fontSize: 28, fontWeight: 700 }}>{results.marks}<span style={{ fontSize: 15, color: t.textDim }}> / {results.maxMarks}</span></div>
        </div>
        <div style={cardStyle(t)}>
          <div style={{ fontSize: 12, color: t.textDim, marginBottom: 4 }}>Accuracy</div>
          <div className="disp" style={{ fontSize: 28, fontWeight: 700, color: t.teal }}>{results.accuracy}%</div>
        </div>
        <div style={{ ...cardStyle(t), display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 90, height: 90 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={26} outerRadius={40} paddingAngle={3} stroke="none">
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <LegendRow color={t.mint} label={`${results.correct} correct`} />
            <LegendRow color={t.coral} label={`${results.wrong} wrong`} />
            <LegendRow color={t.textDim} label={`${results.skipped} skipped`} />
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle(t), marginBottom: 22 }}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Subject-wise accuracy</div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: t.textDim }} axisLine={{ stroke: t.border }} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10.5, fill: t.textDim }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                {subjectData.map((d, i) => <Cell key={i} fill={SUBJECT_COLOR(t)[d.name] || t.teal} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
        <button className="btn" onClick={() => setShowSolutions(!showSolutions)} style={primaryBtn(t.teal)}>
          {showSolutions ? "Hide" : "View"} solutions <ArrowRight size={15} />
        </button>
        <button className="btn" onClick={onRetake} style={ghostBtn(t)}>Take another test</button>
      </div>

      {showSolutions && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {questions.map((q, qi) => {
            const a = answers[qi];
            const correct = a === q.correct;
            return (
              <div key={qi} style={cardStyle(t)}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                  <Badge t={t} color={SUBJECT_COLOR(t)[q.subject] || t.teal}>{q.subject}</Badge>
                  {a === undefined ? <Badge t={t} color={t.textDim}>Skipped</Badge>
                    : correct ? <Badge t={t} color={t.mint}>Correct</Badge> : <Badge t={t} color={t.coral}>Wrong</Badge>}
                </div>
                <div style={{ fontSize: 13.8, marginBottom: 10 }}>{qi + 1}. {q.stem}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {q.options.map((opt, oi) => {
                    const isCorrectOpt = oi === q.correct, isSel = oi === a;
                    let border = t.border, bg = "transparent";
                    if (isCorrectOpt) { border = t.mint; bg = `${t.mint}14`; }
                    else if (isSel) { border = t.coral; bg = `${t.coral}14`; }
                    return (
                      <div key={oi} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: bg }}>
                        <span style={{ fontSize: 12.8 }}>{opt}</span>
                        {isCorrectOpt && <CheckCircle2 size={13} color={t.mint} style={{ marginLeft: "auto" }} />}
                        {isSel && !isCorrectOpt && <XCircle size={13} color={t.coral} style={{ marginLeft: "auto" }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Badge({ t, color, children }) {
  return <span className="mono" style={{ fontSize: 10.5, fontWeight: 600, color, border: `1px solid ${color}55`, background: `${color}14`, borderRadius: 7, padding: "3.5px 9px" }}>{children}</span>;
}
const cardStyle = (t) => ({ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18 });
const iconBtn = (t) => ({ width: 34, height: 34, borderRadius: 9, border: `1px solid ${t.border}`, background: t.panelAlt, color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" });
const primaryBtn = (color) => ({ background: color, color: "#0E1626", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 });
const ghostBtn = (t) => ({ background: "transparent", color: t.text, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 });
