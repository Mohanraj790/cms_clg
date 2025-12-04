import { Router } from "express";
import {
  listSections,
  addSection,
 getSectionById,
  updateSection,
  deleteSection,
} from "../controllers/section.controller.js";

const router = Router();

router.get("/__sections__", (req, res) => res.send("sections router OK"));

router.get("/:slugOrId/sections", listSections);
router.post("/:slugOrId/sections", addSection);
router.get("/:slugOrId/sections/:sectionId", getSectionById);

router.patch("/:slugOrId/sections/:sectionId", updateSection);
router.delete("/:slugOrId/sections/:sectionId", deleteSection);
export default router;
