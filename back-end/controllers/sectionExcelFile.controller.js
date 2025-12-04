import path from "path";
import fs from "fs";
import {
  sequelize,
  Section,
  SubSection,
  SectionExcelFile as SectionExcelFileModel,
} from "../models/index.js";

const ensureSectionInDept = async (slugOrId, sectionId) => {
  const section = await Section.findByPk(Number(sectionId), {
    attributes: ["id", "departmentId", "departmentSlug"],
  });
  if (!section) return null;

  const value = String(slugOrId || "").trim();
  const matches = /^\d+$/.test(value)
    ? section.departmentId === Number(value)
    : section.departmentSlug === value.toLowerCase();

  return matches ? section : null;
};

const ensureValidContext = async (slugOrId, sectionId, subsectionId = null) => {
  const section = await ensureSectionInDept(slugOrId, sectionId);
  if (!section) return null;

  if (subsectionId) {
    const subsection = await SubSection.findByPk(Number(subsectionId), {
      attributes: ["id", "sectionId"],
    });
    if (!subsection || subsection.sectionId !== section.id) return null;
    return { section, subsection };
  }

  return { section, subsection: null };
};

export const uploadSectionExcelFile = async (req, res, next) => {
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
        .json({ ok: false, message: "Excel file is required" });

    const originalName = req.file.originalname || "unnamed.xlsx";
    const filename =
      req.file.filename || path.basename(req.file.path || originalName);
    const filePath = req.file.path || "";
    const mime =
      req.file.mimetype ||
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const ext =
      path.extname(originalName).toLowerCase().replace(".", "") || "xlsx";
    const size = req.file.size || 0;

    const sheetName = req.body?.sheetName ?? null;

    const fileRec = await SectionExcelFileModel.create({
      sectionId: ctx.section.id,
      subsectionId: ctx.subsection ? ctx.subsection.id : null,
      departmentId: ctx.section.departmentId,
      originalName,
      filename,
      path: filePath,
      mime,
      ext,
      size,
      sheetName,
      meta: { uploadedBy: req.user?.id ?? null },
    });

    return res.status(201).json({
      ok: true,
      message: "Excel file uploaded",
      file: {
        id: fileRec.id,
        originalName: fileRec.originalName,
        filename: fileRec.filename,
        sheetName: fileRec.sheetName,
        createdAt: fileRec.createdAt,
      },
    });
  } catch (err) {
    console.error("uploadSectionExcelFile error:", err);
    next(err);
  }
};

export const listSectionExcelFiles = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);
    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.max(Number(req.query.limit || 50), 1);
    const offset = (page - 1) * limit;

    const where = subsectionId
      ? { subsectionId: ctx.subsection.id }
      : { sectionId: ctx.section.id, subsectionId: null };

    if (req.query.departmentId)
      where.departmentId = Number(req.query.departmentId);

    const { count, rows } = await SectionExcelFileModel.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      ok: true,
      total: count,
      page,
      limit,
      data: rows,
    });
  } catch (err) {
    console.error("listSectionExcelFiles error:", err);
    next(err);
  }
};

export const getSectionExcelFile = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId, id } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);
    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const where = subsectionId
      ? { id: Number(id), subsectionId: ctx.subsection.id }
      : { id: Number(id), sectionId: ctx.section.id, subsectionId: null };

    const file = await SectionExcelFileModel.findOne({ where });
    if (!file)
      return res.status(404).json({ ok: false, message: "File not found" });

    const fullPath = path.join(process.cwd(), file.path);
    const workbook = xlsx.readFile(fullPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const downloadUrl = `${req.protocol}://${req.get("host")}/uploads/excel/${file.filename}`;

    res.json({
      ok: true,
      file,
      rows,      // 👈 👑 VERY IMPORTANT
      downloadUrl
    });
  } catch (err) {
    console.error("Excel preview parse error:", err.message);
    return res.json({
      ok: true,
      file: null,
      rows: [],
      message: "Preview not available — download to view"
    });
  }
};



export const deleteSectionExcelFile = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId, id } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);
    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const where = subsectionId
      ? { id: Number(id), subsectionId: ctx.subsection.id }
      : { id: Number(id), sectionId: ctx.section.id, subsectionId: null };

    const file = await SectionExcelFileModel.findOne({ where });
    if (!file)
      return res.status(404).json({ ok: false, message: "File not found" });
    t;
    try {
      if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    } catch (e) {
      console.warn("Could not delete file from disk:", e.message);
    }

    await file.destroy();
    res.json({ ok: true, message: "File deleted" });
  } catch (err) {
    console.error("deleteSectionExcelFile error:", err);
    next(err);
  }
};
