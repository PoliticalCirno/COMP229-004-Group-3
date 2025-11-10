import dotenv from 'dotenv';
import { connectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Product from '../src/models/Product.js';

dotenv.config();

const main = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Product.deleteMany({})]);

  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'Admin!234', role: 'admin' });
  const user = await User.create({ name: 'User One', email: 'user1@example.com', password: 'User!234', role: 'user' });

  const products = await Product.insertMany([
    { name: 'Pro Football', description: 'Match-quality football', price: 59.99, image: 'https://example.com/football.jpg', category: 'football', stock: 100 },
    { name: 'Training Football', description: 'Durable training ball', price: 29.99, image: 'https://example.com/football2.jpg', category: 'football', stock: 100 },
    { name: 'Pro Basketball', description: 'Official size and weight', price: 69.99, image: 'https://example.com/basketball.jpg', category: 'basketball', stock: 100 }
  ]);

  console.log('Seeded:', { admin: admin.email, user: user.email, products: products.length });
  process.exit(0);
};

main().catch(err => { console.error(err); process.exit(1); });
