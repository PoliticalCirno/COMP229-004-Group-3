import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const userPurchased = async (userId, productId) => {
  const exists = await Order.exists({
    user: userId,
    'items.product': productId,
    status: { $in: ['Pending','Paid','Shipped','Completed'] }
  });
  return !!exists;
};

const recomputeAvgRating = async (productId) => {
  const agg = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avg: { $avg: '$rating' } } }
  ]);
  const avg = agg[0]?.avg || 0;
  await Product.findByIdAndUpdate(productId, { avgRating: avg });
};

export const createOrUpdateReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!(await userPurchased(req.user.id, productId))) {
      return res.status(403).json({ message: 'You can only review products you purchased' });
    }
    const doc = await Review.findOneAndUpdate(
      { user: req.user.id, product: productId },
      { rating, comment },
      { upsert: true, new: true, runValidators: true }
    );
    await recomputeAvgRating(productId);
    res.status(201).json(doc);
  } catch (e) { next(e); }
};

export const listProductReviews = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const docs = await Review.find({ product: productId }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (e) { next(e); }
};
