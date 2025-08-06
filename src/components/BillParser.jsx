import React, { useState, useRef } from 'react';
import parseBillFile, { validateParsedItems, BillParsingProgress } from '../utils/billParser';
import '../utils/pdfWorkerConfig'; // Initialize PDF.js worker
import './BillParser.css';

const BillParser = ({ onClose, onStockUpdate }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [editableItems, setEditableItems] = useState([]);
  const [step, setStep] = useState('upload'); // 'upload', 'preview', 'parsed', 'review'
  const [progressInfo, setProgressInfo] = useState({ step: '', progress: 0 });
  const [error, setError] = useState(null);
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
    setStep('preview');

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

  const handleParseBill = async () => {
    if (!file) return;

    setParsing(true);
    setStep('parsing');
    setError(null);

    try {
      // Set up progress tracking
      const progressCallback = (step, progress) => {
        setProgressInfo({ step, progress });
      };

      setProgressInfo({ step: 'Initializing...', progress: 0 });

      // Parse the bill file using real OCR/PDF parsing
      const parsedItems = await parseBillFile(file);
      
      if (!parsedItems || parsedItems.length === 0) {
        throw new Error('No items found in the bill. Please check the file format and try again.');
      }

      // Validate the parsed items
      const validatedItems = validateParsedItems(parsedItems);
      
      if (validatedItems.length === 0) {
        throw new Error('No valid items could be extracted from the bill.');
      }

      // Convert to the format expected by the UI
      const extractedData = {
        vendor: 'Extracted from Bill',
        date: new Date().toISOString().split('T')[0],
        totalAmount: validatedItems.reduce((sum, item) => sum + (item.price * item.qty || 0), 0),
        items: validatedItems.map(item => ({
          sku: item.sku,
          name: item.name || `Product ${item.sku}`,
          quantity: item.qty,
          unitPrice: item.price || 0,
          total: (item.price || 0) * item.qty
        }))
      };

      setParsedData(extractedData);
      setEditableItems(extractedData.items.map((item, index) => ({
        ...item,
        id: index,
        selected: true
      })));
      setStep('review');
      setProgressInfo({ step: 'Completed', progress: 100 });
    } catch (error) {
      console.error('Parsing failed:', error);
      setError(error.message);
      setStep('preview');
    } finally {
      setParsing(false);
    }
  };

  const handleItemEdit = (id, field, value) => {
    setEditableItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, [field]: field === 'quantity' || field === 'unitPrice' ? parseFloat(value) || 0 : value }
          : item
      )
    );
  };

  const handleItemToggle = (id) => {
    setEditableItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      sku: '',
      name: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      selected: true
    };
    setEditableItems(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (id) => {
    setEditableItems(prev => prev.filter(item => item.id !== id));
  };

  const handleApplyChanges = () => {
    const selectedItems = editableItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      alert('Please select at least one item to update stock.');
      return;
    }

    const stockUpdates = selectedItems.map(item => ({
      sku: item.sku,
      name: item.name,
      quantity: item.quantity,
      operation: 'subtract' // Assuming bills are for items leaving inventory
    }));

    onStockUpdate(stockUpdates, parsedData);
    onClose();
  };

  const resetComponent = () => {
    setFile(null);
    setPreview(null);
    setParsedData(null);
    setEditableItems([]);
    setStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && step !== 'parsing') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content bill-parser-modal">
        <div className="modal-header">
          <h2>Bill Parser & Stock Updater</h2>
          <button className="close-button" onClick={onClose} disabled={parsing}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Step 1: File Upload */}
          {step === 'upload' && (
            <>
              <div className="upload-info">
                <p>Upload a bill image or PDF to automatically extract stock information.</p>
                <ul>
                  <li>Supported formats: JPG, PNG, PDF</li>
                  <li>Maximum file size: 10MB</li>
                  <li>The system will extract SKU, quantity, and pricing information</li>
                </ul>
              </div>

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
            </>
          )}

          {/* Step 2: File Preview */}
          {step === 'preview' && file && (
            <>
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
                  <button className="remove-file" onClick={resetComponent}>
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
                    <h4>🔍 Ready to Parse</h4>
                    <p>Click "Parse Bill" to extract product information using {file.type.startsWith('image/') ? 'OCR technology' : 'PDF text extraction'}.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Parsing in Progress */}
          {step === 'parsing' && (
            <div className="parsing-progress">
              <div className="loading-container">
                <div className="loading-spinner large"></div>
                <h3>Parsing Bill...</h3>
                <p>{progressInfo.step || `Extracting product information from your ${file.type.startsWith('image/') ? 'image using OCR' : 'PDF document'}`}</p>
                {progressInfo.progress > 0 && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progressInfo.progress}%` }}
                    ></div>
                  </div>
                )}
                {error && (
                  <div className="error-message">
                    <p>⚠️ Error: {error}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Review Parsed Data */}
          {step === 'review' && parsedData && (
            <div className="review-section">
              <div className="parsed-summary">
                <h3>📋 Extracted Information</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="label">Vendor:</span>
                    <span className="value">{parsedData.vendor}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Date:</span>
                    <span className="value">{parsedData.date}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Total Amount:</span>
                    <span className="value">${parsedData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="items-section">
                <div className="items-header">
                  <h4>📦 Extracted Items</h4>
                  <button className="btn btn-outline btn-small" onClick={handleAddItem}>
                    ➕ Add Item
                  </button>
                </div>

                <div className="items-list">
                  {editableItems.map((item) => (
                    <div key={item.id} className={`item-row ${item.selected ? 'selected' : ''}`}>
                      <div className="item-checkbox">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleItemToggle(item.id)}
                        />
                      </div>
                      <div className="item-fields">
                        <input
                          type="text"
                          placeholder="SKU"
                          value={item.sku}
                          onChange={(e) => handleItemEdit(item.id, 'sku', e.target.value)}
                          className="field-input sku-input"
                        />
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={item.name}
                          onChange={(e) => handleItemEdit(item.id, 'name', e.target.value)}
                          className="field-input name-input"
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemEdit(item.id, 'quantity', e.target.value)}
                          className="field-input qty-input"
                          min="0"
                          step="1"
                        />
                        <input
                          type="number"
                          placeholder="Unit Price"
                          value={item.unitPrice}
                          onChange={(e) => handleItemEdit(item.id, 'unitPrice', e.target.value)}
                          className="field-input price-input"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <button
                        className="remove-item"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                <div className="review-note">
                  <p><strong>Note:</strong> Review and edit the extracted information above. Selected items will be deducted from your inventory when you apply changes.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          {step === 'upload' && (
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          )}
          
          {step === 'preview' && (
            <>
              <button className="btn btn-secondary" onClick={resetComponent}>
                Choose Different File
              </button>
              <button className="btn btn-primary" onClick={handleParseBill}>
                🔍 Parse Bill
              </button>
            </>
          )}
          
          {step === 'parsing' && (
            <button className="btn btn-secondary" disabled>
              Processing...
            </button>
          )}
          
          {step === 'review' && (
            <>
              <button className="btn btn-secondary" onClick={resetComponent}>
                Start Over
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleApplyChanges}
                disabled={editableItems.filter(item => item.selected).length === 0}
              >
                ✅ Apply Stock Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillParser;
