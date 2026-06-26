import { api } from "../api";

export default function ExportButton() {
  const handleExport = async () => {
    try {
      const r = await api.get("/api/data?limit=200");
      const rows = r.data || [];
      if (rows.length === 0) { alert("Aucune donnée à exporter."); return; }

      const headers = ["timestamp", "temp_patient", "temp_chambre", "humidite", "mouvement", "alerte"];
      const csv =
        headers.join(",") + "\n" +
        rows.map(x => headers.map(h => x[h]).join(",")).join("\n");

      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mesures_patient.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Export impossible : vérifie la connexion à l'API.");
    }
  };

  return (
    <button className="theme-btn" onClick={handleExport}>⬇️ Export CSV</button>
  );
}