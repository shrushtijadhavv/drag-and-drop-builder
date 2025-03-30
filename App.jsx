import React, { useState } from 'react';
import Builder from './components/Builder';
import './styles.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Websites.co.in Builder</h1>
        <div className="actions">
          <button className="btn">Preview</button>
          <button className="btn primary">Publish</button>
        </div>
      </header>
      <Builder />
    </div>
  );
}

export default App;