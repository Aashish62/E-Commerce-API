import { DataTypes } from 'sequelize';
const OrderItemModel = (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    priceAtPurchase: { type: DataTypes.FLOAT, allowNull: false } // persistent price stored on order
  }, {
    tableName: 'order_items'
  });

  return OrderItem;
};

export default OrderItemModel;
