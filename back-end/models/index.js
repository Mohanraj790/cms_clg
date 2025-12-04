import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";

import UserFactory from "./User.js";
import DepartmentFactory from "./Department.js";
import SectionFactory from "./Section.js";
import SubSectionFactory from "./SubSection.js";
import SectionFileFactory from "./SectionFile.js";
import SectionPersonFactory from "./SectionPerson.js";
import SectionExcelFileFactory from "./SectionExcelFile.js";
import SectionContentFactory from "./SectionContent.js";

export const User = UserFactory(sequelize, DataTypes);
export const Department = DepartmentFactory(sequelize, DataTypes);
export const Section = SectionFactory(sequelize, DataTypes);
export const SubSection = SubSectionFactory(sequelize, DataTypes);
export const SectionFile = SectionFileFactory(sequelize, DataTypes);
export const SectionPerson = SectionPersonFactory(sequelize, DataTypes);
export const SectionExcelFile = SectionExcelFileFactory(sequelize, DataTypes);
export const SectionContent = SectionContentFactory(sequelize, DataTypes);

Department.hasMany(Section, {
  as: "sections",
  foreignKey: { name: "departmentId", allowNull: false },
  onDelete: "CASCADE",
});
Section.belongsTo(Department, {
  as: "department",
  foreignKey: { name: "departmentId", allowNull: false },
});
Department.hasMany(SubSection, {
  as: "subSections",
  foreignKey: { name: "departmentId", allowNull: false },
  onDelete: "CASCADE",
});
SubSection.belongsTo(Department, {
  as: "department",
  foreignKey: { name: "departmentId", allowNull: false },
});
Section.hasMany(SubSection, {
  as: "subSections",
  foreignKey: { name: "sectionId", allowNull: false },
  onDelete: "CASCADE",
});
SubSection.belongsTo(Section, {
  as: "section",
  foreignKey: { name: "sectionId", allowNull: false },
});
Section.hasMany(SectionFile, {
  foreignKey: "sectionId",
  as: "files",
  onDelete: "CASCADE",
});
SectionFile.belongsTo(Section, {
  foreignKey: "sectionId",
  as: "section",
});

Section.hasMany(SectionPerson, {
  foreignKey: "sectionId",
  as: "people",
  onDelete: "CASCADE",
});
SectionPerson.belongsTo(Section, {
  foreignKey: "sectionId",
  as: "section",
});

Section.hasMany(SectionExcelFile, {
  foreignKey: "sectionId",
  as: "excelFiles",
  onDelete: "CASCADE",
});
SectionExcelFile.belongsTo(Section, {
  foreignKey: "sectionId",
  as: "section",
});

Department.hasMany(SectionExcelFile, {
  foreignKey: "departmentId",
  as: "excelFiles",
  onDelete: "CASCADE",
});
SectionExcelFile.belongsTo(Department, {
  foreignKey: "departmentId",
  as: "department",
});

Section.hasMany(SectionContent, {
  foreignKey: "sectionId",
  as: "contents",
  onDelete: "CASCADE",
});
SectionContent.belongsTo(Section, {
  foreignKey: "sectionId",
  as: "section",
});

export const initAndSeed = async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync({ alter: true });

    const depCount = await Department.count();
    if (depCount === 0) {
      await Department.bulkCreate(
        [
          { id: 1, slug: "mech", name: "Mechanical Engineering" },
          { id: 2, slug: "cse", name: "Computer Science & Engineering" },
          { id: 3, slug: "cyber", name: "Cyber Security" },
          {
            id: 4,
            slug: "ece",
            name: "Electronics & Communication Engineering",
          },
          { id: 5, slug: "agri", name: "Agricultural Engineering" },
          { id: 6, slug: "biomed", name: "Biomedical Engineering" },
          {
            id: 7,
            slug: "aids",
            name: "Artificial Intelligence & Data Science",
          },
          { id: 8, slug: "it", name: "Information Technology" },
          { id: 9, slug: "snh", name: "Science & Humanities" },
        ],
        { validate: true }
      );
    }
  } catch (err) {
    console.error("❌ initAndSeed failed:", err);
    throw err;
  }
};

export { sequelize };
export default {
  sequelize,
  User,
  Department,
  Section,
  SubSection,
  SectionFile,
  SectionPerson,
  SectionExcelFile,
  SectionContent,
};
