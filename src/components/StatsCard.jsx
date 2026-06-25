import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../api";

export default function StatsCard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetch = () =>
      axios.get(`${API_BASE}/api/stats`)
        .then(r => setStats(r.data))
        .catch(() => {});
    fetch();
    const id = setInterval(fetch, 15000);
    return () => clearInterval(id);
  }, []);

  if (!stats) return <div className="card">Chargement stats...</div>;

  return (
    <div className="card">
      <h2>📊 Statistiques 24h</h2>
      <div className="row-stat"><span>Mesures totales</span><strong>{stats.nb_mesures}</strong></div>
      <div className="row-stat"><span>Alertes</span><strong style={{color:"#ef4444"}}>{stats.nb_alertes}</strong></div>
      <div className="row-stat"><span>Mouvements</span><strong>{stats.nb_mouvements}</strong></div>
      {stats.temp_patient && <>
        <hr style={{margin:"10px 0", border:"none", borderTop:"1px solid #e2e8f0"}}/>
        <div className="row-stat"><span>Temp. patient moy.</span><strong>{stats.temp_patient.moyenne}°C</strong></div>
        <div className="row-stat"><span>Min / Max</span><strong>{stats.temp_patient.min}° / {stats.temp_patient.max}°C</strong></div>
      </>}
    </div>
  );
}