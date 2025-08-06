import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.mjs';

/**
 * Main function to parse bills and extract SKU and quantity information
 * @param {File} file - The uploaded file (image or PDF)
 * @returns {Promise<Array<{sku: string, qty: number, name?: string, price?: number}>>}
 */
export async function parseBillFile(file) {
  try {
    // Validate file type
    if (!file) {
      throw new Error('No file provided');
    }

    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    let extractedText = '';

    // Determine parsing method based on file type
    if (fileType.startsWith('image/')) {
      console.log('Processing image file with OCR...');
      extractedText = await extractTextFromImage(file);
    } else if (fileType === 'application/pdf') {
      console.log('Processing PDF file...');
      extractedText = await extractTextFromPDF(file);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    console.log('Extracted text:', extractedText);

    // Parse the extracted text to find SKUs and quantities
    const parsedItems = parseTextForItems(extractedText);

    return parsedItems;
  } catch (error) {
    console.error('Error parsing bill file:', error);
    throw error;
  }
}

/**
 * Extract text from image files using Tesseract.js OCR
 * @param {File} imageFile - The image file to process
 * @returns {Promise<string>} - Extracted text
 */
async function extractTextFromImage(imageFile) {
  try {
    console.log('Starting OCR processing...');
    
    const { data: { text } } = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: m => {
          console.log(`OCR Progress: ${m.status} - ${Math.round(m.progress * 100)}%`);
        },
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_.,: \n\t()[]{}|/$#@!%^&*+=<>?',
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        preserve_interword_spaces: '1'
      }
    );

    console.log('OCR completed successfully');
    return text;
  } catch (error) {
    console.error('OCR processing failed:', error);
    throw new Error(`OCR processing failed: ${error.message}`);
  }
}

/**
 * Extract text from PDF files using PDF.js
 * @param {File} pdfFile - The PDF file to process
 * @returns {Promise<string>} - Extracted text
 */
async function extractTextFromPDF(pdfFile) {
  try {
    console.log('Starting PDF text extraction...');
    
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const numPages = pdf.numPages;
    
    console.log(`PDF has ${numPages} pages`);
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
        
      fullText += pageText + '\n';
      console.log(`Extracted text from page ${pageNum}`);
    }
    
    console.log('PDF text extraction completed');
    return fullText;
  } catch (error) {
    console.error('PDF processing failed:', error);
    throw new Error(`PDF processing failed: ${error.message}`);
  }
}

/**
 * Parse extracted text to find SKUs, quantities, and product information
 * @param {string} text - The extracted text from the bill
 * @returns {Array<{sku: string, qty: number, name?: string, price?: number}>}
 */
function parseTextForItems(text) {
  const items = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  console.log('Parsing text for items...');
  console.log('Total lines to process:', lines.length);
  
  // Multiple parsing strategies to handle different bill formats
  const strategies = [
    parseTableFormat,
    parseLineByLineFormat,
    parseKeyValueFormat,
    parseDescriptiveFormat
  ];
  
  for (const strategy of strategies) {
    const results = strategy(lines, text);
    if (results.length > 0) {
      console.log(`Found ${results.length} items using ${strategy.name}`);
      items.push(...results);
      break; // Use the first strategy that finds items
    }
  }
  
  // If no items found with structured parsing, try fallback patterns
  if (items.length === 0) {
    console.log('No items found with structured parsing, trying fallback patterns...');
    const fallbackResults = parseFallbackPatterns(text);
    items.push(...fallbackResults);
  }
  
  // Clean up and validate results
  const cleanedItems = items
    .filter(item => item.sku && item.qty > 0)
    .map(item => ({
      sku: item.sku.toUpperCase().trim(),
      qty: parseInt(item.qty),
      name: item.name ? item.name.trim() : undefined,
      price: item.price ? parseFloat(item.price) : undefined
    }))
    // Remove duplicates
    .reduce((unique, item) => {
      const existing = unique.find(u => u.sku === item.sku);
      if (existing) {
        existing.qty += item.qty; // Combine quantities for same SKU
      } else {
        unique.push(item);
      }
      return unique;
    }, []);
  
  console.log(`Final parsed items:`, cleanedItems);
  return cleanedItems;
}

