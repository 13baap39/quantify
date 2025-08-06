import React, { useState } from 'react';
import parseBillFile, { validateParsedItems } from '../utils/billParser';
import './BillParserTest.css';

const BillParserTest = () => {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ step: '', progress: 0 });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResults(null);
    setError(null);
  };

  const handleParse = async () => {
    if (!file) return;

    setParsing(true);
    setError(null);
    setResults(null);

    try {
      console.log('Starting to parse file:', file.name);
      
      // Track progress
      const progressCallback = (step, progress) => {
        setProgress({ step, progress });
      };

      const parsedItems = await parseBillFile(file);
      console.log('Raw parsed items:', parsedItems);

      const validatedItems = validateParsedItems(parsedItems);
      console.log('Validated items:', validatedItems);

      setResults({
        rawItems: parsedItems,
        validatedItems: validatedItems,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

    } catch (err) {
      console.error('Parsing error:', err);
      setError(err.message);
    } finally {
      setParsing(false);
      setProgress({ step: '', progress: 0 });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadSampleBill = () => {
    // Create a sample bill text content
    const sampleBillContent = `
TECH SUPPLIES INVOICE
Date: ${new Date().toISOString().split('T')[0]}
Invoice #: INV-2025-001

BILL TO:
Sample Customer
123 Main St
Anytown, ST 12345

ITEMS:
SKU         Description                    Qty    Unit Price    Total
PROD001     Wireless Headphones            2      $45.99        $91.98
PROD002     Bluetooth Speaker              1      $35.50        $35.50
PROD003     USB Cable Type-C               5      $8.99         $44.95
HDMI001     HDMI Cable 6ft                 3      $12.99        $38.97
MOUSE01     Wireless Mouse                 2      $25.99        $51.98

                                          Subtotal: $263.38
                                             Tax: $26.34
                                           Total: $289.72

Thank you for your business!
    `;

    const blob = new Blob([sampleBillContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-invoice.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bill-parser-test">
      <div className="test-container">
        <header className="test-header">
          <h1>🧪 Bill Parser Test Lab</h1>
          <p>Test the OCR and PDF parsing functionality with real files</p>
        </header>

        <div className="test-content">
          {/* File Upload Section */}
          <div className="test-section">
            <h2>📁 Upload Test File</h2>
            <div className="upload-area">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.txt"
                onChange={handleFileChange}
                className="file-input"
              />
              <div className="file-info">
                {file ? (
                  <div className="selected-file">
                    <p><strong>Selected:</strong> {file.name}</p>
                    <p><strong>Type:</strong> {file.type}</p>
                    <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
                  </div>
                ) : (
                  <p>No file selected</p>
                )}
              </div>
            </div>
            
            <div className="action-buttons">
              <button
                onClick={handleParse}
                disabled={!file || parsing}
                className="btn btn-primary"
              >
                {parsing ? '⏳ Parsing...' : '🔍 Parse Bill'}
              </button>
              <button
                onClick={downloadSampleBill}
                className="btn btn-secondary"
              >
                📄 Download Sample Bill
              </button>
            </div>

            {progress.step && (
              <div className="progress-info">
                <p><strong>Status:</strong> {progress.step}</p>
                {progress.progress > 0 && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="test-section error-section">
              <h2>❌ Error</h2>
              <div className="error-content">
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Results Display */}
          {results && (
            <div className="test-section results-section">
              <h2>✅ Parsing Results</h2>
              
              <div className="results-grid">
                {/* File Info */}
                <div className="result-card">
                  <h3>📄 File Information</h3>
                  <ul>
                    <li><strong>Name:</strong> {results.fileName}</li>
                    <li><strong>Type:</strong> {results.fileType}</li>
                    <li><strong>Size:</strong> {formatFileSize(results.fileSize)}</li>
                  </ul>
                </div>

                {/* Raw Items */}
                <div className="result-card">
                  <h3>🔍 Raw Extracted Items ({results.rawItems.length})</h3>
                  {results.rawItems.length > 0 ? (
                    <div className="items-list">
                      {results.rawItems.map((item, index) => (
                        <div key={index} className="item-card raw-item">
                          <div className="item-sku">{item.sku}</div>
                          <div className="item-details">
                            {item.name && <div className="item-name">{item.name}</div>}
                            <div className="item-qty">Qty: {item.qty}</div>
                            {item.price && <div className="item-price">Price: ${item.price}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-items">No items found</p>
                  )}
                </div>

                {/* Validated Items */}
                <div className="result-card">
                  <h3>✅ Validated Items ({results.validatedItems.length})</h3>
                  {results.validatedItems.length > 0 ? (
                    <div className="items-list">
                      {results.validatedItems.map((item, index) => (
                        <div key={index} className="item-card validated-item">
                          <div className="item-sku">{item.sku}</div>
                          <div className="item-details">
                            {item.name && <div className="item-name">{item.name}</div>}
                            <div className="item-qty">Qty: {item.qty}</div>
                            {item.price && <div className="item-price">Price: ${item.price}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-items">No valid items found</p>
                  )}
                </div>
              </div>

              {/* JSON Output */}
              <div className="json-output">
                <h3>📋 JSON Output</h3>
                <pre className="json-content">
                  {JSON.stringify(results.validatedItems, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="test-section instructions-section">
            <h2>📝 Testing Instructions</h2>
            <div className="instructions-grid">
              <div className="instruction-card">
                <h3>🖼️ Image Files (OCR)</h3>
                <ul>
                  <li>Upload JPG, PNG images of bills/invoices</li>
                  <li>Ensure text is clear and readable</li>
                  <li>Good lighting and minimal skew work best</li>
                  <li>OCR processes in browser using Tesseract.js</li>
                </ul>
              </div>
              
              <div className="instruction-card">
                <h3>📄 PDF Files</h3>
                <ul>
                  <li>Upload PDF bills/invoices</li>
                  <li>Text-based PDFs work best</li>
                  <li>Scanned PDFs may have mixed results</li>
                  <li>Processing extracts text directly</li>
                </ul>
              </div>
              
              <div className="instruction-card">
                <h3>📋 Expected Format</h3>
                <ul>
                  <li>SKU: Alphanumeric codes (3+ chars)</li>
                  <li>Quantity: Positive integers</li>
                  <li>Various table formats supported</li>
                  <li>Line-by-line parsing available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillParserTest;
