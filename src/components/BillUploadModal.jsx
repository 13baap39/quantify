import React, { useState, useRef } from 'react';
import './BillUploadModal.css';

const BillUploadModal = ({ onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    // Validate file type
    if (!acceptedTypes.includes(selectedFile.type)) {
      alert('Please upload a valid image (JPG, PNG) or PDF file.');
      return;
    }

    // Validate file size
    if (selectedFile.size > maxFileSize) {
      alert('File size must be less than 10MB.');
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    setUploading(true);

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real application, you would:
      // 1. Upload the file to your server or cloud storage
      // 2. Process the file with OCR (like Google Vision API, Tesseract, etc.)
      // 3. Extract product information and quantities
      // 4. Return the extracted data

      const mockExtractedData = {
        fileName: file.name,
        extractedItems: [
          { sku: 'PROD001', name: 'Wireless Headphones', quantity: 2 },
          { sku: 'PROD003', name: 'USB Cable Type-C', quantity: 5 }
        ],
        totalAmount: 120.50,
        vendor: 'Tech Supplies Inc.',
        date: new Date().toISOString().split('T')[0]
      };

      onUpload(mockExtractedData);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content bill-upload-modal">
        <div className="modal-header">
          <h2>Upload Bill for Stock Deduction</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="upload-info">
            <p>Upload a bill image or PDF to automatically deduct stock quantities.</p>
            <ul>
              <li>Supported formats: JPG, PNG, PDF</li>
              <li>Maximum file size: 10MB</li>
              <li>The system will extract product information automatically</li>
            </ul>
          </div>

          {!file ? (
            <div
              className={`upload-zone ${isDragging ? 'dragging' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-content">
                <div className="upload-icon">📄</div>
                <h3>Drop your bill here or click to browse</h3>
                <p>JPG, PNG, or PDF up to 10MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileInputChange}
                className="hidden-input"
              />
            </div>
          ) : (
            <div className="file-preview">
              <div className="file-info">
                <div className="file-details">
                  <div className="file-icon">
                    {file.type.startsWith('image/') ? '🖼️' : '📄'}
                  </div>
                  <div className="file-meta">
                    <h4>{file.name}</h4>
                    <p>{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button className="remove-file" onClick={removeFile}>
                  ✕
                </button>
              </div>

              {preview && (
                <div className="image-preview">
                  <img src={preview} alt="Bill preview" />
                </div>
              )}

              <div className="processing-info">
                <div className="info-box">
                  <h4>📊 What happens next?</h4>
                  <ul>
                    <li>We'll extract product information from your bill</li>
                    <li>Matching SKUs will be automatically identified</li>
                    <li>Stock quantities will be deducted accordingly</li>
                    <li>You'll receive a summary of changes made</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? (
              <>
                <span className="loading-spinner small"></span>
                Processing...
              </>
            ) : (
              'Process Bill'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillUploadModal;
