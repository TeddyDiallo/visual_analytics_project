import React, { useEffect } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import './MapsVisualization.css'; // Move styles from style.css here

const MapsVisualization = () => {
  useEffect(() => {
    const stateURL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
    const datasetURL = 'salesdata.csv'; // Place salesdata.csv in the public folder

    Promise.all([d3.json(stateURL), d3.csv(datasetURL)]).then(([topoData, csvData]) => {
      const stateData = topojson.feature(topoData, topoData.objects.states).features;

      const initialData = processData(csvData);
      drawMap('#heatmap', stateData, initialData);
      drawBubbleMap('#bubblemap', stateData, initialData);

      d3.select('#gender-filter').on('change', updateMaps);
      d3.select('#age-filter').on('change', updateMaps);

      function updateMaps() {
        const gender = d3.select('#gender-filter').node().value;
        const ageGroup = d3.select('#age-filter').node().value;

        const filteredData = processData(csvData, gender, ageGroup);
        drawMap('#heatmap', stateData, filteredData);
        drawBubbleMap('#bubblemap', stateData, filteredData);
      }
    });

    function processData(data, genderFilter = null, ageFilter = null) {
      // Logic from statescript.js to process data for filters
    }

    function drawMap(svgId, stateData, salesData) {
      // Logic from statescript.js to draw the heatmap
    }

    function drawBubbleMap(svgId, stateData, salesData) {
      // Logic from statescript.js to draw the bubble map
    }
  }, []);

  return (
    <div className="maps-visualization">
      <h2>Side-by-Side US Maps: Demographics and Profit Analysis</h2>

      {/* Filters Section */}
      <div id="filters">
        <label htmlFor="gender-filter">Gender:</label>
        <select id="gender-filter">
          <option value="all">All</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
        <label htmlFor="age-filter">Age Group:</label>
        <select id="age-filter">
          <option value="all">All</option>
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36-50">36-50</option>
          <option value="51+">51+</option>
        </select>
        <button id="toggle-legend">Hide Legend</button>
      </div>

      {/* Maps Section */}
      <div id="map-container">
        <div id="map1">
          <h3>Population</h3>
          <svg id="heatmap"></svg>
          <div className="legend" id="heatmap-legend">Legend for Population Map</div>
        </div>
        <div id="map2">
          <h3>Profit</h3>
          <svg id="bubblemap"></svg>
          <div className="legend" id="bubblemap-legend">Legend for Profit Map</div>
        </div>
      </div>

      {/* Time Series Section */}
      <div id="time-series-container">
        <h3>Time Series Analysis</h3>
        <div id="time-series-controls"></div>
        <svg id="time-series-chart"></svg>
      </div>
    </div>
  );
};

export default MapsVisualization;
