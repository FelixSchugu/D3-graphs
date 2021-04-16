function colorTwo(val) {
  return val <= 2.7
    ? "#313695"
    : val >= 2.8 && val < 3.9
    ? "#4575b4"
    : val >= 3.9 && val < 5.0
    ? "#74add1"
    : val >= 5.0 && val < 6.1
    ? "#e0f3f8"
    : val >= 6.1 && val < 7.2
    ? "#e0f3f8"
    : val >= 7.2 && val < 8.3
    ? "#ffffbf"
    : val >= 8.3 && val < 9.5
    ? "#fee090"
    : val >= 9.5 && val < 10.6
    ? "#fdae61"
    : val >= 10.6 && val < 11.7
    ? "#f46d43"
    : val >= 11.7 && val < 12.8
    ? "#d73027"
    : val >= 12.9
    ? "#a50026"
    : "black";
}

var colors = [
  "#a50026",
  "#d73027",
  "#f46d43",
  "#fdae61",
  "#fee090",
  "#ffffbf",
  "#e0f3f8",
  "#abd9e9",
  "#74add1",
  "#4575b4",
  "#313695",
];

const date = new Date("2020");
date.setMinutes("20:55");
console.log(date);

const ranges = [
  "#acd45c",
  "#ecdc53",
  "#fbc304",
  "#fc8b1c",
  "#fb5334",
  "#d00d39",
  "#940c3c",
  "#531c4c",
];
