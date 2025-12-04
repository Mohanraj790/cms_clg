import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class SectionFile extends Model {}

  SectionFile.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      sectionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "sections",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      subsectionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: "subsections",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },

      path: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      size: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      mime: {
        type: DataTypes.STRING(120),
        allowNull: false,
        defaultValue: "application/pdf",
      },
    },
    {
      sequelize,
      modelName: "SectionFile",
      tableName: "section_files",
      timestamps: true,
      indexes: [{ fields: ["sectionId"] }, { fields: ["subsectionId"] }],
    }
  );

  return SectionFile;
};
