import React, { useState } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import Practice from "./pages/Practice.jsx";
import MockTest from "./pages/MockTest.jsx";
import Flashcards from "./pages/Flashcards.jsx";
import MistakeNotebook from "./pages/MistakeNotebook.jsx";
import PYQ from "./pages/PYQ.jsx";
import Analytics from "./pages/Analytics.jsx";
import Rewards from "./pages/Rewards.jsx";
import AIDoubtSolver from "./pages/AIDoubtSolver.jsx";
import ProfileSettings from "./pages/ProfileSettings.jsx";
import Subscription from "./pages/Subscription.jsx";
import Auth from "./pages/Auth.jsx";
import Admin from "./pages/Admin.jsx";

const PAGES = {
  Dashboard, Practice, MockTest, Flashcards, MistakeNotebook, PYQ,
  Analytics, Rewards, AIDoubtSolver, ProfileSettings, Subscription, Auth, Admin,
};

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const Current = PAGES[page];

  return (
    <div>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 6, padding: 10,
        background: "#0A0F18", position: "sticky", top: 0, zIndex: 50,
      }}>
        {Object.keys(PAGES).map((k) => (
          <button key={k} onClick={() => setPage(k)} style={{
            padding: "6px 10px", borderRadius: 7, fontSize: 11, cursor: "pointer",
            border: "1px solid #25324F", background: page === k ? "#14B8AA" : "#141F35",
            color: page === k ? "#0E1626" : "#EAF0F6", fontWeight: 600,
          }}>{k}</button>
        ))}
      </div>
      <div style={{ color: "black", padding: 20 }}>
  Hello MedMaster
</div>
    </div>
  );
}
