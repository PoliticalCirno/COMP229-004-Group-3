import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { makeOrderNumber } from '../utils/orderNumber.js';

export const checkout = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });
    const items = cart.items.map(ci => ({
      product: ci.product._id,
      name: ci.product.name,
      price: ci.product.price,
      quantity: ci.quantity
    }));
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      orderNumber: makeOrderNumber()
    });
    await Promise.all(items.map(async it => {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.quantity } });
    }));
    cart.items = [];
    await cart.save();
    res.status(201).json(order);
  } catch (e) { next(e); }
};

export const listMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) { next(e); }
};

export const getOrder = async (req, res, next) => {
  try {
    const o = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!o) return res.status(404).json({ message: 'Order not found' });
    res.json(o);
  } catch (e) { next(e); }
};

export const cancelMyOrder = async (req, res, next) => {
  try {
    const o = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!o) return res.status(404).json({ message: 'Order not found' });
    if (!['Pending','Paid'].includes(o.status)) return res.status(400).json({ message: 'Order cannot be cancelled' });
    o.status = 'Cancelled';
    await o.save();
    res.json(o);
  } catch (e) { next(e); }
};

export const adminListOrders = async (_req, res, next) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) { next(e); }
};

export const adminUpdateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ message: 'Order not found' });
    o.status = status || o.status;
    await o.save();
    res.json(o);
  } catch (e) { next(e); }
};
