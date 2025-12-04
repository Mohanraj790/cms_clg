import { Router } from "express";
import {
  listDepartments,
  getDepartmentBySlug,
} from "../controllers/department.controller.js";


const router = Router();

router.get("/", listDepartments);
router.get("/:slugOrId", getDepartmentBySlug);


export default router;
