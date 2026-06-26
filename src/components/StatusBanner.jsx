import { useEffect, useRef, useState } from "react";
import { api } from "../api";

// Bip d'alerte (aucun fichier audio nécessaire)
function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine"; o.frequency.value = 880;
    o.connect(g); g.connect(ctx.destination);
    const t0 = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.3, t0 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
    o.start(t0); o.stop(t0 + 0.55);
  } catch (e) {}
}

// Envoi d'e-mail via EmailJS (REST, sans SDK). Ne fait rien si non configuré.
async function envoyerEmail() {
  const service  = process.env.REACT_APP_EMAILJS_SERVICE;
  const template = process.env.REACT_APP_EMAILJS_TEMPLATE;
  const key      = process.env.REACT_APP_EMAILJS_KEY;
  if (!service || !template || !key) return;   // pas configuré → on ignore

  try {
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: service,
        template_id: template,
        user_id: key,
        template_params: {
          etat: "CRITIQUE",
          message: "Le patient nécessite une intervention immédiate.",
          date: new Date().toLocaleString("fr-FR"),
        },
      }),
    });
  } catch (e) {}
}

export default function StatusBanner() {
  const [pred, setPred] = useState(null);
  const prev = useRef(null);

  useEffect(() => {
    const fetchData = () =>
      api.get("/api/predict")
        .then(r => {
          setPred(r.data);
          if (r.data.label === "Critique" && prev.current !== "Critique") {
            beep();
            envoyerEmail();   // notification au personnel
          }
          prev.current = r.data.label;
        })
        .catch(() => {});
    fetchData();
    const id = setInterval(fetchData, 5000);
    return () => clearInterval(id);
  }, []);

  const label = pred?.label || "—";
  const cls =
    label === "Critique"  ? "sb-crit" :
    label === "Attention" ? "sb-warn" : "sb-ok";
  const text =
    label === "Critique"  ? "⚠️ ALERTE CRITIQUE — intervention immédiate requise" :
    label === "Attention" ? "🟠 Surveillance accrue du patient" :
    label === "Normal"    ? "🟢 Patient stable — paramètres normaux" :
                            "Connexion au système…";

  return <div className={`status-banner ${cls}`}>{text}</div>;
}