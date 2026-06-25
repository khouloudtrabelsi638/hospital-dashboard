import PatientCard  from "./components/PatientCard";
import RoomMonitor  from "./components/RoomMonitor";
import AIprediction from "./components/AIprediction";
import AlertPanel   from "./components/AlertPanel";
import Charts       from "./components/Charts";
import StatsCard    from "./components/StatsCard";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header>
        <span>🏥</span>
        <h1>Smart Hospital — Tableau de bord</h1>
        <span style={{ fontSize: 13, opacity: 0.7 }}>Mise à jour toutes les 5s</span>
      </header>
      <div className="grid">
        <PatientCard />
        <RoomMonitor />
        <AIprediction />
        <AlertPanel />
        <StatsCard />
        <Charts />
      </div>
    </div>
  );
}
