// components/Modal.js
import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-20 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-gray-800 bg-opacity-50"
        onClick={onClose} // Closing the modal when clicking on backdrop
        aria-label="Close Modal"
      ></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-80">
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
          aria-label="Close Modal"
        >
          &times;
        </button>
      </div>
    </div>,
    document.body //rendering it in body
  );
};

export default Modal;
