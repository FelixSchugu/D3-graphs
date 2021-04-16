const main = (counties, edu) => {
  console.log("todo ok!");

  const svg = d3
    .select("svg")
    .attr("width", 1100)
    .attr("height", 600)
    .attr("class", "container");

  const colorPalette = d3
    .scaleQuantize()
    .domain([
      d3.min(edu, (d, i) => d.bachelorsOrHigher),
      d3.max(edu, (d, i) => d.bachelorsOrHigher),
    ])
    .range([
      "#acd45c",
      "#ecdc53",
      "#fbc304",
      "#fc8b1c",
      "#fb5334",
      "#d00d39",
      "#940c3c",
      "#531c4c",
    ]);

  const tooltip = d3
    .select("div")
    .append("div")
    .style("opacity", "0")
    .attr("id", "tooltip");

  // While statement that calculate all the domain with decimal accuracy

  let count = 0;
  let color = "#acd45c";
  let percentajes = [];
  percentajes.push(0);
  while (count <= 77.9) {
    count += 0.1;
    if (colorPalette(count) !== color) {
      percentajes.push(count);
      color = colorPalette(count);
    }
  }

  svg
    .selectAll("path")
    .data(counties)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("fill", (e, i) => {
      let c = edu.find((d) => d.fips === e.id);
      return colorPalette(c.bachelorsOrHigher);
    })
    .attr("class", "county")
    .attr("data-fips", (e, i) => {
      let c = edu.find((d) => d.fips === e.id);
      return c.fips;
    })
    .attr("data-education", (e, i) => {
      let c = edu.find((d) => d.fips === e.id);
      return c.bachelorsOrHigher;
    })
    .attr("stroke", "black")
    .attr("stroke-width", "0.3")
    .on("mouseover", (d, i) => {

      let c = edu.find((d) => d.fips === i.id);
      tooltip.attr("data-education", c.bachelorsOrHigher);
      tooltip.transition().duration(200).style("opacity", "1");

      tooltip
        .html(
          "County: " +
            c.area_name +
            "<br>" +
            "People with Bachelor title or higher: " +
            c.bachelorsOrHigher +
            "%"
        )
        .style("top", d3.pointer(d)[1] + "px")
        .style("left", d3.pointer(d)[0] + "px");
    });

  svg.on("mouseout", (d, i) => {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", "0")
      .style("pointer-events", "none");
    tooltip.hide;
  });
  const legend = svg.append("g").attr("id", "legend");

  legend
    .append("g")
    .selectAll("rect")
    .data(colorPalette.range())
    .enter()
    .append("rect")
    .attr("x", 900)
    .attr("y", (e, i) => {
      let h = 250;
      return h + i * 22;
    })
    .attr("ry", 2)
    .attr("rx", 2)
    .attr("stroke", "#01200F")
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", (e, i) => {
      return colorPalette(percentajes[i]);
    });

  legend
    .append("g")
    .selectAll("text")
    .data(percentajes)
    .enter()
    .append("text")
    .style("font-size", 20)
    .attr("x", 925)
    .attr("y", (e, i) => {
      let h = 265;
      return h + i * 22.5;
    })
    .text((d) => ">= " + Math.floor(d.toFixed(1)) + "%");
};

const COUNTY_API =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

const EDUCATIONAL_API =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

d3.json(COUNTY_API).then((data, error) => {
  let countData;
  let eduData;

  if (error) {
    return console.log("Impossible to connect");
  } else {
    countData = topojson.feature(data, data.objects.counties).features;
    d3.json(EDUCATIONAL_API).then((data, error) => {
      if (error) {
        return console.log("Impossible to connect");
      } else {
        eduData = data;
        main(countData, eduData);
      }
    });
  }
});
