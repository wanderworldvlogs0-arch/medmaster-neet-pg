import React, { useMemo, useState } from "react";
import {
  Sun, Moon, TrendingUp, TrendingDown, Clock3, Target, Flame, ChevronDown,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Cell, PieChart, Pie,
} from "recharts";

/* ---------------------------------------------------------------
   TOKENS (same "clinical chart" system as the other modules)
--------------------------------------------------------------- */
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

function seededRand(seed) { const x = Math.sin(seed * 999) * 10000; return x - Math.floor(x); }

/* ---------------------------------------------------------------
   MOCK DATA
--------------------------------------------------------------- */
const ACCURACY_TREND = [
  { d: "Wk1", acc: 58 }, { d: "Wk2", acc: 61 }, { d: "Wk3", acc: 59 }, { d: "Wk4", acc: 65 },
  { d: "Wk5", acc: 68 }, { d: "Wk6", acc: 71 }, { d: "Wk7", acc: 69 }, { d: "Wk8", acc: 74 },
  { d: "Wk9", acc: 76 }, { d: "Wk10", acc: 79 }, { d: "Wk11", acc: 78 }, { d: "Wk12", acc: 83 },
];

const SUBJECTS = [
  { name: "Medicine", mastery: 72 }, { name: "Surgery", mastery: 64 }, { name: "Pathology", mastery: 68 },
  { name: "Pharmacology", mastery: 55 }, { name: "Anatomy", mastery: 41 }, { name: "Physiology", mastery: 61 },
  { name: "Microbiology", mastery: 58 }, { name: "PSM", mastery: 49 }, { name: "Biochemistry", mastery: 66 },
  { name: "Pediatrics", mastery: 70 }, { name: "Obstetrics", mastery: 53 }, { name: "Orthopaedics", mastery: 46 },
];
const SUBJECT_COLOR = (t, m) => (m < 50 ? t.coral : m < 65 ? t.amber : t.mint);

const OVERALL = { correct: 1842, wrong: 612, skipped: 214 };

const HEATMAP_WEEKS = 14;
const heatmapData = Array.from({ length: HEATMAP_WEEKS }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => {
    const r = seededRand(w * 7 + d + 3);
    return r < 0.12 ? 0 : Math.round(r * 5); // 0-5 study-hour buckets, sparse zeros
  })
);
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function heatColor(t, v) {
  if (v === 0) return t.border;
  const stops = [`${t.teal}30`, `${t.teal}55`, `${t.teal}80`, `${t.teal}AA`, t.teal];
  return stops[Math.min(v - 1, 4)];
}

