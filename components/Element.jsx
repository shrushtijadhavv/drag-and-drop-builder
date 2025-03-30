import React, { useRef, useState, useEffect } from 'react';

const Element = ({ element, isSelected, onSelect, onUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  
  useEffect(() => {
    if (!isSelected) return;
    
    const handleKeyDown = (e) => {
      // Handle element movement with arrow keys
      const STEP = 10;
      const { position } = element;
      
      switch (e.key) {
        case 'ArrowUp':
          onUpdate({ position: { ...position, y: position.y - STEP } });
          break;
        case 'ArrowDown':
          onUpdate({ position: { ...position, y: position.y + STEP } });
          break;
        case 'ArrowLeft':
          onUpdate({ position: { ...position, x: position.x - STEP } });
          break;
        case 'ArrowRight':
          onUpdate({ position: { ...position, x: position.x + STEP } });
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, element, onUpdate]);
  
  const handleMouseDown = (e) => {
    if (e.target !== elementRef.current) return;
    
    setIsDragging(true);
    
    const rect = elementRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    onSelect();
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const parentRect = elementRef.current.parentElement.getBoundingClientRect();
    const newX = e.clientX - parentRect.left - dragOffset.x;
    const newY = e.clientY - parentRect.top - dragOffset.y;
    
    onUpdate({
      position: { x: newX, y: newY },
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  const getElementContent = () => {
    switch (element.type) {
      case 'text':
      case 'heading':
        return <div>{element.content}</div>;
      case 'button':
        return <button style={{ border: 'none', outline: 'none' }}>{element.content}</button>;
      case 'image':
        return (
          <div className="image-placeholder">
            {element.content || 'Image placeholder'}
          </div>
        );
      default:
        return <div>{element.content}</div>;
    }
  };
  
  const getElementStyles = () => {
    const { position, styles } = element;
    
    return {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      ...styles,
      cursor: isDragging ? 'grabbing' : 'grab',
      border: isSelected ? '2px solid #4a90e2' : 'none',
      boxShadow: isSelected ? '0 0 8px rgba(74, 144, 226, 0.5)' : 'none',
    };
  };
  
  return (
    <div
      ref={elementRef}
      className={`element element-${element.type}`}
      style={getElementStyles()}
      onMouseDown={handleMouseDown}
      onClick={onSelect}
    >
      {getElementContent()}
      {isSelected && (
        <div className="element-controls">
          <div className="resize-handle"></div>
        </div>
      )}
    </div>
  );
};

export default Element;