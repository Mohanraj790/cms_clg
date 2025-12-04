import { Department, Section, SubSection } from "../models/index.js";

const getDeptValue = (req) =>
  (req.params.slugOrId ?? req.params.slug ?? req.params.id ?? "").trim();

const resolveDepartment = async (value) => {
  if (!value) return null;

  if (/^\d+$/.test(value)) {
    return Department.findByPk(Number(value), {
      attributes: ["id", "slug"],
    });
  }

  return Department.findOne({
    where: { slug: String(value).toLowerCase() },
    attributes: ["id", "slug"],
  });
};

const resolveSection = async (departmentId, sectionId) => {
  if (!/^\d+$/.test(sectionId)) return null;

  return Section.findOne({
    where: { id: Number(sectionId), departmentId },
    attributes: ["id", "departmentId", "title"],
  });
};

export const listSubSections = async (req, res, next) => {
  try {
    const value = getDeptValue(req);
    const dep = await resolveDepartment(value);
    if (!dep)
      return res
        .status(404)
        .json({ ok: false, message: "Department not found" });

    const { sectionId } = req.params;
    const section = await resolveSection(dep.id, sectionId);
    if (!section)
      return res.status(404).json({ ok: false, message: "Section not found" });

    const subSections = await SubSection.findAll({
      where: {
        departmentId: dep.id,
        sectionId: section.id,
      },
      attributes: [
        "id",
        "departmentId",
        "sectionId",
        "title",
      ],
      order: [["id", "ASC"]],
    });

    res.json({ ok: true, data: subSections });
  } catch (err) {
    next(err);
  }
};

export const addSubSection = async (req, res, next) => {
  try {
    const value = getDeptValue(req);
    const dep = await resolveDepartment(value);
    if (!dep)
      return res
        .status(404)
        .json({ ok: false, message: "Department not found" });

    const { sectionId } = req.params;
    const section = await resolveSection(dep.id, sectionId);
    if (!section)
      return res.status(404).json({ ok: false, message: "Section not found" });

    const title = String(req.body?.title ?? "").trim();
    if (!title) {
      return res
        .status(400)
        .json({ ok: false, message: "Sub section title is required" });
    }

    const exists = await SubSection.findOne({
      where: {
        departmentId: dep.id,
        sectionId: section.id,
        title,
      },
      attributes: ["id"],
    });
    if (exists) {
      return res.status(409).json({
        ok: false,
        message: "Sub section title already exists in this section",
      });
    }

    const subSection = await SubSection.create({
      departmentId: dep.id,
      departmentSlug: dep.slug,
      sectionId: section.id,
      title,
    });

    res.status(201).json({ ok: true, data: subSection });
  } catch (err) {
    next(err);
  }
};

export const getSubSectionById = async (req, res, next) => {
  try {
    const value = getDeptValue(req);
    const dep = await resolveDepartment(value);
    if (!dep)
      return res
        .status(404)
        .json({ ok: false, message: "Department not found" });

    const { sectionId, subSectionId } = req.params;
    const section = await resolveSection(dep.id, sectionId);
    if (!section)
      return res.status(404).json({ ok: false, message: "Section not found" });

    const subSection = await SubSection.findOne({
      where: {
        id: Number(subSectionId),
        departmentId: dep.id,
        sectionId: section.id,
      },
    });

    if (!subSection)
      return res
        .status(404)
        .json({ ok: false, message: "Sub section not found" });

    res.json({ ok: true, data: subSection });
  } catch (err) {
    next(err);
  }
};

export const updateSubSection = async (req, res, next) => {
  try {
    const { subSectionId } = req.params;

    if (!/^\d+$/.test(subSectionId)) {
      return res
        .status(400)
        .json({ ok: false, message: "Invalid sub section id" });
    }

    const title = String(req.body?.title ?? "").trim();
    if (!title) {
      return res
        .status(400)
        .json({ ok: false, message: "New sub section title is required" });
    }

    const subSection = await SubSection.findByPk(Number(subSectionId));
    if (!subSection)
      return res
        .status(404)
        .json({ ok: false, message: "Sub section not found" });

    const dup = await SubSection.findOne({
      where: {
        departmentId: subSection.departmentId,
        sectionId: subSection.sectionId,
        title,
      },
      attributes: ["id"],
    });

    if (dup && dup.id !== subSection.id) {
      return res.status(409).json({
        ok: false,
        message: "Sub section title already exists in this section",
      });
    }

    await subSection.update({ title });
    res.json({ ok: true, data: subSection });
  } catch (err) {
    next(err);
  }
};

export const deleteSubSection = async (req, res, next) => {
  try {
    const { subSectionId } = req.params;

    if (!/^\d+$/.test(subSectionId)) {
      return res
        .status(400)
        .json({ ok: false, message: "Invalid sub section id" });
    }

    const deleted = await SubSection.destroy({
      where: { id: Number(subSectionId) },
    });

    if (!deleted)
      return res
        .status(404)
        .json({ ok: false, message: "Sub section not found" });

    res.json({ ok: true, message: "Sub section deleted" });
  } catch (err) {
    next(err);
  }
};
