/*

aux.js : datos auxiliares escritos a mano (en data/). Antes roles.js y favoritos.js.

  - index.htm y wwt/wwt.htm lo cargan con <script>; push.sh lo sube.
  - import/comun.py (lee_aux) lee "var CAMPO =","var ROLES =",
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
  idfoto 8   id de la foto (6 letras, p.ej. abcdef; review/fotoid.py); "-" =
             sin foto. En todas las fuentes: el que trae se queda; vacío o "-", lo
             pone foto_ids (comun.sh) al generar, y en *.out.js, paso1
fecha regular (REG, lo que se repite: milongas...): la misma gramática en
todas las fuentes, una fila por milonga con sus días (import/campos.py):
  REG.D.<hora>                  todos los días
  REG.W.<días>.<hora>           cada semana: días 0 domingo ... 6 sábado,
                                separados por - (1-3: lunes y miércoles); ? sin día fijo
  REG.M.<día>.<semanas>.<hora>  cada mes, ese día de esas semanas: 1..5
                                separadas por - (2-4: segunda y cuarta); L la última
  <hora>: hhmm-hhmm, hhmm o vacía
varios (campo 6): subcampos con nombre de tres letras, en cualquier fila
(people y eventos), igual en todas las fuentes:
  varios = nom:valor#nom:valor...   ('-' vacío)
  cada nombre, una vez como mucho. Las listas (org www vid ins tel wec kak
  ema txt) admiten varios
  valores: entre llaves y separados por ¬ (org:{Ana¬Luis}); con uno solo,
  sin llaves (org:Ana). # ¬ { } no van dentro de un valor (se quitan)
  lat lon  coordenadas                      event*, venue
  dir      dirección o "País, Ciudad"       event*, venue
  loc      local o sala                     milonga
  org      quién organiza (lista; wwt.htm enlaza los que son personas)
  www      webs que no son de Facebook (lista; la de FB va en la url;
           en list, la url de la lista)
  vid      vídeos: YouTube, Vimeo (lista)
  ins      usuarios de Instagram, sin @ (lista)
  tel      teléfonos (lista; en un venue, el del local)
  wec      IDs de WeChat (lista)
  kak      KakaoTalk: ID o enlace open.kakao.com (lista)
  ema      emails (lista)
           (contactos: en publicPeople solo url e ins; en publicEvent ninguno,
           solo org. Los quita import/paso1-merge.sh)
  txt      texto libre: bio, escuela... (lista; people)
  fec      fecha EVT.../REG... (event*, milonga)
Los que no hay, no se ponen; se escriben en ese orden (lat lon dir loc org
www vid ins tel wec kak ema txt fec) (import/campos.py:
VARIOS, lee_varios, escribe_varios; aquí, leeVarios). Ejemplos:
  milonga  loc:Nou#org:Thomas Rieser#www:https://...#fec:REG.W.5.2100-0300
  event    lat:45.76#lon:1.33#dir:France, Boisseuil#org:{Ana¬Luis}#fec:EVT.9.OCT.23-25.2026
  venue    lat:41.64#lon:-0.88#dir:C/ Rocasolano, 3, Zaragoza
  people   vid:https://youtu.be/...#txt:{Tango DJ¬Organizer of Milonga Loca}
*/

var CAMPO = {
  "area": 0,"country": 1,"city": 2,"tiporol": 3,"name": 4,
  "varios": 5,"private": 6,"urlfb": 7,"idfoto": 8
};

// varios (gramática arriba) -> {nom: [valores]}; las listas {v1¬v2}, en sus
// valores; los subcampos sin nombre válido no se leen. Igual que lee_varios()
// de import/campos.py.
const VARIOS=['lat','lon','dir','loc','org','www','vid','ins','tel','wec','kak','ema','txt','fec'];
const LISTAS=['org','www','vid','ins','tel','wec','kak','ema','txt'];
function leeVarios(fila){
  const d={};
  for (const s of String(fila[CAMPO.varios]||'').split('#')){
    const m=s.trim().match(/^([a-z]{3}):(.*)$/s);
    if (!m || !VARIOS.includes(m[1])){continue}
    const val=m[2].trim(), lista=LISTAS.includes(m[1]) && val.startsWith('{') && val.endsWith('}');
    for (const v of (lista ? val.slice(1,-1).split('¬') : [val]).map(x => x.trim())){
      if (v && v!='-'){(d[m[1]]=d[m[1]]||[]).push(v)}
    }
  }
  return d;
}

