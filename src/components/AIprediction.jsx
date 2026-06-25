import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../api";

const COLORS = { Normal: "#22c55e", Attention: "#f97316", Critique: "#ef4444" };
const ICONS  = { Normal: "🟢", Attention: "🟠", Critique: "🔴" };

export default function AIprediction() {
  const [pred, setPred] = useState(null);

  useEffect(() => {
    const fetch = () =>
      axios.get(`${API_BASE}/api/predict`)
        .then(r => setPred(r.data))
        .catch(() => {});
    fetch();
    const id = setInterval(fetch, 5000);
    return () => clearInterval(id);
  }, []);

  if (!pred) return <div className="card">Chargement IA...</div>;

  const color = COLORS[pred.label] || "#94a3b8";

  return (
    <div className="card">
      <h2>🤖 Prédiction IA</h2>
      <div style={{ fontSize: 36, fontWeight: 700, color, margin: "12px 0" }}>
        {ICONS[pred.label]} {pred.label}
      </div>
      <div style={{ marginTop: 12 }}>
        {Object.entries(pred.probabilites).map(([k, v]) => (
          <div key={k} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span>{k}</span><span>{v}%</span>
            </div>
            <div style={{ background: "#e2e8f0", borderRadius: 4, height: 8 }}>
              <div style={{
                width: `${v}%`, height: 8, borderRadius: 4,
                background: COLORS[k], transition: "width .5s"
              }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}