/* ---------------------------------------------------------------
   APP
--------------------------------------------------------------- */
export default function MedMasterAnalytics() {
  const [dark, setDark] = useState(true);
  const t = dark ? palette.dark : palette.light;
  const [range, setRange] = useState("month"); // week | month | all

  const sortedSubjects = [...SUBJECTS].sort((a, b) => b.mastery - a.mastery);
  const strengths = sortedSubjects.slice(0, 3);
  const weaknesses = [...sortedSubjects].reverse().slice(0, 3);

  const pieData = [
    { name: "Correct", value: OVERALL.correct, color: t.mint },
    { name: "Wrong", value: OVERALL.wrong, color: t.coral },
    { name: "Skipped", value: OVERALL.skipped, color: t.textDim },
  ];
  const totalQ = OVERALL.correct + OVERALL.wrong + OVERALL.skipped;
  const overallAccuracy = Math.round((OVERALL.correct / (OVERALL.correct + OVERALL.wrong)) * 100);

  const totalStudyHours = useMemo(() => heatmapData.flat().reduce((a, v) => a + v, 0) * 0.7, []);

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter',sans-serif" }}>
      <style>{FONT_IMPORT}{`
        .disp{font-family:'Space Grotesk',sans-serif;} .mono{font-family:'IBM Plex Mono',monospace;}
        * { box-sizing:border-box; }
        .btn{transition:all .12s;} .btn:active{transform:scale(.96);}
        .hcell{transition:transform .1s;} .hcell:hover{transform:scale(1.25);}
        ::-webkit-scrollbar{width:8px;} ::-webkit-scrollbar-thumb{background:${t.border};border-radius:8px;}
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 26px", borderBottom: `1px solid ${t.border}`, background: t.panel, position: "sticky", top: 0, zIndex: 5 }}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 15.5 }}>Analytics</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <RangeToggle t={t} range={range} setRange={setRange} />
          <button onClick={() => setDark(!dark)} className="btn" style={iconBtn(t)}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "22px 20px 60px" }}>
        {/* STAT ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
          <StatCard t={t} icon={<Target size={16} color={t.teal} />} label="Overall accuracy" value={`${overallAccuracy}%`} trend="+6.2%" up />
          <StatCard t={t} icon={<Clock3 size={16} color={t.amber} />} label="Study hours (14 wks)" value={`${Math.round(totalStudyHours)}h`} trend="+4h/wk" up />
          <StatCard t={t} icon={<TrendingUp size={16} color={t.mint} />} label="Questions solved" value={totalQ.toLocaleString()} trend="+312 this month" up />
          <StatCard t={t} icon={<Flame size={16} color={t.coral} />} label="Longest streak" value="24 days" trend="current: 18" />
        </div>

        {/* ACCURACY TREND */}
        <div style={{ ...cardStyle(t), marginBottom: 18 }}>
          <div className="disp" style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Accuracy trend</div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ACCURACY_TREND} margin={{ top: 4, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 10.5, fill: t.textDim }} axisLine={{ stroke: t.border }} tickLine={false} />
                <YAxis tick={{ fontSize: 10.5, fill: t.textDim }} axisLine={false} tickLine={false} domain={[40, 100]} />
                <Tooltip contentStyle={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="acc" stroke={t.teal} strokeWidth={2.4} dot={{ r: 3, fill: t.teal }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SUBJECT COMPARISON + PIE */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14, marginBottom: 18 }}>
          <div style={cardStyle(t)}>
            <div className="disp" style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Subject comparison</div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedSubjects} layout="vertical" margin={{ top: 0, right: 20, left: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={t.border} horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: t.textDim }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: t.text }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip contentStyle={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="mastery" radius={[0, 5, 5, 0]} barSize={13}>
                    {sortedSubjects.map((s, i) => <Cell key={i} fill={SUBJECT_COLOR(t, s.mastery)} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={cardStyle(t)}>
            <div className="disp" style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Answer distribution</div>
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={38} outerRadius={58} paddingAngle={3} stroke="none">
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 8 }}>
              {pieData.map((d) => (
                <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: d.color }} />
                    {d.name}
                  </span>
                  <span className="mono" style={{ color: t.textDim }}>{d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STRENGTH / WEAKNESS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
          <div style={cardStyle(t)}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <TrendingUp size={15} color={t.mint} />
              <span className="disp" style={{ fontWeight: 700, fontSize: 14 }}>Strengths</span>
            </div>
            {strengths.map((s) => <RankRow key={s.name} t={t} name={s.name} value={s.mastery} color={t.mint} />)}
          </div>
          <div style={cardStyle(t)}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <TrendingDown size={15} color={t.coral} />
              <span className="disp" style={{ fontWeight: 700, fontSize: 14 }}>Needs work</span>
            </div>
            {weaknesses.map((s) => <RankRow key={s.name} t={t} name={s.name} value={s.mastery} color={t.coral} />)}
          </div>
        </div>

        {/* STUDY TIME HEATMAP */}
        <div style={cardStyle(t)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span className="disp" style={{ fontWeight: 700, fontSize: 14 }}>Study time</span>
            <span style={{ fontSize: 11.5, color: t.textDim }}>last {HEATMAP_WEEKS} weeks</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: 2 }}>
              {DAY_LABELS.map((d, i) => (
                <div key={d} style={{ height: 13, fontSize: 9.5, color: t.textDim, lineHeight: "13px" }}>{i % 2 === 1 ? d.slice(0, 1) : ""}</div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 3, overflowX: "auto" }}>
              {heatmapData.map((week, wi) => (
                <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {week.map((v, di) => (
                    <div key={di} className="hcell" title={`${v} sessions`} style={{
                      width: 13, height: 13, borderRadius: 3, background: heatColor(t, v),
                    }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 10.5, color: t.textDim }}>
            Less
            {[0, 1, 2, 3, 4].map((v) => <div key={v} style={{ width: 11, height: 11, borderRadius: 3, background: heatColor(t, v) }} />)}
            More
          </div>
        </div>
      </div>
    </div>
  );
}

function iconBtn(t) {
  return { width: 34, height: 34, borderRadius: 9, border: `1px solid ${t.border}`, background: t.panelAlt, color: t.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
}
const cardStyle = (t) => ({ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18 });

function RangeToggle({ t, range, setRange }) {
  const opts = [["week", "Week"], ["month", "Month"], ["all", "All time"]];
  return (
    <div style={{ display: "flex", background: t.panelAlt, border: `1px solid ${t.border}`, borderRadius: 9, padding: 3 }}>
      {opts.map(([k, l]) => (
        <button key={k} onClick={() => setRange(k)} className="btn" style={{
          border: "none", cursor: "pointer", fontSize: 11.5, fontWeight: 600, padding: "6px 11px", borderRadius: 7,
          background: range === k ? t.teal : "transparent", color: range === k ? "#0E1626" : t.textDim,
        }}>{l}</button>
      ))}
    </div>
  );
}

function StatCard({ t, icon, label, value, trend, up }) {
  return (
    <div style={cardStyle(t)}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        {icon}
        <span style={{ fontSize: 11.5, color: t.textDim }}>{label}</span>
      </div>
      <div className="disp" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{value}</div>
      <div className="mono" style={{ fontSize: 10.5, color: up ? t.mint : t.textDim }}>{trend}</div>
    </div>
  );
}
function RankRow({ t, name, value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
      <span style={{ fontSize: 13 }}>{name}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 70, height: 5, borderRadius: 3, background: t.border, overflow: "hidden" }}>
          <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3 }} />
        </div>
        <span className="mono" style={{ fontSize: 12, fontWeight: 700, color, width: 30, textAlign: "right" }}>{value}%</span>
      </div>
    </div>
  );
}
