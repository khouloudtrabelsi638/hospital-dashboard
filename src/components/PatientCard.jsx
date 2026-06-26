import { useEffect, useState } from "react";
import { api } from "../api";

export default function PatientCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = () =>
      api.get("/api/data?limit=1")
        .then(r => setData(r.data[0]))
        .catch(() => {});
    fetch();
    const id = setInterval(fetch, 5000);
    return () => clearInterval(id);
  }, []);

  if (!data) return <div className="card">Chargement...</div>;

  const t = data.temp_patient;
  const color = t > 38.5 ? "#ef4444" : t > 37.5 ? "#f97316" : "#22c55e";

  return (
    <div className="card">
      <h2>🌡 Température Patient</h2>
      <div style={{ fontSize: 48, fontWeight: 700, color }}>{t}°C</div>
      <div style={{ color, fontWeight: 600, marginTop: 8 }}>
        {t > 38.5 ? "🔴 FIÈVRE CRITIQUE" : t > 37.5 ? "🟠 TEMPÉRATURE ÉLEVÉE" : "🟢 NORMAL"}
      </div>
      <div className="ts">{data.timestamp?.slice(0, 19).replace("T", " ")}</div>
    </div>
  );
}