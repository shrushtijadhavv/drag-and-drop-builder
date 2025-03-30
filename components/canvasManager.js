// canvasManager.js - Add this file to your project

import Modal from './Modal';
import React, { useState } from 'react';

const CanvasManager = ({ canvasElement }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [elementToDelete, setElementToDelete] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');

  const handleDeleteClick = (element) => {
    setElementToDelete(element);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (elementToDelete) {
      elementToDelete.remove();
    }
    setModalOpen(false);
    setElementToDelete(null);
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setElementToDelete(null);
  };

  const handleVideoUrl = () => {
    setModalOpen(true);
  };

  const confirmVideoUrl = () => {
    // Logic to handle the confirmed video URL
    console.log('Video URL confirmed:', videoUrl);
    setModalOpen(false);
  };

  const cancelVideoUrl = () => {
    setModalOpen(false);
  };

  class CanvasManagerClass {
    constructor(canvasElement) {
      this.canvas = canvasElement;
      this.isDragging = false;
      this.currentElement = null;
      this.offsetX = 0;
      this.offsetY = 0;
      this.canvasBounds = null;
      this.context = canvasElement.getContext('2d'); // Assuming it's a 2D canvas

      // Initialize the canvas
      this.initialize();
    }

    initialize() {
      // Get canvas boundaries for containment
      this.updateCanvasBounds();

      // Set up event listeners for window resize
      window.addEventListener('resize', () => this.updateCanvasBounds());

      // Setup drop zone
      this.setupDropZone();

      // Setup draggable elements within canvas
      this.setupExistingElements();
    }

    updateCanvasBounds() {
      this.canvasBounds = this.canvas.getBoundingClientRect();
    }

    setupDropZone() {
      this.canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.canvas.classList.add('drag-over');
      });

      this.canvas.addEventListener('dragleave', () => {
        this.canvas.classList.remove('drag-over');
      });

      this.canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        this.canvas.classList.remove('drag-over');

        // Get the dropped element type from data transfer
        const elementType = e.dataTransfer.getData('element-type');

        if (elementType) {
          // Calculate position within canvas bounds
          const x = Math.min(
            Math.max(0, e.clientX - this.canvasBounds.left),
            this.canvasBounds.width - 100
          );
          const y = Math.min(
            Math.max(0, e.clientY - this.canvasBounds.top),
            this.canvasBounds.height - 100
          );

          // Create new element based on type
          this.createNewElement(elementType, x, y);
        }
      });
    }

    setupExistingElements() {
      // Find all existing elements in the canvas
      const elements = this.canvas.querySelectorAll('.canvas-element');

      elements.forEach((element) => {
        this.makeElementDraggable(element);
      });
    }

    makeElementDraggable(element) {
      element.setAttribute('draggable', 'true');

      // Add grab cursor
      element.style.cursor = 'grab';

      element.addEventListener('mousedown', (e) => {
        if (e.target.closest('.element-controls')) return;

        this.isDragging = true;
        this.currentElement = element;

        // Add active class
        element.classList.add('dragging');

        // Calculate offset within the element
        const elementRect = element.getBoundingClientRect();
        this.offsetX = e.clientX - elementRect.left;
        this.offsetY = e.clientY - elementRect.top;

        // Change cursor
        element.style.cursor = 'grabbing';

        // Prevent defaults
        e.preventDefault();
      });

      // Global mouse events
      document.addEventListener('mousemove', (e) => {
        if (!this.isDragging || !this.currentElement) return;

        // Calculate new position
        let newX = e.clientX - this.canvasBounds.left - this.offsetX;
        let newY = e.clientY - this.canvasBounds.top - this.offsetY;

        // Constrain to canvas bounds
        const elementWidth = this.currentElement.offsetWidth;
        const elementHeight = this.currentElement.offsetHeight;

        newX = Math.max(0, Math.min(newX, this.canvasBounds.width - elementWidth));
        newY = Math.max(0, Math.min(newY, this.canvasBounds.height - elementHeight));

        // Apply new position
        this.currentElement.style.position = 'absolute';
        this.currentElement.style.left = `${newX}px`;
        this.currentElement.style.top = `${newY}px`;
      });

      document.addEventListener('mouseup', () => {
        if (this.currentElement) {
          this.currentElement.classList.remove('dragging');
          this.currentElement.style.cursor = 'grab';
          this.currentElement = null;
        }
        this.isDragging = false;
      });
    }

    createNewElement(elementType, x, y) {
      let element;

      switch (elementType) {
        case 'text':
          element = this.createTextElement();
          break;
        case 'image':
          element = this.createImageElement();
          break;
        case 'video':
          element = this.createVideoElement();
          break;
        case 'gallery':
          element = this.createGalleryElement();
          break;
        case 'form':
          element = this.createFormElement();
          break;
        case 'map':
          element = this.createMapElement();
          break;
        default:
          element = this.createDefaultElement(elementType);
      }

      // Set position
      element.style.position = 'absolute';
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      // Add to canvas
      this.canvas.appendChild(element);

      // Make draggable
      this.makeElementDraggable(element);

      // Return for further customization
      return element;
    }

    createTextElement() {
      const div = document.createElement('div');
      div.className = 'canvas-element text-element';
      div.innerHTML = `
        <div class="element-controls">
          <button class="btn small icon-btn edit-btn" title="Edit Text"><i class="fas fa-edit"></i></button>
          <button class="btn small icon-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
        <div class="text-content" contenteditable="true">Edit this text</div>
      `;

      this.setupElementControls(div);
      return div;
    }

    createImageElement() {
      const div = document.createElement('div');
      div.className = 'canvas-element image-element';
      div.innerHTML = `
        <div class="element-controls">
          <button class="btn small icon-btn upload-btn" title="Upload Image"><i class="fas fa-upload"></i></button>
          <button class="btn small icon-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
        <div class="image-placeholder">
          <i class="fas fa-image"></i>
          <p>Click to upload image</p>
        </div>
      `;

      // Handle image upload
      const imgPlaceholder = div.querySelector('.image-placeholder');
      const uploadBtn = div.querySelector('.upload-btn');

      [imgPlaceholder, uploadBtn].forEach((el) => {
        el.addEventListener('click', () => this.handleImageUpload(div));
      });

      this.setupElementControls(div);
      return div;
    }

    createVideoElement() {
      const div = document.createElement('div');
      div.className = 'canvas-element video-element';
      div.innerHTML = `
        <div class="element-controls">
          <button class="btn small icon-btn url-btn" title="Video URL"><i class="fas fa-link"></i></button>
          <button class="btn small icon-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
        <div class="video-placeholder">
          <i class="fas fa-video"></i>
          <p>Click to add video URL</p>
        </div>
      `;

      // Handle video URL input
      const videoPlaceholder = div.querySelector('.video-placeholder');
      const urlBtn = div.querySelector('.url-btn');

      [videoPlaceholder, urlBtn].forEach((el) => {
        el.addEventListener('click', () => handleVideoUrl());
      });

      this.setupElementControls(div);
      return div;
    }

    createGalleryElement() {
      const div = document.createElement('div');
      div.className = 'canvas-element gallery-element';
      div.innerHTML = `
        <div class="element-controls">
          <button class="btn small icon-btn add-image-btn" title="Add Images"><i class="fas fa-plus"></i></button>
          <button class="btn small icon-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
        <div class="gallery-container">
          <div class="gallery-placeholder">
            <i class="fas fa-images"></i>
            <p>Click to add multiple images</p>
          </div>
        </div>
      `;

      // Handle gallery image uploads
      const galleryPlaceholder = div.querySelector('.gallery-placeholder');
      const addImageBtn = div.querySelector('.add-image-btn');

      [galleryPlaceholder, addImageBtn].forEach((el) => {
        el.addEventListener('click', () => this.handleGalleryUpload(div));
      });

      this.setupElementControls(div);
      return div;
    }

    createFormElement() {
      const div = document.createElement('div');
      div.className = 'canvas-element form-element';
      div.innerHTML = `
        <div class="element-controls">
          <button class="btn small icon-btn edit-form-btn" title="Edit Form"><i class="fas fa-edit"></i></button>
          <button class="btn small icon-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
        <form class="form-container">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" class="form-control" placeholder="Enter your name">
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" class="form-control" placeholder="Enter your email">
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" class="form-control" rows="3" placeholder="Enter your message"></textarea>
          </div>
          <button type="button" class="btn primary">Submit</button>
        </form>
      `;

      // Form field editing
      const editFormBtn = div.querySelector('.edit-form-btn');
      editFormBtn.addEventListener('click', () => this.openFormEditor(div));

      this.setupElementControls(div);
      return div;
    }

    createMapElement() {
      const div = document.createElement('div');
      div.className = 'canvas-element map-element';
      div.innerHTML = `
        <div class="element-controls">
          <button class="btn small icon-btn location-btn" title="Set Location"><i class="fas fa-map-marker-alt"></i></button>
          <button class="btn small icon-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
        <div class="map-placeholder">
          <i class="fas fa-map"></i>
          <p>Click to set map location</p>
        </div>
      `;

      // Handle map location
      const mapPlaceholder = div.querySelector('.map-placeholder');
      const locationBtn = div.querySelector('.location-btn');

      [mapPlaceholder, locationBtn].forEach((el) => {
        el.addEventListener('click', () => this.handleMapLocation(div));
      });

      this.setupElementControls(div);
      return div;
    }

    createDefaultElement(type) {
      const div = document.createElement('div');
      div.className = `canvas-element default-element ${type}-element`;
      div.innerHTML = `
        <div class="element-controls">
          <button class="btn small icon-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn small icon-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
        <div class="default-content">
          <i class="fas fa-cube"></i>
          <p>${type.charAt(0).toUpperCase() + type.slice(1)} Element</p>
        </div>
      `;

      this.setupElementControls(div);
      return div;
    }

    setupElementControls(element) {
      // Delete button
      const deleteBtn = element.querySelector('.delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => handleDeleteClick(element));
      }

      // Select element on click
      element.addEventListener('click', (e) => {
        if (e.target.closest('.element-controls')) return;

        // Deselect all other elements
        document.querySelectorAll('.canvas-element.selected').forEach((el) => {
          if (el !== element) el.classList.remove('selected');
        });

        // Select this element
        element.classList.toggle('selected');
      });
    }

    // Handlers for different element types
    handleImageUpload(element) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const placeholder = element.querySelector('.image-placeholder');
          placeholder.innerHTML = `<img src="${event.target.result}" alt="Uploaded Image" style="max-width: 100%; max-height: 100%;">`;
        };

        reader.readAsDataURL(file);
      };

      input.click();
    }

    handleVideoUrl(element) {
      const videoUrl = prompt('Enter YouTube or video URL:'); // Replace this with a modal-based input
      if (!videoUrl) return;

      let embedUrl = videoUrl;

      // Convert YouTube URLs to embed format
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = this.getYoutubeVideoId(videoUrl);
        if (videoId) {
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
      }

      const placeholder = element.querySelector('.video-placeholder');
      placeholder.innerHTML = `
        <iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 100%; height: 250px;"></iframe>
      `;
    }

    getYoutubeVideoId(url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    }

    handleGalleryUpload(element) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;

      input.onchange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const galleryContainer = element.querySelector('.gallery-container');
        galleryContainer.innerHTML = '';

        // Create gallery grid
        const galleryGrid = document.createElement('div');
        galleryGrid.className = 'gallery-grid';
        galleryGrid.style.display = 'grid';
        galleryGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        galleryGrid.style.gap = '5px';

        files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'gallery-item';
            imgContainer.style.height = '80px';
            imgContainer.style.overflow = 'hidden';

            const img = document.createElement('img');
            img.src = event.target.result;
            img.alt = 'Gallery Image';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';

            imgContainer.appendChild(img);
            galleryGrid.appendChild(imgContainer);
          };

          reader.readAsDataURL(file);
        });

        galleryContainer.appendChild(galleryGrid);
      };

      input.click();
    }

    openFormEditor(element) {
      const form = element.querySelector('form');

      // Get current form fields
      const formGroups = Array.from(form.querySelectorAll('.form-group'));
      const fieldTypes = formGroups.map((group) => {
        const input = group.querySelector('input, textarea, select');
        return {
          type: input.type === 'textarea' ? 'textarea' : input.type,
          label: group.querySelector('label').textContent,
          placeholder: input.placeholder,
        };
      });

      // Simple prompt-based editor (in a real app, use a modal)
      const addField = confirm('Do you want to add a new field to the form?');

      if (addField) {
        const fieldType = prompt('Enter field type (text, email, textarea, select):', 'text');
        const fieldLabel = prompt('Enter field label:', 'New Field');
        const fieldPlaceholder = prompt('Enter placeholder text:', 'Enter value');

        if (fieldType && fieldLabel) {
          const newGroup = document.createElement('div');
          newGroup.className = 'form-group';

          if (fieldType === 'textarea') {
            newGroup.innerHTML = `
              <label for="new-field">${fieldLabel}</label>
              <textarea id="new-field" class="form-control" placeholder="${fieldPlaceholder}" rows="3"></textarea>
            `;
          } else if (fieldType === 'select') {
            newGroup.innerHTML = `
              <label for="new-field">${fieldLabel}</label>
              <select id="new-field" class="form-control">
                <option value="">Select an option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            `;
          } else {
            newGroup.innerHTML = `
              <label for="new-field">${fieldLabel}</label>
              <input type="${fieldType}" id="new-field" class="form-control" placeholder="${fieldPlaceholder}">
            `;
          }

          // Add before submit button
          form.insertBefore(newGroup, form.querySelector('button'));
        }
      }
    }

    handleMapLocation(element) {
      const address = prompt('Enter location address or coordinates:');
      if (!address) return;

      // For demo purposes, use a static Google Maps image
      // In a real app, use the Google Maps JavaScript API
      const encodedAddress = encodeURIComponent(address);
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=14&size=400x300&markers=color:red%7C${encodedAddress}&key=YOUR_API_KEY`;

      // Show a placeholder image for demo (replace with actual API in production)
      const placeholder = element.querySelector('.map-placeholder');
      placeholder.innerHTML = `
        <div style="position: relative;">
          <div style="background-color: #eee; width: 100%; height: 250px; display: flex; justify-content: center; align-items: center;">
            <div style="text-align: center;">
              <i class="fas fa-map-marker-alt" style="font-size: 24px; color: #e74c3c;"></i>
              <p style="margin-top: 10px;">${address}</p>
              <p style="margin-top: 5px; font-size: 12px; color: #777;">Map would appear here with API key</p>
            </div>
          </div>
        </div>
      `;

      // In production, use:
      // placeholder.innerHTML = `<img src="${mapUrl}" alt="Map location" style="width: 100%;">`;
    }

    // Method to render elements on the canvas
    render(elements) {
      this.clearCanvas();
      elements.forEach((element) => {
        this.drawElement(element);
      });
    }

    // Clear the canvas
    clearCanvas() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Draw an individual element
    drawElement(element) {
      const { type, position, styles, content } = element;

      switch (type) {
        case 'text':
          this.context.font = `${styles.fontSize || '16px'} Arial`;
          this.context.fillStyle = styles.color || '#000';
          this.context.fillText(content, position.x, position.y);
          break;

        case 'image':
          // Example: Draw a placeholder rectangle for an image
          this.context.fillStyle = styles.backgroundColor || '#ccc';
          this.context.fillRect(position.x, position.y, styles.width || 100, styles.height || 100);
          break;

        case 'button':
          // Example: Draw a button-like rectangle
          this.context.fillStyle = styles.backgroundColor || '#007BFF';
          this.context.fillRect(position.x, position.y, styles.width || 100, styles.height || 40);
          this.context.fillStyle = styles.color || '#fff';
          this.context.fillText(content, position.x + 10, position.y + 25);
          break;

        default:
          console.warn(`Unknown element type: ${type}`);
      }
    }
  }

  // Additional CSS for drag and drop functionality
  const style = document.createElement('style');
  style.textContent = `
    .canvas-element {
      min-width: 100px;
      min-height: 50px;
      z-index: 1;
    }

    .canvas-element.dragging {
      opacity: 0.8;
      z-index: 100;
    }

    .canvas-element.selected {
      z-index: 10;
    }

    .canvas.drag-over {
      box-shadow: 0 0 0 2px #4a90e2;
    }

    .image-placeholder,
    .video-placeholder,
    .gallery-placeholder,
    .map-placeholder {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background-color: #f5f5f5;
      border: 1px dashed #ccc;
      border-radius: 4px;
      height: 150px;
      cursor: pointer;
    }

    .image-placeholder i,
    .video-placeholder i,
    .gallery-placeholder i,
    .map-placeholder i {
      font-size: 24px;
      color: #666;
      margin-bottom: 10px;
    }
  `;

  document.head.appendChild(style);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this element?"
      />
      <Modal
        isOpen={isModalOpen}
        onClose={cancelVideoUrl}
        onConfirm={confirmVideoUrl}
        message="Enter YouTube or video URL:"
      />
      <button onClick={handleVideoUrl}>Add Video</button>
      {/* Other canvasManager logic */}
    </>
  );
};

export default CanvasManager;