import React, { useState } from "react";
import {
  Sun, Moon, Check, Zap, Infinity, Clock3, ShieldCheck, X, CreditCard, Smartphone, ArrowRight, CheckCircle2,
} from "lucide-react";

const palette = {
  dark: { bg: "#0E1626", panel: "#141F35", panelAlt: "#182545", border: "#25324F", text: "#EAF0F6", textDim: "#8593AC", teal: "#14B8AA", mint: "#3ACE85", amber: "#E9AE45" },
  light: { bg: "#EEF1F3", panel: "#FFFFFF", panelAlt: "#F5F7F8", border: "#DFE4E9", text: "#101826", textDim: "#5C6B80", teal: "#0E8F84", mint: "#1F9D5F", amber: "#B9791C" },
};
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@600&display=swap');`;

const PLANS = [
  { id: "trial", name: "Free Trial", price: 0, sub: "2 days", desc: "Explore the full app, no card needed", highlight: false },
  { id: "1yr", name: "1 Year", price: 500, sub: "/ year", desc: "Full NEET PG cycle coverage", highlight: true, tag: "Most popular" },
  { id: "3yr", name: "3 Years", price: 1000, sub: "/ 3 years", desc: "Covers PG + INI-CET attempts", highlight: false, tag: "Best value" },
];
const FEATURES = ["Unlimited MCQs", "Unlimited AI Doubt Solver", "Unlimited PDFs", "Unlimited Mock Tests", "Unlimited Analytics", "Unlimited Flashcards"];

export default function MedMasterSubscription() {
  const [dark, setDark] = useState(true);
  const t = dark ? palette.dark : palette.light;
  const [phase, setPhase] = useState("plans"); // plans | checkout | success
  const [selected, setSelected] = useState(PLANS[1]);
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);

  const choose = (p) => { setSelected(p); if (p.price > 0) setPhase("checkout"); else setPhase("success"); };
  const pay = () => { setProcessing(true); setTimeout(() => { setProcessing(false); setPhase("success"); }, 1400); };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter',sans-serif" }}>
      <style>{FONT}{`.disp{font-family:'Space Grotesk',sans-serif;} .mono{font-family:'IBM Plex Mono',monospace;} *{box-sizing:border-box;} .btn{transition:all .12s;} .btn:active{transform:scale(.96);} .pcard{transition:transform .12s;} .pcard:hover{transform:translateY(-3px);} ::-webkit-scrollbar{width:8px;} ::-webkit-scrollbar-thumb{background:${t.border};border-radius:8px;}`}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 26px", borderBottom: `1px solid ${t.border}`, background: t.panel }}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 15.5 }}>Subscription</div>
        <button onClick={() => setDark(!dark)} className="btn" style={iconBtn(t)}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
      </div>

      {phase === "plans" && <PlansView t={t} onChoose={choose} />}
      {phase === "checkout" && <CheckoutView t={t} plan={selected} method={method} setMethod={setMethod} processing={processing} onPay={pay} onBack={() => setPhase("plans")} />}
      {phase === "success" && <SuccessView t={t} plan={selected} onDone={() => setPhase("plans")} />}
    </div>
  );
}

