import { useEffect, useState } from "react";
import { api } from "../api";

const MIN = 30, MAX = 42;
const R = 70;
const C = 2 * Math.PI * R;

function timeAgo(ts, now) {
  if (!ts) return "";
  let iso = ts.includes("T") ? ts : ts.replace(" ", "T");
  if (!/[Zz]|[+-]\d\d:?\d\d$/.test(iso)) iso += "Z";
  let s = Math.floor((now - new Date(iso).getTime()) / 1000);
  if (s < 0) s = 0;
  if (s < 60) return `il y a ${s} s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `il y a ${m} min`;
  return `il y a ${Math.floor(m / 60)} h`;
}

// État selon chaud ET froid
function etat(t) {
  if (t > 38.5)  return { color: "#ef4444", label: "FIÈVRE CRITIQUE", icon: "🔴" };
  if (t < 35.0)  return { color: "#ef4444", label: "HYPOTHERMIE",     icon: "🔴" };
  if (t > 37.5)  return { color: "#f97316", label: "TEMP. ÉLEVÉE",    icon: "🟠" };
  if (t < 36.0)  return { color: "#f97316", label: "TEMP. BASSE",     icon: "🟠" };
  return { color: "#22c55e", label: "NORMAL", icon: "🟢" };
}

export default function PatientGauge() {
  const [data, setData] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const fetchData = () =>
      api.get("/api/data?limit=1")
        .then(r => setData(r.data[0]))
        .catch(() => {});
    fetchData();
    const id   = setInterval(fetchData, 5000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(id); clearInterval(tick); };
  }, []);

  if (!data) return <div className="card">Chargement...</div>;

  const t = data.temp_patient;
  const { color, label, icon } = etat(t);
  let frac = (t - MIN) / (MAX - MIN);
  frac = Math.max(0, Math.min(1, frac));
  const offset = C * (1 - frac);

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h2 style={{ textAlign: "left" }}>🌡 Température Patient</h2>
      <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={R} fill="none" stroke="#e2e8f0" strokeWidth="14" />
          <circle
            cx="90" cy="90" r={R} fill="none" stroke={color} strokeWidth="14"
            strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset}
            transform="rotate(-90 90 90)"
            style={{ transition: "stroke-dashoffset .8s ease, stroke .4s" }}
          />
          <text x="90" y="86" textAnchor="middle" fontSize="38" fontWeight="700" fill={color}>{t}°</text>
          <text x="90" y="112" textAnchor="middle" fontSize="13" fill="#94a3b8">Celsius</text>
        </svg>
      </div>
      <div style={{ color, fontWeight: 700, fontSize: 16 }}>{icon} {label}</div>
      <div className="ts" style={{ textAlign: "center" }}>{timeAgo(data.timestamp, now)}</div>
    </div>
  );
}