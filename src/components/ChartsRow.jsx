import { useEffect, useState } from "react";
import { api } from "../api";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function ChartsRow() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = () =>
      api.get("/api/data?limit=20")
        .then(r => setData(r.data.reverse().map(d => ({
          ...d,
          time: d.timestamp?.slice(11, 19) || ""
        }))))
        .catch(() => {});
    fetchData();
    const id = setInterval(fetchData, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="card" style={{ gridColumn: "1 / -1" }}>
      <div className="charts-row">

        <div>
          <h2>📈 Températures (20 dernières)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5edf3" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} minTickGap={20} />
              <YAxis domain={[30, 45]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temp_patient" stroke="#ef4444"
                    name="Patient (°C)" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="temp_chambre" stroke="#3b82f6"
                    name="Chambre (°C)" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2>💧 Humidité (20 dernières)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5edf3" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} minTickGap={20} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="humidite" stroke="#06b6d4"
                    fill="url(#humGrad)" strokeWidth={2} name="Humidité (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}