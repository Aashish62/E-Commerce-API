import sequelize from '../config/db.js';

import UserModel from '../models/user.model.js';
import CategoryModel from '../models/category.model.js';
import ProductModel from '../models/product.model.js';
import CartItemModel from '../models/cartItem.model.js';
import OrderModel from '../models/order.model.js';
import OrderItemModel from '../models/orderItem.model.js';

// Initialize Models
const User = UserModel(sequelize);
const Category = CategoryModel(sequelize);
const Product = ProductModel(sequelize);
const CartItem = CartItemModel(sequelize);
const Order = OrderModel(sequelize);
const OrderItem = OrderItemModel(sequelize);

// Associations
User.hasMany(CartItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });


// Named exports for compatibility with ES module imports
export { sequelize, User, Category, Product, CartItem, Order, OrderItem };

// Default export for compatibility
export default {
  sequelize,
  User,
  Category,
  Product,
  CartItem,
  Order,
  OrderItem
};
