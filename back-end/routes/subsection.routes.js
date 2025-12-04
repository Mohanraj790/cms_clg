import express from "express";
import {
  listSubSections,
  addSubSection,
  getSubSectionById,
  updateSubSection,
  deleteSubSection,
} from "../controllers/subSection.controller.js";

const router = express.Router();

// List subsections by Section
router.get("/:slugOrId/sections/:sectionId/all/subsections", listSubSections);

// Add subsection
router.post("/:slugOrId/sections/:sectionId/subsections", addSubSection);

// Get specific subsection
router.get(
  "/:slugOrId/sections/:sectionId/subsections/:subSectionId",
  getSubSectionById
);

// Update subsection
router.put(
  "/:slugOrId/sections/:sectionId/subsections/:subSectionId",
  updateSubSection
);

// Delete subsection
router.delete(
  "/:slugOrId/sections/:sectionId/subsections/:subSectionId",
  deleteSubSection
);

export default router;
