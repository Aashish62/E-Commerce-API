
import models from '../models/index.js';
const { CartItem, Product } = models;

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // If item exists in cart, increment quantity — but keep priceAtAddition unchanged
    let cartItem = await CartItem.findOne({ where: { userId: req.user.id, productId } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        userId: req.user.id,
        productId,
        quantity,
        priceAtAddition: product.price 
      });
    }
    res.status(201).json({ message: 'Item added to cart successfully', data: cartItem });
  } catch (err) { next(err); }
};

export const getCart = async (req, res, next) => {
  try {
    const items = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, attributes: ['id', 'name', 'imageUrl', 'stock'] }]
    });
    const total = items.reduce((s, it) => s + (it.priceAtAddition * it.quantity), 0);
    res.json({ items, total });
  } catch (err) { next(err); }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const item = await CartItem.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Not found' });
    await item.destroy();
    res.status(204).json({ message: 'Item removed from cart successfully' });
  } catch (err) { next(err); }
};
