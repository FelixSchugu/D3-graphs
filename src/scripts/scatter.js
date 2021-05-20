fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((response) => response.json())
  .then((d) => {
    var data = Object.values(d);
    main(data);
  });

const main = (data) => {
  const height = 400;
  const width = 800;
  const padding = 30;

  const yScale = d3
    .scaleTime()
    .domain([
      new Date("January 1, 2020 00:" + d3.min(data, (d, i) => d.Time)),
      new Date("January 1, 2020 00:" + d3.max(data, (d, i) => d.Time)),
    ])
    .range([height - padding, padding]);

  const xScale = d3
    .scaleTime()
    .domain([
      d3.min(data, (d, i) => d.Year) - 1,
      d3.max(data, (d, i) => d.Year),
    ])
    .range([padding, width - padding]);

  const svg = d3
    .select(document.getElementById("main"))
    .append("svg")
    .attr("width", width)
    .attr("height", height + 25);

  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  const tooltip = d3
    .select("div")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", "0");

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("class", "y-a")
    .attr("transform", "translate(" + (padding + 10) + ",0)");

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("class", "x-a")
    .attr(
      "transform",
      "translate(" + (padding - 20) + "," + (height - padding) + ")"
    );

  const circle = svg
    .selectAll("svg")
    .data(data)
    .enter()
    .append("circle")
    .attr("fill", (d, i) => (d.Doping.length > 1 ? "#72B01D" : "#454955"))
    .attr("class", "dot")
    .attr("width", 10)
    .attr("height", 10)
    .attr("cy", (d, i) => yScale(new Date("January 1, 2020 00:" + d.Time)))
    .attr("cx", (d, i) => xScale(d.Year))
    .attr("r", 5)
    .attr("data-xvalue", (d, i) => d.Year)
    .attr("data-yvalue", (d, i) =>
      new Date("January 1, 2020 00:" + d.Time).toISOString()
    );

  circle
    .on("mouseover", (d) => {
      let doping = d.Doping.length > 0 ? "Doping: " + d.Doping : "No doping allegations";

      tooltip.attr("data-year", d.Year);
      tooltip.transition().duration(100).style("opacity", "1");
      tooltip
        .style("left", xScale(d.Year) + 50 + "px")
        .style(
          "top",
          yScale(new Date("January 1, 2020 00:" + d.Time)) + 10 + "px"
        );
      tooltip.html(
        "Name: " +
          d.Name +
          "<br>" +
          "Place: " +
          d.Place +
          "<br>" +
          "Time: " +
          d.Time +
          "<br>" +
          "Seconds: " +
          d.Seconds +
          "<br>" +
          "Year: " +
          d.Year +
          "<br>" +
          "Nacionality: " +
          d.Nationality +
          "<br>" +
          doping +
          "<br>"
      );
    })
    .on("mouseout", (d) => {
      tooltip.transition().style("opacity", 0).style("pointer-events", "none");
      tooltip.hide;
    });

  svg
    .append("g")
    .append("text")
    .attr("y", 20)
    .attr("x", 8)
    .text("Min")
    .attr("fill", "gray");

  svg
    .append("g")
    .append("text")
    .attr("x", width / 2)
    .attr("y", 412)
    .attr("fill", "gray")
    .attr("font-size", 20)
    .text("Years");

  svg
    .append("g")
    .append("text")
    .attr("id", "legend")
    .attr("x", 550)
    .attr("y", 280)
    .attr("fill", "#F3EFF5")
    .text("No doping allegations");

  svg
    .append("g")
    .append("text")
    .attr("x", 550)
    .attr("y", 250)
    .attr("fill", "#F3EFF5")
    .text("With doping allegations");

  svg
    .append("g")
    .append("rect")
    .attr("x", 760)
    .attr("y", 232)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "#72B01D");

  svg
    .append("g")
    .append("rect")
    .attr("x", 760)
    .attr("y", 262)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "#454955");
};
