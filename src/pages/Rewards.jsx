import React, { useState } from "react";
import {
  Sun, Moon, Flame, Coins, Trophy, Star, Lock, Zap, Target, Medal, Crown,
  ChevronUp, ChevronDown, Minus, Award, Sparkles,
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
   MOCK DATA
--------------------------------------------------------------- */
const XP = 4120, XP_PER_LEVEL = 1000, LEVEL = Math.floor(XP / XP_PER_LEVEL) + 1;
const XP_INTO_LEVEL = XP % XP_PER_LEVEL;
const COINS = 860;
const STREAK = 18;
const LONGEST_STREAK = 24;

const STREAK_STRIP = [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // last 14 days, 1=studied

const BADGES = [
  { name: "First Steps", icon: Star, earned: true, date: "12 Mar 2026", desc: "Solved your first 100 questions" },
  { name: "Century Club", icon: Trophy, earned: true, date: "2 Apr 2026", desc: "100-question accuracy streak ≥ 80%" },
  { name: "Night Owl", icon: Sparkles, earned: true, date: "19 May 2026", desc: "Studied past midnight 10 times" },
  { name: "Iron Streak", icon: Flame, earned: true, date: "28 Jun 2026", desc: "Maintained a 15-day streak" },
  { name: "Mock Master", icon: Medal, earned: false, desc: "Score 90%+ on 5 full-length mock tests" },
  { name: "Subject Slayer", icon: Award, earned: false, desc: "Reach 90% mastery in any subject" },
  { name: "Flashcard Fiend", icon: Zap, earned: false, desc: "Review 1,000 flashcards" },
  { name: "Top 10", icon: Crown, earned: false, desc: "Finish in the weekly top 10 leaderboard" },
];

const GOALS = [
  { label: "Weekly goal", desc: "Solve 500 questions this week", value: 340, target: 500, color: "teal" },
  { label: "Monthly goal", desc: "Complete 12 mock tests this month", value: 7, target: 12, color: "amber" },
];

const LEADERBOARD = {
  weekly: [
    { rank: 1, name: "Ananya S.", xp: 2840, change: 0 },
    { rank: 2, name: "Rohan K.", xp: 2710, change: 1 },
    { rank: 3, name: "Priya M.", xp: 2600, change: -1 },
    { rank: 4, name: "Vikram T.", xp: 2410, change: 2 },
    { rank: 5, name: "Sneha R.", xp: 2380, change: 0 },
    { rank: 6, name: "You", xp: 2210, change: 3, isUser: true },
    { rank: 7, name: "Arjun P.", xp: 2150, change: -2 },
    { rank: 8, name: "Divya N.", xp: 2090, change: 1 },
  ],
  monthly: [
    { rank: 1, name: "Rohan K.", xp: 9840, change: 1 },
    { rank: 2, name: "Ananya S.", xp: 9620, change: -1 },
    { rank: 3, name: "Vikram T.", xp: 9105, change: 0 },
    { rank: 4, name: "Priya M.", xp: 8890, change: 2 },
    { rank: 5, name: "You", xp: 8420, change: 4, isUser: true },
    { rank: 6, name: "Sneha R.", xp: 8210, change: -1 },
    { rank: 7, name: "Karan V.", xp: 7950, change: 0 },
    { rank: 8, name: "Arjun P.", xp: 7700, change: -2 },
  ],
  alltime: [
    { rank: 1, name: "Rohan K.", xp: 48200, change: 0 },
    { rank: 2, name: "Ananya S.", xp: 46850, change: 0 },
    { rank: 3, name: "Priya M.", xp: 41200, change: 1 },
    { rank: 4, name: "Vikram T.", xp: 39800, change: -1 },
    { rank: 5, name: "Karan V.", xp: 37650, change: 0 },
    { rank: 6, name: "Sneha R.", xp: 35200, change: 0 },
    { rank: 7, name: "Arjun P.", xp: 33900, change: 0 },
    { rank: 8, name: "You", xp: 31450, change: 0, isUser: true },
  ],
};

/* ---------------------------------------------------------------
   APP
--------------------------------------------------------------- */
export default function MedMasterRewards() {
  const [dark, setDark] = useState(true);
  const t = dark ? palette.dark : palette.light;
  const [tab, setTab] = useState("rewards"); // rewards | leaderboard
  const [lbRange, setLbRange] = useState("weekly");

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter',sans-serif" }}>
      <style>{FONT_IMPORT}{`
        .disp{font-family:'Space Grotesk',sans-serif;} .mono{font-family:'IBM Plex Mono',monospace;}
        * { box-sizing:border-box; }
        .btn{transition:all .12s;} .btn:active{transform:scale(.96);}
        .badge{transition:transform .12s;} .badge:hover{transform:translateY(-3px);}
        .lbrow{transition:transform .1s;} .lbrow:hover{transform:translateX(2px);}
        ::-webkit-scrollbar{width:8px;} ::-webkit-scrollbar-thumb{background:${t.border};border-radius:8px;}
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 26px", borderBottom: `1px solid ${t.border}`, background: t.panel, position: "sticky", top: 0, zIndex: 5 }}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 15.5 }}>Rewards</div>
        <button onClick={() => setDark(!dark)} className="btn" style={iconBtn(t)}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "22px 20px 60px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <TabBtn t={t} active={tab === "rewards"} onClick={() => setTab("rewards")} icon={Trophy} label="Rewards" />
          <TabBtn t={t} active={tab === "leaderboard"} onClick={() => setTab("leaderboard")} icon={Crown} label="Leaderboard" />
        </div>

        {tab === "rewards" ? (
          <RewardsTab t={t} dark={dark} />
        ) : (
          <LeaderboardTab t={t} lbRange={lbRange} setLbRange={setLbRange} />
        )}
      </div>
    </div>
  );
}

function iconBtn(t) {
  return { width: 34, height: 34, borderRadius: 9, border: `1px solid ${t.border}`, background: t.panelAlt, color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
}
function TabBtn({ t, active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} className="btn" style={{
      display: "flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 10,
      border: `1px solid ${active ? t.teal : t.border}`, background: active ? `${t.teal}18` : t.panel,
      color: active ? t.teal : t.textDim, fontSize: 13, fontWeight: 600, cursor: "pointer",
    }}><Icon size={15} />{label}</button>
  );
}
const cardStyle = (t) => ({ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18 });

/* ---------------------------------------------------------------
   REWARDS TAB
--------------------------------------------------------------- */
function RewardsTab({ t, dark }) {
  const pct = (XP_INTO_LEVEL / XP_PER_LEVEL) * 100;
  return (
    <div>
      {/* XP + COINS + STREAK */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div style={cardStyle(t)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg, ${t.teal}, ${t.mint})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }} className="disp">{LEVEL}</div>
              <div>
                <div className="disp" style={{ fontWeight: 700, fontSize: 14.5 }}>Level {LEVEL}</div>
                <div style={{ fontSize: 11, color: t.textDim }}>{XP.toLocaleString()} XP total</div>
              </div>
            </div>
            <span className="mono" style={{ fontSize: 11, color: t.textDim }}>{XP_INTO_LEVEL}/{XP_PER_LEVEL} XP</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: t.border, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${t.teal}, ${t.mint})`, borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 10.5, color: t.textDim, marginTop: 6 }}>{XP_PER_LEVEL - XP_INTO_LEVEL} XP to Level {LEVEL + 1}</div>
        </div>

        <div style={{ ...cardStyle(t), display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <Coins size={22} color={t.amber} style={{ marginBottom: 6 }} />
          <div className="disp" style={{ fontSize: 20, fontWeight: 700 }}>{COINS}</div>
          <div style={{ fontSize: 11, color: t.textDim }}>coins</div>
        </div>

        <div style={{ ...cardStyle(t), display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <Flame size={22} color={t.coral} style={{ marginBottom: 6 }} />
          <div className="disp" style={{ fontSize: 20, fontWeight: 700 }}>{STREAK} days</div>
          <div style={{ fontSize: 11, color: t.textDim }}>longest: {LONGEST_STREAK}</div>
        </div>
      </div>

      {/* STREAK STRIP */}
      <div style={{ ...cardStyle(t), marginBottom: 20 }}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Last 14 days</div>
        <div style={{ display: "flex", gap: 6 }}>
          {STREAK_STRIP.map((v, i) => (
            <div key={i} style={{
              flex: 1, height: 28, borderRadius: 7,
              background: v ? `linear-gradient(180deg, ${t.teal}, ${t.mint})` : t.border,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {v ? <Flame size={12} color="#0E1626" /> : null}
            </div>
          ))}
        </div>
      </div>

      {/* GOALS */}
      <div className="disp" style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 10 }}>Goals</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 24 }}>
        {GOALS.map((g) => {
          const color = t[g.color];
          const pctG = Math.min(100, Math.round((g.value / g.target) * 100));
          return (
            <div key={g.label} style={cardStyle(t)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Target size={14} color={color} />
                <span className="disp" style={{ fontWeight: 700, fontSize: 13 }}>{g.label}</span>
              </div>
              <div style={{ fontSize: 11.5, color: t.textDim, marginBottom: 10 }}>{g.desc}</div>
              <div style={{ height: 7, borderRadius: 4, background: t.border, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ width: `${pctG}%`, height: "100%", background: color, borderRadius: 4 }} />
              </div>
              <div className="mono" style={{ fontSize: 11, color: t.textDim }}>{g.value} / {g.target}</div>
            </div>
          );
        })}
      </div>

      {/* BADGES */}
      <div className="disp" style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 10 }}>Badges & Achievements</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {BADGES.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.name} className="badge" style={{
              ...cardStyle(t), textAlign: "center", padding: "16px 10px",
              opacity: b.earned ? 1 : 0.55,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, margin: "0 auto 10px",
                background: b.earned ? `linear-gradient(135deg, ${t.teal}, ${t.mint})` : t.panelAlt,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: b.earned ? "none" : `1px solid ${t.border}`,
              }}>
                {b.earned ? <Icon size={19} color="#fff" /> : <Lock size={16} color={t.textDim} />}
              </div>
              <div className="disp" style={{ fontWeight: 600, fontSize: 12, marginBottom: 3 }}>{b.name}</div>
              <div style={{ fontSize: 10, color: t.textDim, lineHeight: 1.4 }}>{b.earned ? b.date : b.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   LEADERBOARD TAB
--------------------------------------------------------------- */
function LeaderboardTab({ t, lbRange, setLbRange }) {
  const list = LEADERBOARD[lbRange];
  const userRow = list.find((r) => r.isUser);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["weekly", "This week"], ["monthly", "This month"], ["alltime", "All time"]].map(([k, l]) => (
          <button key={k} onClick={() => setLbRange(k)} className="btn" style={{
            padding: "7px 13px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer",
            border: `1px solid ${lbRange === k ? t.teal : t.border}`,
            background: lbRange === k ? `${t.teal}18` : "transparent",
            color: lbRange === k ? t.teal : t.textDim,
          }}>{l}</button>
        ))}
      </div>

      {/* podium for top 3 */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 22, justifyContent: "center" }}>
        {[list[1], list[0], list[2]].map((r, i) => {
          if (!r) return <div key={i} style={{ flex: 1 }} />;
          const heights = [86, 108, 70];
          const medalColor = [t.textDim, t.amber, "#B08D57"][r.rank - 1] || t.textDim;
          return (
            <div key={r.rank} style={{ flex: 1, maxWidth: 140, textAlign: "center" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", margin: "0 auto 8px",
                background: `linear-gradient(135deg, ${t.teal}, ${t.violet})`, display: "flex",
                alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#fff",
                border: r.isUser ? `2px solid ${t.amber}` : "none",
              }} className="disp">{r.name.split(" ").map((w) => w[0]).join("")}</div>
              <div style={{
                height: heights[i], borderRadius: "10px 10px 0 0", background: t.panel, border: `1px solid ${t.border}`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: 10,
              }}>
                <Crown size={14} color={medalColor} style={{ marginBottom: 4 }} />
                <div className="disp" style={{ fontWeight: 700, fontSize: 12.5 }}>#{r.rank}</div>
                <div style={{ fontSize: 10.5, color: t.textDim, padding: "0 4px" }}>{r.name}</div>
                <div className="mono" style={{ fontSize: 10.5, fontWeight: 600, color: t.teal, marginTop: 2 }}>{r.xp.toLocaleString()} XP</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((r) => (
          <div key={r.rank} className="lbrow" style={{
            ...cardStyle(t), display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "11px 16px", border: `1px solid ${r.isUser ? t.teal : t.border}`,
            background: r.isUser ? `${t.teal}12` : t.panel,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: t.textDim, width: 22 }}>#{r.rank}</div>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${t.teal}, ${t.violet})`,
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11.5, color: "#fff",
              }} className="disp">{r.name.split(" ").map((w) => w[0]).join("")}</div>
              <span style={{ fontSize: 13, fontWeight: r.isUser ? 700 : 500 }}>{r.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="mono" style={{ fontSize: 12.5, fontWeight: 700 }}>{r.xp.toLocaleString()} XP</span>
              <ChangeIndicator t={t} change={r.change} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function ChangeIndicator({ t, change }) {
  if (change > 0) return <span style={{ display: "flex", alignItems: "center", gap: 2, color: t.mint, fontSize: 11 }}><ChevronUp size={13} />{change}</span>;
  if (change < 0) return <span style={{ display: "flex", alignItems: "center", gap: 2, color: t.coral, fontSize: 11 }}><ChevronDown size={13} />{Math.abs(change)}</span>;
  return <span style={{ display: "flex", alignItems: "center", color: t.textDim, fontSize: 11 }}><Minus size={13} /></span>;
}
