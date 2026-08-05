import React, { useState } from "react";
import {
  Sun, Moon, LayoutGrid, BookOpen, HelpCircle, Users, CreditCard, Bell,
  BarChart3, Search, TrendingUp, IndianRupee, ChevronRight,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

const palette = {
  dark: { bg: "#0E1626", panel: "#141F35", panelAlt: "#182545", border: "#25324F", text: "#EAF0F6", textDim: "#8593AC", teal: "#14B8AA", mint: "#3ACE85", coral: "#F26A50", amber: "#E9AE45" },
  light: { bg: "#EEF1F3", panel: "#FFFFFF", panelAlt: "#F5F7F8", border: "#DFE4E9", text: "#101826", textDim: "#5C6B80", teal: "#0E8F84", mint: "#1F9D5F", coral: "#D8452F", amber: "#B9791C" },
};
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@600&display=swap');`;

const NAV = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "content", label: "Subjects / Questions", icon: BookOpen },
  { key: "users", label: "Users", icon: Users },
  { key: "revenue", label: "Subscriptions & Revenue", icon: CreditCard },
];

const USERS = [
  { name: "Riya Sharma", email: "riya.s@email.com", plan: "1 Year", status: "active", joined: "12 Mar 2026" },
  { name: "Arjun Patel", email: "arjun.p@email.com", plan: "Trial", status: "trial", joined: "2 Aug 2026" },
  { name: "Sneha Reddy", email: "sneha.r@email.com", plan: "3 Years", status: "active", joined: "5 Jan 2026" },
  { name: "Karan Verma", email: "karan.v@email.com", plan: "1 Year", status: "expired", joined: "18 Jul 2025" },
];
const REVENUE_TREND = [{ m: "Mar", r: 42 }, { m: "Apr", r: 58 }, { m: "May", r: 51 }, { m: "Jun", r: 74 }, { m: "Jul", r: 89 }, { m: "Aug", r: 96 }];
const SUBJECTS_ROWS = [
  { name: "Anatomy", chapters: 6, questions: 1240, status: "published" },
  { name: "Medicine", chapters: 6, questions: 2180, status: "published" },
  { name: "Radiology", chapters: 4, questions: 310, status: "draft" },
];

export default function MedMasterAdmin() {
  const [dark, setDark] = useState(true);
  const t = dark ? palette.dark : palette.light;
  const [nav, setNav] = useState("overview");

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter',sans-serif", display: "flex" }}>
      <style>{FONT}{`.disp{font-family:'Space Grotesk',sans-serif;} .mono{font-family:'IBM Plex Mono',monospace;} *{box-sizing:border-box;} .btn{transition:all .12s;} .btn:active{transform:scale(.97);} ::-webkit-scrollbar{width:8px;} ::-webkit-scrollbar-thumb{background:${t.border};border-radius:8px;}`}</style>

      <aside style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${t.border}`, background: t.panel, padding: 16 }}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 20, padding: "0 6px" }}>MedMaster <span style={{ color: t.teal }}>Admin</span></div>
        {NAV.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setNav(key)} className="btn" style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 9,
            border: "none", cursor: "pointer", textAlign: "left", marginBottom: 2,
            background: nav === key ? t.panelAlt : "transparent", color: nav === key ? t.teal : t.textDim, fontSize: 13,
          }}><Icon size={16} />{label}</button>
        ))}
      </aside>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 26px", borderBottom: `1px solid ${t.border}` }}>
          <div className="disp" style={{ fontWeight: 700, fontSize: 15.5 }}>{NAV.find((n) => n.key === nav).label}</div>
          <button onClick={() => setDark(!dark)} className="btn" style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${t.border}`, background: t.panelAlt, color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
        </div>

        <div style={{ padding: "22px 26px 50px" }}>
          {nav === "overview" && <Overview t={t} dark={dark} />}
          {nav === "content" && <ContentTab t={t} />}
          {nav === "users" && <UsersTab t={t} />}
          {nav === "revenue" && <RevenueTab t={t} />}
        </div>
      </div>
    </div>
  );
}

