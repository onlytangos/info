/*

aux.js : datos auxiliares escritos a mano (en data/). Antes roles.js y favoritos.js.

  - index.htm y wwt/caras.htm lo cargan con <script>; push.sh lo sube.
  - import/comun.py (lee_aux) lee "var CAMPO =", "var ROLES =",
    "var ROLES_EQUIVALENCIAS =" y "var favoritos =" como JSON: dentro, comillas dobles y sin comentarios
    (se toleran comas finales). Los comentarios, fuera.

*/

// ════════════════════════════ CAMPOS ════════════════════════════

/*
CAMPO: posición de cada campo en las filas de 9 campos de *.out.js y res*.json.
Los programas usan fila[CAMPO.name] en vez de fila[4] (en Python igual:
comun.CAMPO.name). People y eventos comparten posiciones:
  tiporol 3  people: roles (art,org...)              eventos: milonga, event...
  varios 5   people: datos públicos separados por #  eventos: subcampos con # (abajo)
  private 6  people: comentarios privados            eventos: "-"
  idfoto 8   id de la foto (6 letras, p.ej. abcdef; review/fotoid.py); vacío =
             sin foto. En todas las fuentes: el que trae se queda; vacío, lo
             pone foto_ids (comun.sh) al generar, y en *.out.js, paso1
fecha regular (REG, lo que se repite: milongas...): la misma gramática en
todas las fuentes, una fila por milonga con sus días (import/campos.py):
  REG.D.<hora>                  todos los días
  REG.W.<días>.<hora>           cada semana: días 0 domingo ... 6 sábado,
                                separados por - (1-3: lunes y miércoles); ? sin día fijo
  REG.M.<día>.<semanas>.<hora>  cada mes, ese día de esas semanas: 1..5
                                separadas por - (2-4: segunda y cuarta); L la última
  <hora>: hhmm-hhmm, hhmm o vacía
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

// fecha regular REG (gramática arriba; igual que lee_reg de import/campos.py):
// {frec: D|W|M, dias: [0-6] ([] sin día fijo), semanas: ['1'..'5','L'], hora};
// null si no la sigue
function leeReg(f){
  const p=String(f||'').split('.');
  const horaOk=h => /^(\d{4}(-\d{4})?)?$/.test(h);
  if (p[0]!='REG'){return null}
  if (p[1]=='D' && p.length==3 && horaOk(p[2])){return {frec:'D', dias:[0,1,2,3,4,5,6], semanas:[], hora:p[2]}}
  if (p[1]=='W' && p.length==4 && horaOk(p[3]) && /^(\?|[0-6](-[0-6])*)$/.test(p[2])){
    return {frec:'W', dias:p[2]=='?' ? [] : p[2].split('-').map(Number), semanas:[], hora:p[3]};
  }
  if (p[1]=='M' && p.length==5 && horaOk(p[4]) && /^[0-6]$/.test(p[2]) && /^([1-5]|L)(-([1-5]|L))*$/.test(p[3])){
    return {frec:'M', dias:[Number(p[2])], semanas:p[3].split('-'), hora:p[4]};
  }
  return null;
}
// semanas del mes de una REG mensual, en texto: ['2','4'] -> '2nd,4th'; L -> 'last'
function semanasReg(ss){
  const ord={'1':'1st','2':'2nd','3':'3rd','4':'4th','5':'5th','L':'last'};
  return ss.map(s => ord[s]||s).join(',');
}
// texto corto de una fecha REG: 'daily 2000-2300', 'mon,wed 2000', 'fri 2nd,4th 2100', '? 2100'
function textoReg(f){
  const r=leeReg(f);
  if (!r){return String(f||'')}
  const dias=['sun','mon','tue','wed','thu','fri','sat'];
  const cuando=r.frec=='D' ? 'daily' : (r.dias.length ? r.dias.map(d => dias[d]).join(',') : '?')
    +(r.frec=='M' ? ' '+semanasReg(r.semanas) : '');
  return cuando+(r.hora ? ' '+r.hora : '');
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
