fetch(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
)
  .then((response) => response.json())
  .then((data) => {
    let movies = data;
    main(movies);
  });

const main = (movies) => {
  const formatedData = d3
    .hierarchy(movies, (n) => n.children)
    .sum((n) => n.value)
    .sort((n1, n2) => n2.value - n1.value);

  const treemap = d3.treemap().size([1000, 600]).padding(2);
  treemap(formatedData);

  const svg = d3.select("#map");
  const movieTiles = formatedData.leaves();

  const tooltip = d3
    .select("div")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", "0");

  const section = svg
    .selectAll("g")
    .data(movieTiles)
    .enter()
    .append("g")
    .attr("transform", (d) => "translate(" + d.x0 + "," + d.y0 + ")");

  section
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (d) => fillColor(d.data.category))
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value);

  section
    .on("mouseover", (d, m) => {
      tooltip.attr("data-value", m.data.value);
      tooltip.transition().duration(200).style("opacity", "1");
      tooltip.html(
        "Movie name: " +
          m.data.name +
          "<br>" +
          "Genre: " +
          m.data.category +
          "<br>" +
          "Worth: " +
          m.data.value
      );

      tooltip.style("top", d.screenY + "px").style("left", d.screenX + "px");
    })
    .on("mouseout", (d) => {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", "0")
        .style("pointer-events", "none");
      tooltip.hide;
    });

  section
    .append("text")
    .selectAll("tspan")
    .data((d) => d.data.name.split(" "))
    .enter()
    .append("tspan")
    .attr("x", 5)
    .attr("y", (d, i) => 13 + i * 10)
    .attr("font-size", "10")
    .attr("fill", "white")
    .text((d) => d);

  const legendSvg = d3.select("#legend");
  const legend = legendSvg.append("g").attr("id", "legend");

  let legendCategory = [];

  for (e in movieTiles) {
    let cat = movieTiles[e].data.category;
    if (legendCategory.indexOf(cat) === -1) legendCategory.push(cat);
  }

  legend
    .append("g")
    .selectAll("rect")
    .data(legendCategory)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .attr("x", (d, i) => i * 120 + 25)
    .attr("y", 15)
    .attr("width", 20)
    .attr("height", 20)
    .attr("stroke", "gray")
    .attr("fill", (d) => fillColor(d));

  legend
    .append("g")
    .selectAll("text")
    .data(legendCategory)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * 120 + 55)
    .attr("y", 30)
    .text((d) => d);
};

const fillColor = (category) => {
  let colors = {
    Action: "#1F271B",
    Drama: "#19647E",
    Adventure: "#28AFB0",
    Family: "#F4D35E",
    Animation: "#EE964B",
    Comedy: "#9C0D38",
    Biography: "#1C464D",
  };
  return category in colors ? colors[category] : "black";
};
