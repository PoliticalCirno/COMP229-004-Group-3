import Product from '../models/Product.js';

export const createProduct = async (req, res, next) => {
  try {
    const doc = await Product.create(req.body);
    res.status(201).json(doc);
  } catch (e) { next(e); }
};

export const listProducts = async (req, res, next) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;
    const where = {};
    if (q) where.$text = { $search: q };
    if (category) where.category = category;
    if (minPrice || maxPrice) where.price = {};
    if (minPrice) where.price.$gte = Number(minPrice);
    if (maxPrice) where.price.$lte = Number(maxPrice);
    const docs = await Product.find(where).sort({ createdAt: -1 });
    res.json(docs);
  } catch (e) { next(e); }
};

export const getProduct = async (req, res, next) => {
  try {
    const doc = await Product.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
};

export const updateProduct = async (req, res, next) => {
  try {
    const doc = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const doc = await Product.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json({ deleted: true });
  } catch (e) { next(e); }
};
