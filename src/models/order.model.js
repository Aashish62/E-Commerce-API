import { DataTypes } from 'sequelize';

const OrderModel = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled'), defaultValue: 'pending' }
  }, {
    tableName: 'orders'
  });

  return Order;
};

export default OrderModel;
