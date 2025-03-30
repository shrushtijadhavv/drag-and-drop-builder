import React, { useRef } from 'react';
import Element from './Element';
import { useDragDrop } from '../hooks/useDragDrop';

const Canvas = ({ 
  elements, 
  selectedElement, 
  onAddElement, 
  onSelectElement, 
  onUpdateElement,
  template 
}) => {
  const canvasRef = useRef(null);
  const { onDragOver, onDrop } = useDragDrop();
  
  const handleDrop = (e) => {
    const elementType = onDrop(e);
    if (!elementType) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const position = {
      x: e.clientX - canvasRect.left,
      y: e.clientY - canvasRect.top,
    };
    
    onAddElement(elementType, position);
  };
  
  const getTemplateClassName = () => {
    return `canvas-container template-${template}`;
  };
  
  return (
    <div 
      className="canvas-wrapper"
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      <div 
        ref={canvasRef}
        className={getTemplateClassName()}
      >
        {elements.map((element) => (
          <Element 
            key={element.id}
            element={element}
            isSelected={selectedElement && selectedElement.id === element.id}
            onSelect={() => onSelectElement(element)}
            onUpdate={(updates) => onUpdateElement(element.id, updates)}
          />
        ))}
      </div>
    </div>
  );
};

export default Canvas;