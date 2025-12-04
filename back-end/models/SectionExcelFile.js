// import { DataTypes, Model } from "sequelize";

// export default (sequelize) => {
//   class SectionExcelFile extends Model {}

//   SectionExcelFile.init(
//     {
//       id: {
//         type: DataTypes.INTEGER.UNSIGNED,
//         autoIncrement: true,
//         primaryKey: true,
//       },

//       sectionId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
//       departmentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },

//       originalName: { type: DataTypes.STRING(255), allowNull: false },
//       filename: { type: DataTypes.STRING(255), allowNull: false },
//       path: { type: DataTypes.STRING(512), allowNull: false },
//       mime: { type: DataTypes.STRING(120), allowNull: false },
//       ext: { type: DataTypes.STRING(10), allowNull: false },
//       size: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },

//       sheetName: { type: DataTypes.STRING(200), allowNull: true },
//       rowsCount: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
//       meta: { type: DataTypes.JSON, allowNull: true },
//     },
//     {
//       sequelize,
//       modelName: "SectionExcelFile",
//       tableName: "section_excel_files",
//       timestamps: true,
//       indexes: [{ fields: ["sectionId"] }, { fields: ["departmentId"] }],
//     }
//   );

//   return SectionExcelFile;
// };
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class SectionExcelFile extends Model {}

  SectionExcelFile.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      // 🔹 Relations
      departmentId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      sectionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      subsectionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true, // can be null if file belongs directly to a section
        comment: "If present, this file belongs to a subsection",
      },

      // 🔹 File details
      originalName: { type: DataTypes.STRING(255), allowNull: false },
      filename: { type: DataTypes.STRING(255), allowNull: false },
      path: { type: DataTypes.STRING(512), allowNull: false },
      mime: { type: DataTypes.STRING(120), allowNull: false },
      ext: { type: DataTypes.STRING(10), allowNull: false },
      size: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },

      // 🔹 Excel metadata
      sheetName: { type: DataTypes.STRING(200), allowNull: true },
      rowsCount: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      meta: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Extra info like uploadedBy, description, etc.",
      },
    },
    {
      sequelize,
      modelName: "SectionExcelFile",
      tableName: "section_excel_files",
      timestamps: true,
      indexes: [
        { fields: ["sectionId"] },
        { fields: ["subsectionId"] },
        { fields: ["departmentId"] },
      ],
    }
  );

  return SectionExcelFile;
};
