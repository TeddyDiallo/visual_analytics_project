import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const RevByCountryBar = () => {
    const svgRef = useRef();
    const [data, setData] = useState([]);
    // Use this to track which country is expanded (if any), default is none and will generate main view
    const [expandedCountry, setExpandedCountry] = useState(null);
  
    // Fetch CSV Data
    useEffect(() => {
      d3.csv('/salesdata.csv').then((data) => {
        setData(data);
      });
    }, []);
  
    // Create the bar chart
    useEffect(() => {
      if (data.length > 0) {
        // Set size and basic attributes of visualization
        const svg = d3.select(svgRef.current)
          .attr('width', 800)
          .attr('height', 400)
          .style('background-color', '#f9f9f9')
          .style('overflow', 'visible');
  
        // Process data to group by country and state
        // Will be in the format: ["country", {total_revenue, [[state1, state1_revenue], [state2, state2_revenue],...]}]
        // So, every country will list 1) total revenue, and 2) a list of state/state-revenue tuples
        const processedData = d3.rollups(
          data,
          v => ({
            totalRevenue: d3.sum(v, d => +d['Revenue']),
            states: d3.rollups(v, stateData => d3.sum(stateData, d => +d['Revenue']), d => d['State'])
          }),
          d => d['Country']
        );
  
        // Sets up a view for revenue x country by leaving state tuples out of this separate data
        const categoryData = Array.from(processedData, ([country, { totalRevenue }]) => ({
          country,
          totalRevenue
        }));
  
        // X-scale setting countries on x axis from overview/country-only data
        const x = d3.scaleBand()
          .domain(categoryData.map(d => d.country))
          .range([0, 800])
          .padding(0.2);
  
        //Y-scale setting revenue on y axis
        const y = d3.scaleLinear()
          .domain([0, d3.max(categoryData, d => d.totalRevenue)])
          .range([400, 0]);
  
        // Clear previous elements
        svg.selectAll("*").remove();
  
        // Axes
        svg.append('g')
          .call(d3.axisBottom(x))
          .attr('transform', 'translate(0, 400)')
          .attr('color', 'black');
  
        svg.append('g')
          .call(d3.axisLeft(y))
          .attr('color', 'black');
  
        // Bars
        svg.selectAll('.bar')
          .data(categoryData)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', d => x(d.country))
          .attr('y', d => y(d.totalRevenue))
          .attr('width', x.bandwidth())
          .attr('height', d => 400 - y(d.totalRevenue))
          .attr('fill', 'steelblue')
          // Create an event on clicking the given bar to expand country data into states
          .on('click', (event, d) => {
            // Sets expanded country to the chosen country
            setExpandedCountry(d.country);
            // Runs the state display code
            displayStates(d.country, processedData);
          });
  
        // Display state breakdown or return to country view
        const displayStates = (country, data) => {
          // Search processed dataset and pull the total revenue and state/revenue tuples for each country
          const countryData = data.find(([c]) => c === country)[1];
          // Get the state tuples isolated from the country
          const states = countryData.states;

          // Don't bother expanding if there's no states, or only 1 state, listed. This will not be engaging or fun.
          if (states.length <= 1) {
            setExpandedCountry(null);
          }
          else {
  
            // Define x scale
            const stateX = d3.scaleBand()
              // Get state names for x axis
              .domain(states.map(d => d[0]))
              .range([0, 800])
              .padding(0.1);
  
            const stateY = d3.scaleLinear()
              // Max y val is max value of any state's revenue from the list of tuples
              .domain([0, d3.max(states, ([, revenue]) => revenue)])
              .range([400, 0]);
  
            // Transition the current bars out
            svg.selectAll('.bar')
              .transition()
              .duration(500)
              .attr('width', 0)
              .remove();
  
            // Update axes for states
            svg.selectAll("g").remove();
            svg.append('g')
              .call(d3.axisBottom(stateX))
              .attr('transform', 'translate(0, 400)')
              .attr('color', 'black');
  
            svg.append('g')
              .call(d3.axisLeft(stateY))
              .attr('color', 'black');
  
            // Create bars for states
            svg.selectAll('.state-bar')
              .data(states)
              .enter()
              .append('rect')
              .attr('class', 'state-bar')
              .attr('x', d => stateX(d[0]))
              .attr('y', d => stateY(d[1]))
              .attr('width', stateX.bandwidth())
              .attr('height', d => 400 - stateY(d[1]))
              .attr('fill', 'orange');
  
            // Back button to leave states view
            svg.append("text")
              .attr("x", 720)
              .attr("y", 30)
              .attr("class", "back-button")
              .style("cursor", "pointer")
              .style("fill", "red")
              .text("Back")
              .on("click", () => {
                // Reset expanded country when button is clicked
                setExpandedCountry(null); 
              });
            }
        };
      }
    }, [data, expandedCountry]);  // Re-render when data or expandedCountry changes
  
    return <svg ref={svgRef}></svg>;
  };
  
  export default RevByCountryBar;