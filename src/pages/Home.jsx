import React from "react";
import { useNavigate } from "react-router-dom"; 
import './Home.css'; 
import laptop from '../assets/lap2.png';

const Home = () => {
  const navigate = useNavigate(); 

  const handleNavigation = () => {
    navigate("/data"); 
  };

  const handleNavigation2 = () => {
    navigate("/report"); 
  };

  const handleNavigation3 = () => {
    navigate("/llm"); 
  };

  const handleAdminPageNavigation = () => {
    navigate("/AdminPage"); // Navigates to the Admin page
  };

  return (
    <div className="container">
      <div className="open">
        <div className="layer"></div>
        <div className="layer"></div>
      </div>

      <section className="content-section">
        <div className="banner-text">
          <h2>Laptop Database Integration</h2>
          <br />
          <h3>Seamlessly Merge Laptop Databases for Enhanced Insights</h3>
          <p>
            In today's digital landscape, accessing comprehensive and accurate information is crucial for making informed decisions. Our project focuses on integrating multiple laptop databases into a single, cohesive system. By merging data from various sources, we aim to provide users with a unified platform that offers detailed specifications, pricing comparisons, and availability across different retailers. 
            <br />
            The integration will not only streamline the search process but also incorporate advanced features such as personalized recommendations and trend analysis. This project is designed to empower users with the tools they need to find the perfect laptop tailored to their needs and preferences.
          </p>
          <button 
            onClick={handleNavigation} 
            className="navigate-btn"
          >
            Search Laptops
          </button>
          <button 
            onClick={handleNavigation2} 
            className="navigate-btn2"
          >
            Report
          </button>
          <button 
            onClick={handleNavigation3} 
            className="navigate-btn2"
          >
            Try LLM
          </button>
          
          {/* Button to navigate to Admin Page */}
          <button 
            onClick={handleAdminPageNavigation} 
            className="navigate-btn2"
          >
            Admin Dashboard
          </button>
        </div>

        <div className="image-container">
          <img src={laptop} alt="Laptop" />
        </div>
      </section>
    </div>
  );
};

export default Home;
