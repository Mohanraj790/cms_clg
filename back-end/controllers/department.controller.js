import { Department } from "../models/index.js";

export const listDepartments = async (_req, res) => {
  try {
    const departments = await Department.findAll({
      attributes: ["id", "slug", "name"],
      order: [["id", "ASC"]],
    });

    res.json({ ok: true, data: departments });
  } catch (err) {
    console.error("listDepartments:", err);
    res.status(500).json({ ok: false, message: "Failed to fetch departments" });
  }
};

export const getDepartmentBySlug = async (req, res) => {
  try {
    const value = req.params.slugOrId;

    if (!value) {
      return res
        .status(400)
        .json({ ok: false, message: "Missing department identifier" });
    }

    const where = /^\d+$/.test(value)
      ? { id: Number(value) }
      : { slug: value.toLowerCase() };

    const dep = await Department.findOne({
      where,
      attributes: ["id", "slug", "name"],
    });

    if (!dep) {
      return res
        .status(404)
        .json({ ok: false, message: "Department not found" });
    }

    res.json({ ok: true, data: dep });
  } catch (err) {
    console.error("getDepartmentBySlug:", err);
    res.status(500).json({ ok: false, message: "Failed to fetch department" });
  }
};
