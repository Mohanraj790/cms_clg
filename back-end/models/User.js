import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class User extends Model {}
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.STRING(100), allowNull: false },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      indexes: [{ unique: true, fields: ["email"] }],
    }
  );
  return User;
};
