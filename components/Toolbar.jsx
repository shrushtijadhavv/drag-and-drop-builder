// src/components/Toolbar.jsx - Enhanced with working undo/redo
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Toolbar = ({ 
  currentTemplate, 
  onChangeTemplate, 
  canUndo, 
  canRedo, 
  onUndo, 
  onRedo 
}) => {
  const navigate = useNavigate();
  
  const templates = [
    { id: 'default', name: 'Default Template' },
    { id: 'business', name: 'Business Template' },
    { id: 'portfolio', name: 'Portfolio Template' },
    { id: 'blog', name: 'Blog Template' },
    { id: 'ecommerce', name: 'E-Commerce Template' },
  ];
  
  const handlePreview = () => {
    navigate('/preview');
  };
  
  return (
    <div className="toolbar">
      <div className="template-selector">
        <label>Template:</label>
        <select
          value={currentTemplate}
          onChange={(e) => onChangeTemplate(e.target.value)}
        >
          {templates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="toolbar-actions">
        <button 
          className="btn" 
          onClick={onUndo} 
          disabled={!canUndo}
          title="Undo"
        >
          Undo
        </button>
        <button 
          className="btn" 
          onClick={onRedo} 
          disabled={!canRedo}
          title="Redo"
        >
          Redo
        </button>
        <button className="btn" onClick={handlePreview}>Preview</button>
      </div>
      
      <div className="device-preview">
        <button className="btn icon-btn active" title="Desktop View">🖥️</button>
        <button className="btn icon-btn" title="Mobile View">📱</button>
      </div>
    </div>
  );
};

export default Toolbar;