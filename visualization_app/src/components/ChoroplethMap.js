import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './ChoroplethMap.css';

const ChoroplethMap = () => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 960;
    const height = 600;

    const projection = d3.geoAlbersUsa().translate([width / 2, height / 2]).scale([1000]);
    const path = d3.geoPath().projection(projection);

    const color = d3.scaleQuantize([0, 1000], d3.schemeBlues[9]);

    Promise.all([
      d3.json('/us-states.json'),
      d3.csv('/salesdata.csv')
    ]).then(([usStates, data]) => {
      console.log('GeoJSON data:', usStates);
      console.log('CSV data:', data);

      // Process the CSV data to count customers per state
      const stateData = {};
      data.forEach(d => {
        if (d.country === 'United States') {
          const state = d.state;
          if (stateData[state]) {
            stateData[state] += 1;
          } else {
            stateData[state] = 1;
          }
        }
      });

      console.log('Processed state data:', stateData);

      // Compute the domain for the color scale
      const maxCustomers = d3.max(Object.values(stateData));
      color.domain([0, maxCustomers]);

      // Render the map
      svg.append('g')
        .selectAll('path')
        .data(usStates.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', d => color(stateData[d.properties.name] || 0))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .append('title')
        .text(d => `${d.properties.name}: ${stateData[d.properties.name] || 0} customers`);

      console.log('Map rendered');
    }).catch(error => {
      console.error('Error loading data:', error);
    });
  }, []);

  return <svg ref={svgRef} width="960" height="600"></svg>;
};

export default ChoroplethMap;