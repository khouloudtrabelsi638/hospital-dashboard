import { useEffect, useState } from "react";
import axios from "axios";

export default function AlertPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetch = () =>
      axios.get("http://localhost:5000/api/alerts")
        .then(r => setAlerts(r.data))
        .catch(() => {});
    fetch();
    const id = setInterval(fetch, 5000);
    return () => clearInterval(id);
  }, []);

  const triggerAlert = () =>
    axios.post("http://localhost:5000/api/alert", {
      type: "manuelle", message: "Alerte déclenchée depuis le dashboard", niveau: "urgence"
    }).then(() => axios.get("http://localhost:5000/api/alerts").then(r => setAlerts(r.data)));

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>🚨 Alertes</h2>
        <button onClick={triggerAlert} style={{
          background: "#ef4444", color: "#fff", border: "none",
          borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontWeight: 600
        }}>+ Alerte</button>
      </div>
      {alerts.length === 0
        ? <div className="ts">Aucune alerte</div>
        : alerts.map((a, i) => (
          <div key={i} style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 8, padding: "8px 12px", marginTop: 8, fontSize: 13
          }}>
            <strong>🔴 {a.type}</strong> — {a.message}
            <div className="ts">{a.timestamp?.slice(0, 19).replace("T", " ")}</div>
          </div>
        ))
      }
    </div>
  );
}
