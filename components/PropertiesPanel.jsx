import React from 'react';

const PropertiesPanel = ({ selectedElement, onUpdateElement, onDeleteElement }) => {
  if (!selectedElement) {
    return (
      <div className="properties-panel">
        <h3>Properties</h3>
        <p className="no-selection">Select an element to edit its properties</p>
      </div>
    );
  }
  
  const handleContentChange = (e) => {
    onUpdateElement(selectedElement.id, {
      content: e.target.value,
    });
  };
  
  const handleStyleChange = (property, value) => {
    onUpdateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        [property]: value,
      },
    });
  };
  
  const handleDelete = () => {
    onDeleteElement(selectedElement.id);
  };
  
  return (
    <div className="properties-panel">
      <h3>Properties: {getElementTypeName(selectedElement.type)}</h3>
      
      <div className="properties-form">
        {/* Content Section */}
        <div className="property-group">
          <h4>Content</h4>
          {selectedElement.type === 'image' ? (
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={selectedElement.content || ''}
                onChange={handleContentChange}
                placeholder="Enter image URL"
              />
              <button className="btn small">Upload Image</button>
            </div>
          ) : (
            <div className="form-group">
              <label>Text</label>
              <textarea
                value={selectedElement.content || ''}
                onChange={handleContentChange}
                rows="3"
              />
            </div>
          )}
        </div>
        
        {/* Style Section */}
        <div className="property-group">
          <h4>Appearance</h4>
          
          <div className="form-group">
            <label>Width</label>
            <div className="input-with-unit">
              <input
                type="text"
                value={selectedElement.styles.width}
                onChange={(e) => handleStyleChange('width', e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Background Color</label>
            <input
              type="color"
              value={convertToHex(selectedElement.styles.backgroundColor)}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Text Color</label>
            <input
              type="color"
              value={convertToHex(selectedElement.styles.color)}
              onChange={(e) => handleStyleChange('color', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Font Size</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={parseInt(selectedElement.styles.fontSize) || 16}
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
              />
              <span>px</span>
            </div>
          </div>
          
          <div className="form-group">
            <label>Padding</label>
            <div className="input-with-unit">
              <input
                type="number"
                value={parseInt(selectedElement.styles.padding) || 0}
                onChange={(e) => handleStyleChange('padding', `${e.target.value}px`)}
              />
              <span>px</span>
            </div>
          </div>
        </div>
        
        {/* Advanced Section */}
        {selectedElement.type === 'button' && (
          <div className="property-group">
            <h4>Button Properties</h4>
            
            <div className="form-group">
              <label>Link URL</label>
              <input
                type="text"
                placeholder="https://example.com"
              />
            </div>
            
            <div className="form-group">
              <label>Border Radius</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={parseInt(selectedElement.styles.borderRadius) || 0}
                  onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
                />
                <span>px</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="actions">
          <button className="btn danger" onClick={handleDelete}>Delete Element</button>
        </div>
      </div>
    </div>
  );
};

const getElementTypeName = (type) => {
  const names = {
    text: 'Text Block',
    heading: 'Heading',
    button: 'Button',
    image: 'Image',
  };
  
  return names[type] || type;
};

const convertToHex = (color) => {
  // Simple conversion for common color names
  if (!color || color === 'transparent') return '#ffffff';
  if (color.startsWith('#')) return color;
  
  const tempElement = document.createElement('div');
  tempElement.style.color = color;
  document.body.appendChild(tempElement);
  const computedColor = window.getComputedStyle(tempElement).color;
  document.body.removeChild(tempElement);
  
  // Convert rgb to hex
  if (computedColor.startsWith('rgb')) {
    const rgb = computedColor.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      return `#${Number(rgb[0]).toString(16).padStart(2, '0')}${Number(rgb[1]).toString(16).padStart(2, '0')}${Number(rgb[2]).toString(16).padStart(2, '0')}`;
    }
  }
  
  return '#ffffff';
};

export default PropertiesPanel;

