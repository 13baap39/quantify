import React, { useState } from 'react';
import BillParser from '../components/BillParser';
import './BillParserDemo.css';

const BillParserDemo = () => {
  const [showParser, setShowParser] = useState(false);
  const [stockUpdates, setStockUpdates] = useState([]);

  const handleStockUpdate = (updates, billData) => {
    console.log('Stock updates received:', updates);
    console.log('Bill data received:', billData);
    
    setStockUpdates(updates);
    setShowParser(false);
    
    // Show success message
    alert(`Successfully processed bill! ${updates.length} items ready for stock update.`);
  };

  const sampleBills = [
    {
      name: 'electronics_invoice.pdf',
      description: 'Sample electronics invoice with multiple items',
      type: 'PDF'
    },
    {
      name: 'receipt_hardware.jpg',
      description: 'Hardware store receipt image',
      type: 'Image'
    },
    {
      name: 'supplier_bill.png',
      description: 'Supplier bill with product codes',
      type: 'Image'
    }
  ];

  return (
    <div className="bill-parser-demo">
      <div className="demo-container">
        <header className="demo-header">
          <h1>🔍 Bill Parser Demo</h1>
          <p>Test the OCR and PDF parsing capabilities of the Bill Parser component</p>
        </header>

        <div className="demo-content">
          <div className="demo-section">
            <h2>How It Works</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>📤 Upload</h3>
                  <p>Upload an image (JPG, PNG) or PDF file of your bill or invoice</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>🔍 Parse</h3>
                  <p>Our OCR/PDF parser extracts product information, SKUs, and quantities</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>✏️ Review</h3>
                  <p>Review and edit the extracted data before applying to inventory</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>✅ Apply</h3>
                  <p>Apply the changes to update your stock quantities automatically</p>
                </div>
              </div>
            </div>
          </div>

          <div className="demo-section">
            <h2>Sample Bills for Testing</h2>
            <div className="sample-bills">
              {sampleBills.map((bill, index) => (
                <div key={index} className="bill-card">
                  <div className="bill-icon">
                    {bill.type === 'PDF' ? '📄' : '🖼️'}
                  </div>
                  <div className="bill-info">
                    <h4>{bill.name}</h4>
                    <p>{bill.description}</p>
                    <span className="bill-type">{bill.type}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="sample-note">
              <strong>Note:</strong> Upload any bill file to see the parser in action. The demo uses simulated OCR results based on filename patterns.
            </p>
          </div>

          <div className="demo-section">
            <h2>Features</h2>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">🖼️</span>
                <div>
                  <h4>Image OCR</h4>
                  <p>Extract text from JPG and PNG images using OCR technology</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📄</span>
                <div>
                  <h4>PDF Parsing</h4>
                  <p>Extract structured data from PDF invoices and receipts</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✏️</span>
                <div>
                  <h4>Manual Editing</h4>
                  <p>Review and modify extracted data before applying changes</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
                <div>
                  <h4>Smart Detection</h4>
                  <p>Automatically identify SKUs, product names, and quantities</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💾</span>
                <div>
                  <h4>Bulk Updates</h4>
                  <p>Apply multiple stock changes at once from a single bill</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <div>
                  <h4>Real-time Preview</h4>
                  <p>See how changes will affect your inventory before applying</p>
                </div>
              </div>
            </div>
          </div>

          <div className="demo-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => setShowParser(true)}
            >
              🚀 Try Bill Parser
            </button>
          </div>

          {stockUpdates.length > 0 && (
            <div className="demo-section">
              <h2>Last Processed Bill</h2>
              <div className="processed-items">
                {stockUpdates.map((item, index) => (
                  <div key={index} className="processed-item">
                    <span className="item-sku">{item.sku}</span>
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                    <span className={`item-operation ${item.operation}`}>
                      {item.operation === 'add' ? '➕' : '➖'} {item.operation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showParser && (
        <BillParser
          onClose={() => setShowParser(false)}
          onStockUpdate={handleStockUpdate}
        />
      )}
    </div>
  );
};

export default BillParserDemo;
