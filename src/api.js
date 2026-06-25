import axios from "axios";

// En local : utilise localhost.
// Déployé (GitHub Pages) : utilise l'URL définie dans le fichier .env
export const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

// Évite la page d'avertissement de ngrok (sinon il renvoie du HTML au lieu du JSON)
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";