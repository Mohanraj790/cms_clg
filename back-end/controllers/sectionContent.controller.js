import fs from "fs";
import path from "path";
import {
  Department,
  Section,
  SubSection,
  SectionContent,
} from "../models/index.js";

const ensureValidContext = async (slugOrId, sectionId, subsectionId = null) => {
  const deptWhere = {};
  if (/^\d+$/.test(String(slugOrId))) deptWhere.id = Number(slugOrId);
  else deptWhere.slug = String(slugOrId).toLowerCase();

  const department = await Department.findOne({
    where: deptWhere,
    attributes: ["id", "slug"],
  });
  if (!department) return null;

  const section = await Section.findByPk(Number(sectionId), {
    attributes: ["id", "departmentId"],
  });
  if (!section || section.departmentId !== department.id) return null;

  if (subsectionId) {
    const subsection = await SubSection.findByPk(Number(subsectionId), {
      attributes: ["id", "sectionId"],
    });
    if (!subsection || subsection.sectionId !== section.id) return null;
    return { department, section, subsection };
  }

  return { department, section, subsection: null };
};

export const listSectionContents = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);
    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const where = subsectionId
      ? { subsectionId: ctx.subsection.id }
      : { sectionId: ctx.section.id, subsectionId: null };

    const rows = await SectionContent.findAll({
      where,
      attributes: ["id", "content", "photo", "createdAt", "updatedAt"],
      order: [["id", "DESC"]],
    });

    res.json({ ok: true, data: rows });
  } catch (e) {
    next(e);
  }
};

export const getSectionContent = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId, contentId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);
    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const where = subsectionId
      ? { id: Number(contentId), subsectionId: ctx.subsection.id }
      : {
          id: Number(contentId),
          sectionId: ctx.section.id,
          subsectionId: null,
        };

    const row = await SectionContent.findOne({
      where,
      attributes: ["id", "content", "photo", "createdAt", "updatedAt"],
    });

    if (!row)
      return res.status(404).json({ ok: false, message: "Content not found" });

    res.json({ ok: true, data: row });
  } catch (e) {
    next(e);
  }
};

export const uploadSectionContent = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);
    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const content = req.body?.content?.trim();
    if (!content)
      return res
        .status(400)
        .json({ ok: false, message: "Content text is required" });

    const photo = req.file ? req.file.filename : null;

    const row = await SectionContent.create({
      sectionId: ctx.section.id,
      subsectionId: ctx.subsection ? ctx.subsection.id : null,
      content,
      photo,
    });

    res
      .status(201)
      .json({ ok: true, message: "Content added successfully ✅", data: row });
  } catch (e) {
    next(e);
  }
};

export const updateSectionContent = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId, contentId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);
    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const where = subsectionId
      ? { id: Number(contentId), subsectionId: ctx.subsection.id }
      : {
          id: Number(contentId),
          sectionId: ctx.section.id,
          subsectionId: null,
        };

    const record = await SectionContent.findOne({ where });
    if (!record)
      return res.status(404).json({ ok: false, message: "Content not found" });

    const newPhoto = req.file ? req.file.filename : null;

    if (newPhoto && record.photo) {
      const oldPath = path.join("uploads/photos", record.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await record.update({
      content: req.body?.content || record.content,
      photo: newPhoto || record.photo,
    });

    res.json({
      ok: true,
      message: "Content updated successfully ✅",
      data: record,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteSectionContent = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId, contentId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);
    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const where = subsectionId
      ? { id: Number(contentId), subsectionId: ctx.subsection.id }
      : {
          id: Number(contentId),
          sectionId: ctx.section.id,
          subsectionId: null,
        };

    const record = await SectionContent.findOne({ where });
    if (!record)
      return res.status(404).json({ ok: false, message: "Content not found" });

    if (record.photo) {
      const abs = path.resolve("uploads/photos", record.photo);
      if (fs.existsSync(abs)) fs.unlinkSync(abs);
    }

    await record.destroy();
    res.json({ ok: true, message: "Content deleted successfully ✅" });
  } catch (e) {
    next(e);
  }
};
