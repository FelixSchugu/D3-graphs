const countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

const educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let educationData;

let canvas = d3.select("#canvas");

let drawMap = () => {
  canvas
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("fill", (countyDataItem) => {
      let id = countyDataItem["id"];
      let county = educationData.find((item) => {
        return item["fips"] === id;
      });
      let percentage = county["bachelorsOrHigher"];

      if (percentage <= 15) {
        return "tomato";
      } else if (percentage <= 30) {
        return "orange";
      } else if (percentage <= 45) {
        return "lightgreen";
      } else {
        return "limegreen";
      }
    })
    .attr("d", d3.geoPath())
    .attr("class", "county");
};

d3.json(countyURL).then((data, error) => {
  if (error) {
    console.log(log);
  } else {
    countyData = topojson.feature(data, data.objects.counties).features;
    console.log(countyData);

    d3.json(educationURL).then((data, error) => {
      if (error) {
        console.log(log);
      } else {
        educationData = data;
        console.log(educationData);
        drawMap();
      }
    });
  }
})
