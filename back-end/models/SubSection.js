
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class SubSection extends Model {}

  SubSection.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      sectionId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      departmentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      title: { type: DataTypes.STRING(150), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: "SubSection",
      tableName: "subsections", // ✅ THIS NAME IS CRITICAL
      timestamps: true,
    }
  );

  return SubSection;
};
