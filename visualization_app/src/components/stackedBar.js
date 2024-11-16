// // code for static stacked bar chart
// // Set the dimensions and margins of the graph
// var margin = {top: 80, right: 150, bottom: 60, left: 80},
//     width = 1000 - margin.left - margin.right,
//     height = 600 - margin.top - margin.bottom;

// // Append the svg object to the body of the page
// var svg = d3.select("#chart")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// // Load data from CSV file
// d3.csv("Age_Group_Spending_by_Country.csv").then(function(data) {

//   // Cast revenue to numeric and ensure valid entries
//   data.forEach(function(d) {
//     d.Revenue = +d.Revenue || 0;
//   });

//   // Get unique age groups and countries
//   var subgroups = Array.from(new Set(data.map(d => d["Age Group"])));
//   var countries = Array.from(new Set(data.map(d => d.Country)));

//   // Prepare the data for stacking
//   var groupedData = d3.groups(data, d => d.Country);
//   var stackData = groupedData.map(([key, values]) => {
//     var entry = {Country: key};
//     values.forEach(v => {
//       entry[v["Age Group"]] = v.Revenue;
//     });
//     return entry;
//   });

//   // Set up the X axis (countries)
//   var x = d3.scaleBand()
//       .domain(countries)
//       .range([0, width])
//       .padding([0.2]);

//   svg.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x).tickSize(0))
//       .selectAll("text")
//       .attr("transform", "translate(-10,0)rotate(-45)")
//       .style("text-anchor", "end");

//   // Set up the Y axis (revenue scale)
//   var maxRevenue = d3.max(data, d => d.Revenue);
//   var y = d3.scaleLinear()
//       .domain([0, maxRevenue])  // Use the actual max revenue value
//       .range([height, 0]);

//   svg.append("g")
//       .call(d3.axisLeft(y));

//   // Y-axis label
//   svg.append("text")
//       .attr("text-anchor", "middle")
//       .attr("transform", "rotate(-90)")
//       .attr("x", -height / 2)
//       .attr("y", -margin.left / 1.5)
//       .style("font-size", "16px")
//       .text("Revenue");

//   // X-axis label
//   svg.append("text")
//       .attr("text-anchor", "middle")
//       .attr("x", width / 2)
//       .attr("y", height + margin.bottom / 1.2)
//       .style("font-size", "16px")
//       .text("Country");

//   // Color scale for age groups
//   var color = d3.scaleOrdinal()
//       .domain(subgroups)
//       .range(d3.schemeSet2);

//   // Stack the data
//   var stackedData = d3.stack()
//       .keys(subgroups)
//       (stackData);

//   // Show the bars
//   svg.append("g")
//     .selectAll("g")
//     .data(stackedData)
//     .enter().append("g")
//       .attr("fill", function(d) { return color(d.key); })
//     .selectAll("rect")
//     .data(function(d) { return d; })
//     .enter().append("rect")
//       .attr("x", function(d) { return x(d.data.Country); })
//       .attr("y", function(d) { return y(d[1]); })
//       .attr("height", function(d) { return y(d[0]) - y(d[1]); })
//       .attr("width", x.bandwidth());

//   // Add a legend for the Age Groups
//   var legend = svg.append("g")
//       .attr("transform", "translate(" + (width + 30) + "," + 10 + ")");

//   subgroups.forEach(function(subgroup, i) {
//     legend.append("rect")
//         .attr("x", 0)
//         .attr("y", i * 20)
//         .attr("width", 10)
//         .attr("height", 10)
//         .style("fill", color(subgroup));

//     legend.append("text")
//         .attr("x", 20)
//         .attr("y", i * 20 + 9)
//         .text(subgroup)
//         .style("font-size", "12px")
//         .attr("alignment-baseline", "middle");
//   });

//   // Add a title to the chart after bars are drawn
//   svg.append("text")
//       .attr("x", (width / 2))             
//       .attr("y", 0 - (margin.top / 2))
//       .attr("text-anchor", "middle")  
//       .style("font-size", "24px") 
//       .style("text-decoration", "bold")  
//       //.text("Age Group Spending By Country");