function iconBtn(t) { return { width: 34, height: 34, borderRadius: 9, border: `1px solid ${t.border}`, background: t.panelAlt, color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }; }
const cardStyle = (t) => ({ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18 });
const primaryBtn = (c) => ({ background: c, color: "#0E1626", border: "none", borderRadius: 10, padding: "11px 18px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 });
const ghostBtn = (t) => ({ background: "transparent", color: t.text, border: `1px solid ${t.border}`, borderRadius: 10, padding: "11px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" });

function PlansView({ t, onChoose }) {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div className="disp" style={{ fontSize: 22, fontWeight: 700, marginBottom: 3, textAlign: "center" }}>Go Premium</div>
      <div style={{ color: t.textDim, fontSize: 13.5, marginBottom: 26, textAlign: "center" }}>Unlock everything you need to crack NEET PG</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {PLANS.map((p) => (
          <div key={p.id} className="pcard" style={{
            ...cardStyle(t), position: "relative", border: `1.5px solid ${p.highlight ? t.teal : t.border}`,
            background: p.highlight ? (t === palette.dark ? "#123833" : "#E5F5F2") : t.panel,
          }}>
            {p.tag && <div className="mono" style={{ position: "absolute", top: -10, left: 16, fontSize: 9.5, fontWeight: 700, color: "#0E1626", background: p.highlight ? t.teal : t.amber, borderRadius: 6, padding: "3px 8px" }}>{p.tag}</div>}
            <div className="disp" style={{ fontWeight: 700, fontSize: 15, marginTop: 6, marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 11.5, color: t.textDim, marginBottom: 14 }}>{p.desc}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 18 }}>
              <span className="disp" style={{ fontSize: 26, fontWeight: 700 }}>{p.price === 0 ? "Free" : `₹${p.price}`}</span>
              <span style={{ fontSize: 11.5, color: t.textDim }}>{p.sub}</span>
            </div>
            <button onClick={() => onChoose(p)} className="btn" style={{ ...primaryBtn(p.highlight ? t.teal : "transparent"), width: "100%", ...(p.highlight ? {} : { color: t.text, border: `1px solid ${t.border}` }) }}>
              {p.price === 0 ? "Start free trial" : "Choose plan"} <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>

      <div style={cardStyle(t)}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Everything in Premium</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
          {FEATURES.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <Check size={14} color={t.mint} /> {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckoutView({ t, plan, method, setMethod, processing, onPay, onBack }) {
  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "28px 20px 60px" }}>
      <button onClick={onBack} className="btn" style={{ background: "none", border: "none", color: t.textDim, fontSize: 12, cursor: "pointer", marginBottom: 14, padding: 0 }}>← Back to plans</button>

      <div style={cardStyle(t)}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div className="disp" style={{ fontWeight: 700, fontSize: 15 }}>{plan.name} Plan</div>
            <div style={{ fontSize: 11.5, color: t.textDim }}>{plan.desc}</div>
          </div>
          <div className="disp" style={{ fontWeight: 700, fontSize: 18 }}>₹{plan.price}</div>
        </div>

        <div style={{ borderTop: `1px dashed ${t.border}`, paddingTop: 14, marginBottom: 14 }}>
          <div className="mono" style={{ fontSize: 11, color: t.textDim, marginBottom: 8 }}>PAYMENT METHOD</div>
          <PayOption t={t} active={method === "upi"} onClick={() => setMethod("upi")} icon={Smartphone} label="UPI" desc="GPay, PhonePe, Paytm" />
          <PayOption t={t} active={method === "card"} onClick={() => setMethod("card")} icon={CreditCard} label="Card" desc="Debit / Credit card" />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: t.textDim, marginBottom: 16 }}>
          <ShieldCheck size={13} /> Secured by Razorpay
        </div>

        <button onClick={onPay} disabled={processing} className="btn" style={{ ...primaryBtn(t.teal), width: "100%" }}>
          {processing ? "Processing…" : `Pay ₹${plan.price}`}
        </button>
      </div>
    </div>
  );
}
function PayOption({ t, active, onClick, icon: Icon, label, desc }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 13px", borderRadius: 11, border: `1.5px solid ${active ? t.teal : t.border}`, background: active ? `${t.teal}14` : "transparent", cursor: "pointer", marginBottom: 8 }}>
      <Icon size={16} color={active ? t.teal : t.textDim} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 10.5, color: t.textDim }}>{desc}</div>
      </div>
      {active && <CheckCircle2 size={15} color={t.teal} />}
    </div>
  );
}

function SuccessView({ t, plan, onDone }) {
  return (
    <div style={{ maxWidth: 380, margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
      <CheckCircle2 size={44} color={t.mint} style={{ marginBottom: 14 }} />
      <div className="disp" style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{plan.price === 0 ? "Trial started!" : "Payment successful"}</div>
      <div style={{ fontSize: 13, color: t.textDim, marginBottom: 22 }}>
        {plan.price === 0 ? "Your 2-day free trial is active. Enjoy full access." : `Your ${plan.name} plan is now active. Receipt sent to your email.`}
      </div>
      <button onClick={onDone} className="btn" style={{ ...primaryBtn(t.teal), margin: "0 auto" }}>Go to Dashboard <ArrowRight size={14} /></button>
    </div>
  );
}
