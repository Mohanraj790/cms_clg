import express from "express";
import { uploadPhoto } from "../upload/storage.js";
import {
  listPeople,
  getPerson,
  createPerson,
  updatePerson,
  deletePerson,
  getPersonPhoto,
} from "../controllers/sectionPerson.controller.js";

const router = express.Router();


router.get("/:slugOrId/sections/:sectionId/people", listPeople);

router.get("/:slugOrId/sections/:sectionId/people/:personId", getPerson);

router.get(
  "/:slugOrId/sections/:sectionId/people/:personId/photo",
  getPersonPhoto
);

router.post(
  "/:slugOrId/sections/:sectionId/people",
  uploadPhoto.single("photo"),
  createPerson
);

router.patch(
  "/:slugOrId/sections/:sectionId/people/:personId",
  uploadPhoto.single("photo"),
  updatePerson
);

router.delete("/:slugOrId/sections/:sectionId/people/:personId", deletePerson);

router.get(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/people",
  listPeople
);

router.get(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/people/:personId",
  getPerson
);

router.get(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/people/:personId/photo",
  getPersonPhoto
);

router.post(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/people",
  uploadPhoto.single("photo"),
  createPerson
);

router.patch(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/people/:personId",
  uploadPhoto.single("photo"),
  updatePerson
);

router.delete(
  "/:slugOrId/sections/:sectionId/subsections/:subsectionId/people/:personId",
  deletePerson
);

export default router;
