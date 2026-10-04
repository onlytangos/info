/*



*/

var ROLES = {
  "art": {"publico": 1, "desc": "artista",                  "nombre": "artista",     "color": "#e4ddff", "colorPeople": "#e4adff"},
  "p26": {"publico": 1, "desc": "PTC 2026",                 "nombre": "ptc26",       "color": "#ffe0b3", "colorPeople": "#ffe0b3"},
  "p25": {"publico": 1, "desc": "PTC 2025",                 "nombre": "ptc25",       "color": "#ffe9cc", "colorPeople": "#ffe9cc"},
  "p24": {"publico": 1, "desc": "PTC 2024",                 "nombre": "ptc24",       "color": "#fff2e0", "colorPeople": "#fff2e0"},
  "org": {"publico": 1, "desc": "organizadora",             "nombre": "organiza",    "color": "#ebc4ff", "colorPeople": "#ccffcc"},
  "djm": {"publico": 1, "desc": "pasa música",              "nombre": "tangoDJ",     "color": "#db94ff", "colorPeople": "#db94ff"},
  "wrt": {"publico": 1, "desc": "crea contenido de tango",  "nombre": "writer",      "color": "#f9fea0", "colorPeople": "#F9EE90"},
  "tch": {"publico": 1, "desc": "teacher",                  "nombre": "teacher",     "color": "#b3f0e0", "colorPeople": "#b3f0e0"},
  "mil": {"publico": 0, "desc": "milonguera, baila bien",   "nombre": "milonguera",  "color": "#ffccff", "colorPeople": "#ffccff"},
  "com": {"publico": 0, "desc": "compañía",                 "nombre": "compañía",    "color": "#ffcccc", "colorPeople": "#ffcccc"},
  "vip": {"publico": 0, "desc": "mil+com+inf",              "nombre": "mil+com+inf", "color": "#ff9999", "colorPeople": "#ff9999"},
  "dan": {"publico": 0, "desc": "dancer regular, no mil",   "nombre": "dancer",      "color": "#cfe8ff", "colorPeople": "#cfe8ff"},
  "inf": {"publico": 0, "desc": "proveedor de información", "nombre": "info",        "color": "#F9AA90", "colorPeople": "#F9AA90"},
  "non": {"publico": 0, "desc": "no interesa",              "nombre": "",            "color": "#e0e0e0", "colorPeople": "#e0e0e0"}
};

/*
ROLES_EQUIVALENCIAS: roles antiguos con equivalencia clara (rol antiguo ->
rol de ROLES). comun.py los convierte al normalizar, así los datos de origen
pueden seguir trayendo el nombre antiguo.
*/

var ROLES_EQUIVALENCIAS = {
  "dj":        "djm",
  "artist":    "art",
  "organizer": "org",
  "writer":    "wrt",
  "ptc2026":   "p26",
  "ptc2025":   "p25",
  "ptc2024":   "p24"
};
