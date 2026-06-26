import axios from "axios";

// En local : utilise localhost.
// Déployé (GitHub Pages) : utilise l'URL définie dans le fichier .env
export const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

// Instance axios avec l'en-tête anti-avertissement ngrok "cousu" dedans.
// Tous les appels passent par cette instance → ngrok ne peut plus afficher
// sa page "You are about to visit...".
export const api = axios.create({
  baseURL: API_BASE,
  headers: { "ngrok-skip-browser-warning": "true" },
});