const cardStyle = (t) => ({ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18 });
function StatCard({ t, icon, label, value, sub }) {
  return (
    <div style={cardStyle(t)}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>{icon}<span style={{ fontSize: 11.5, color: t.textDim }}>{label}</span></div>
      <div className="disp" style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
      {sub && <div className="mono" style={{ fontSize: 10.5, color: t.mint, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}
function Badge({ color, children }) { return <span className="mono" style={{ fontSize: 10, fontWeight: 600, color, border: `1px solid ${color}55`, background: `${color}14`, borderRadius: 6, padding: "3px 8px" }}>{children}</span>; }

function Overview({ t, dark }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }}>
        <StatCard t={t} icon={<Users size={15} color={t.teal} />} label="Total users" value="12,480" sub="+340 this month" />
        <StatCard t={t} icon={<CreditCard size={15} color={t.amber} />} label="Active subscriptions" value="6,120" sub="49% conversion" />
        <StatCard t={t} icon={<IndianRupee size={15} color={t.mint} />} label="Revenue (Aug)" value="₹9.6L" sub="+8% vs Jul" />
        <StatCard t={t} icon={<HelpCircle size={15} color={t.coral} />} label="Reported errors" value="23" sub="8 unresolved" />
      </div>
      <div style={cardStyle(t)}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Revenue trend (₹ thousands)</div>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_TREND} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.teal} stopOpacity={0.4} /><stop offset="100%" stopColor={t.teal} stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="m" tick={{ fontSize: 10.5, fill: t.textDim }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="r" stroke={t.teal} strokeWidth={2.2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ContentTab({ t }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.panel, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 12px", width: 280 }}>
          <Search size={14} color={t.textDim} /><span style={{ fontSize: 12.5, color: t.textDim }}>Search subjects…</span>
        </div>
        <button className="btn" style={{ background: t.teal, color: "#0E1626", border: "none", borderRadius: 10, padding: "8px 15px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>+ Add subject</button>
      </div>
      <div style={{ ...cardStyle(t), padding: 0 }}>
        {SUBJECTS_ROWS.map((s, i) => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: i < SUBJECTS_ROWS.length - 1 ? `1px solid ${t.border}` : "none" }}>
            <div>
              <div className="disp" style={{ fontWeight: 600, fontSize: 13.5 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: t.textDim }}>{s.chapters} chapters · {s.questions.toLocaleString()} questions</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Badge color={s.status === "published" ? t.mint : t.amber}>{s.status}</Badge>
              <ChevronRight size={15} color={t.textDim} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab({ t }) {
  const statusColor = { active: t.mint, trial: t.amber, expired: t.coral };
  return (
    <div style={{ ...cardStyle(t), padding: 0 }}>
      {USERS.map((u, i) => (
        <div key={u.email} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: i < USERS.length - 1 ? `1px solid ${t.border}` : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="disp" style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${t.teal}, ${t.mint})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#fff" }}>{u.name.split(" ").map((w) => w[0]).join("")}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
              <div style={{ fontSize: 11, color: t.textDim }}>{u.email} · joined {u.joined}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="mono" style={{ fontSize: 11.5 }}>{u.plan}</span>
            <Badge color={statusColor[u.status]}>{u.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function RevenueTab({ t }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 18 }}>
        <StatCard t={t} icon={<TrendingUp size={15} color={t.teal} />} label="MRR equivalent" value="₹8.1L" />
        <StatCard t={t} icon={<Users size={15} color={t.amber} />} label="Trial → paid" value="49%" />
        <StatCard t={t} icon={<Bell size={15} color={t.coral} />} label="Renewals due (7d)" value="184" />
      </div>
      <div style={cardStyle(t)}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Plan breakdown</div>
        {[["1 Year", 3820, t.teal], ["3 Years", 1640, t.mint], ["Trial (active)", 660, t.amber]].map(([label, count, color]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0" }}>
            <span style={{ fontSize: 13 }}>{label}</span>
            <span className="mono" style={{ fontSize: 12.5, fontWeight: 700, color }}>{count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
