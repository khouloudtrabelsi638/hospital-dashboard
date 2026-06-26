import { useState, useRef, useEffect } from "react";
import { api } from "../api";

// ⚙️ Configuration Groq
const GROQ_KEY   = process.env.REACT_APP_GROQ_KEY;          // mets ta clé dans .env
const GROQ_MODEL = "llama-3.3-70b-versatile";               // change si "model decommissioned"
const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Bonjour 👋 Je suis l'assistant médical du tableau de bord. Posez-moi une question sur l'état du patient ou les mesures." }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    const newMsgs = [...messages, { role: "user", content: q }];
    setMessages(newMsgs);
    setLoading(true);

    try {
      if (!GROQ_KEY) {
        setMessages(m => [...m, { role: "assistant",
          content: "⚠️ Clé Groq manquante. Ajoute REACT_APP_GROQ_KEY dans le fichier .env, puis relance (npm start) ou redéploie (npm run deploy)." }]);
        return;
      }

      // 1) Récupère le contexte temps réel depuis TON API
     let contexte = "Contexte indisponible.";
      try {
        const [d, p, s, hist] = await Promise.all([
          api.get("/api/data?limit=1"),
          api.get("/api/predict"),
          api.get("/api/stats"),
          api.get("/api/data?limit=40"),   // <-- l'historique
        ]);
        const mz = d.data[0] || {};
        const lignes = (hist.data || [])
          .map(x => `${x.timestamp?.slice(11,19)} | patient ${x.temp_patient}°C | chambre ${x.temp_chambre}°C | hum ${x.humidite}% | mouv ${x.mouvement} | alerte ${x.alerte}`)
          .join("\n");
        contexte =
          `Mesure actuelle — patient ${mz.temp_patient} °C, chambre ${mz.temp_chambre} °C, ` +
          `humidité ${mz.humidite} %, mouvement ${mz.mouvement ? "oui" : "non"}, alerte ${mz.alerte ? "oui" : "non"}. ` +
          `Prédiction IA: ${p.data.label}. Stats 24h: ${s.data.nb_mesures} mesures, ${s.data.nb_alertes} alertes, ` +
          `moyenne ${s.data.temp_patient?.moyenne} °C, min ${s.data.temp_patient?.min} °C, max ${s.data.temp_patient?.max} °C.\n\n` +
          `HISTORIQUE des 40 dernières mesures (la plus récente en haut) :\n${lignes}`;
      } catch (e) {}
      const sys = {
        role: "system",
        content:
          "Tu es un assistant intégré à un tableau de bord hospitalier IoT de surveillance des patients. " +
          "Réponds toujours en français, de façon brève, claire et professionnelle. " +
          "Tu n'es pas médecin : tu n'établis pas de diagnostic, tu aides seulement à interpréter les données affichées " +
          "et tu invites à contacter un soignant en cas de doute. Données actuelles du patient : " + contexte,
      };

      // 2) Appel Groq
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [sys, ...newMsgs.slice(-8)],
          temperature: 0.4,
          max_tokens: 400,
        }),
      });
      const json = await res.json();
      const answer =
        json?.choices?.[0]?.message?.content ||
        (json?.error?.message ? "Erreur API : " + json.error.message : "Réponse vide.");
      setMessages(m => [...m, { role: "assistant", content: answer }]);

    } catch (e) {
      setMessages(m => [...m, { role: "assistant",
        content: "❌ Impossible de joindre l'assistant. Vérifie ta clé Groq et ta connexion internet." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ gridColumn: "1 / -1" }}>
      <h2>💬 Assistant médical IA</h2>

      <div className="chat-log">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>{m.content}</div>
        ))}
        {loading && <div className="chat-msg assistant">…</div>}
        <div ref={endRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ex : L'état du patient est-il préoccupant ?"
        />
        <button onClick={send} disabled={loading}>Envoyer</button>
      </div>
    </div>
  );
}