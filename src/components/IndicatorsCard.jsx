import { useEffect, useState } from "react";
import { api } from "../api";

const R = 34;
const C = 2 * Math.PI * R;

function Ring({ value, frac, color, label, suffix = "" }) {
  const f = Math.max(0, Math.min(1, frac));
  const offset = C * (1 - f);
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <svg width="92" height="92" viewBox="0 0 92 92">
        <circle cx="46" cy="46" r={R} fill="none" stroke="#e2e8f0" strokeWidth="9" />
        <circle
          cx="46" cy="46" r={R} fill="none" stroke={color} strokeWidth="9"
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset}
          transform="rotate(-90 46 46)"
          style={{ transition: "stroke-dashoffset .8s ease" }}
        />
        <text x="46" y="51" textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>
          {value}{suffix}
        </text>
      </svg>
      <div className="ts" style={{ textAlign: "center" }}>{label}</div>
    </div>
  );
}

export default function IndicatorsCard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = () =>
      api.get("/api/stats")
        .then(r => setStats(r.data))
        .catch(() => {});
    fetchData();
    const id = setInterval(fetchData, 15000);
    return () => clearInterval(id);
  }, []);

  if (!stats) return <div className="card">Chargement indicateurs...</div>;

  const moy = stats.temp_patient?.moyenne ?? 0;
  const moyColor = moy > 38.5 || moy < 35 ? "#ef4444" : moy > 37.5 || moy < 36 ? "#f97316" : "#22c55e";

  return (
    <div className="card">
      <h2>📟 Indicateurs clés</h2>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Ring value={moy} suffix="°"
              frac={(moy - 30) / (42 - 30)} color={moyColor} label="Temp. moy." />
        <Ring value={stats.nb_alertes}
              frac={stats.nb_alertes / 10}
              color={stats.nb_alertes > 0 ? "#ef4444" : "#22c55e"} label="Alertes 24h" />
        <Ring value={stats.nb_mouvements}
              frac={stats.nb_mouvements / 20} color="#0ea5e9" label="Mouvements" />
      </div>
    </div>
  );
}