// fecha de un evento (subcampo fec de varios), '' si no tiene. Igual que
// fecha_de() de import/campos.py.
const ES_FECHA=/^(EVT|REG)\./;
function fechaDe(fila){
  const f=(leeVarios(fila).fec||[''])[0];
  return ES_FECHA.test(f) ? f : '';
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

// ═══════════════ UTILIDADES DE LAS PÁGINAS ═══════════════
// (index.htm, wwt/wwt.htm y review/index.htm)

// true si el tipo (campo 4) es de un evento, venue, milonga, academy o list (su primera
// palabra); si no, es una persona. Única regla para distinguirlos en las
// páginas (en Python: es_tipo_evento de review/page.py). list: fuente de
// información; las mundiales tienen área 'World', país 'world' y ciudad '*world'
function esEvento(tipo){
  return ['event','venue','milonga','academy','list'].includes(String(tipo).trim().split(' ')[0]);
}

// url para comparar (la misma página aunque se escriba distinto): sin https://,
// www., m., web., mayúsculas, #ancla ni / final. Parámetros: en Facebook solo
// id= y fbid=; en las demás webs, todos salvo los de seguimiento (utm_,
// fbclid...): en YouTube watch?v= es otro vídeo. Igual que clave_url de
// import/comun.py
const SEGUIMIENTO=/^(utm_\w+|fbclid|gclid|mibextid|acontext|__tn__|__cft__\[?\d*\]?|rdid|ref|ref_src|si|igsh|share_url)=/;
function claveUrl(u){
  u=String(u||'').trim().toLowerCase();
  if (u=='' || u=='-'){return ''}
  u=u.replace(/^https?:\/\//,'').replace(/^(www\.|m\.|web\.)/,'').split('#')[0];
  const i=u.indexOf('?');
  const ruta=(i<0 ? u : u.slice(0,i)).replace(/\/+$/,''), q=i<0 ? '' : u.slice(i+1);
  const ps=/^(facebook\.com|fb\.com)/.test(ruta)
    ? q.split('&').filter(p => /^(id|fbid)=\d+$/.test(p)).slice(0,1)
    : q.split('&').filter(p => p && !SEGUIMIENTO.test(p));
  return ruta+(ps.length ? '?'+ps.join('&') : '');
}

// foto de un id (campo 9, idfoto): la primera que haya en review/foto0,1,2,9/
// (eventos 0,2,1,9: la portada antes), según fotosId de review/fotoid.js
// (se carga después de aux.js: se lee en la primera llamada).
// {carpeta, fichero: '<id>.<ext>'}; null si no tiene
let fotoSetsCache=null;
function fotoDeId(idfoto,evento){
  if (!idfoto || idfoto=='-'){return null}       // "-": sin foto
  if (!fotoSetsCache){
    fotoSetsCache=Object.fromEntries(['0','1','2','9'].map(c =>
      [c,new Set(typeof fotosId!='undefined' && fotosId[c] ? fotosId[c] : [])]));
  }
  for (const c of (evento ? ['0','2','1','9'] : ['0','1','2','9']))
    for (const e of ['jpg','webp','png'])
      if (fotoSetsCache[c].has(idfoto+'.'+e)){return {carpeta:c, fichero:idfoto+'.'+e}}
  return null;
}

// baja texto como un fichero llamado nombre (tipo: application/json, text/plain...)
function bajaFichero(nombre,texto,tipo){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([texto],{type:tipo}));
  a.download=nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href),1000);
}

// ════════════════════════════ ROLES ════════════════════════════


