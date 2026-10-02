/*

roles.js : roles de people (campo 4), en un solo sitio para todos.

  - index.htm lo carga con <script> (va junto a index.htm; push.sh lo sube)
  - import-datos/comun.py y bin/common.py leen los objetos de "var ROLES ="
    y "var ROLES_EQUIVALENCIAS =" como JSON: dentro, JSON estricto (comillas
    dobles, sin comas finales, sin comentarios). Los comentarios, aquí fuera.

Cada rol:
  publico     1 = puede salir en publicPeople.out.js (ROLES_PUBLICOS)
              0 = solo privado
  desc        descripción (ROLES_VALIDOS en comun.py)
  nombre      sufijo en el selector de index.htm ("" = sin sufijo)
  color       color de la etiqueta en index.htm, vista mundo
  colorPeople color de la etiqueta en index.htm, vista people

Roles públicos:
  art      baila/actúa profesionalmente
  p26..p24 compite/compitió en el Pacific Tango Championship 2026..2024
           (ptc2026..ptc2024 se convierten a p26..p24: ROLES_EQUIVALENCIAS en comun.py)
  org      organiza milongas, festivales o maratones
  djm      DJ de tango
  wrt      escribe, publica o hace vídeos sobre tango
  tch      da clases
Roles privados:
  mil      bailarina de buen nivel
  com      compañera de viaje o de baile
  vip      milonguera, compañía y fuente de información
  dan      baila, pero no a nivel milonguera
  inf      fuente de información sobre eventos y gente
  non      descartada: ya no baila, baila mal, no disponible

El orden de aquí es el de los selectores de index.htm.

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
