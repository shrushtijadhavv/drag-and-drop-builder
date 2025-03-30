// src/pages/BuilderPage.jsx - Wrapper for the Builder component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Builder from '../components/Builder';

const BuilderPage = () => {
  const navigate = useNavigate();
  const [websiteData, setWebsiteData] = useState(null);
  
  useEffect(() => {
    // Retrieve the website data from localStorage
    const storedData = localStorage.getItem('websiteData');
    if (storedData) {
      setWebsiteData(JSON.parse(storedData));
    } else {
      // If no data exists, redirect to the form
      navigate('/');
    }
  }, [navigate]);
  
  const handlePreview = () => {
    navigate('/preview');
  };
  
  if (!websiteData) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <>
      <header className="app-header">
        <h1>{websiteData.businessName || 'Websites.co.in Builder'}</h1>
        <div className="actions">
          <button className="btn" onClick={handlePreview}>Preview</button>
          <button className="btn primary">Publish</button>
        </div>
      </header>
      <Builder initialData={websiteData} />
    </>
  );
};

export default BuilderPage;