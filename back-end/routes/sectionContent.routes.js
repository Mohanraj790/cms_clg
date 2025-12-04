import express from "express";
import {
  listSectionContents,
  getSectionContent,
  uploadSectionContent,
  updateSectionContent,
  deleteSectionContent,
} from "../controllers/sectionContent.controller.js";

import { uploadSectionPhoto } from "../upload/storage.js"; // ✅ photo upload middleware

const router = express.Router();

router.get("/:slugOrId/sections/:sectionId/contents", listSectionContents);
router.get(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/contents",
  listSectionContents
);

router.get(
  "/:slugOrId/sections/:sectionId/contents/:contentId",
  getSectionContent
);
router.get(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/contents/:contentId",
  getSectionContent
);

router.post(
  "/:slugOrId/sections/:sectionId/contents",
  uploadSectionPhoto.single("photo"),
  uploadSectionContent
);
router.post(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/contents",
  uploadSectionPhoto.single("photo"),
  uploadSectionContent
  
      // return `/departments/${departmentSlug}/sections/${activeTitle.id}/subsections/${activeSubSection.id}/contents`;
// 
);

router.put(
  "/:slugOrId/sections/:sectionId/contents/:contentId",
  uploadSectionPhoto.single("photo"),
  updateSectionContent
);
router.put(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/contents/:contentId",
  uploadSectionPhoto.single("photo"),
  updateSectionContent
);

router.delete(
  "/:slugOrId/sections/:sectionId/contents/:contentId",
  deleteSectionContent
);
router.delete(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/contents/:contentId",
  deleteSectionContent
);

export default router;
