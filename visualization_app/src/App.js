import React, { useState } from 'react';
import './App.css';
import BarChart from './components/BarChart';

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
            <button onClick={() => setShowExplanation(!showExplanation)}>
              {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
            </button>
            {showExplanation && (
              <p>
                This bar chart represents the quantity of products sold across different product categories.
                It gives insights into which categories perform better in terms of sales volume.
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