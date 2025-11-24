
import models from '../models/index.js';
const { CartItem, Order, OrderItem, Product, sequelize } = models;

export const placeOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const items = await CartItem.findAll({ where: { userId: req.user.id }, include: [Product], transaction: t });
    if (!items.length) {
      await t.rollback();
      return res.status(400).json({ message: 'Cart empty' });
    }

    // Check stock availability
    for (const it of items) {
      if (it.quantity > it.Product.stock) {
        await t.rollback();
        return res.status(400).json({ message: `Not enough stock for ${it.Product.name}` });
      }
    }

    const total = items.reduce((s, i) => s + i.priceAtAddition * i.quantity, 0);
    const order = await Order.create({ userId: req.user.id, totalAmount: total, status: 'pending' }, { transaction: t });

    for (const it of items) {
      await OrderItem.create({
        orderId: order.id,
        productId: it.productId,
        quantity: it.quantity,
        priceAtPurchase: it.priceAtAddition
      }, { transaction: t });

      // reduce product stock (live price change should not affect existing order)
      it.Product.stock = it.Product.stock - it.quantity;
      await it.Product.save({ transaction: t });
    }

    // clear cart
    await CartItem.destroy({ where: { userId: req.user.id }, transaction: t });

    await t.commit();
    res.status(201).json({ message: 'Order placed successfully', data: order });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

export const  getOrders = async (req, res, next) => {
  try {
    const where = {};
    if (req.user.role === 'customer') where.userId = req.user.id;
    const orders = await Order.findAll({
      where,
      include: [{ model: OrderItem, include: [Product] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (err) { next(err); }
};
