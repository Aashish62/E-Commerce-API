import { DataTypes } from 'sequelize';

const ProductModel = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0 } },
    stock: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
    imageUrl: { type: DataTypes.STRING },
    categoryId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    tableName: 'products'
  });

  return Product;
};

export default ProductModel;