/**
 * Parse table format bills (common in invoices)
 * Looks for patterns like: SKU | Description | Qty | Price
 */
function parseTableFormat(lines, fullText) {
  const items = [];
  
  // Look for table headers to identify the format
  const headerPatterns = [
    /(?:item|sku|code|part).{0,20}(?:description|name).{0,20}(?:qty|quantity|amount)/i,
    /(?:product|item).{0,30}(?:qty|quantity)/i,
    /(?:sku|code).{0,30}(?:qty|quantity)/i
  ];
  
  let headerIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (headerPatterns.some(pattern => pattern.test(lines[i]))) {
      headerIndex = i;
      break;
    }
  }
  
  if (headerIndex === -1) return items;
  
  console.log('Found table header at line:', headerIndex);
  
  // Parse items starting after the header
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip obviously non-item lines
    if (line.match(/total|subtotal|tax|discount|payment|terms|thank you/i)) {
      break;
    }
    
    // Try to extract SKU and quantity from the line
    const item = extractItemFromLine(line);
    if (item) {
      items.push(item);
    }
  }
  
  return items;
}

/**
 * Parse line-by-line format where each line contains one item
 */
function parseLineByLineFormat(lines, fullText) {
  const items = [];
  
  for (const line of lines) {
    // Skip header and footer lines
    if (line.match(/invoice|receipt|bill|total|subtotal|tax|date|customer|vendor|address|phone|email|thank you|terms|conditions/i)) {
      continue;
    }
    
    const item = extractItemFromLine(line);
    if (item) {
      items.push(item);
    }
  }
  
  return items;
}

/**
 * Parse key-value format (less common but exists)
 * Looks for patterns like "Item: SKU123, Quantity: 5"
 */
function parseKeyValueFormat(lines, fullText) {
  const items = [];
  
  for (const line of lines) {
    // Look for key-value patterns
    const kvMatches = line.match(/(sku|item|product|code):\s*([A-Z0-9-_]+).*?(?:qty|quantity|amount):\s*(\d+)/i);
    if (kvMatches) {
      items.push({
        sku: kvMatches[2],
        qty: parseInt(kvMatches[3]),
        name: extractProductName(line)
      });
    }
  }
  
  return items;
}

/**
 * Parse descriptive format where items are described in sentences
 */
function parseDescriptiveFormat(lines, fullText) {
  const items = [];
  
  // Look for patterns like "5 units of PROD123" or "PROD123 x 3"
  const descriptivePatterns = [
    /(\d+)\s+(?:units?\s+of|pieces?\s+of|qty\s+of)?\s*([A-Z0-9-_]{3,})/gi,
    /([A-Z0-9-_]{3,})\s*[x×]\s*(\d+)/gi,
    /([A-Z0-9-_]{3,}).*?(?:quantity|qty|amount):\s*(\d+)/gi
  ];
  
  for (const line of lines) {
    for (const pattern of descriptivePatterns) {
      let match;
      while ((match = pattern.exec(line)) !== null) {
        if (pattern === descriptivePatterns[0]) {
          // Pattern: "5 units of PROD123"
          items.push({
            sku: match[2],
            qty: parseInt(match[1]),
            name: extractProductName(line)
          });
        } else if (pattern === descriptivePatterns[1]) {
          // Pattern: "PROD123 x 3"
          items.push({
            sku: match[1],
            qty: parseInt(match[2]),
            name: extractProductName(line)
          });
        } else {
          // Pattern: "PROD123 quantity: 3"
          items.push({
            sku: match[1],
            qty: parseInt(match[2]),
            name: extractProductName(line)
          });
        }
      }
    }
  }
  
  return items;
}

/**
 * Fallback parsing for when structured methods fail
 */
function parseFallbackPatterns(text) {
  const items = [];
  
  // Very broad patterns as last resort
  const fallbackPatterns = [
    // Look for any alphanumeric code followed by numbers
    /([A-Z]{2,}[0-9]{2,}|[0-9]{2,}[A-Z]{2,})[^\d]*(\d+)/g,
    // Look for product codes in various formats
    /(PROD|ITEM|SKU|CODE)?[_-]?([A-Z0-9]{4,})[^\d]*(\d+)/gi
  ];
  
  for (const pattern of fallbackPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const sku = match[1] || match[2];
      const qty = parseInt(match[match.length - 1]);
      
      if (sku && qty && qty > 0 && qty < 1000) { // Reasonable quantity range
        items.push({
          sku: sku,
          qty: qty
        });
      }
    }
  }
  
  return items;
}

