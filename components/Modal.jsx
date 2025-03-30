// filepath: c:\Users\Shrushti Jadhav\website-builder\src\components\Modal.jsx
import React from 'react';
import './Modal.css'; // Optional: Add styles for the modal

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onClose}>No</button>
      </div>
    </div>
  );
};

export default Modal;