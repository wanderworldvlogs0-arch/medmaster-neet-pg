import React, { useEffect, useRef, useState } from "react";
import {
  Sun, Moon, Send, Image as ImageIcon, FileText, Plus, Brain, Sparkles,
  BookOpen, Layers, ListChecks, Stethoscope, MessageSquareText, X, Paperclip,
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
   MOCK CHAT HISTORY (sidebar)
--------------------------------------------------------------- */
const HISTORY = [
  { id: "h1", title: "Frank-Starling mechanism", time: "Today" },
  { id: "h2", title: "Ethambutol vs Isoniazid toxicity", time: "Today" },
  { id: "h3", title: "Erb's palsy — image uploaded", time: "Yesterday" },
  { id: "h4", title: "Cranial nerve mnemonics", time: "2 days ago" },
  { id: "h5", title: "Von Gierke's disease pathway", time: "4 days ago" },
];

const STARTERS = [
  "Explain the Frank-Starling mechanism simply",
  "Mnemonic for the 12 cranial nerves",
  "Why does constrictive pericarditis cause Kussmaul's sign?",
  "Upload a question image to solve",
];

/* ---------------------------------------------------------------
   MOCK AI RESPONSE ENGINE (keyword-matched canned answers)
--------------------------------------------------------------- */
function mockAnswer(query) {
  const q = query.toLowerCase();
  if (q.includes("frank-starling") || q.includes("starling")) {
    return "The Frank-Starling mechanism says: the more the ventricle fills with blood during diastole (preload), the more forcefully it contracts — up to a physiological limit.\n\nThink of it like stretching a rubber band: stretch it more (within reason) and it snaps back harder. Cardiac muscle fibers work the same way — more stretch means more overlap of actin-myosin cross-bridges, meaning a stronger contraction.\n\nIn decompensated heart failure, the ventricle operates on the flattened/descending part of this curve — so pumping more volume in no longer helps, and can even worsen output.";
  }
  if (q.includes("cranial nerve")) {
    return "Classic mnemonic for the 12 cranial nerves (I–XII):\n\n\"Oh Oh Oh To Touch And Feel Very Good Vaginal Area, Hmm\"\n\nOlfactory, Optic, Oculomotor, Trochlear, Trigeminal, Abducens, Facial, Vestibulocochlear, Glossopharyngeal, Vagus, Accessory, Hypoglossal.\n\nFor sensory/motor/both: \"Some Say Marry Money But My Brother Says Big Brains Matter More\" — S=sensory, M=motor, B=both.";
  }
  if (q.includes("kussmaul") || q.includes("pericarditis")) {
    return "Kussmaul's sign is a paradoxical rise in JVP on inspiration.\n\nNormally, inspiration drops intrathoracic pressure, which increases venous return and should lower JVP. In constrictive pericarditis, the rigid, non-compliant pericardium prevents the right atrium/ventricle from accommodating that extra volume — so pressure backs up into the jugular veins instead, and JVP rises.\n\nIt's typically absent in cardiac tamponade, which is a useful discriminator in PYQs.";
  }
  if (q.includes("ethambutol") || q.includes("isoniazid")) {
    return "Quick comparison:\n\n• Ethambutol → dose-dependent optic neuritis (red-green color blindness first) — needs baseline + periodic visual testing.\n• Isoniazid → peripheral neuropathy (from B6/pyridoxine depletion) and hepatotoxicity — that's why pyridoxine is co-administered.\n\nA good way to remember: \"Ethambutol = Eyes, Isoniazid = Nerves & liver.\"";
  }
  return "Here's a working explanation based on your question — in a full deployment this would call the AI backend with your topic context and return a tailored answer, citing relevant chapters from your question bank.\n\nFor this demo, try one of the suggested starter prompts, or ask about: Frank-Starling mechanism, cranial nerve mnemonics, Kussmaul's sign, or Ethambutol vs Isoniazid toxicity.";
}

function mockGenerate(kind, topic) {
  const bank = {
    summary: `Summary — ${topic}:\n\n• Core mechanism explained in 2-3 lines\n• Key differentiator from similar conditions/drugs\n• One high-yield fact examiners love to test\n\n(In production this is generated from the full AI response text via a structured-output call.)`,
    mnemonic: `Mnemonic for ${topic}:\n\nA short, memorable phrase built from the first letters of the key facts above — generated and cached so you can revisit it from your notes anytime.`,
    flashcards: `Generated 3 flashcards for "${topic}" and added them to your Pharmacology deck:\n\n1. Front: core definition → Back: mechanism\n2. Front: key differentiator → Back: explanation\n3. Front: classic exam trap → Back: correct answer`,
    mcqs: `Generated 2 practice MCQs on "${topic}" and added them to your custom question set — available under Mock Test → Custom Test.`,
    clinical: `Clinical correlation for "${topic}":\n\nA short vignette showing how this concept presents in an actual patient, with the key exam-relevant clinical sign or lab finding highlighted.`,
  };
  return bank[kind];
}

const ACTIONS = [
  { key: "summary", label: "Summary", icon: MessageSquareText },
  { key: "mnemonic", label: "Mnemonic", icon: Sparkles },
  { key: "flashcards", label: "Flashcards", icon: Layers },
  { key: "mcqs", label: "MCQs", icon: ListChecks },
  { key: "clinical", label: "Clinical explanation", icon: Stethoscope },
];

/* ---------------------------------------------------------------
   APP
--------------------------------------------------------------- */
export default function MedMasterAIDoubtSolver() {
  const [dark, setDark] = useState(true);
  const t = dark ? palette.dark : palette.light;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [activeHistory, setActiveHistory] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = (text) => {
    const content = (text ?? input).trim();
    if (!content && !attachment) return;
    const userMsg = { role: "user", text: content, attachment, id: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput(""); setAttachment(null); setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "ai", text: mockAnswer(content || "image question"), id: Date.now() + 1, topic: content || "this question" }]);
    }, 950);
  };

  const runAction = (kind, topic, afterId) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "ai", text: mockGenerate(kind, topic), id: Date.now(), isGenerated: true }]);
    }, 700);
  };

  const newChat = () => { setMessages([]); setActiveHistory(null); setAttachment(null); setInput(""); };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter',sans-serif", display: "flex" }}>
      <style>{FONT_IMPORT}{`
        .disp{font-family:'Space Grotesk',sans-serif;} .mono{font-family:'IBM Plex Mono',monospace;}
        * { box-sizing:border-box; }
        .btn{transition:all .12s;} .btn:active{transform:scale(.96);}
        .hrow{transition:background .12s;}
        .dot{animation:pulse 1.2s infinite ease-in-out;} .dot:nth-child(2){animation-delay:.15s;} .dot:nth-child(3){animation-delay:.3s;}
        @keyframes pulse{0%,60%,100%{opacity:.3;transform:scale(.85);}30%{opacity:1;transform:scale(1);}}
        ::-webkit-scrollbar{width:8px;} ::-webkit-scrollbar-thumb{background:${t.border};border-radius:8px;}
      `}</style>

      {/* SIDEBAR */}
      <aside style={{ width: 250, flexShrink: 0, borderRight: `1px solid ${t.border}`, background: t.panel, padding: 16, display: "flex", flexDirection: "column" }}>
        <button onClick={newChat} className="btn" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 14px",
          borderRadius: 10, border: "none", background: t.teal, color: "#0E1626", fontSize: 13, fontWeight: 700,
          cursor: "pointer", marginBottom: 16,
        }}><Plus size={15} /> New doubt</button>

        <div style={{ fontSize: 11, color: t.textDim, fontWeight: 600, marginBottom: 8, letterSpacing: 0.5 }}>RECENT</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {HISTORY.map((h) => (
            <div key={h.id} className="hrow" onClick={() => setActiveHistory(h.id)} style={{
              padding: "9px 10px", borderRadius: 8, cursor: "pointer",
              background: activeHistory === h.id ? t.panelAlt : "transparent",
            }}>
              <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.title}</div>
              <div style={{ fontSize: 10.5, color: t.textDim }}>{h.time}</div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 26px", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Brain size={17} color={t.teal} />
            <span className="disp" style={{ fontWeight: 700, fontSize: 15.5 }}>AI Doubt Solver</span>
          </div>
          <button onClick={() => setDark(!dark)} className="btn" style={iconBtn(t)}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 26px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            {messages.length === 0 && (
              <EmptyState t={t} onPick={send} onUpload={(kind) => setAttachment({ kind, name: kind === "image" ? "question_photo.jpg" : "chapter_notes.pdf" })} />
            )}

            {messages.map((m, i) => (
              <MessageBubble key={m.id} t={t} m={m}
                showActions={m.role === "ai" && !m.isGenerated && i === messages.length - 1 && !typing}
                onAction={(kind) => runAction(kind, m.topic)} />
            ))}

            {typing && (
              <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "10px 0" }}>
                <AiAvatar t={t} />
                <div style={{ display: "flex", gap: 4, background: t.panel, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 14px" }}>
                  <span className="dot" style={{ width: 6, height: 6, borderRadius: "50%", background: t.teal }} />
                  <span className="dot" style={{ width: 6, height: 6, borderRadius: "50%", background: t.teal }} />
                  <span className="dot" style={{ width: 6, height: 6, borderRadius: "50%", background: t.teal }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* INPUT BAR */}
        <div style={{ borderTop: `1px solid ${t.border}`, padding: "14px 26px 20px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            {attachment && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.panelAlt, border: `1px solid ${t.border}`, borderRadius: 9, padding: "7px 11px", marginBottom: 8, width: "fit-content" }}>
                {attachment.kind === "image" ? <ImageIcon size={13} color={t.teal} /> : <FileText size={13} color={t.teal} />}
                <span style={{ fontSize: 11.5 }}>{attachment.name}</span>
                <button onClick={() => setAttachment(null)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textDim, display: "flex" }}><X size={13} /></button>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, background: t.panel, border: `1px solid ${t.border}`, borderRadius: 14, padding: "8px 10px" }}>
              <button onClick={() => setAttachment({ kind: "image", name: "question_photo.jpg" })} className="btn" style={miniIconBtn(t)} title="Upload image"><ImageIcon size={15} /></button>
              <button onClick={() => setAttachment({ kind: "pdf", name: "chapter_notes.pdf" })} className="btn" style={miniIconBtn(t)} title="Upload PDF"><Paperclip size={15} /></button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask a medical question…"
                rows={1}
                style={{
                  flex: 1, resize: "none", border: "none", outline: "none", background: "transparent",
                  color: t.text, fontSize: 13.5, fontFamily: "'Inter',sans-serif", padding: "8px 4px", maxHeight: 100,
                }}
              />
              <button onClick={() => send()} className="btn" style={{
                width: 34, height: 34, borderRadius: 9, border: "none", background: t.teal, color: "#0E1626",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}><Send size={15} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function iconBtn(t) {
  return { width: 34, height: 34, borderRadius: 9, border: `1px solid ${t.border}`, background: t.panelAlt, color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
}
function miniIconBtn(t) {
  return { width: 30, height: 30, borderRadius: 8, border: "none", background: "transparent", color: t.textDim, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
}

function AiAvatar({ t }) {
  return (
    <div style={{
      width: 26, height: 26, borderRadius: 8, background: `linear-gradient(135deg, ${t.teal}, ${t.violet})`,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}><Brain size={13} color="#fff" /></div>
  );
}

/* ---------------------------------------------------------------
   EMPTY STATE
--------------------------------------------------------------- */
function EmptyState({ t, onPick, onUpload }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <div style={{
        width: 54, height: 54, borderRadius: 16, margin: "0 auto 16px",
        background: `linear-gradient(135deg, ${t.teal}, ${t.violet})`, display: "flex", alignItems: "center", justifyContent: "center",
      }}><Brain size={24} color="#fff" /></div>
      <div className="disp" style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Ask me anything, doctor-to-be</div>
      <div style={{ fontSize: 13, color: t.textDim, marginBottom: 24 }}>Text, question photos, or PDF pages — I'll explain, summarize, and turn it into study material.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 420, margin: "0 auto" }}>
        {STARTERS.map((s, i) => (
          <button key={s} className="btn" onClick={() => i === STARTERS.length - 1 ? onUpload("image") : onPick(s)} style={{
            textAlign: "left", padding: "11px 14px", borderRadius: 11, border: `1px solid ${t.border}`,
            background: t.panel, color: t.text, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 9,
          }}>
            {i === STARTERS.length - 1 ? <ImageIcon size={14} color={t.teal} /> : <Sparkles size={14} color={t.teal} />}
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   MESSAGE BUBBLE
--------------------------------------------------------------- */
function MessageBubble({ t, m, showActions, onAction }) {
  const isUser = m.role === "user";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", maxWidth: "88%", flexDirection: isUser ? "row-reverse" : "row" }}>
        {!isUser && <AiAvatar t={t} />}
        <div style={{
          background: isUser ? t.teal : t.panel, color: isUser ? "#0E1626" : t.text,
          border: isUser ? "none" : `1px solid ${t.border}`, borderRadius: 14,
          padding: "12px 15px", fontSize: 13.5, lineHeight: 1.6, whiteSpace: "pre-line",
        }}>
          {m.attachment && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, opacity: 0.85 }}>
              {m.attachment.kind === "image" ? <ImageIcon size={13} /> : <FileText size={13} />}
              <span style={{ fontSize: 11.5 }}>{m.attachment.name}</span>
            </div>
          )}
          {m.text}
        </div>
      </div>

      {showActions && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8, marginLeft: 34 }}>
          {ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <button key={a.key} onClick={() => onAction(a.key)} className="btn" style={{
                display: "flex", alignItems: "center", gap: 5, padding: "6px 11px", borderRadius: 8,
                border: `1px solid ${t.border}`, background: t.panelAlt, color: t.textDim, fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}><Icon size={12} />{a.label}</button>
            );
          })}
        </div>
      )}
    </div>
  );
}
