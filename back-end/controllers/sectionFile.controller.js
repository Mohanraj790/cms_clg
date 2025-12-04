import path from "path";
import {
  Department,
  Section,
  SubSection,
  SectionFile,
} from "../models/index.js";

const ensureValidContext = async (slugOrId, sectionId, subsectionId = null) => {
  const deptWhere = {};
  if (/^\d+$/.test(String(slugOrId))) {
    deptWhere.id = Number(slugOrId);
  } else {
    deptWhere.slug = String(slugOrId).toLowerCase();
  }

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

export const listSectionFiles = async (req, res, next) => {
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

    const rows = await SectionFile.findAll({
      where,
      attributes: ["id", "title", "path", "size", "mime", "createdAt"],
      order: [["id", "DESC"]],
    });

    res.json({ ok: true, data: rows });
  } catch (e) {
    next(e);
  }
};

export const getSectionFile = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId, fileId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);
    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const where = subsectionId
      ? { id: Number(fileId), subsectionId: ctx.subsection.id }
      : { id: Number(fileId), sectionId: ctx.section.id, subsectionId: null };

    const row = await SectionFile.findOne({
      where,
      attributes: [
        "id",
        "title",
        "path",
        "size",
        "mime",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!row)
      return res.status(404).json({ ok: false, message: "File not found" });

    res.json({ ok: true, data: row });
  } catch (e) {
    next(e);
  }
};

export const downloadSectionFile = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId, fileId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);
    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const where = subsectionId
      ? { id: Number(fileId), subsectionId: ctx.subsection.id }
      : { id: Number(fileId), sectionId: ctx.section.id, subsectionId: null };

    const row = await SectionFile.findOne({
      where,
      attributes: ["title", "path", "mime"],
    });

    if (!row)
      return res.status(404).json({ ok: false, message: "File not found" });

    const abs = path.resolve(row.path);
    if (!fs.existsSync(abs))
      return res
        .status(410)
        .json({ ok: false, message: "File missing on server" });

    const safeName = row.title.replace(/\s+/g, "_") + ".pdf";
    res.setHeader("Content-Type", row.mime || "application/pdf");
    res.download(abs, safeName);
  } catch (e) {
    next(e);
  }
};

export const uploadSectionPdf = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);
    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    if (!req.file)
      return res
        .status(400)
        .json({ ok: false, message: "PDF file is required" });

    const title = (req.body?.title || req.file.originalname).trim();

    const row = await SectionFile.create({
      sectionId: ctx.section.id,
      subsectionId: ctx.subsection ? ctx.subsection.id : null,
      title,
      path: req.file.path,
      size: req.file.size,
      mime: req.file.mimetype,
    });

    res.status(201).json({ ok: true, data: row });
  } catch (e) {
    next(e);
  }
};

export const renameSectionFile = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId, fileId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);
    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const where = subsectionId
      ? { id: Number(fileId), subsectionId: ctx.subsection.id }
      : { id: Number(fileId), sectionId: ctx.section.id, subsectionId: null };

    const row = await SectionFile.findOne({ where });

    if (!row)
      return res.status(404).json({ ok: false, message: "File not found" });

    const title = String(req.body?.title ?? "").trim();
    if (!title)
      return res
        .status(400)
        .json({ ok: false, message: "New title is required" });

    await row.update({ title });
    res.json({ ok: true, data: row });
  } catch (e) {
    next(e);
  }
};

export const deleteSectionFile = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId, fileId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);
    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const where = subsectionId
      ? { id: Number(fileId), subsectionId: ctx.subsection.id }
      : { id: Number(fileId), sectionId: ctx.section.id, subsectionId: null };

    const row = await SectionFile.findOne({ where });

    if (!row)
      return res.status(404).json({ ok: false, message: "File not found" });

    try {
      const abs = path.resolve(row.path);
      if (fs.existsSync(abs)) fs.unlinkSync(abs);
    } catch {}

    await row.destroy();
    res.json({ ok: true, message: "File deleted" });
  } catch (e) {
    next(e);
  }
};
