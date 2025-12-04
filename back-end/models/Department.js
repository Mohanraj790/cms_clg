import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Department extends Model {}
  Department.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      slug: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      name: { type: DataTypes.STRING(150), allowNull: false },
    },
    {
      sequelize,
      modelName: "Department",
      tableName: "departments",
      indexes: [{ unique: true, fields: ["slug"] }],
    }
  );
  return Department;
};