var ROLES = {
  "art": {"publico": 1,"desc": "artista",                  "nombre": "artista",     "color": "#e4ddff","colorPeople": "#e4adff"},
  "p26": {"publico": 1,"desc": "PTC 2026",                 "nombre": "ptc26",       "color": "#ffe0b3","colorPeople": "#ffe0b3"},
  "p25": {"publico": 1,"desc": "PTC 2025",                 "nombre": "ptc25",       "color": "#ffe9cc","colorPeople": "#ffe9cc"},
  "p24": {"publico": 1,"desc": "PTC 2024",                 "nombre": "ptc24",       "color": "#fff2e0","colorPeople": "#fff2e0"},
  "org": {"publico": 1,"desc": "organizadora",             "nombre": "organiza",    "color": "#ebc4ff","colorPeople": "#ccffcc"},
  "djm": {"publico": 1,"desc": "pasa música",              "nombre": "tangoDJ",     "color": "#db94ff","colorPeople": "#db94ff"},
  "wrt": {"publico": 1,"desc": "crea contenido de tango",  "nombre": "writer",      "color": "#f9fea0","colorPeople": "#F9EE90"},
  "tch": {"publico": 1,"desc": "teacher",                  "nombre": "teacher",     "color": "#b3f0e0","colorPeople": "#b3f0e0"},
  "shp": {"publico": 1,"desc": "tiene tienda",             "nombre": "shopper",     "color": "#d4f5a3","colorPeople": "#d4f5a3"},
  "mil": {"publico": 0,"desc": "milonguera bien conocida","nombre": "milonguera",  "color": "#ffccff","colorPeople": "#ffccff"},
  "com": {"publico": 0,"desc": "compañía",                 "nombre": "compañía",    "color": "#ffcccc","colorPeople": "#ffcccc"},
  "vip": {"publico": 0,"desc": "mil+com+inf",              "nombre": "mil+com+inf","color": "#ff9999","colorPeople": "#ff9999"},
  "dan": {"publico": 0,"desc": "dancer regular conocida",  "nombre": "dancer",      "color": "#cfe8ff","colorPeople": "#cfe8ff"},
  "inf": {"publico": 0,"desc": "proveedor de información","nombre": "info",        "color": "#F9AA90","colorPeople": "#F9AA90"},
  "bed": {"publico": 0,"desc": "alojamiento",              "nombre": "alojamiento","color": "#d9f2c4","colorPeople": "#d9f2c4"},
  "non": {"publico": 0,"desc": "no interesa",              "nombre": "",            "color": "#e0e0e0","colorPeople": "#e0e0e0"}
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

Cada fila: [nombre, ciudad, estado]. Es de un evento de su misma ciudad si
todas las palabras de su nombre están en el nombre del evento, así que el
nombre puede estar incompleto. Se compara normalizado: da igual mayúsculas,
tildes y lo que va entre (paréntesis).

Estados: home 🛖, go ⭐, think ❓ (con ?fav2,"mi agenda", solo home y go)

paso1 avisa en result.txt ([FAV]) de las entradas que no encuentran evento,
de las que encuentran varios y de los estados que no son estos.

*/

var favoritos=[
  ["Big Milonga -Estrellas-","Suncheon","home"],
  ["Busan Tango Marathon","Busan","home"],
  ["Cherry Blossoms Milonga","Changwon","home"],
  ["ChunCheon Tango Marathon","Chuncheon","home"],
  ["Crab Milonga","Pohang","home"],
  ["Daegu International Tango Marathon","Daegu","home"],
  ["Festivalito de Tango en Hong Kong","Hong Kong","go"],
  ["Greater China Tango Championship","Chengdu","think"],
  ["Gunsan Sunset Tango Marathon","Gunsan","home"],
  ["ICH Chengdu Tango Festival&Competition","Chengdu","think"],
  ["Jeju Summ Milonga","Jeju","think"],
  ["More than Tango Marathon & Festival & Cup","Shanghai","think"],
  ["Nanjing Tango Festival","Nanjing","think"],
  ["Oriental Tango Congress(OTC)","Beijing","think"],
  ["Sakura Tango Festival","Fukuoka","think"],
  ["Sapporo Tango Festival","Sapporo","think"],
  ["Select Tango Weekend","Beijing","go"],
  ["Shenyang Summer Ice & Snow Tango Weekend","Shenyang","go"],
  ["Taiwan Tango Marathon","Doulan Village","go"], 
  ["TANGO CHINA-Dapeng Tango Holiday","Shenzhen","go"],
  ["Vietnam Tango Marathon","Da Nang","go"],
  ["Hong Kong Tango Marathon","Hong Kong","go"],
];
