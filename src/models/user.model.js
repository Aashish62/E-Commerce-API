
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

const UserModel = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'customer'), defaultValue: 'customer' },
    name: { type: DataTypes.STRING }
  }, {
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
        user.password = await bcrypt.hash(user.password, rounds);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
          user.password = await bcrypt.hash(user.password, rounds);
        }
      }
    }
  });

  User.prototype.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
  };

  return User;
};

export default UserModel;
