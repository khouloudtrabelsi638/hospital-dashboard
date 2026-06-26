import { useEffect, useState } from "react";
import PatientGauge   from "./components/PatientGauge";
import RoomMonitor    from "./components/RoomMonitor";
import AIprediction   from "./components/AIprediction";
import AlertPanel     from "./components/AlertPanel";
import StatsCard      from "./components/StatsCard";
import IndicatorsCard from "./components/IndicatorsCard";
import StatusBanner   from "./components/StatusBanner";
import ChartsRow      from "./components/ChartsRow";
import ChatBox        from "./components/ChatBox";
import ExportButton   from "./components/ExportButton";
import "./App.css";
import "./extras.css";

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="app">
      <header>
        <span>🏥</span>
        <h1>Smart Hospital — Tableau de bord</h1>
        <ExportButton />
        <button className="theme-btn" onClick={() => setDark(d => !d)}>
          {dark ? "☀️ Clair" : "🌙 Sombre"}
        </button>
        <span style={{ fontSize: 13, opacity: 0.7 }}>Mise à jour toutes les 5s</span>
      </header>

      <StatusBanner />

      <div className="grid">
        <PatientGauge />
        <RoomMonitor />
        <AIprediction />
        <AlertPanel />
        <StatsCard />
        <IndicatorsCard />
        <ChartsRow />
        <ChatBox />
      </div>
    </div>
  );
}