import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stock from '../models/Stock.js';

dotenv.config();

const sampleStocks = [
  { sku: 'TSHIRT-RED-M', quantity: 25, color: 'Red', size: 'M' },
  { sku: 'TSHIRT-RED-L', quantity: 18, color: 'Red', size: 'L' },
  { sku: 'TSHIRT-BLUE-M', quantity: 32, color: 'Blue', size: 'M' },
  { sku: 'TSHIRT-BLUE-L', quantity: 15, color: 'Blue', size: 'L' },
  { sku: 'JEANS-DARK-32', quantity: 12, color: 'Dark Blue', size: '32' },
  { sku: 'JEANS-DARK-34', quantity: 8, color: 'Dark Blue', size: '34' },
  { sku: 'HOODIE-GRAY-M', quantity: 20, color: 'Gray', size: 'M' },
  { sku: 'HOODIE-GRAY-L', quantity: 14, color: 'Gray', size: 'L' },
  { sku: 'SNEAKERS-WHITE-9', quantity: 6, color: 'White', size: '9' },
  { sku: 'SNEAKERS-WHITE-10', quantity: 4, color: 'White', size: '10' },
  { sku: 'HAT-BLACK', quantity: 35, color: 'Black', size: null },
  { sku: 'SOCKS-WHITE', quantity: 100, color: 'White', size: null }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Stock.deleteMany({});
    console.log('Cleared existing stock data');

    // Insert sample data
    const createdStocks = await Stock.insertMany(sampleStocks);
    console.log(`✅ Successfully seeded ${createdStocks.length} stock items:`);
    
    createdStocks.forEach(stock => {
      console.log(`   ${stock.sku} - Qty: ${stock.quantity}${stock.color ? ` - ${stock.color}` : ''}${stock.size ? ` - ${stock.size}` : ''}`);
    });

    // Display summary
    const totalQuantity = await Stock.aggregate([
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total SKUs: ${createdStocks.length}`);
    console.log(`   Total Quantity: ${totalQuantity[0]?.total || 0}`);

    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
