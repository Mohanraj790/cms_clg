import { Department, Section } from "../models/index.js";

const getDeptValue = (req) =>
  (req.params.slugOrId ?? req.params.slug ?? req.params.id ?? "").trim();

const resolveDepartment = async (value) => {
  if (!value) return null;

  if (/^\d+$/.test(value)) {
    const dep = await Department.findByPk(Number(value), {
      attributes: ["id", "slug"],
    });
    return dep;
  }

  return Department.findOne({
    where: { slug: String(value).toLowerCase() },
    attributes: ["id", "slug"],
  });
};

export const listSections = async (req, res, next) => {
  try {
    const value = getDeptValue(req);
    const dep = await resolveDepartment(value);
    if (!dep)
      return res
        .status(404)
        .json({ ok: false, message: "Department not found" });

    const sections = await Section.findAll({
      where: { departmentId: dep.id },
      attributes: ["id", "departmentId", "departmentSlug", "title"],
      order: [["id", "ASC"]],
    });

    res.json({ ok: true, data: sections });
  } catch (err) {
    next(err);
  }
};

export const addSection = async (req, res, next) => {
  try {
    const value = getDeptValue(req);
    const dep = await resolveDepartment(value);
    if (!dep)
      return res
        .status(404)
        .json({ ok: false, message: "Department not found" });

    const title = String(req.body?.title ?? "").trim();
    if (!title) {
      return res
        .status(400)
        .json({ ok: false, message: "Section title is required" });
    }

    const exists = await Section.findOne({
      where: { departmentId: dep.id, title },
      attributes: ["id"],
    });
    if (exists) {
      return res
        .status(409)
        .json({
          ok: false,
          message: "Section title already exists in this department",
        });
    }

    const section = await Section.create({
      departmentId: dep.id,
      departmentSlug: dep.slug,
      title,
    });

    res.status(201).json({ ok: true, data: section });
  } catch (err) {
    next(err);
  }
};
export const getSectionById = async (req, res, next) => {
  try {
    const { slugOrId, sectionId } = req.params;
    const dep = await resolveDepartment(slugOrId);
    if (!dep)
      return res.status(404).json({ ok: false, message: "Department not found" });

    const section = await Section.findOne({
      where: { id: Number(sectionId), departmentId: dep.id },
    });
    if (!section)
      return res.status(404).json({ ok: false, message: "Section not found" });

    res.json({ ok: true, data: section });
  } catch (err) {
    next(err);
  }
};
export const updateSection = async (req, res, next) => {
  try {
    const { sectionId } = req.params;

    if (!/^\d+$/.test(sectionId)) {
      return res.status(400).json({ ok: false, message: "Invalid section id" });
    }

    const title = String(req.body?.title ?? "").trim();
    if (!title) {
      return res
        .status(400)
        .json({ ok: false, message: "New section title is required" });
    }

    const section = await Section.findByPk(Number(sectionId));
    if (!section)
      return res.status(404).json({ ok: false, message: "Section not found" });

    const dup = await Section.findOne({
      where: { departmentId: section.departmentId, title },
      attributes: ["id"],
    });
    if (dup && dup.id !== section.id) {
      return res
        .status(409)
        .json({
          ok: false,
          message: "Section title already exists in this department",
        });
    }

    await section.update({ title });
    res.json({ ok: true, data: section });
  } catch (err) {
    next(err);
  }
};

export const deleteSection = async (req, res, next) => {
  try {
    const { sectionId } = req.params;

    if (!/^\d+$/.test(sectionId)) {
      return res.status(400).json({ ok: false, message: "Invalid section id" });
    }

    const deleted = await Section.destroy({ where: { id: Number(sectionId) } });
    if (!deleted)
      return res.status(404).json({ ok: false, message: "Section not found" });

    res.json({ ok: true, message: "Section deleted" });
  } catch (err) {
    next(err);
  }
};
