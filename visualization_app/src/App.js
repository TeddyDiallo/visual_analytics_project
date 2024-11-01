import React, { useState } from 'react';
import './App.css';
import BarChart from './components/BarChart';
import ChoroplethMap from './components/ChoroplethMap';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showBarChartExplanation, setShowBarChartExplanation] = useState(false);
  const [showMapExplanation, setShowMapExplanation] = useState(false);

  // Handle sidebar collapse/expand
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Scroll to specific visualization
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="App">

      {/* Navbar */}
      <nav className="navbar">
        <ul>
          <li onClick={() => alert('Nandini, Chelsea, Teddy')}>Team Members</li>
          <li onClick={() => alert('This is our visualization project about customer data.')}>About</li>
        </ul>
      </nav>
      
      {/* Title */}
      <h1 className="page-title">Sales Data Dashboard</h1>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <button onClick={toggleSidebar} className="collapse-btn">
          {sidebarCollapsed ? '>' : '<'}
        </button>
        {!sidebarCollapsed && (
          <ul>
            <li onClick={() => scrollToSection('bar-chart-section')}>Visualization 1</li>
            <li onClick={() => scrollToSection('choropleth-map-section')}>Visualization 2</li>
            {/* Add more visualizations here */}
          </ul>
        )}
      </div>

      {/* Main content */}
      <div className="content">
        {/* Bar Chart Section */}
        <div id="bar-chart-section">
          <h2>Bar Chart: Product Quantity by Category</h2>
          <BarChart />
          
          {/* Explanation Section */}
          <div className="explanation">
            <button onClick={() => setShowBarChartExplanation(!showBarChartExplanation)}>
              {showBarChartExplanation ? 'Hide Explanation' : 'Show Explanation'}
            </button>
            {showBarChartExplanation && (
              <p>
                This bar chart represents the quantity of products sold across different product categories.
                It gives insights into which categories perform better in terms of sales volume.
              </p>
            )}
          </div>
        </div>

        {/* Choropleth Map Section */}
        <div id="choropleth-map-section">
          <h2>Choropleth Map</h2>
          <ChoroplethMap />
          
          {/* Explanation Section */}
          <div className="explanation">
            <button onClick={() => setShowMapExplanation(!showMapExplanation)}>
              {showMapExplanation ? 'Hide Explanation' : 'Show Explanation'}
            </button>
            {showMapExplanation && (
              <p>
                This choropleth map visualizes the number of customers in each state of the United States.
              </p>
            )}
          </div>
        </div>

        {/* Future visualizations would go here */}
      </div>
    </div>
  );
}

export default App;