import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const ensureCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await ensureCart(req.user.id);
    await cart.populate('items.product');
    res.json(cart);
  } catch (e) { next(e); }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Math.max(1, Number(quantity) || 1);
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const cart = await ensureCart(req.user.id);
    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx >= 0) cart.items[idx].quantity += qty;
    else cart.items.push({ product: productId, quantity: qty });
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate('items.product');
    res.status(201).json(cart);
  } catch (e) { next(e); }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await ensureCart(req.user.id);
    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx < 0) return res.status(404).json({ message: 'Item not in cart' });
    const qty = Number(quantity);
    if (qty <= 0) cart.items.splice(idx, 1);
    else cart.items[idx].quantity = qty;
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (e) { next(e); }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const cart = await ensureCart(req.user.id);
    cart.items = cart.items.filter(i => i.product.toString() != productId);
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (e) { next(e); }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await ensureCart(req.user.id);
    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();
    res.json(cart);
  } catch (e) { next(e); }
};
