/*

aux.js : datos auxiliares escritos a mano (en data/). Antes roles.js y favoritos.js.

  - index.htm y wwt/caras.htm lo cargan con <script>; push.sh lo sube.
  - import/comun.py (lee_aux) lee "var CAMPO =", "var ROLES =",
    "var ROLES_EQUIVALENCIAS =" y "var favoritos =" como JSON: dentro, comillas dobles y sin comentarios
    (se toleran comas finales). Los comentarios, fuera.

*/

// ════════════════════════════ CAMPOS ════════════════════════════

/*
CAMPO: posición de cada campo en las filas de *.out.js (9 campos) y res*.json (8).
Los programas usan fila[CAMPO.name] en vez de fila[4] (en Python igual:
comun.CAMPO.name). People y eventos comparten posiciones:
  tiporol 3  people: roles (art,org...)              eventos: milonga, event...
  varios 5   people: datos públicos separados por #  eventos: subcampos con # (abajo)
  private 6  people: comentarios privados            eventos: "-"
  idfoto 8   solo en *.out.js (lo añade paso1): id de la foto (8 letras, p.ej.
             abcdefgh); vacío = sin foto
varios de eventos: la fecha (EVT.../REG...) es siempre el último subcampo y
www (opcional) va justo antes; venue y list no llevan fecha:
  milonga  local#org[#www]#REG...
  event    lat#lon#dir#org[#www]#EVT...
  venue    lat#lon#dir[#www]
Los res*.json de los scrapers traen la fecha en el campo 7; paso0 la mueve
a varios al normalizar (comun.normaliza_evento).
*/

var CAMPO = {
  "area": 0, "country": 1, "city": 2, "tiporol": 3, "name": 4,
  "varios": 5, "private": 6, "urlfb": 7, "idfoto": 8
};

// fecha de un evento (último subcampo de varios), '' si no tiene. Igual que
// fecha_de() y varios_sin_fecha() de import/campos.py.
const ES_FECHA=/^(EVT|REG)\./;
function fechaDe(fila){
  const s=String(fila[CAMPO.varios]||'').split('#');
  const f=s[s.length-1].trim();
  return ES_FECHA.test(f) ? f : '';
}
function variosSinFecha(fila){
  const v=String(fila[CAMPO.varios]||'');
  return fechaDe(fila) ? v.slice(0,v.lastIndexOf('#')) : v;
}

// ════════════════════════════ ROLES ════════════════════════════


var ROLES = {
  "art": {"publico": 1, "desc": "artista",                  "nombre": "artista",     "color": "#e4ddff", "colorPeople": "#e4adff"},
  "p26": {"publico": 1, "desc": "PTC 2026",                 "nombre": "ptc26",       "color": "#ffe0b3", "colorPeople": "#ffe0b3"},
  "p25": {"publico": 1, "desc": "PTC 2025",                 "nombre": "ptc25",       "color": "#ffe9cc", "colorPeople": "#ffe9cc"},
  "p24": {"publico": 1, "desc": "PTC 2024",                 "nombre": "ptc24",       "color": "#fff2e0", "colorPeople": "#fff2e0"},
  "org": {"publico": 1, "desc": "organizadora",             "nombre": "organiza",    "color": "#ebc4ff", "colorPeople": "#ccffcc"},
  "djm": {"publico": 1, "desc": "pasa música",              "nombre": "tangoDJ",     "color": "#db94ff", "colorPeople": "#db94ff"},
  "wrt": {"publico": 1, "desc": "crea contenido de tango",  "nombre": "writer",      "color": "#f9fea0", "colorPeople": "#F9EE90"},
  "tch": {"publico": 1, "desc": "teacher",                  "nombre": "teacher",     "color": "#b3f0e0", "colorPeople": "#b3f0e0"},
  "shp": {"publico": 1, "desc": "tiene tienda",             "nombre": "shopper",     "color": "#d4f5a3", "colorPeople": "#d4f5a3"},
  "mil": {"publico": 0, "desc": "milonguera bien conocida", "nombre": "milonguera",  "color": "#ffccff", "colorPeople": "#ffccff"},
  "com": {"publico": 0, "desc": "compañía",                 "nombre": "compañía",    "color": "#ffcccc", "colorPeople": "#ffcccc"},
  "vip": {"publico": 0, "desc": "mil+com+inf",              "nombre": "mil+com+inf", "color": "#ff9999", "colorPeople": "#ff9999"},
  "dan": {"publico": 0, "desc": "dancer regular conocida",  "nombre": "dancer",      "color": "#cfe8ff", "colorPeople": "#cfe8ff"},
  "inf": {"publico": 0, "desc": "proveedor de información", "nombre": "info",        "color": "#F9AA90", "colorPeople": "#F9AA90"},
  "bed": {"publico": 0, "desc": "alojamiento",              "nombre": "alojamiento", "color": "#d9f2c4", "colorPeople": "#d9f2c4"},
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


// ══════════════════════════ FAVORITOS ══════════════════════════

/*

favoritos: estado de los eventos favoritos (lo lee index.htm con ?fav o ?fav2)

Cada fila: [nombre, ciudad, estado], tal como salen en el listado.
Se compara normalizado: da igual mayúsculas, tildes, (paréntesis),
años/números y palabras como tango/marathon/festival/de/the.

Estados: home 🛖, go 😊, think 🤔, moreinfo ❓

paso1 avisa en result.txt ([FAV]) de las entradas que no encuentran evento.

*/

// go 😊
// home 🛖
// think 🤔 ⭐
// moreinfo ❓

var favoritos=[
  ["8th Singapore International Tango Festival", "Singapore", "think"],
  ["Big Milonga -Estrellas-", "Suncheon", "home"],
  ["Busan Tango Marathon", "Busan", "home"],
  ["Champagne Milonga", "Seoul", "think"],
  ["Cherry Blossoms Milonga", "Changwon", "home"],
  ["ChunCheon Tango Marathon", "Chuncheon", "home"],
  ["Crab Milonga", "Pohang", "home"],
  ["Daegu International Tango Marathon", "Daegu", "home"],
  ["Festivalito de Tango en Hong Kong", "Hong Kong", "go"],
  ["Greater China Tango Championship", "Chengdu", "think"],
  ["Gunsan Sunset Tango Marathon", "Gunsan", "home"],
  ["ICH Chengdu Tango Festival&Competition", "Chengdu", "think"],
  ["Jeju Summ Milonga", "Jeju", "think"],
  ["More than Tango Marathon & Festival & Cup", "Shanghai", "think"],
  ["Nanjing Tango Festival", "Nanjing", "moreinfo"],
  ["Oriental Tango Congress(OTC)", "Beijing", "think"],
  ["RoyBeDDong", "Busan", "think"],
  ["Sakura Tango Festival", "Fukuoka", "think"],
  ["Sapporo Tango Festival", "Sapporo", "think"],
  ["Select Tango Weekend", "Beijing", "go"],
  ["Shenyang Summer Ice & Snow Tango Weekend","Shenyang","go"],
  ["Taiwan Tango Marathon", "Doulan Village", "go"], 
  ["TANGO CHINA-Dapeng Tango Holiday", "Shenzhen", "go"],
  ["Vietnam Tango Marathon", "Da Nang", "go"],
];
