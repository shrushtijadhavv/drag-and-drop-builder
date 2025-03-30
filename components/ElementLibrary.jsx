import React from 'react';
import { useDragDrop } from '../hooks/useDragDrop';

const ElementLibrary = () => {
  const { onDragStart } = useDragDrop();
  
  const elements = [
    { type: 'heading', label: 'Heading', icon: 'T' },
    { type: 'text', label: 'Text Block', icon: '¶' },
    { type: 'image', label: 'Image', icon: '🖼️' },
    { type: 'button', label: 'Button', icon: '⬜' },
    { type: 'form', label: 'Form', icon: '📋' },
    { type: 'video', label: 'Video', icon: '▶️' },
    { type: 'gallery', label: 'Gallery', icon: '🖼️🖼️' },
    { type: 'map', label: 'Map', icon: '🗺️' },
  ];
  
  return (
    <div className="element-library">
      <h3>Elements</h3>
      <div className="elements-list">
        {elements.map((element) => (
          <div 
            key={element.type}
            className="element-item"
            draggable
            onDragStart={(e) => onDragStart(e, element.type)}
          >
            <div className="element-icon">{element.icon}</div>
            <span>{element.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElementLibrary;