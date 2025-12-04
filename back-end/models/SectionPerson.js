import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class SectionPerson extends Model {}

  SectionPerson.init(
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

      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      designation: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      photoPath: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      about: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Detailed description or profile of the faculty member",
      },
    },
    {
      sequelize,
      modelName: "SectionPerson",
      tableName: "section_people",
      timestamps: true,

      indexes: [{ fields: ["sectionId"] }, { fields: ["subsectionId"] }],
    }
  );

  return SectionPerson;
};
