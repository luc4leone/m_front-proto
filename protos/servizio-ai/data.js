// Dataset sintetico per il proof of concept "prompt-first".
// Curato apposta per lo script di demo (vedi README nella cartella):
// 9 giornalisti a Torino su Cultura/Arte (2 dei quali Collaboratore),
// più ~30 record di contorno per dare la sensazione di una banca dati vera
// e per dimostrare che il filtro esclude correttamente città/argomenti sbagliati.

const ARGOMENTI = [
  "Cultura",
  "Arte",
  "Economia",
  "Sport",
  "Politica",
  "Tecnologia",
  "Cronaca",
  "Ambiente",
];

const CITTA = ["Torino", "Milano", "Roma", "Napoli", "Bologna"];

const RUOLI = ["Giornalista", "Caporedattore", "Direttore", "Collaboratore"];

// Sinonimi in linguaggio naturale → valore canonico del vocabolario.
const RUOLO_SINONIMI = {
  freelance: "Collaboratore",
  freelancer: "Collaboratore",
  collaboratori: "Collaboratore",
  collaboratore: "Collaboratore",
};

const ARGOMENTO_SINONIMI = {
  culturale: "Cultura",
  culturali: "Cultura",
  artistico: "Arte",
  artistica: "Arte",
};

const JOURNALISTS = [
  // --- Gruppo chiave: Torino, Cultura/Arte (righe 1-9) ---
  { id: 1, nome: "Giulia", cognome: "Ferraris", città: "Torino", ruolo: "Giornalista", argomenti: ["Cultura"], testata: "Osservatore Piemonte" },
  { id: 2, nome: "Marco", cognome: "Villata", città: "Torino", ruolo: "Caporedattore", argomenti: ["Cultura"], testata: "Osservatore Piemonte" },
  { id: 3, nome: "Francesca", cognome: "Bruno", città: "Torino", ruolo: "Giornalista", argomenti: ["Cultura", "Economia"], testata: "Radar Cultura" },
  { id: 4, nome: "Davide", cognome: "Conti", città: "Torino", ruolo: "Collaboratore", argomenti: ["Cultura"], testata: "Radar Cultura" },
  { id: 5, nome: "Elena", cognome: "Moretti", città: "Torino", ruolo: "Direttore", argomenti: ["Cultura"], testata: "Bussola Notizie" },
  { id: 6, nome: "Simone", cognome: "Greco", città: "Torino", ruolo: "Giornalista", argomenti: ["Cultura"], testata: "Bussola Notizie" },
  { id: 7, nome: "Chiara", cognome: "Longo", città: "Torino", ruolo: "Giornalista", argomenti: ["Arte"], testata: "Meridiano Arte" },
  { id: 8, nome: "Andrea", cognome: "Serra", città: "Torino", ruolo: "Collaboratore", argomenti: ["Arte"], testata: "Meridiano Arte" },
  { id: 9, nome: "Sara", cognome: "Fontana", città: "Torino", ruolo: "Caporedattore", argomenti: ["Arte", "Tecnologia"], testata: "Prisma News" },

  // --- Distrattori: Torino ma argomento sbagliato ---
  { id: 10, nome: "Paolo", cognome: "Rizzo", città: "Torino", ruolo: "Giornalista", argomenti: ["Sport"], testata: "Verso Sera" },
  { id: 11, nome: "Laura", cognome: "Vitale", città: "Torino", ruolo: "Caporedattore", argomenti: ["Economia"], testata: "Verso Sera" },
  { id: 12, nome: "Riccardo", cognome: "Leone", città: "Torino", ruolo: "Collaboratore", argomenti: ["Politica"], testata: "Controluce" },

  // --- Distrattori: Cultura/Arte ma città sbagliata ---
  { id: 13, nome: "Valentina", cognome: "Costa", città: "Milano", ruolo: "Giornalista", argomenti: ["Cultura"], testata: "Filo Diretto" },
  { id: 14, nome: "Fabio", cognome: "Martini", città: "Milano", ruolo: "Direttore", argomenti: ["Arte"], testata: "Filo Diretto" },
  { id: 15, nome: "Alessia", cognome: "Pellegrini", città: "Milano", ruolo: "Collaboratore", argomenti: ["Cultura", "Arte"], testata: "Indice" },
  { id: 23, nome: "Ilaria", cognome: "Caruso", città: "Roma", ruolo: "Giornalista", argomenti: ["Cultura"], testata: "Meridiano" },
  { id: 27, nome: "Camilla", cognome: "Bianchi", città: "Roma", ruolo: "Caporedattore", argomenti: ["Arte"], testata: "Prisma News" },
  { id: 32, nome: "Andrea", cognome: "Fontana", città: "Napoli", ruolo: "Caporedattore", argomenti: ["Cultura"], testata: "Meridiano Arte" },
  { id: 37, nome: "Francesca", cognome: "Leone", città: "Bologna", ruolo: "Giornalista", argomenti: ["Arte"], testata: "Meridiano Arte" },

  // --- Altro contorno: Milano ---
  { id: 16, nome: "Matteo", cognome: "Barbieri", città: "Milano", ruolo: "Giornalista", argomenti: ["Economia"], testata: "Taccuino" },
  { id: 17, nome: "Silvia", cognome: "Gallo", città: "Milano", ruolo: "Caporedattore", argomenti: ["Tecnologia"], testata: "Taccuino" },
  { id: 18, nome: "Lorenzo", cognome: "Marino", città: "Milano", ruolo: "Giornalista", argomenti: ["Cronaca"], testata: "Lente News" },
  { id: 19, nome: "Martina", cognome: "Romano", città: "Milano", ruolo: "Collaboratore", argomenti: ["Sport"], testata: "Lente News" },
  { id: 20, nome: "Alessandro", cognome: "De Luca", città: "Milano", ruolo: "Direttore", argomenti: ["Politica"], testata: "Costellazione Media" },
  { id: 39, nome: "Elena", cognome: "Rizzo", città: "Milano", ruolo: "Caporedattore", argomenti: ["Cronaca"], testata: "Filo Diretto" },

  // --- Altro contorno: Roma ---
  { id: 21, nome: "Federica", cognome: "Colombo", città: "Roma", ruolo: "Giornalista", argomenti: ["Politica"], testata: "Costellazione Media" },
  { id: 22, nome: "Stefano", cognome: "Ricci", città: "Roma", ruolo: "Caporedattore", argomenti: ["Economia"], testata: "Meridiano" },
  { id: 24, nome: "Roberto", cognome: "Lombardi", città: "Roma", ruolo: "Direttore", argomenti: ["Cronaca"], testata: "Osservatore Capitale" },
  { id: 25, nome: "Beatrice", cognome: "Giordano", città: "Roma", ruolo: "Collaboratore", argomenti: ["Ambiente"], testata: "Osservatore Capitale" },
  { id: 26, nome: "Giovanni", cognome: "Mancini", città: "Roma", ruolo: "Giornalista", argomenti: ["Tecnologia"], testata: "Radar Cultura" },
  { id: 40, nome: "Luca", cognome: "Serra", città: "Roma", ruolo: "Giornalista", argomenti: ["Sport"], testata: "Osservatore Capitale" },

  // --- Altro contorno: Napoli ---
  { id: 28, nome: "Francesco", cognome: "Russo", città: "Napoli", ruolo: "Giornalista", argomenti: ["Sport"], testata: "Mappa Media" },
  { id: 29, nome: "Elisa", cognome: "Ferrara", città: "Napoli", ruolo: "Collaboratore", argomenti: ["Cronaca"], testata: "Mappa Media" },
  { id: 30, nome: "Davide", cognome: "Rossi", città: "Napoli", ruolo: "Direttore", argomenti: ["Economia"], testata: "Bussola Notizie" },
  { id: 31, nome: "Giulia", cognome: "Marino", città: "Napoli", ruolo: "Giornalista", argomenti: ["Ambiente"], testata: "Radar Cultura" },

  // --- Altro contorno: Bologna ---
  { id: 33, nome: "Chiara", cognome: "Villa", città: "Bologna", ruolo: "Giornalista", argomenti: ["Tecnologia"], testata: "Taccuino" },
  { id: 34, nome: "Marco", cognome: "Costa", città: "Bologna", ruolo: "Collaboratore", argomenti: ["Politica"], testata: "Indice" },
  { id: 35, nome: "Sara", cognome: "Bruno", città: "Bologna", ruolo: "Caporedattore", argomenti: ["Cronaca"], testata: "Lente News" },
  { id: 36, nome: "Paolo", cognome: "Greco", città: "Bologna", ruolo: "Direttore", argomenti: ["Ambiente"], testata: "Verso Sera" },
  { id: 38, nome: "Simone", cognome: "Vitale", città: "Bologna", ruolo: "Collaboratore", argomenti: ["Economia"], testata: "Costellazione Media" },
];

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function journalistEmail(j) {
  return `${slugify(j.nome)}.${slugify(j.cognome)}@${slugify(j.testata)}.it`;
}