// });




// code for interactive stacked bar chart
// Declare dimensions and margins globally
var margin = { top: 80, right: 150, bottom: 60, left: 80 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Append the svg object to the body of the page
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
d3.csv("Age_Group_Spending_by_Country.csv").then(function (data) {
  // Cast revenue to numeric and ensure valid entries
  data.forEach(function (d) {
      d.Revenue = +d.Revenue || 0;
  });

  // Get unique age groups and countries
  const subgroups = Array.from(new Set(data.map(d => d["Age Group"])));
  const countries = Array.from(new Set(data.map(d => d.Country)));

  // Prepare the data for stacking
  const groupedData = d3.groups(data, d => d.Country);
  const stackData = groupedData.map(([key, values]) => {
      const entry = { Country: key };
      subgroups.forEach(subgroup => {
          entry[subgroup] = values.find(v => v["Age Group"] === subgroup)?.Revenue || 0;
      });
      return entry;
  });

  console.log("Prepared Stack Data:", stackData);

  // Set up the X axis (countries)
  const x = d3.scaleBand()
      .domain(countries)
      .range([0, width])
      .padding([0.2]);

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Set up the Y axis (revenue scale)
  const maxRevenue = d3.max(data, d => d.Revenue);
  const y = d3.scaleLinear()
      .domain([0, maxRevenue])
      .range([height, 0]);

  svg.append("g").call(d3.axisLeft(y));

  // Color scale for age groups
  const color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(d3.schemeSet2);

  // Stack the data
  const stackedData = d3.stack().keys(subgroups)(stackData);

  // Function to update the chart
  function updateChart(filteredSubgroups) {
      const filteredStackedData = d3.stack().keys(filteredSubgroups)(stackData);

      const bars = barsGroup.selectAll("g.layer")
          .data(filteredStackedData);

      // Remove old layers
      bars.exit().remove();

      // Add new layers
      bars.enter()
          .append("g")
          .classed("layer", true)
          .attr("fill", d => color(d.key))
          .merge(bars)
          .selectAll("rect")
          .data(d => d)
          .join("rect")
          .attr("x", d => x(d.data.Country))
          .attr("y", d => y(d[1]))
          .attr("height", d => y(d[0]) - y(d[1]))
          .attr("width", x.bandwidth());
  }

  // Add the bars
  const barsGroup = svg.append("g");
  updateChart(subgroups);

  // Add a legend for the Age Groups
  const legend = svg.append("g")
      .attr("transform", "translate(" + (width + 30) + "," + 10 + ")");

  let activeGroup = null;

  subgroups.forEach(function (subgroup, i) {
      legend.append("rect")
          .attr("x", 0)
          .attr("y", i * 20)
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", color(subgroup))
          .style("cursor", "pointer")
          .on("click", function () {
              if (activeGroup === subgroup) {
                  activeGroup = null; // Reset if the same group is clicked
                  updateChart(subgroups);
                  legend.selectAll("rect").style("opacity", 1); // Reset legend opacity
              } else {
                  activeGroup = subgroup;
                  updateChart([subgroup]); // Show only the selected group
                  legend.selectAll("rect")
                      .style("opacity", d => (d === subgroup ? 1 : 0.5));
              }
          });

      legend.append("text")
          .attr("x", 20)
          .attr("y", i * 20 + 9)
          .text(subgroup)
          .style("font-size", "12px")
          .attr("alignment-baseline", "middle")
          .style("cursor", "pointer")
          .on("click", function () {
              if (activeGroup === subgroup) {
                  activeGroup = null; // Reset if the same group is clicked
                  updateChart(subgroups);
                  legend.selectAll("rect").style("opacity", 1); // Reset legend opacity
              } else {
                  activeGroup = subgroup;
                  updateChart([subgroup]); // Show only the selected group
                  legend.selectAll("rect")
                      .style("opacity", d => (d === subgroup ? 1 : 0.5));
              }
          });
  });

  // Add a title to the chart
  svg.append("text")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("text-decoration", "bold")
      .text("Age Group Spending By Country");
});
