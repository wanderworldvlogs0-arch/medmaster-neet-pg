import React, { useEffect, useMemo, useState } from "react";
import {
  Bookmark, Flag, Clock3, ChevronRight, ChevronLeft, CheckCircle2, XCircle,
  Circle, CheckSquare, Square, Sun, Moon, X, ArrowRight, RotateCcw, Sparkles,
} from "lucide-react";

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

const QUESTIONS = [
  {
    type: "single", difficulty: "medium", estTime: 60, pyq: "AIIMS Nov 2023",
    tags: ["Heart Failure", "Diuretics"],
    stem: "A 62-year-old man with NYHA class III heart failure with reduced ejection fraction is already on a loop diuretic, ACE inhibitor, and beta-blocker. Which drug class, when added, has been shown to reduce mortality by targeting the RAAS at the aldosterone level?",
    options: ["Thiazide diuretics", "Mineralocorticoid receptor antagonists", "Calcium channel blockers", "Alpha-1 blockers"],
    correct: [1],
    explanation: "Mineralocorticoid receptor antagonists, spironolactone and eplerenone, block aldosterone effect at the distal nephron and myocardium. Landmark trials RALES and EMPHASIS-HF showed a consistent mortality benefit when added to standard HFrEF therapy, which is why they are a pillar of guideline-directed medical therapy alongside ACE-I or ARNI, beta-blockers, and SGLT2 inhibitors.",
    reference: "Harrison's Principles of Internal Medicine, 21st Ed., Ch. 254",
  },
  {
    type: "multiple", difficulty: "hard", estTime: 90, pyq: "NEET PG 2022",
    tags: ["Heart Failure", "Pharmacology"],
    stem: "Which of the following drugs have demonstrated a mortality benefit in patients with heart failure with reduced ejection fraction, HFrEF? Select all that apply.",
    options: ["Sacubitril-valsartan, ARNI", "Dapagliflozin, SGLT2 inhibitor", "Digoxin", "Carvedilol", "Amlodipine"],
    correct: [0, 1, 3],
    explanation: "ARNI, PARADIGM-HF trial, SGLT2 inhibitors, DAPA-HF and EMPEROR-Reduced trials, and specific beta-blockers like carvedilol, bisoprolol and metoprolol succinate all reduce mortality in HFrEF. Digoxin improves symptoms and reduces hospitalizations but has never shown a mortality benefit. Amlodipine is mortality-neutral and used only for concomitant hypertension or angina, not as HF-directed therapy.",
    reference: "ACC/AHA/HFSA 2022 Heart Failure Guideline",
  },
  {
    type: "image", difficulty: "medium", estTime: 75, pyq: "INI-CET 2023",
    tags: ["Heart Failure", "Radiology"],
    stem: "A 58-year-old woman presents with progressive breathlessness. Her chest X-ray is shown below. Which finding is most specific for cardiogenic pulmonary edema rather than ARDS?",
    options: ["Bilateral perihilar bat-wing opacities", "Cardiomegaly with upper lobe venous diversion", "Diffuse peripheral ground-glass opacities", "Pleural effusion alone"],
    correct: [1],
    explanation: "Cardiomegaly with cephalization of pulmonary vessels, upper lobe venous diversion, points to a cardiac cause of pulmonary edema. Elevated left atrial pressure redistributes blood to the upper lobes before frank edema develops. ARDS classically shows a normal heart size with diffuse, peripheral, patchy opacities because the process is driven by capillary leak, not hydrostatic pressure.",
    reference: "Felson's Principles of Chest Roentgenology, 5th Ed.",
  },
  {
    type: "single", difficulty: "easy", estTime: 45, pyq: "FMGE 2023",
    tags: ["Heart Failure", "Physiology"],
    stem: "The Frank-Starling mechanism describes the relationship between which two variables?",
    options: ["Heart rate and stroke volume", "Ventricular end-diastolic volume and stroke volume", "Afterload and ejection fraction", "Coronary flow and myocardial oxygen demand"],
    correct: [1],
    explanation: "The Frank-Starling law states that, within physiological limits, increased ventricular end-diastolic volume, preload, stretches myocardial fibers and increases the force of contraction, thereby increasing stroke volume. In decompensated heart failure, the ventricle operates on the flattened or descending part of this curve, so further volume loading no longer improves, and can worsen, stroke volume.",
    reference: "Guyton and Hall Textbook of Medical Physiology, 14th Ed., Ch. 9",
  },
  {
    type: "single", difficulty: "hard", estTime: 90, pyq: "AIIMS May 2022",
    tags: ["Heart Failure", "Clinical"],
    stem: "A 70-year-old man with known HFrEF, EF 30%, on optimal medical therapy presents with a resting heart rate of 88 per minute in sinus rhythm despite maximally tolerated beta-blocker dose. Which agent can be added to further reduce heart rate without additional negative inotropic effect?",
    options: ["Verapamil", "Ivabradine", "Digoxin", "Diltiazem"],
    correct: [1],
    explanation: "Ivabradine selectively inhibits the If, funny, current in the SA node, slowing heart rate without affecting myocardial contractility or blood pressure, making it useful in HFrEF patients who remain tachycardic despite maximal beta-blockade. Non-dihydropyridine calcium channel blockers, verapamil and diltiazem, are avoided in HFrEF due to their negative inotropic effect.",
    reference: "SHIFT Trial, Lancet 2010; ACC/AHA/HFSA 2022 Guideline",
  },
  {
    type: "multiple", difficulty: "medium", estTime: 75, pyq: "NEET PG 2021",
    tags: ["Heart Failure", "Clinical Signs"],
    stem: "Which of the following are recognized clinical signs of right-sided heart failure? Select all that apply.",
    options: ["Raised JVP", "Bilateral pitting pedal edema", "Bibasilar crepitations", "Tender hepatomegaly", "Orthopnea"],
    correct: [0, 1, 3],
    explanation: "Right heart failure causes systemic venous congestion: raised JVP, dependent pitting edema, and tender hepatomegaly from hepatic congestion, sometimes with pulsatile liver in tricuspid regurgitation. Bibasilar crepitations and orthopnea reflect pulmonary venous congestion and are signs of left-sided, not right-sided, heart failure, a classic PYQ discriminator.",
    reference: "Davidson's Principles and Practice of Medicine, 24th Ed.",
  },
];

