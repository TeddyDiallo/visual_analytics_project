import React, { useState } from 'react';
import './App.css';
import RevByCountryBar from './RevByCountry';
//import QuantPriceLine from './QuantByPrice';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

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
          <li onClick={() => alert('Teddy Diallo, Nandini, Chelsea')}>Team Members</li>
          <li onClick={() => alert('This is a dashboard that visualizes sales data. It provides insights into the sales performance of different products and categories.')}>About</li>
        </ul>
      </nav>
      
      <h1 className="page-title">Sales Data Dashboard</h1>

      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
  <button onClick={toggleSidebar} className="collapse-btn">
    {sidebarCollapsed ? '>' : '<'}
  </button>
  {!sidebarCollapsed && (
    <ul>
      <li onClick={() => scrollToSection('bar-chart-section')}>Revenue by Country</li>
      <li onClick={() => scrollToSection('visualization-2')}> Demographics & Profitability</li>
      <li onClick={() => scrollToSection('visualization-3')}>Visualization 3</li>
    </ul>
  )}
</div>

      {/* Main content */}
      <div className="content">
        <div id="bar-chart-section">
          <h2>Bar Chart: Revenue by Country</h2>
          <RevByCountryBar />
          
          {/* Explanation Section */}
          <div className="explanation">
            <button onClick={() => setShowExplanation(!showExplanation)}>
              {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
            </button>
            {showExplanation && (
              <p>
                This bar chart represents the revenue from each country listed in the dataset. For any
                countries with states or provinces, click on the bar to expand the revenue view to statewise.
              </p>
            )}
          </div>

        <div id="visualization-2">
          <h2>Visualization 2: Placeholder</h2>
          <p>This is where the second visualization will go.</p>
        </div>

        <div id="visualization-3">
          <h2>Visualization 3: Placeholder</h2>
          <p>This is where the third visualization will go.</p>
        </div>          
          
      </div>
    </div>
  </div>
  );
}

export default App;
