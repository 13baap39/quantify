import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        // SKU should be alphanumeric with optional hyphens/underscores
        return /^[A-Z0-9_-]+$/.test(v);
      },
      message: 'SKU must contain only uppercase letters, numbers, hyphens, and underscores'
    }
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be a whole number'
    }
  },
  color: {
    type: String,
    trim: true,
    default: null
  },
  size: {
    type: String,
    trim: true,
    default: null
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Index for better query performance
stockSchema.index({ sku: 1 });
stockSchema.index({ lastUpdated: -1 });

// Pre-save middleware to update lastUpdated
stockSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastUpdated = new Date();
  }
  next();
});

// Instance methods
stockSchema.methods.updateQuantity = function(newQuantity) {
  this.quantity = newQuantity;
  this.lastUpdated = new Date();
  return this.save();
};

// Static methods
stockSchema.statics.findBySku = function(sku) {
  return this.findOne({ sku: sku.toUpperCase() });
};

stockSchema.statics.bulkUpdateQuantities = async function(updates) {
  const operations = updates.map(update => ({
    updateOne: {
      filter: { sku: update.sku.toUpperCase() },
      update: { 
        $inc: { quantity: update.quantity }, 
        $set: { lastUpdated: new Date() }
      },
      upsert: false
    }
  }));
  
  return this.bulkWrite(operations);
};

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
