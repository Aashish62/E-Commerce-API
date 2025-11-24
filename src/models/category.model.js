
import { DataTypes } from 'sequelize';

 const CategoryModel = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT }
  }, {
    tableName: 'categories'
  });

  return Category;
};

export default CategoryModel;