
import { DataTypes, Model } from "sequelize";
import { Department } from "./index.js";

export default (sequelize) => {
  class Section extends Model {}

  Section.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      departmentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "departments", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      departmentSlug: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Section",
      tableName: "sections",
      timestamps: true,
      indexes: [{ fields: ["departmentId"] }, { fields: ["departmentSlug"] }],
      hooks: {
        beforeValidate: async (section) => {
          if (!section.departmentId && section.departmentSlug) {
            const dep = await sequelize.models.Department.findOne({
              where: { slug: String(section.departmentSlug).toLowerCase() },
              attributes: ["id", "slug"],
            });
            if (dep) section.departmentId = dep.id;
          }

          if (section.departmentId && !section.departmentSlug) {
            const dep = await sequelize.models.Department.findByPk(
              section.departmentId,
              {
                attributes: ["slug"],
              }
            );
            if (dep) section.departmentSlug = dep.slug;
          }

          if (section.departmentSlug) {
            section.departmentSlug = String(
              section.departmentSlug
            ).toLowerCase();
          }
        },

        beforeSave: async (section) => {
          if (
            section.changed("departmentId") &&
            !section.changed("departmentSlug")
          ) {
            const dep = await sequelize.models.Department.findByPk(
              section.departmentId,
              {
                attributes: ["slug"],
              }
            );
            if (dep) section.departmentSlug = dep.slug.toLowerCase();
          }
        },
      },
    }
  );

  return Section;
};
