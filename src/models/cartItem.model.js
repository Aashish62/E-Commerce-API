import { DataTypes } from 'sequelize';

const CartItemModel = (sequelize) => {
  const CartItem = sequelize.define('CartItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    priceAtAddition: { type: DataTypes.FLOAT, allowNull: false } // persistent price
  }, {
    tableName: 'cart_items'
  });

  return CartItem;
};

export default CartItemModel;