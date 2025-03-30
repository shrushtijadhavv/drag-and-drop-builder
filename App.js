// src/App.js - Updated with routing
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import WebsiteForm from './components/WebsiteForm';
import BuilderPage from './pages/BuilderPage';
import PreviewPage from './pages/PreviewPage';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<WebsiteForm />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



