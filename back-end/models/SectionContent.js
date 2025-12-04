import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class SectionContent extends Model {}

  SectionContent.init(
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

      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Text content or description related to this section",
      },

      photo: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "File name or image URL",
      },
    },
    {
      sequelize,
      modelName: "SectionContent",
      tableName: "section_contents",
      timestamps: true,
      indexes: [{ fields: ["sectionId"] }, { fields: ["subsectionId"] }],
    }
  );

  return SectionContent;
};
