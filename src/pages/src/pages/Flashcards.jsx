import React, { useMemo, useState } from "react";
import {
  Sun, Moon, Layers, Flame, RotateCcw, ArrowRight, CheckCircle2, BookOpen, Sparkles,
} from "lucide-react";

/* ---------------------------------------------------------------
   TOKENS (same "clinical chart" system as the other modules)
--------------------------------------------------------------- */
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

/* ---------------------------------------------------------------
   SM-2 SPACED REPETITION
   quality: again=1, hard=3, good=4, easy=5
--------------------------------------------------------------- */
function sm2(card, rating) {
  const quality = { again: 1, hard: 3, good: 4, easy: 5 }[rating];
  let { ef = 2.5, interval = 0, reps = 0 } = card;
  if (quality < 3) {
    reps = 0; interval = 1;
  } else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(interval * ef);
  }
  ef = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  return { ef: Math.round(ef * 100) / 100, interval, reps };
}
function previewInterval(card, rating) { return sm2(card, rating).interval; }

/* ---------------------------------------------------------------
   MOCK DECKS
--------------------------------------------------------------- */
const DECKS = [
  {
    id: "pharm-ans", subject: "Pharmacology", topic: "ANS Drugs — Mnemonics", color: "amber",
    cards: [
      { front: "Mnemonic for direct-acting cholinergic agonists?", back: "\"MBC-P\": Methacholine, Bethanechol, Carbachol, Pilocarpine — all resist AChE breakdown better than ACh itself, giving longer duration of action." },
      { front: "Which anti-cholinergic is used specifically for motion sickness?", back: "Scopolamine (hyoscine) — crosses the blood-brain barrier well and is applied as a transdermal patch behind the ear for motion sickness prophylaxis." },
      { front: "First-line drug for anaphylaxis and why?", back: "IM Epinephrine (adrenaline) — α1 reverses vasodilation/hypotension, β1 increases cardiac output, β2 causes bronchodilation and reduces mediator release." },
      { front: "Beta-2 selective agonist used for tocolysis?", back: "Ritodrine / Terbutaline — β2 stimulation relaxes uterine smooth muscle, used to delay preterm labour." },
    ],
  },
  {
    id: "anat-limb", subject: "Anatomy", topic: "Upper Limb — Nerve Injuries", color: "mint",
    cards: [
      { front: "'Waiter's tip' deformity results from injury to which nerve roots?", back: "Erb's palsy — upper trunk of brachial plexus, roots C5-C6. Arm hangs adducted, medially rotated, forearm pronated, wrist flexed." },
      { front: "Claw hand with sensory loss over medial 1.5 fingers?", back: "Ulnar nerve injury — loses lumbricals to 4th/5th digits, causing hyperextension at MCP and flexion at IP joints of ring and little fingers." },
      { front: "Wrist drop is characteristic of injury to which nerve, and at what common site?", back: "Radial nerve, classically at the spiral (radial) groove of the humerus — e.g. from a mid-shaft humeral fracture or 'Saturday night palsy'." },
    ],
  },
  {
    id: "biochem-path", subject: "Biochemistry", topic: "Metabolic Pathways", color: "violet",
    cards: [
      { front: "Rate-limiting enzyme of glycolysis?", back: "Phosphofructokinase-1 (PFK-1) — converts fructose-6-phosphate to fructose-1,6-bisphosphate; inhibited by ATP and citrate, activated by AMP and fructose-2,6-bisphosphate." },
      { front: "Rate-limiting enzyme of the urea cycle?", back: "Carbamoyl phosphate synthetase I (CPS-I) — mitochondrial enzyme activated by N-acetylglutamate; its deficiency causes hyperammonemia." },
      { front: "Rate-limiting enzyme of cholesterol synthesis, and its inhibitor drug class?", back: "HMG-CoA reductase — inhibited competitively by statins, which lower LDL by upregulating hepatic LDL receptors." },
    ],
  },
];

