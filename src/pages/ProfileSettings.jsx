import React, { useState } from "react";
import {
  Sun, Moon, User, Mail, Phone, GraduationCap, School, Target, Camera,
  Bell, Lock, Globe, Shield, Trash2, ChevronRight, Check,
} from "lucide-react";

const palette = {
  dark: { bg: "#0E1626", panel: "#141F35", panelAlt: "#182545", border: "#25324F", text: "#EAF0F6", textDim: "#8593AC", teal: "#14B8AA", coral: "#F26A50" },
  light: { bg: "#EEF1F3", panel: "#FFFFFF", panelAlt: "#F5F7F8", border: "#DFE4E9", text: "#101826", textDim: "#5C6B80", teal: "#0E8F84", coral: "#D8452F" },
};
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap');`;

const PROFILE = { name: "Riya Sharma", email: "riya.sharma@email.com", phone: "+91 98765 43210", college: "Grant Government Medical College", university: "MUHS", year: "3rd Year MBBS", targetRank: "AIR under 500" };

export default function MedMasterProfileSettings() {
  const [dark, setDark] = useState(true);
  const t = dark ? palette.dark : palette.light;
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState(PROFILE);
  const [notif, setNotif] = useState({ daily: true, streak: true, mock: false, marketing: false });
  const [lang, setLang] = useState("English");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter',sans-serif" }}>
      <style>{FONT}{`.disp{font-family:'Space Grotesk',sans-serif;} *{box-sizing:border-box;} .btn{transition:all .12s;} .btn:active{transform:scale(.96);} ::-webkit-scrollbar{width:8px;} ::-webkit-scrollbar-thumb{background:${t.border};border-radius:8px;}`}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 26px", borderBottom: `1px solid ${t.border}`, background: t.panel }}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 15.5 }}>{tab === "profile" ? "Profile" : "Settings"}</div>
        <button onClick={() => setDark(!dark)} className="btn" style={iconBtn(t)}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "22px 20px 60px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <TabBtn t={t} active={tab === "profile"} onClick={() => setTab("profile")} icon={User} label="Profile" />
          <TabBtn t={t} active={tab === "settings"} onClick={() => setTab("settings")} icon={Shield} label="Settings" />
        </div>

        {tab === "profile" ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg, ${t.teal}, #3ACE85)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff" }} className="disp">RS</div>
                <button className="btn" style={{ position: "absolute", bottom: -2, right: -2, width: 24, height: 24, borderRadius: "50%", background: t.panel, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Camera size={11} color={t.text} /></button>
              </div>
              <div>
                <div className="disp" style={{ fontSize: 17, fontWeight: 700 }}>{form.name}</div>
                <div style={{ fontSize: 12, color: t.textDim }}>{form.year}</div>
              </div>
            </div>

            <div style={cardStyle(t)}>
              <Field t={t} icon={User} label="Full name" value={form.name} onChange={(v) => set("name", v)} />
              <Field t={t} icon={Mail} label="Email" value={form.email} onChange={(v) => set("email", v)} />
              <Field t={t} icon={Phone} label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
              <Field t={t} icon={School} label="College" value={form.college} onChange={(v) => set("college", v)} />
              <Field t={t} icon={GraduationCap} label="University" value={form.university} onChange={(v) => set("university", v)} />
              <Field t={t} icon={GraduationCap} label="MBBS year" value={form.year} onChange={(v) => set("year", v)} />
              <Field t={t} icon={Target} label="Target rank" value={form.targetRank} onChange={(v) => set("targetRank", v)} last />
            </div>
            <button className="btn" style={{ ...primaryBtn(t.teal), marginTop: 16, width: "100%", justifyContent: "center" }}><Check size={14} /> Save changes</button>
          </div>
        ) : (
          <div>
            <SectionLabel t={t}>Appearance</SectionLabel>
            <div style={cardStyle(t)}>
              <Row t={t} icon={dark ? Moon : Sun} label="Theme" value={dark ? "Dark mode" : "Light mode"}
                right={<Toggle t={t} on={dark} onClick={() => setDark(!dark)} />} last />
            </div>

            <SectionLabel t={t}>Language</SectionLabel>
            <div style={cardStyle(t)}>
              <Row t={t} icon={Globe} label="App language" value={lang} right={<ChevronRight size={15} color={t.textDim} />} last onClick={() => setLang(lang === "English" ? "Hindi" : "English")} />
            </div>

            <SectionLabel t={t}>Notifications</SectionLabel>
            <div style={cardStyle(t)}>
              <Row t={t} icon={Bell} label="Daily revision reminder" right={<Toggle t={t} on={notif.daily} onClick={() => setNotif((p) => ({ ...p, daily: !p.daily }))} />} />
              <Row t={t} icon={Bell} label="Streak alerts" right={<Toggle t={t} on={notif.streak} onClick={() => setNotif((p) => ({ ...p, streak: !p.streak }))} />} />
              <Row t={t} icon={Bell} label="Mock test reminders" right={<Toggle t={t} on={notif.mock} onClick={() => setNotif((p) => ({ ...p, mock: !p.mock }))} />} />
              <Row t={t} icon={Bell} label="Offers & updates" right={<Toggle t={t} on={notif.marketing} onClick={() => setNotif((p) => ({ ...p, marketing: !p.marketing }))} />} last />
            </div>

            <SectionLabel t={t}>Privacy & Security</SectionLabel>
            <div style={cardStyle(t)}>
              <Row t={t} icon={Lock} label="Change password" right={<ChevronRight size={15} color={t.textDim} />} />
              <Row t={t} icon={Shield} label="Privacy policy" right={<ChevronRight size={15} color={t.textDim} />} last />
            </div>

            <SectionLabel t={t}>Danger zone</SectionLabel>
            <div style={{ ...cardStyle(t), borderColor: `${t.coral}55` }}>
              <Row t={t} icon={Trash2} iconColor={t.coral} label="Delete account" labelColor={t.coral}
                right={<ChevronRight size={15} color={t.coral} />} last onClick={() => setConfirmDelete(true)} />
            </div>
          </div>
        )}
      </div>

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 16, padding: 22, width: 320 }}>
            <div className="disp" style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: t.coral }}>Delete account?</div>
            <div style={{ fontSize: 12.5, color: t.textDim, marginBottom: 18 }}>This permanently deletes your progress, subscriptions and all data. This cannot be undone.</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="btn" onClick={() => setConfirmDelete(false)} style={ghostBtn(t)}>Cancel</button>
              <button className="btn" onClick={() => setConfirmDelete(false)} style={primaryBtn(t.coral)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function iconBtn(t) { return { width: 34, height: 34, borderRadius: 9, border: `1px solid ${t.border}`, background: t.panelAlt, color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }; }
function TabBtn({ t, active, onClick, icon: Icon, label }) {
  return <button onClick={onClick} className="btn" style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 10, border: `1px solid ${active ? t.teal : t.border}`, background: active ? `${t.teal}18` : t.panel, color: active ? t.teal : t.textDim, fontSize: 13, fontWeight: 600, cursor: "pointer" }}><Icon size={15} />{label}</button>;
}
const cardStyle = (t) => ({ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 16, padding: "4px 18px" });
const primaryBtn = (c) => ({ background: c, color: "#0E1626", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 });
const ghostBtn = (t) => ({ background: "transparent", color: t.text, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" });

function SectionLabel({ t, children }) { return <div style={{ fontSize: 11.5, fontWeight: 600, color: t.textDim, margin: "18px 2px 8px" }}>{children}</div>; }

function Field({ t, icon: Icon, label, value, onChange, last }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", borderBottom: last ? "none" : `1px solid ${t.border}` }}>
      <Icon size={15} color={t.textDim} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10.5, color: t.textDim, marginBottom: 3 }}>{label}</div>
        <input value={value} onChange={(e) => onChange(e.target.value)} style={{ border: "none", outline: "none", background: "transparent", color: t.text, fontSize: 13.5, width: "100%", fontFamily: "inherit" }} />
      </div>
    </div>
  );
}
function Row({ t, icon: Icon, iconColor, label, labelColor, value, right, last, onClick }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: last ? "none" : `1px solid ${t.border}`, cursor: onClick ? "pointer" : "default" }}>
      <Icon size={15} color={iconColor || t.textDim} />
      <div style={{ flex: 1, fontSize: 13, color: labelColor || t.text }}>{label}{value && <span style={{ color: t.textDim, marginLeft: 8, fontSize: 12 }}>{value}</span>}</div>
      {right}
    </div>
  );
}
function Toggle({ t, on, onClick }) {
  return (
    <button onClick={onClick} className="btn" style={{ width: 38, height: 21, borderRadius: 11, border: "none", cursor: "pointer", background: on ? t.teal : t.border, position: "relative" }}>
      <div style={{ width: 15, height: 15, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 20 : 3, transition: "left .15s" }} />
    </button>
  );
}