/**
 * Extract item information from a single line of text
 */
function extractItemFromLine(line) {
  // Common patterns for item lines
  const patterns = [
    // SKU followed by description and quantity: "PROD123 Widget Name 5 $29.99"
    /([A-Z0-9-_]{3,})\s+(.+?)\s+(\d+)\s+[\$€£]?([\d.,]+)/i,
    // Quantity first: "5 PROD123 Widget Name $29.99"
    /(\d+)\s+([A-Z0-9-_]{3,})\s+(.+?)\s+[\$€£]?([\d.,]+)/i,
    // Simple SKU and quantity: "PROD123 5"
    /([A-Z0-9-_]{3,})\s+(\d+)/i,
    // Quantity and SKU: "5 PROD123"
    /(\d+)\s+([A-Z0-9-_]{3,})/i,
    // Tab or pipe separated: "PROD123|Widget|5|$29.99"
    /([A-Z0-9-_]{3,})[\t|]+(.+?)[\t|]+(\d+)[\t|]+([\d.,]+)/i,
    // Spaced format: "PROD123    Widget Name    5    $29.99"
    /([A-Z0-9-_]{3,})\s{2,}(.+?)\s{2,}(\d+)\s{2,}[\$€£]?([\d.,]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      let sku, qty, name, price;
      
      // Determine which group contains what based on the pattern
      if (pattern === patterns[1]) {
        // Quantity first pattern
        qty = parseInt(match[1]);
        sku = match[2];
        name = match[3];
        price = parseFloat(match[4]?.replace(/[^0-9.]/g, ''));
      } else if (pattern === patterns[2] || pattern === patterns[5]) {
        // Simple SKU and quantity
        sku = match[1];
        qty = parseInt(match[2]);
      } else if (pattern === patterns[3]) {
        // Quantity and SKU
        qty = parseInt(match[1]);
        sku = match[2];
      } else {
        // Standard patterns
        sku = match[1];
        name = match[2];
        qty = parseInt(match[3]);
        price = parseFloat(match[4]?.replace(/[^0-9.]/g, ''));
      }
      
      // Validate the extracted data
      if (sku && qty && qty > 0 && qty < 1000) {
        return {
          sku: sku.trim(),
          qty: qty,
          name: name ? name.trim() : undefined,
          price: price && !isNaN(price) ? price : undefined
        };
      }
    }
  }
  
  return null;
}

/**
 * Extract product name from a line of text
 */
function extractProductName(line) {
  // Remove SKU patterns and extract remaining text as product name
  const cleanLine = line
    .replace(/[A-Z0-9-_]{3,}/g, '') // Remove SKU-like patterns
    .replace(/\d+/g, '') // Remove numbers
    .replace(/[\$€£]?[\d.,]+/g, '') // Remove prices
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  return cleanLine.length > 2 ? cleanLine : undefined;
}

/**
 * Validate and normalize extracted data
 */
export function validateParsedItems(items) {
  return items.filter(item => {
    // Validate SKU format (at least 3 characters, alphanumeric)
    if (!item.sku || !/^[A-Z0-9-_]{3,}$/i.test(item.sku)) {
      console.warn('Invalid SKU format:', item.sku);
      return false;
    }
    
    // Validate quantity (positive integer, reasonable range)
    if (!item.qty || item.qty < 1 || item.qty > 10000) {
      console.warn('Invalid quantity:', item.qty);
      return false;
    }
    
    return true;
  });
}

/**
 * Get parsing progress for UI feedback
 */
export class BillParsingProgress {
  constructor() {
    this.currentStep = '';
    this.progress = 0;
    this.callbacks = [];
  }
  
  updateProgress(step, progress) {
    this.currentStep = step;
    this.progress = progress;
    this.callbacks.forEach(callback => callback(step, progress));
  }
  
  onProgress(callback) {
    this.callbacks.push(callback);
  }
  
  removeProgressListener(callback) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }
}

// Export for use in components
export default parseBillFile;
