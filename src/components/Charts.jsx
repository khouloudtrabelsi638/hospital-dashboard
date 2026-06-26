import { useEffect, useState } from "react";
import { api } from "../api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function Charts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = () =>
      api.get("/api/data?limit=20")
        .then(r => setData(r.data.reverse().map(d => ({
          ...d,
          time: d.timestamp?.slice(11, 19) || ""
        }))))
        .catch(() => {});
    fetch();
    const id = setInterval(fetch, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="card" style={{ gridColumn: "1 / -1" }}>
      <h2>📈 Températures (20 dernières mesures)</h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="time" tick={{ fontSize: 11 }} />
          <YAxis domain={[30, 45]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temp_patient" stroke="#ef4444"
                name="Temp. Patient (°C)" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="temp_chambre" stroke="#3b82f6"
                name="Temp. Chambre (°C)" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}