// src/components/Builder.jsx - Enhanced with history state for undo/redo
import React, { useState, useEffect, useReducer } from 'react';
import CanvasManager from './canvasManager';
import ElementLibrary from './ElementLibrary';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import Toolbar from './Toolbar';

// History reducer for undo/redo functionality
const historyReducer = (state, action) => {
  switch (action.type) {
    case 'PUSH_STATE':
      return {
        past: [...state.past, action.payload],
        present: action.payload,
        future: []
      };
    case 'UNDO':
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future]
      };
    case 'REDO':
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture
      };
    default:
      return state;
  }
};

const Builder = ({ initialData }) => {
  // Initialize with sample data based on initial form data
  const initialElements = [];
  
  if (initialData) {
    // Add header with business name
    initialElements.push({
      id: `element-header-${Date.now()}`,
      type: 'heading',
      position: { x: 20, y: 20 },
      content: initialData.businessName,
      styles: {
        width: '80%',
        fontSize: '32px',
        fontWeight: 'bold',
        color: initialData.primaryColor,
        backgroundColor: 'transparent',
        padding: '10px',
      },
    });
    
    // Add description paragraph
    if (initialData.description) {
      initialElements.push({
        id: `element-desc-${Date.now()}`,
        type: 'text',
        position: { x: 20, y: 100 },
        content: initialData.description,
        styles: {
          width: '80%',
          fontSize: '16px',
          color: '#333',
          backgroundColor: 'transparent',
          padding: '10px',
        },
      });
    }
    
    // Add contact information if provided
    if (initialData.contactEmail || initialData.contactPhone || initialData.address) {
      let contactContent = 'Contact Us:\n';
      if (initialData.contactEmail) contactContent += `Email: ${initialData.contactEmail}\n`;
      if (initialData.contactPhone) contactContent += `Phone: ${initialData.contactPhone}\n`;
      if (initialData.address) contactContent += `Address: ${initialData.address}`;
      
      initialElements.push({
        id: `element-contact-${Date.now()}`,
        type: 'text',
        position: { x: 20, y: 200 },
        content: contactContent,
        styles: {
          width: '40%',
          fontSize: '14px',
          color: '#555',
          backgroundColor: '#f9f9f9',
          padding: '15px',
          borderRadius: '4px',
        },
      });
    }
    
    // Add a button if it's an e-commerce site
    if (initialData.businessType === 'ecommerce' || initialData.features.ecommerce) {
      initialElements.push({
        id: `element-shop-${Date.now()}`,
        type: 'button',
        position: { x: 20, y: 300 },
        content: 'Shop Now',
        styles: {
          width: 'auto',
          padding: '12px 24px',
          color: '#fff',
          backgroundColor: initialData.primaryColor,
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
        },
      });
    }
    
    // Add an image placeholder
    initialElements.push({
      id: `element-image-${Date.now()}`,
      type: 'image',
      position: { x: 400, y: 100 },
      content: initialData.logo ? 'Logo Image' : 'Featured Image',
      styles: {
        width: '300px',
        height: '200px',
        backgroundColor: '#f0f0f0',
        border: `1px solid ${initialData.primaryColor}`,
      },
    });
  }
  
  // Initialize history state with initial elements
  const [historyState, dispatch] = useReducer(historyReducer, {
    past: [],
    present: initialElements,
    future: []
  });
  
  const [elements, setElements] = useState(initialElements);
  const [selectedElement, setSelectedElement] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState(initialData?.businessType || 'default');
  
  // Sync elements with history present state
  useEffect(() => {
    setElements(historyState.present);
  }, [historyState]);
  
  // Save elements to localStorage when they change
  useEffect(() => {
    localStorage.setItem('websiteElements', JSON.stringify(elements));
  }, [elements]);
  
  const handleAddElement = (elementType, position) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type: elementType,
      position,
      content: getDefaultContent(elementType),
      styles: getDefaultStyles(elementType, initialData),
    };
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement);
    
    // Save to history
    dispatch({ type: 'PUSH_STATE', payload: newElements });
  };
  
  const handleUpdateElement = (id, updates) => {
    const newElements = elements.map(element => 
      element.id === id ? { ...element, ...updates } : element
    );
    
    setElements(newElements);
    
    if (selectedElement && selectedElement.id === id) {
      setSelectedElement({ ...selectedElement, ...updates });
    }
    
    // Save to history
    dispatch({ type: 'PUSH_STATE', payload: newElements });
  };
  
  const handleDeleteElement = (id) => {
    const newElements = elements.filter(element => element.id !== id);
    setElements(newElements);
    
    if (selectedElement && selectedElement.id === id) {
      setSelectedElement(null);
    }
    
    // Save to history
    dispatch({ type: 'PUSH_STATE', payload: newElements });
  };
  
  const handleSelectElement = (element) => {
    setSelectedElement(element);
  };
  
  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };
  
  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };
  
  const getDefaultContent = (type) => {
    switch (type) {
      case 'text':
        return 'Add your text here';
      case 'heading':
        return 'Heading';
      case 'button':
        return 'Click Me';
      default:
        return '';
    }
  };
  
  const getDefaultStyles = (type, data) => {
    const primaryColor = data?.primaryColor || '#4a90e2';
    
    const baseStyles = {
      width: '100%',
      padding: '10px',
      color: '#333',
      backgroundColor: 'transparent',
    };
    
    switch (type) {
      case 'text':
        return { ...baseStyles, fontSize: '16px' };
      case 'heading':
        return { 
          ...baseStyles, 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: primaryColor 
        };
      case 'button':
        return {
          ...baseStyles,
          width: 'auto',
          backgroundColor: primaryColor,
          color: 'white',
          borderRadius: '4px',
          cursor: 'pointer',
        };
      case 'image':
        return { ...baseStyles, height: '200px' };
      default:
        return baseStyles;
    }
  };
  
  return (
    <div className="builder">
      <Toolbar 
        currentTemplate={currentTemplate}
        onChangeTemplate={setCurrentTemplate}
        canUndo={historyState.past.length > 0}
        canRedo={historyState.future.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      <div className="builder-main">
        <ElementLibrary initialData={initialData} />
        <Canvas 
          elements={elements}
          selectedElement={selectedElement}
          onAddElement={handleAddElement}
          onSelectElement={handleSelectElement}
          onUpdateElement={handleUpdateElement}
          template={currentTemplate}
        />
        <PropertiesPanel 
          selectedElement={selectedElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          initialData={initialData}
        />
      </div>
    </div>
  );
};

// Initialize the canvas manager when the component mounts
function initializeCanvas() {
  const canvas = document.querySelector('.canvas');
  if (!canvas) return;

  const canvasManager = new CanvasManager(canvas);
  setupLibraryElements();
}

function setupLibraryElements() {
  const elements = document.querySelectorAll('.element-item');

  elements.forEach(element => {
    element.setAttribute('draggable', 'true');

    element.addEventListener('dragstart', (e) => {
      const elementType = element.getAttribute('data-type') || 'default';
      e.dataTransfer.setData('element-type', elementType);

      setTimeout(() => {
        element.classList.add('dragging');
      }, 0);
    });

    element.addEventListener('dragend', () => {
      element.classList.remove('dragging');
    });
  });
}

export default Builder;
// Note: The CanvasManager class should be defined in the canvasManager.js file, and it should handle the actual rendering of elements on the canvas.
// The ElementLibrary, Canvas, and PropertiesPanel components should be defined in their respective files and imported here.

