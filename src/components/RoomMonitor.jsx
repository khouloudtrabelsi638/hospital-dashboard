import { useEffect, useState } from "react";
import { api } from "../api";

export default function RoomMonitor() {
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

  return (
    <div className="card">
      <h2>🏥 Chambre Médicale</h2>
      <div className="row-stat">
        <span>Température</span>
        <strong>{data.temp_chambre}°C</strong>
      </div>
      <div className="row-stat">
        <span>Humidité</span>
        <strong>{data.humidite}%</strong>
      </div>
      <div className="row-stat">
        <span>Mouvement patient</span>
        <strong style={{ color: data.mouvement ? "#22c55e" : "#94a3b8" }}>
          {data.mouvement ? "Actif" : "Inactif"}
        </strong>
      </div>
    </div>
  );
}