/* ---------------------------------------------------------------
   APP
--------------------------------------------------------------- */
export default function MedMasterFlashcards() {
  const [dark, setDark] = useState(true);
  const t = dark ? palette.dark : palette.light;
  const [phase, setPhase] = useState("queue"); // queue | session | summary
  const [deckId, setDeckId] = useState(null);
  const [cardState, setCardState] = useState({}); // key -> {ef, interval, reps}
  const [order, setOrder] = useState([]);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [log, setLog] = useState([]); // list of ratings this session

  const totalDue = DECKS.reduce((a, d) => a + d.cards.length, 0);

  const startDeck = (id) => {
    const deck = DECKS.find((d) => d.id === id);
    setDeckId(id);
    setOrder(deck.cards.map((_, i) => i));
    setPos(0); setFlipped(false); setLog([]);
    setPhase("session");
  };
  const startAll = () => {
    const all = [];
    DECKS.forEach((d, di) => d.cards.forEach((_, ci) => all.push(`${di}:${ci}`)));
    setDeckId("all");
    setOrder(all);
    setPos(0); setFlipped(false); setLog([]);
    setPhase("session");
  };

  const deck = deckId && deckId !== "all" ? DECKS.find((d) => d.id === deckId) : null;
  const currentCard = useMemo(() => {
    if (!order.length) return null;
    if (deckId === "all") {
      const [di, ci] = order[pos].split(":").map(Number);
      return { ...DECKS[di].cards[ci], key: order[pos], subject: DECKS[di].subject, topic: DECKS[di].topic, color: DECKS[di].color };
    }
    const ci = order[pos];
    return { ...deck.cards[ci], key: `${deckId}:${ci}`, subject: deck.subject, topic: deck.topic, color: deck.color };
  }, [order, pos, deckId, deck]);

  const rate = (rating) => {
    const key = currentCard.key;
    const prev = cardState[key] || {};
    const next = sm2(prev, rating);
    setCardState((p) => ({ ...p, [key]: next }));
    setLog((p) => [...p, { rating, interval: next.interval }]);
    if (pos < order.length - 1) { setPos(pos + 1); setFlipped(false); }
    else setPhase("summary");
  };

  const colorOf = (name) => ({ amber: t.amber, mint: t.mint, violet: t.violet, teal: t.teal, coral: t.coral }[name] || t.teal);

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter',sans-serif" }}>
      <style>{FONT_IMPORT}{`
        .disp{font-family:'Space Grotesk',sans-serif;} .mono{font-family:'IBM Plex Mono',monospace;}
        * { box-sizing:border-box; }
        .btn{transition:all .12s;} .btn:active{transform:scale(.96);}
        .deckrow{transition:all .12s;} .deckrow:hover{transform:translateY(-2px);}
        .flipcard{ perspective:1400px; }
        .flipinner{ position:relative; width:100%; height:100%; transition:transform .45s cubic-bezier(.4,.2,.2,1); transform-style:preserve-3d; }
        .flipface{ position:absolute; inset:0; backface-visibility:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center; border-radius:20px; padding:32px; text-align:center; }
        .flipback{ transform:rotateY(180deg); }
        ::-webkit-scrollbar{width:8px;} ::-webkit-scrollbar-thumb{background:${t.border};border-radius:8px;}
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 26px", borderBottom: `1px solid ${t.border}`, background: t.panel, position: "sticky", top: 0, zIndex: 5 }}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 15.5 }}>Flashcards</div>
        <button onClick={() => setDark(!dark)} className="btn" style={iconBtn(t)}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
      </div>

      {phase === "queue" && (
        <QueueView t={t} totalDue={totalDue} onStartDeck={startDeck} onStartAll={startAll} colorOf={colorOf} />
      )}
      {phase === "session" && currentCard && (
        <SessionView t={t} card={currentCard} pos={pos} total={order.length} flipped={flipped}
          setFlipped={setFlipped} rate={rate} cardState={cardState} colorOf={colorOf} />
      )}
      {phase === "summary" && (
        <SummaryView t={t} log={log} onDone={() => setPhase("queue")} />
      )}
    </div>
  );
}

function iconBtn(t) {
  return { width: 34, height: 34, borderRadius: 9, border: `1px solid ${t.border}`, background: t.panelAlt, color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
}

/* ---------------------------------------------------------------
   QUEUE VIEW
--------------------------------------------------------------- */
function QueueView({ t, totalDue, onStartDeck, onStartAll, colorOf }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div className="disp" style={{ fontSize: 22, fontWeight: 700 }}>Today's revision queue</div>
      </div>
      <div style={{ color: t.textDim, fontSize: 13.5, marginBottom: 22 }}>{totalDue} cards due across 3 decks · spaced repetition (SM-2)</div>

      <div style={{ display: "flex", gap: 14, marginBottom: 22 }}>
        <div style={{ ...cardStyle(t), flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${t.amber}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flame size={18} color={t.amber} />
          </div>
          <div>
            <div className="disp" style={{ fontSize: 18, fontWeight: 700 }}>18-day streak</div>
            <div style={{ fontSize: 11.5, color: t.textDim }}>Review today to keep it going</div>
          </div>
        </div>
        <button onClick={onStartAll} className="btn" style={{ ...primaryBtn(t.teal), flex: 1, justifyContent: "center", fontSize: 13.5 }}>
          Revise all due <ArrowRight size={15} />
        </button>
      </div>

      <div className="disp" style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 10 }}>By deck</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {DECKS.map((d) => (
          <div key={d.id} className="deckrow" onClick={() => onStartDeck(d.id)} style={{
            ...cardStyle(t), cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${colorOf(d.color)}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Layers size={17} color={colorOf(d.color)} />
              </div>
              <div>
                <div className="disp" style={{ fontWeight: 600, fontSize: 14 }}>{d.topic}</div>
                <div style={{ fontSize: 11.5, color: t.textDim }}>{d.subject}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: colorOf(d.color) }}>{d.cards.length} due</span>
              <ArrowRight size={15} color={t.textDim} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SESSION VIEW — flip card + SM-2 rating buttons
--------------------------------------------------------------- */
function SessionView({ t, card, pos, total, flipped, setFlipped, rate, cardState, colorOf }) {
  const color = colorOf(card.color);
  const state = cardState[card.key] || {};

  const ratings = [
    { key: "again", label: "Again", color: t.coral },
    { key: "hard", label: "Hard", color: t.amber },
    { key: "good", label: "Good", color: t.teal },
    { key: "easy", label: "Easy", color: t.mint },
  ];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "22px 20px 60px" }}>
      <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i < pos ? t.mint : i === pos ? t.teal : t.border, opacity: i === pos ? 1 : 0.7 }} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div className="mono" style={{ fontSize: 12, color: t.textDim }}>Card {pos + 1} / {total}</div>
        <span className="mono" style={{ fontSize: 10.5, fontWeight: 600, color, border: `1px solid ${color}55`, background: `${color}14`, borderRadius: 7, padding: "3.5px 9px" }}>{card.subject} · {card.topic}</span>
      </div>

      <div className="flipcard" style={{ height: 320, marginBottom: 20 }} onClick={() => !flipped && setFlipped(true)}>
        <div className="flipinner" style={{ transform: flipped ? "rotateY(180deg)" : "none" }}>
          <div className="flipface" style={{ background: t.panel, border: `1.5px solid ${t.border}` }}>
            <Sparkles size={18} color={color} style={{ marginBottom: 14 }} />
            <div style={{ fontSize: 17, lineHeight: 1.55, fontWeight: 500 }}>{card.front}</div>
            <div style={{ position: "absolute", bottom: 20, fontSize: 11.5, color: t.textDim }}>Tap card to reveal answer</div>
          </div>
          <div className="flipface flipback" style={{ background: t.panel, border: `1.5px solid ${color}` }}>
            <BookOpen size={18} color={color} style={{ marginBottom: 14 }} />
            <div style={{ fontSize: 14.5, lineHeight: 1.6 }}>{card.back}</div>
          </div>
        </div>
      </div>

      {!flipped ? (
        <button className="btn" onClick={() => setFlipped(true)} style={{ ...primaryBtn(color), width: "100%", justifyContent: "center", fontSize: 14 }}>
          Show answer
        </button>
      ) : (
        <div>
          <div style={{ fontSize: 11.5, color: t.textDim, textAlign: "center", marginBottom: 8 }}>How well did you recall this?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {ratings.map((r) => (
              <button key={r.key} className="btn" onClick={() => rate(r.key)} style={{
                background: "transparent", border: `1.5px solid ${r.color}`, color: r.color, borderRadius: 11,
                padding: "10px 6px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              }}>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{r.label}</span>
                <span className="mono" style={{ fontSize: 10, opacity: 0.85 }}>{previewInterval(state, r.key)}d</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   SUMMARY VIEW
--------------------------------------------------------------- */
function SummaryView({ t, log, onDone }) {
  const counts = { again: 0, hard: 0, good: 0, easy: 0 };
  log.forEach((l) => counts[l.rating]++);
  const colorMap = { again: t.coral, hard: t.amber, good: t.teal, easy: t.mint };

  return (
    <div style={{ maxWidth: 480, margin: "50px auto", padding: "0 20px", textAlign: "center" }}>
      <CheckCircle2 size={40} color={t.mint} style={{ marginBottom: 14 }} />
      <div className="disp" style={{ fontSize: 21, fontWeight: 700, marginBottom: 4 }}>Revision complete</div>
      <div style={{ color: t.textDim, fontSize: 13.5, marginBottom: 26 }}>{log.length} cards reviewed this session</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 28 }}>
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} style={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 6px" }}>
            <div className="disp" style={{ fontSize: 18, fontWeight: 700, color: colorMap[k] }}>{v}</div>
            <div style={{ fontSize: 10.5, color: t.textDim, textTransform: "capitalize", marginTop: 2 }}>{k}</div>
          </div>
        ))}
      </div>

      <button className="btn" onClick={onDone} style={{ ...primaryBtn(t.teal), margin: "0 auto" }}>
        <RotateCcw size={14} /> Back to queue
      </button>
    </div>
  );
}

const cardStyle = (t) => ({ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18 });
const primaryBtn = (color) => ({ background: color, color: "#0E1626", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 });
