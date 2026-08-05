import React, { useState } from "react";
import {
  Sun, Moon, Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft,
  Stethoscope, GraduationCap, Target, CheckCircle2,
} from "lucide-react";

const palette = {
  dark: { bg: "#0E1626", panel: "#141F35", panelAlt: "#182545", border: "#25324F", text: "#EAF0F6", textDim: "#8593AC", teal: "#14B8AA", mint: "#3ACE85" },
  light: { bg: "#EEF1F3", panel: "#FFFFFF", panelAlt: "#F5F7F8", border: "#DFE4E9", text: "#101826", textDim: "#5C6B80", teal: "#0E8F84", mint: "#1F9D5F" },
};
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap');`;

const ONBOARD_STEPS = [
  { icon: Stethoscope, title: "Welcome to MedMaster", desc: "The complete prep companion for NEET PG, INI-CET and FMGE." },
  { icon: GraduationCap, title: "Learn your way", desc: "MCQs, flashcards, PYQs and an AI doubt solver — all in one place." },
  { icon: Target, title: "Track every step", desc: "Mistake notebook, weak-topic analysis and mock tests keep you exam-ready." },
];

export default function MedMasterAuth() {
  const [dark, setDark] = useState(true);
  const t = dark ? palette.dark : palette.light;
  const [screen, setScreen] = useState("onboarding"); // onboarding | login | signup | forgot | sent
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter',sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{FONT}{`.disp{font-family:'Space Grotesk',sans-serif;} *{box-sizing:border-box;} .btn{transition:all .12s;} .btn:active{transform:scale(.97);} input:focus{outline:none;}`}</style>

      <div style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}>
        <button onClick={() => setDark(!dark)} className="btn" style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${t.border}`, background: t.panelAlt, color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20px 40px" }}>
        {screen === "onboarding" && <Onboarding t={t} step={step} setStep={setStep} onDone={() => setScreen("login")} />}
        {screen === "login" && <Login t={t} showPw={showPw} setShowPw={setShowPw} onSignup={() => setScreen("signup")} onForgot={() => setScreen("forgot")} />}
        {screen === "signup" && <Signup t={t} showPw={showPw} setShowPw={setShowPw} onLogin={() => setScreen("login")} />}
        {screen === "forgot" && <Forgot t={t} onBack={() => setScreen("login")} onSent={() => setScreen("sent")} />}
        {screen === "sent" && <Sent t={t} onBack={() => setScreen("login")} />}
      </div>
    </div>
  );
}

const cardStyle = (t) => ({ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 18, padding: 28, width: 360 });
const primaryBtn = (c) => ({ background: c, color: "#0E1626", border: "none", borderRadius: 10, padding: "11px 18px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%" });
function InputField({ t, icon: Icon, type = "text", placeholder, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 13px", marginBottom: 11, background: t.panelAlt }}>
      <Icon size={15} color={t.textDim} />
      <input type={type} placeholder={placeholder} style={{ flex: 1, border: "none", background: "transparent", color: t.text, fontSize: 13, fontFamily: "inherit" }} />
      {right}
    </div>
  );
}

function Onboarding({ t, step, setStep, onDone }) {
  const s = ONBOARD_STEPS[step];
  const Icon = s.icon;
  return (
    <div style={{ ...cardStyle(t), textAlign: "center" }}>
      <div style={{ width: 60, height: 60, borderRadius: 16, margin: "0 auto 20px", background: `linear-gradient(135deg, ${t.teal}, ${t.mint})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={26} color="#fff" /></div>
      <div className="disp" style={{ fontSize: 19, fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
      <div style={{ fontSize: 13, color: t.textDim, marginBottom: 26, lineHeight: 1.6 }}>{s.desc}</div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 22 }}>
        {ONBOARD_STEPS.map((_, i) => <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i === step ? t.teal : t.border, transition: "width .2s" }} />)}
      </div>
      <button onClick={() => step < ONBOARD_STEPS.length - 1 ? setStep(step + 1) : onDone()} className="btn" style={primaryBtn(t.teal)}>
        {step < ONBOARD_STEPS.length - 1 ? "Next" : "Get started"} <ArrowRight size={14} />
      </button>
    </div>
  );
}

function Login({ t, showPw, setShowPw, onSignup, onForgot }) {
  return (
    <div style={cardStyle(t)}>
      <div className="disp" style={{ fontSize: 19, fontWeight: 700, marginBottom: 4 }}>Welcome back</div>
      <div style={{ fontSize: 12.5, color: t.textDim, marginBottom: 20 }}>Log in to continue your prep</div>
      <InputField t={t} icon={Mail} placeholder="Email or phone" />
      <InputField t={t} icon={Lock} type={showPw ? "text" : "password"} placeholder="Password"
        right={<button onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textDim, display: "flex" }}>{showPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>} />
      <div style={{ textAlign: "right", marginBottom: 16 }}>
        <button onClick={onForgot} style={{ background: "none", border: "none", color: t.teal, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>Forgot password?</button>
      </div>
      <button className="btn" style={primaryBtn(t.teal)}>Log in <ArrowRight size={14} /></button>
      <div style={{ textAlign: "center", marginTop: 18, fontSize: 12.5, color: t.textDim }}>
        New here? <button onClick={onSignup} style={{ background: "none", border: "none", color: t.teal, fontWeight: 600, cursor: "pointer", fontSize: 12.5 }}>Create account</button>
      </div>
    </div>
  );
}

function Signup({ t, showPw, setShowPw, onLogin }) {
  return (
    <div style={cardStyle(t)}>
      <div className="disp" style={{ fontSize: 19, fontWeight: 700, marginBottom: 4 }}>Create your account</div>
      <div style={{ fontSize: 12.5, color: t.textDim, marginBottom: 20 }}>Start your 2-day free trial</div>
      <InputField t={t} icon={User} placeholder="Full name" />
      <InputField t={t} icon={Mail} placeholder="Email" />
      <InputField t={t} icon={Lock} type={showPw ? "text" : "password"} placeholder="Password"
        right={<button onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textDim, display: "flex" }}>{showPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>} />
      <button className="btn" style={{ ...primaryBtn(t.teal), marginTop: 6 }}>Create account <ArrowRight size={14} /></button>
      <div style={{ textAlign: "center", marginTop: 18, fontSize: 12.5, color: t.textDim }}>
        Already have an account? <button onClick={onLogin} style={{ background: "none", border: "none", color: t.teal, fontWeight: 600, cursor: "pointer", fontSize: 12.5 }}>Log in</button>
      </div>
    </div>
  );
}

function Forgot({ t, onBack, onSent }) {
  return (
    <div style={cardStyle(t)}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: t.textDim, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, marginBottom: 14, padding: 0 }}><ArrowLeft size={13} /> Back</button>
      <div className="disp" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Reset password</div>
      <div style={{ fontSize: 12.5, color: t.textDim, marginBottom: 20 }}>We'll email you a reset link</div>
      <InputField t={t} icon={Mail} placeholder="Registered email" />
      <button onClick={onSent} className="btn" style={primaryBtn(t.teal)}>Send reset link</button>
    </div>
  );
}
function Sent({ t, onBack }) {
  return (
    <div style={{ ...cardStyle(t), textAlign: "center" }}>
      <CheckCircle2 size={40} color={t.mint} style={{ marginBottom: 14 }} />
      <div className="disp" style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Check your inbox</div>
      <div style={{ fontSize: 12.5, color: t.textDim, marginBottom: 20 }}>A password reset link has been sent to your email.</div>
      <button onClick={onBack} className="btn" style={primaryBtn(t.teal)}>Back to login</button>
    </div>
  );
}
