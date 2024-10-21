// src/BarChart.js
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const BarChart = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  // Fetch CSV Data
  useEffect(() => {
    d3.csv('/salesdata.csv').then((data) => {
      setData(data);
    });
  }, []);

  // Create the bar chart
  useEffect(() => {
    if (data.length > 0) {
      const svg = d3.select(svgRef.current)
        .attr('width', 800)
        .attr('height', 400)
        .style('background-color', '#f9f9f9')
        .style('overflow', 'visible');

      // Extract relevant data (e.g., Product Category and Quantity)
      const processedData = d3.rollup(
        data,
        v => d3.sum(v, d => +d['Quantity']),
        d => d['Product Category']
      );

      const categoryData = Array.from(processedData, ([category, quantity]) => ({
        category, quantity
      }));

      const x = d3.scaleBand()
        .domain(categoryData.map(d => d.category))
        .range([0, 800])
        .padding(0.2);

      const y = d3.scaleLinear()
        .domain([0, d3.max(categoryData, d => d.quantity)])
        .range([400, 0]);

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
        .attr('x', d => x(d.category))
        .attr('y', d => y(d.quantity))
        .attr('width', x.bandwidth())
        .attr('height', d => 400 - y(d.quantity))
        .attr('fill', 'steelblue');
    }
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default BarChart;
