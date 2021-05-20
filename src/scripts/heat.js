fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((response) => response.json())
  .then((d) => {
    var data = Object.values(d["monthlyVariance"]);
    main(data);
  });

function main(data) {
  var years = data.map((d, i) => new Date(d.year + " " + d.month));
  document.getElementById("description").innerText =
    "" + data[0].year + " - " + data[data.length - 1].year;

  var maxMonths = new Date(d3.max(years));
  maxMonths.setMonth(maxMonths.getMonth() + 3);

  const h = 420;
  const w = 1450;
  const padding = 30;
  const firstYear = data[0].year;
  const baseTemperature = 8.66;
  const rangeColors = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.9];

  
  const xScale = d3
    .scaleTime()
    .domain([d3.min(data, (d) => d.year) - 1, d3.max(data, (d) => d.year)])
    .range([padding - 2, w - padding - 73]);

  const yScale = d3
    .scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .range([h - padding, padding]);

  const xAxis = d3
    .axisBottom(xScale)
    .scale(xScale)
    .tickFormat(d3.format("d"))
    .tickSizeOuter(0);

  const yAxis = d3
    .axisLeft(yScale)
    .tickValues(yScale.domain())
    .tickFormat((month) => {
      var date = new Date(0);
      date.setUTCMonth(month);
      return d3.time.format.utc("%B")(date);
    });

  var tooltip = d3
    .select("div")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", "0");

  const svg = d3
    .select(document.getElementById("main"))
    .append("svg")
    .attr("width", w)
    .attr("height", h + 200);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(" + 45 + "," + (h - padding) + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", "translate(" + (padding + 45) + ",0)")
    .attr("id", "y-axis")
    .call(yAxis);

  const rect = svg
    .selectAll("svg")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("id", "bar")
    .attr("data-year", (d, i) => d.year)
    .attr("data-month", (d, i) => d.month - 1)
    .attr("data-temp", (d, i) => baseTemperature + d.variance);

  rect
    .attr("width", 5)
    .attr("height", 30)
    .attr("fill", (d, i) => {
      return pickColor(baseTemperature + d.variance);
    })
    .attr("x", (d, i) => {
      return (d.year - firstYear + 15.2) * 5;
    })
    .attr("y", (d, i) => {
      return h - 30.5 - d.month * 30;
    });

  rect
    .on("mouseover", (d, i) => {
      var date = new Date(0);
      date.setUTCMonth(i.month);
      d3.time.format.utc("%B")(date);

      tooltip.transition().duration(100).style("opacity", "1");
      tooltip.html(
        "Year: " +
          i.year +
          "<br>" +
          "Month: " +
          d3.time.format.utc("%B")(date) +
          "<br>" +
          "Var: " +
          parseFloat(Math.round(i.variance * 100) / 100).toFixed(2) +
          "°C" +
          "<br>" +
          "Temp: " +
          parseFloat(
            Math.round((baseTemperature + i.variance) * 100) / 100
          ).toFixed(2) +
          "°C"
      );
      tooltip.attr("data-year", i.year);
      tooltip
        .style("top", h - 30 - i.month * 30 + "px")
        .style("left", (i.year - firstYear + 15.2) * 5 + "px");
    })
    .on("mouseout", (d) => {
      tooltip.transition().style("opacity", 0).style("pointer-events", "none");
      tooltip.hide;
    });

  const legend = svg.append("g").attr("id", "legend");

  legend
    .append("g")
    .selectAll("rect")
    .data(rangeColors.reverse())
    .enter()
    .append("rect")
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("class", "legend-rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("y", (d, i) => h - (i - 9) * 18)
    .attr("x", 100)
    .attr("fill", (d, i) => pickColor(d));

  legend
    .append("g")
    .selectAll("text")
    .data(rangeColors)
    .enter()
    .append("text")
    .attr("y", (d, i) => h - (i - 9.7) * 18)
    .attr("x", 130)
    .text((d, i) => {
      console.log(rangeColors[i + 1]);
      return d === 2.8
        ? "Lower than " + d + "°C"
        : d === 12.9
        ? "Higher than " + d + "°C"
        : "Between " + d + "°C " + " and " + rangeColors[i - 1] + "°C";
    });
}

function pickColor(val) {
  return val <= 2.7
    ? "#313695"
    : val >= 2.8 && val < 3.9
    ? "#4575b4"
    : val >= 3.9 && val < 5.0
    ? "#74add1"
    : val >= 5.0 && val < 6.1
    ? "#abd9e9"
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
