// src/pages/PreviewPage.jsx - Preview functionality
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PreviewPage = () => {
  const navigate = useNavigate();
  const [websiteElements, setWebsiteElements] = useState([]);
  const [websiteData, setWebsiteData] = useState(null);
  const [viewportSize, setViewportSize] = useState('desktop');
  
  useEffect(() => {
    // Retrieve the current elements from localStorage
    const storedElements = localStorage.getItem('websiteElements');
    const storedData = localStorage.getItem('websiteData');
    
    if (storedElements) {
      setWebsiteElements(JSON.parse(storedElements));
    }
    
    if (storedData) {
      setWebsiteData(JSON.parse(storedData));
    }
  }, []);
  
  const handleBack = () => {
    navigate('/builder');
  };
  
  if (!websiteData) {
    return <div className="loading">Loading preview...</div>;
  }
  
  return (
    <div className="preview-container">
      <header className="preview-header">
        <button className="btn" onClick={handleBack}>
          Back to Editor
        </button>
        <div className="device-switcher">
          <button 
            className={`btn icon-btn ${viewportSize === 'mobile' ? 'active' : ''}`}
            onClick={() => setViewportSize('mobile')}
          >
            📱
          </button>
          <button 
            className={`btn icon-btn ${viewportSize === 'tablet' ? 'active' : ''}`}
            onClick={() => setViewportSize('tablet')}
          >
            📔
          </button>
          <button 
            className={`btn icon-btn ${viewportSize === 'desktop' ? 'active' : ''}`}
            onClick={() => setViewportSize('desktop')}
          >
            🖥️
          </button>
        </div>
      </header>
      
      <div className={`preview-frame ${viewportSize}`}>
        <div className="preview-content">
          <h1>{websiteData.businessName}</h1>
          <p>{websiteData.description}</p>
          
          {/* Render the elements as they would appear on the real website */}
          <div className="preview-elements">
            {websiteElements.map((element) => (
              <div 
                key={element.id}
                className={`preview-element preview-${element.type}`}
                style={{
                  position: 'absolute',
                  left: `${element.position.x}px`,
                  top: `${element.position.y}px`,
                  ...element.styles
                }}
              >
                {element.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;