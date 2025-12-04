import express from "express";
import { uploadExcel } from "../upload/storage.js";
import {
  uploadSectionExcelFile,
  listSectionExcelFiles,
  getSectionExcelFile,
  deleteSectionExcelFile,
} from "../controllers/sectionExcelFile.controller.js";

const router = express.Router();

router.get("/:slugOrId/sections/:sectionId/excel-files", listSectionExcelFiles);

router.post(
  "/:slugOrId/sections/:sectionId/excel-files",
  uploadExcel.single("file"),
  uploadSectionExcelFile
  // `/departments/cse/sections/${activeTitle.id}/excel/upload`,
);

router.get(
  "/:slugOrId/sections/:sectionId/excel-files/:id",
  getSectionExcelFile
);

router.delete(
  "/:slugOrId/sections/:sectionId/excel-files/:id",
  deleteSectionExcelFile
);

router.get(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/excel-files",
  listSectionExcelFiles
);

router.post(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/excel-files",
  uploadExcel.single("file"),
  uploadSectionExcelFile
);

router.get(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/excel-files/:id",
  getSectionExcelFile
);

router.delete(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/excel-files/:id",
  deleteSectionExcelFile
);

export default router;