function optIcon(type, selected, isCorrectOpt, submitted, t) {
  const Icon = type === "multiple" ? (selected ? CheckSquare : Square) : Circle;
  let color = t.textDim;
  if (submitted) {
    if (isCorrectOpt) color = t.mint;
    else if (selected && !isCorrectOpt) color = t.coral;
  } else if (selected) color = t.teal;
  return <Icon size={17} color={color} fill={type === "single" && selected ? color : "none"} strokeWidth={2} />;
}

export default function MedMasterPractice() {
  const [dark, setDark] = useState(true);
  const t = dark ? palette.dark : palette.light;

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [flagged, setFlagged] = useState({});
  const [times, setTimes] = useState({});
  const [phase, setPhase] = useState("session");
  const [reviewIdx, setReviewIdx] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const q = QUESTIONS[idx];
  const total = QUESTIONS.length;
  const isSubmitted = !!submitted[idx];
  const selected = answers[idx] || new Set();

  useEffect(() => {
    if (phase !== "session" || isSubmitted) return;
    const iv = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, [idx, phase, isSubmitted]);

  useEffect(() => { setSeconds(0); }, [idx]);

  const toggleOption = (oi) => {
    if (isSubmitted) return;
    setAnswers((prev) => {
      const set = new Set(prev[idx] || []);
      if (q.type === "single") { set.clear(); set.add(oi); }
      else { set.has(oi) ? set.delete(oi) : set.add(oi); }
      return { ...prev, [idx]: set };
    });
  };

  const submit = () => {
    setSubmitted((p) => ({ ...p, [idx]: true }));
    setTimes((p) => ({ ...p, [idx]: seconds }));
  };

  const isCorrect = (qi) => {
    const sel = answers[qi] || new Set();
    const correctSet = new Set(QUESTIONS[qi].correct);
    if (sel.size !== correctSet.size) return false;
    for (const s of sel) if (!correctSet.has(s)) return false;
    return true;
  };

  const goNext = () => {
    if (idx < total - 1) setIdx(idx + 1);
    else setPhase("summary");
  };

  const stats = useMemo(() => {
    let correct = 0, wrong = 0, skipped = 0, timeSum = 0;
    QUESTIONS.forEach((_, qi) => {
      if (!submitted[qi]) { skipped++; return; }
      if (isCorrect(qi)) correct++; else wrong++;
      timeSum += times[qi] || 0;
    });
    return { correct, wrong, skipped, timeSum, accuracy: correct + wrong ? Math.round((correct / (correct + wrong)) * 100) : 0 };
  }, [submitted, times, answers]);

  const restart = () => {
    setIdx(0); setAnswers({}); setSubmitted({}); setTimes({}); setPhase("session"); setSeconds(0);
  };

  return (
    <div style={{
      minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter',sans-serif",
    }}>
      <style>{FONT_IMPORT}{`
        .disp{font-family:'Space Grotesk',sans-serif;} .mono{font-family:'IBM Plex Mono',monospace;}
        * { box-sizing:border-box; }
        ::-webkit-scrollbar{width:8px;} ::-webkit-scrollbar-thumb{background:${t.border};border-radius:8px;}
      `}</style>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 26px", borderBottom: `1px solid ${t.border}`, background: t.panel,
        position: "sticky", top: 0, zIndex: 5,
      }}>
        <div>
          <div className="mono" style={{ fontSize: 10.5, color: t.textDim, letterSpacing: 1, marginBottom: 2 }}>MEDICINE, CARDIOLOGY</div>
          <div className="disp" style={{ fontSize: 15.5, fontWeight: 700 }}>Heart Failure Practice Session</div>
        </div>
        <button onClick={() => setDark(!dark)} style={{
          width: 34, height: 34, borderRadius: 9, border: `1px solid ${t.border}`, background: t.panelAlt,
          color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
      </div>

      {phase === "session" && (
        <SessionView t={t} dark={dark} q={q} idx={idx} total={total} selected={selected}
          isSubmitted={isSubmitted} submitted={submitted}
          bookmarked={!!bookmarked[idx]} flagged={!!flagged[idx]} seconds={seconds}
          toggleOption={toggleOption} submit={submit} goNext={goNext}
          setIdx={setIdx}
          toggleBookmark={() => setBookmarked((p) => ({ ...p, [idx]: !p[idx] }))}
          toggleFlag={() => setFlagged((p) => ({ ...p, [idx]: !p[idx] }))}
          isCorrectFn={isCorrect} />
      )}

      {phase === "summary" && (
        <SummaryView t={t} stats={stats} total={total} onReview={() => { setPhase("review"); setReviewIdx(0); }} onRestart={restart} />
      )}

      {phase === "review" && (
        <ReviewView t={t} idx={reviewIdx} setIdx={setReviewIdx} answers={answers}
          submitted={submitted} isCorrectFn={isCorrect} onDone={() => setPhase("summary")} />
      )}
    </div>
  );
}

function SessionView({ t, dark, q, idx, total, selected, isSubmitted, seconds, toggleOption, submit, goNext, setIdx, bookmarked, flagged, toggleBookmark, toggleFlag, isCorrectFn, submitted }) {
  const typeLabel = { single: "Single Correct", multiple: "Multiple Correct", image: "Image Based" }[q.type];
  const diffColor = { easy: t.mint, medium: t.amber, hard: t.coral }[q.difficulty];

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "22px 20px 60px" }}>
      <div style={{ display: "flex", gap: 5, marginBottom: 18 }}>
        {QUESTIONS.map((_, i) => {
          let color = t.border;
          if (submitted[i]) color = isCorrectFn(i) ? t.mint : t.coral;
          else if (i === idx) color = t.teal;
          return <div key={i} onClick={() => setIdx(i)} style={{
            flex: 1, height: 5, borderRadius: 3, background: color, cursor: "pointer",
            opacity: i === idx ? 1 : 0.75,
          }} />;
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div className="mono" style={{ fontSize: 12, color: t.textDim }}>Question {idx + 1} of {total}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="mono" style={{ fontSize: 12, color: t.textDim, display: "flex", alignItems: "center", gap: 4 }}>
            <Clock3 size={13} /> {String(Math.floor(seconds / 60)).padStart(1, "0")}:{String(seconds % 60).padStart(2, "0")}
          </span>
          <button onClick={toggleBookmark} style={iconBtn(t, bookmarked ? t.amber : t.textDim)}>
            <Bookmark size={15} fill={bookmarked ? t.amber : "none"} />
          </button>
          <button onClick={toggleFlag} style={iconBtn(t, flagged ? t.coral : t.textDim)}>
            <Flag size={15} fill={flagged ? t.coral : "none"} />
          </button>
        </div>
      </div>

      <div style={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 18, padding: 24 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <Badge t={t} color={t.teal}>{typeLabel}</Badge>
          <Badge t={t} color={diffColor}>{q.difficulty[0].toUpperCase() + q.difficulty.slice(1)}</Badge>
          <Badge t={t} color={t.textDim}>{q.estTime}s est.</Badge>
          <Badge t={t} color={t.textDim}>{q.pyq}</Badge>
        </div>

        <div style={{ fontSize: 15.5, lineHeight: 1.55, marginBottom: 18 }}>{q.stem}</div>

        {q.type === "image" && <ChestXraySVG />}

        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {q.options.map((opt, oi) => {
            const isSel = selected.has(oi);
            const isCorrectOpt = q.correct.includes(oi);
            let bg = t.panelAlt, border = t.border;
            if (isSubmitted) {
              if (isCorrectOpt) { bg = dark ? "#12301F" : "#E6F7EC"; border = t.mint; }
              else if (isSel && !isCorrectOpt) { bg = dark ? "#331B18" : "#FBE8E4"; border = t.coral; }
            } else if (isSel) { bg = dark ? "#123833" : "#E5F5F2"; border = t.teal; }
            return (
              <div key={oi} onClick={() => toggleOption(oi)} style={{
                display: "flex", alignItems: "center", gap: 11, padding: "12px 14px", borderRadius: 11,
                border: `1.5px solid ${border}`, background: bg, cursor: isSubmitted ? "default" : "pointer",
              }}>
                {optIcon(q.type, isSel, isCorrectOpt, isSubmitted, t)}
                <span style={{ fontSize: 13.8 }}>{opt}</span>
                {isSubmitted && isCorrectOpt && <CheckCircle2 size={15} color={t.mint} style={{ marginLeft: "auto" }} />}
                {isSubmitted && isSel && !isCorrectOpt && <XCircle size={15} color={t.coral} style={{ marginLeft: "auto" }} />}
              </div>
            );
          })}
        </div>

        {isSubmitted && (
          <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px dashed ${t.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
              <Sparkles size={14} color={t.teal} />
              <span className="disp" style={{ fontWeight: 700, fontSize: 13.5 }}>Explanation</span>
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.65, color: t.text, marginBottom: 10 }}>{q.explanation}</div>
            <div className="mono" style={{ fontSize: 11.5, color: t.textDim }}>Ref: {q.reference}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
              {q.tags.map((tag) => <span key={tag} className="mono" style={{
                fontSize: 10.5, color: t.textDim, border: `1px solid ${t.border}`, borderRadius: 6, padding: "2px 8px",
              }}>{tag}</span>)}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
        {!isSubmitted ? (
          <button disabled={selected.size === 0} onClick={submit} style={{
            ...primaryBtn(t.teal), opacity: selected.size === 0 ? 0.45 : 1,
            cursor: selected.size === 0 ? "not-allowed" : "pointer",
          }}>Submit answer</button>
        ) : (
          <button onClick={goNext} style={primaryBtn(t.teal)}>
            {idx < total - 1 ? "Next question" : "Finish session"} <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

function Badge({ t, color, children }) {
  return <span className="mono" style={{
    fontSize: 10.5, fontWeight: 600, color, border: `1px solid ${color}55`,
    background: `${color}14`, borderRadius: 7, padding: "3.5px 9px",
  }}>{children}</span>;
}
function iconBtn(t, color) {
  return { width: 30, height: 30, borderRadius: 8, border: `1px solid ${t.border}`, background: t.panelAlt,
    color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
}
function primaryBtn(color) {
  return { background: color, color: "#0E1626", border: "none", borderRadius: 10, padding: "11px 20px",
    fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 };
}

function ChestXraySVG() {
  return (
    <div style={{ background: "#0A0F18", borderRadius: 12, padding: 14, marginBottom: 18, display: "flex", justifyContent: "center" }}>
      <svg width="220" height="220" viewBox="0 0 220 220">
        <rect width="220" height="220" fill="#0A0F18" />
        <ellipse cx="110" cy="115" rx="90" ry="95" fill="none" stroke="#3A4B63" strokeWidth="2" />
        <path d="M60 60 Q55 115 65 175" fill="none" stroke="#556A85" strokeWidth="6" opacity="0.6" />
        <path d="M160 60 Q165 115 155 175" fill="none" stroke="#556A85" strokeWidth="6" opacity="0.6" />
        <ellipse cx="112" cy="130" rx="46" ry="40" fill="#8593AC" opacity="0.55" />
        <ellipse cx="100" cy="118" rx="30" ry="26" fill="#B9C4D6" opacity="0.5" />
        <path d="M110 20 L110 210" stroke="#3A4B63" strokeWidth="1" strokeDasharray="3 4" />
      </svg>
    </div>
  );
}

function SummaryView({ t, stats, total, onReview, onRestart }) {
  const mins = Math.floor(stats.timeSum / 60), secs = stats.timeSum % 60;
  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: "0 20px", textAlign: "center" }}>
      <div className="disp" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Session complete</div>
      <div style={{ color: t.textDim, fontSize: 13.5, marginBottom: 26 }}>Heart Failure, {total} questions</div>

      <div style={{
        display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        width: 150, height: 150, borderRadius: "50%", border: `10px solid ${t.border}`,
        position: "relative", marginBottom: 26,
      }}>
        <svg width="150" height="150" style={{ position: "absolute", top: -10, left: -10, transform: "rotate(-90deg)" }}>
          <circle cx="75" cy="75" r="65" fill="none" stroke={t.teal} strokeWidth="10"
            strokeDasharray={2 * Math.PI * 65} strokeDashoffset={2 * Math.PI * 65 * (1 - stats.accuracy / 100)}
            strokeLinecap="round" />
        </svg>
        <div className="disp" style={{ fontSize: 30, fontWeight: 700 }}>{stats.accuracy}%</div>
        <div style={{ fontSize: 11, color: t.textDim }}>accuracy</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 28 }}>
        <StatBox t={t} v={stats.correct} l="Correct" color={t.mint} />
        <StatBox t={t} v={stats.wrong} l="Wrong" color={t.coral} />
        <StatBox t={t} v={stats.skipped} l="Skipped" color={t.textDim} />
        <StatBox t={t} v={`${mins}:${String(secs).padStart(2, "0")}`} l="Time" color={t.amber} mono />
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={onReview} style={primaryBtn(t.teal)}>Review answers <ArrowRight size={15} /></button>
        <button onClick={onRestart} style={{ ...primaryBtn("transparent"), color: t.text, border: `1px solid ${t.border}` }}>
          <RotateCcw size={14} /> Retry session
        </button>
      </div>
    </div>
  );
}
function StatBox({ t, v, l, color, mono }) {
  return (
    <div style={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 6px" }}>
      <div className={mono ? "mono" : "disp"} style={{ fontSize: 17, fontWeight: 700, color }}>{v}</div>
      <div style={{ fontSize: 10.5, color: t.textDim, marginTop: 2 }}>{l}</div>
    </div>
  );
}

function ReviewView({ t, idx, setIdx, answers, submitted, isCorrectFn, onDone }) {
  const q = QUESTIONS[idx];
  const sel = answers[idx] || new Set();
  const attempted = !!submitted[idx];
  const correct = attempted && isCorrectFn(idx);

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "22px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div className="mono" style={{ fontSize: 12, color: t.textDim }}>Review {idx + 1} of {QUESTIONS.length}</div>
        <button onClick={onDone} style={iconBtn(t, t.textDim)}><X size={15} /></button>
      </div>

      <div style={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 18, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          {!attempted ? <Badge t={t} color={t.textDim}>Skipped</Badge>
            : correct ? <Badge t={t} color={t.mint}>Correct</Badge>
            : <Badge t={t} color={t.coral}>Incorrect</Badge>}
          <Badge t={t} color={t.textDim}>{q.pyq}</Badge>
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.55, marginBottom: 16 }}>{q.stem}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {q.options.map((opt, oi) => {
            const isCorrectOpt = q.correct.includes(oi);
            const isSel = sel.has(oi);
            let border = t.border, bg = "transparent";
            if (isCorrectOpt) { border = t.mint; bg = `${t.mint}14`; }
            else if (isSel) { border = t.coral; bg = `${t.coral}14`; }
            return (
              <div key={oi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", borderRadius: 10, border: `1.5px solid ${border}`, background: bg }}>
                <span style={{ fontSize: 13.3 }}>{opt}</span>
                {isCorrectOpt && <CheckCircle2 size={14} color={t.mint} style={{ marginLeft: "auto" }} />}
                {isSel && !isCorrectOpt && <XCircle size={14} color={t.coral} style={{ marginLeft: "auto" }} />}
              </div>
            );
          })}
        </div>
        <div style={{ paddingTop: 14, borderTop: `1px dashed ${t.border}` }}>
          <div style={{ fontSize: 13.3, lineHeight: 1.6, marginBottom: 8 }}>{q.explanation}</div>
          <div className="mono" style={{ fontSize: 11.5, color: t.textDim }}>Ref: {q.reference}</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <button disabled={idx === 0} onClick={() => setIdx(idx - 1)}
          style={{ ...primaryBtn("transparent"), color: t.text, border: `1px solid ${t.border}`, opacity: idx === 0 ? 0.4 : 1 }}>
          <ChevronLeft size={15} /> Previous
        </button>
        {idx < QUESTIONS.length - 1 ? (
          <button onClick={() => setIdx(idx + 1)} style={primaryBtn(t.teal)}>Next <ChevronRight size={15} /></button>
        ) : (
          <button onClick={onDone} style={primaryBtn(t.teal)}>Back to summary</button>
        )}
      </div>
    </div>
  );
                 }
