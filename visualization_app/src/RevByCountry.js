import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

//TODO: FILTER BY REVENUE RANGE, ADJUST X AXIS LABELS
const RevByCountryBar = () => {
    const svgRef = useRef();
    const [data, setData] = useState([]);
    // Use this to track which country is expanded (if any), default is none and will generate main view
    const [expandedCountry, setExpandedCountry] = useState(null);
    // Use these to track and set the range of revenue vals to display
    const [minRevenue, setMinRevenue] = useState(0);
    const [maxRevenue, setMaxRevenue] = useState(12000000);
  
    // Fetch CSV Data
    useEffect(() => {
      d3.csv('/salesdata.csv').then((data) => {
        // This bit only exists because an unnamed country made like $600...
        const cleanedData = data.map(d => ({
          ...d,
          Country: d['Country'] ? d['Country'] : 'Other',
        })).filter(d => d['Country'] !== 'Other' || d['Revenue'] > 0);
        setData(cleanedData);
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
        // Will be in the format: [country, {total_revenue, [[state1, state1_revenue], [state2, state2_revenue],...]}]
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
        const countryData = Array.from(processedData, ([country, { totalRevenue }]) => ({
          country,
          totalRevenue
        }));

        // Determine here whether country or state view (need this bc of slider addition)
        if (!expandedCountry) {
          // Filter country data by revenue range (specified by sliders)
          const filteredData = countryData.filter(
            d => d.totalRevenue >= minRevenue && d.totalRevenue <= maxRevenue
          );
    
          // X-scale setting countries on x axis from overview/country-only data
          const x = d3.scaleBand()
            .domain(filteredData.map(d => d.country))
            .range([0, 800])
            .padding(0.2);
    
          //Y-scale setting revenue on y axis
          const y = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.totalRevenue)])
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
            .data(filteredData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.country))
            .attr('y', d => y(d.totalRevenue))
            .attr('width', x.bandwidth())
            .attr('height', d => 400 - y(d.totalRevenue))
            .attr('fill', 'rebeccapurple')
            .on('click', (event, d) => {
              // Sets expanded country to the chosen country (and prompts vis to refresh)
              setExpandedCountry(d.country);
            });
        }
        // And now the states view
        else {
          // Search processed dataset and pull the total revenue and state/revenue tuples for each country
          const countryData = processedData.find(([c]) => c === expandedCountry)[1];
          // Get the state tuples isolated from the country
          const states = countryData.states;
          // Filter states by revenue specified on sliders
          const filteredStates = states.filter(([, revenue]) => revenue >= minRevenue && revenue <= maxRevenue);
    
          // Don't bother expanding if there's no states, or only 1 state, listed. This will not be engaging or fun.
          if (states.length <= 1) {
            setExpandedCountry(null);
          }
          else {
            // Define x scale
            const stateX = d3.scaleBand()
              // Get state names for x axis
              .domain(filteredStates.map(d => d[0]))
              .range([0, 800])
              .padding(0.1);
  
            const stateY = d3.scaleLinear()
              // Max y val is max value of any state's revenue from the list of tuples
              .domain([0, d3.max(filteredStates, ([, revenue]) => revenue)])
              .range([400, 0]);


            // Transition out all existing elements so that state bars refresh properly
            svg.selectAll("*").remove();
            
            svg.append('g')
              .call(d3.axisBottom(stateX))
              .attr('transform', 'translate(0, 400)')
              .attr('color', 'black')
              .selectAll("text")
              .attr("transform", "rotate(-45)")
              .style("text-anchor", "end");

            svg.append('g')
              .call(d3.axisLeft(stateY))
              .attr('color', 'black');
  
            // Create bars for states
            svg.selectAll('.state-bar')
              .data(filteredStates)
              .enter()
              .append('rect')
              .attr('class', 'state-bar')
              .attr('x', d => stateX(d[0]))
              .attr('y', d => stateY(d[1]))
              .attr('width', stateX.bandwidth())
              .attr('height', d => 400 - stateY(d[1]))
              .attr('fill', 'mediumpurple');
    
            // Back button to leave states view
            svg.append("text")
              .attr("x", 720)
              .attr("y", 30)
              .attr("class", "back-button")
              .style("cursor", "pointer")
              .style("fill", "rebeccapurple")
              .text("Back")
              .on("click", () => {
                // Reset expanded country when button is clicked
                setExpandedCountry(null);
              });
            }
        }
      }
    }, [data, expandedCountry, minRevenue, maxRevenue]);  // Re-render when data, expandedCountry, or revenue range changes
  
    // Sliders are above chart
    // Name of slider is to the left of the slider,
    // value is below the slider
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <label>
                Min Revenue:
                <input
                  type="range"
                  min="0"
                  max="12000000"
                  value={minRevenue}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    // If the new value of minimum exceeds maximum, cap it
                    if (value <= maxRevenue) setMinRevenue(value);
                    else setMinRevenue(maxRevenue);
                  }}
                />
              </label>
              <div style={{ marginTop: '10px' }}>{minRevenue}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <label>
                Max Revenue:
                <input
                  type="range"
                  min="0"
                  max="12000000"
                  value={maxRevenue}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    // If the new value of maximum is below minimum, limit to min
                    if (value >= minRevenue) setMaxRevenue(value);
                    else setMaxRevenue(minRevenue);
                  }}
                />
              </label>
              <div style={{ marginTop: '10px' }}>{maxRevenue}</div>
            </div>
          </div>
        </div>
        <svg ref={svgRef}></svg>
      </div>
    );
  };
  
  export default RevByCountryBar;