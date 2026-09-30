// favoritos.js : estado de los eventos favoritos (va junto a index.htm)
// Cada fila: [nombre, ciudad, estado], tal como salen en el listado. Se compara normalizado:
// da igual mayúsculas, tildes, (paréntesis), años/números y palabras como
// tango/marathon/festival/de/the. Estados: home 🛖, go 😊, think 🤔, moreinfo ❓
// paso1 avisa en result.txt ([FAV]) de las entradas que no encuentran evento.
var favoritos=[
  // go 😊
  ["TANGO CHINA-Dapeng Tango Holiday", "Shenzhen", "go"],
  ["Festivalito de Tango en Hong Kong", "Hong Kong", "go"],
  ["Greater China Tango Championship", "Chengdu", "go"],
  ["Vietnam Tango Marathon", "Da Nang", "go"],
  ["Select Tango Weekend", "Beijing", "go"],
  ["Jeju Summ Milonga", "Jeju", "go"],
  ["Taiwan Tango Marathon", "Doulan Village", "go"],
  // home 🛖
  ["Crab Milonga", "Pohang", "home"],
  ["Cherry Blossoms Milonga", "Changwon", "home"],
  ["Daegu International Tango Marathon", "Daegu", "home"],
  ["Gunsan Sunset Tango Marathon", "Gunsan", "home"],
  ["Busan Tango Marathon", "Busan", "home"],
  ["ChunCheon Tango Marathon", "Chuncheon", "home"],
  ["Big Milonga -Estrellas-", "Suncheon", "home"],
  ["RoyBeDDong", "Busan", "home"],
  ["Champagne Milonga", "Seoul", "home"],
  // think 🤔
  ["Sapporo Tango Festival", "Sapporo", "think"],
  ["More than Tango Marathon & Festival & Cup", "Shanghai", "think"],
  // moreinfo ❓
  ["Nanjing Tango Festival", "Nanjing", "moreinfo"],
];
