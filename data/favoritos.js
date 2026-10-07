/*

favoritos.js : estado de los eventos favoritos (en data/, lo lee index.htm)

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
