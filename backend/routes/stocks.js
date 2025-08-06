import express from 'express';
import { body, param, validationResult } from 'express-validator';
import Stock from '../models/Stock.js';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// @route   GET /api/stocks
// @desc    Get all stocks with optional filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 100, 
      sortBy = 'sku', 
      sortOrder = 'asc',
      search,
      color,
      size,
      minQuantity,
      maxQuantity
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.sku = { $regex: search, $options: 'i' };
    }
    
    if (color) {
      filter.color = color;
    }
    
    if (size) {
      filter.size = size;
    }
    
    if (minQuantity !== undefined || maxQuantity !== undefined) {
      filter.quantity = {};
      if (minQuantity !== undefined) filter.quantity.$gte = parseInt(minQuantity);
      if (maxQuantity !== undefined) filter.quantity.$lte = parseInt(maxQuantity);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [stocks, total] = await Promise.all([
      Stock.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Stock.countDocuments(filter)
    ]);

    // Calculate summary statistics
    const totalStocks = await Stock.countDocuments();
    const totalQuantity = await Stock.aggregate([
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);

    res.json({
      success: true,
      data: {
        stocks,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: stocks.length,
          totalRecords: total
        },
        summary: {
          totalStocks,
          totalQuantity: totalQuantity[0]?.total || 0,
          filteredResults: total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stocks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/stocks/:sku
// @desc    Get single stock by SKU
// @access  Public
router.get('/:sku', [
  param('sku').notEmpty().withMessage('SKU is required')
], handleValidationErrors, async (req, res) => {
  try {
    const stock = await Stock.findBySku(req.params.sku);
    
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    res.json({
      success: true,
      data: stock
    });

  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stock',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/stocks
// @desc    Create new stock item
// @access  Public
router.post('/', [
  body('sku')
    .notEmpty()
    .withMessage('SKU is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('SKU must be between 1 and 50 characters'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('color')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Color must be less than 30 characters'),
  body('size')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Size must be less than 20 characters')
], handleValidationErrors, async (req, res) => {
  try {
    const { sku, quantity, color, size } = req.body;

    // Check if SKU already exists
    const existingStock = await Stock.findBySku(sku);
    if (existingStock) {
      return res.status(409).json({
        success: false,
        message: 'SKU already exists'
      });
    }

    const stock = new Stock({
      sku: sku.toUpperCase(),
      quantity,
      color: color || null,
      size: size || null
    });

    await stock.save();

    res.status(201).json({
      success: true,
      message: 'Stock created successfully',
      data: stock
    });

  } catch (error) {
    console.error('Error creating stock:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'SKU already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating stock',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/stocks/:sku
// @desc    Update stock quantity and details
// @access  Public
router.put('/:sku', [
  param('sku').notEmpty().withMessage('SKU is required'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('color')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Color must be less than 30 characters'),
  body('size')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Size must be less than 20 characters')
], handleValidationErrors, async (req, res) => {
  try {
    const { quantity, color, size } = req.body;
    
    const stock = await Stock.findBySku(req.params.sku);
    
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    // Update fields
    stock.quantity = quantity;
    if (color !== undefined) stock.color = color || null;
    if (size !== undefined) stock.size = size || null;
    stock.lastUpdated = new Date();

    await stock.save();

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: stock
    });

  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating stock',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PATCH /api/stocks/batch
// @desc    Batch update quantities for multiple SKUs (e.g., from bill parsing)
// @access  Public
router.patch('/batch', [
  body('updates')
    .isArray({ min: 1 })
    .withMessage('Updates must be a non-empty array'),
  body('updates.*.sku')
    .notEmpty()
    .withMessage('Each update must have a SKU'),
  body('updates.*.quantity')
    .isInt()
    .withMessage('Each update must have a valid quantity (can be negative for deductions)'),
  body('operation')
    .optional()
    .isIn(['add', 'subtract', 'set'])
    .withMessage('Operation must be "add", "subtract", or "set"')
], handleValidationErrors, async (req, res) => {
  try {
    const { updates, operation = 'add' } = req.body;

    const results = {
      successful: [],
      failed: [],
      notFound: []
    };

    // Process each update
    for (const update of updates) {
      try {
        const stock = await Stock.findBySku(update.sku);
        
        if (!stock) {
          results.notFound.push({
            sku: update.sku,
            reason: 'SKU not found'
          });
          continue;
        }

        let newQuantity;
        switch (operation) {
          case 'add':
            newQuantity = stock.quantity + update.quantity;
            break;
          case 'subtract':
            newQuantity = stock.quantity - update.quantity;
            break;
          case 'set':
            newQuantity = update.quantity;
            break;
          default:
            newQuantity = stock.quantity + update.quantity;
        }

        // Ensure quantity doesn't go negative
        if (newQuantity < 0) {
          results.failed.push({
            sku: update.sku,
            reason: 'Quantity would become negative',
            currentQuantity: stock.quantity,
            requestedChange: update.quantity
          });
          continue;
        }

        const oldQuantity = stock.quantity;
        await stock.updateQuantity(newQuantity);

        results.successful.push({
          sku: update.sku,
          oldQuantity,
          newQuantity,
          change: newQuantity - oldQuantity
        });

      } catch (error) {
        results.failed.push({
          sku: update.sku,
          reason: error.message
        });
      }
    }

    const statusCode = results.failed.length > 0 ? 207 : 200; // 207 Multi-Status for partial success

    res.status(statusCode).json({
      success: results.failed.length === 0,
      message: `Batch update completed. ${results.successful.length} successful, ${results.failed.length} failed, ${results.notFound.length} not found.`,
      data: results
    });

  } catch (error) {
    console.error('Error in batch update:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during batch update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/stocks/:sku
// @desc    Delete stock item
// @access  Public
router.delete('/:sku', [
  param('sku').notEmpty().withMessage('SKU is required')
], handleValidationErrors, async (req, res) => {
  try {
    const stock = await Stock.findOneAndDelete({ sku: req.params.sku.toUpperCase() });
    
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    res.json({
      success: true,
      message: 'Stock deleted successfully',
      data: stock
    });

  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting stock',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
