import express from "express";
import { uploadPdf } from "../upload/storage.js";
import {
  listSectionFiles,
  getSectionFile,
  downloadSectionFile,
  uploadSectionPdf,
  renameSectionFile,
  deleteSectionFile,
} from "../controllers/sectionFile.controller.js";

const router = express.Router();

router.get("/:slugOrId/sections/:sectionId/files", listSectionFiles);

router.get("/:slugOrId/sections/:sectionId/files/:fileId", getSectionFile);

router.get(
  "/:slugOrId/sections/:sectionId/files/:fileId/download",
  downloadSectionFile
);

router.post(
  "/:slugOrId/sections/:sectionId/files",
  uploadPdf.single("file"),
  uploadSectionPdf
);

router.patch("/:slugOrId/sections/:sectionId/files/:fileId", renameSectionFile);

router.delete(
  "/:slugOrId/sections/:sectionId/files/:fileId",
  deleteSectionFile
);

router.get(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/files",
  listSectionFiles
);

router.get(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/files/:fileId",
  getSectionFile
);

router.get(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/files/:fileId/download",
  downloadSectionFile
);

router.post(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/files",
  uploadPdf.single("file"),
  uploadSectionPdf
);

router.patch(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/files/:fileId",
  renameSectionFile
);

router.delete(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/files/:fileId",
  deleteSectionFile
);

export default router;
