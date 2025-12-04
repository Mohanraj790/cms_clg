import fs from "fs";
import path from "path";
import {
  Department,
  Section,
  SubSection,
  SectionPerson,
} from "../models/index.js";

const ensureValidContext = async (slugOrId, sectionId, subsectionId = null) => {
  const deptWhere = {};
  if (/^\d+$/.test(slugOrId)) {
    deptWhere.id = Number(slugOrId);
  } else {
    deptWhere.slug = String(slugOrId).toLowerCase();
  }

  const department = await Department.findOne({
    where: deptWhere,
    attributes: ["id", "slug"],
  });

  if (!department) {
    console.log("❌ Department not found for", slugOrId);
    return null;
  }

  const section = await Section.findByPk(Number(sectionId), {
    attributes: ["id", "departmentId"],
  });

  if (!section) {
    console.log("❌ Section not found:", sectionId);
    return null;
  }

  if (section.departmentId !== department.id) {
    console.log(
      "❌ Section does not belong to department:",
      section.departmentId,
      "≠",
      department.id
    );
    return null;
  }

  if (subsectionId) {
    const subsection = await SubSection.findByPk(Number(subsectionId), {
      attributes: ["id", "sectionId"],
    });

    if (!subsection) {
      console.log("❌ Subsection not found:", subsectionId);
      return null;
    }

    if (subsection.sectionId !== section.id) {
      console.log(
        "❌ Subsection.sectionId mismatch:",
        subsection.sectionId,
        "≠",
        section.id
      );
      return null;
    }

    return { department, section, subsection };
  }

  return { department, section, subsection: null };
};

const toUrl = (p) => {
  if (!p) return null;
  const normalized = String(p).replace(/\\/g, "/").replace(/^\/+/, "");
  return `/${normalized}`;
};

const tryUnlink = (filePath) => {
  if (!filePath) return;
  try {
    const abs = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch (err) {
    console.warn("Could not delete file:", filePath, err?.message ?? err);
  }
};

export const listPeople = async (req, res, next) => {
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

    const rows = await SectionPerson.findAll({
      where,
      attributes: ["id", "name", "designation", "photoPath"],
      order: [["id", "ASC"]],
    });

    const data = rows.map((r) => ({
      id: r.id,
      photo: toUrl(r.photoPath),
      name: r.name,
      designation: r.designation,
    }));

    res.json({ ok: true, data });
  } catch (e) {
    next(e);
  }
};

export const getPerson = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId, personId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);

    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const where = subsectionId
      ? { id: Number(personId), subsectionId: ctx.subsection.id }
      : { id: Number(personId), sectionId: ctx.section.id, subsectionId: null };

    const person = await SectionPerson.findOne({
      where,
      attributes: ["id", "name", "designation", "photoPath", "about"],
    });

    if (!person)
      return res.status(404).json({ ok: false, message: "Person not found" });

    res.json({
      ok: true,
      data: {
        id: person.id,
        name: person.name,
        designation: person.designation,
        photo: toUrl(person.photoPath),
        about: person.about,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const createPerson = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);

    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const name = String(req.body?.name ?? "").trim();
    const designation = String(req.body?.designation ?? "").trim();
    const about = String(req.body?.about ?? "").trim() || null;

    if (!name || !designation)
      return res
        .status(400)
        .json({ ok: false, message: "name & designation required" });

    let photoPath = null;
    if (req.file && req.file.path) {
      const rel = String(req.file.path).replace(/\\/g, "/");
      const idx = rel.indexOf("uploads/");
      photoPath = idx >= 0 ? rel.slice(idx) : rel.replace(/^\/+/, "");
    }

    const row = await SectionPerson.create({
      sectionId: ctx.section.id,
      subsectionId: ctx.subsection ? ctx.subsection.id : null,
      name,
      designation,
      about,
      photoPath,
    });

    res.status(201).json({
      ok: true,
      data: {
        id: row.id,
        name: row.name,
        designation: row.designation,
        photo: toUrl(row.photoPath),
        about: row.about,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const updatePerson = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId, personId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);

    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const where = subsectionId
      ? { id: Number(personId), subsectionId: ctx.subsection.id }
      : { id: Number(personId), sectionId: ctx.section.id, subsectionId: null };

    const row = await SectionPerson.findOne({ where });
    if (!row)
      return res.status(404).json({ ok: false, message: "Person not found" });

    const payload = {};
    if (req.body?.name !== undefined)
      payload.name = String(req.body.name).trim();
    if (req.body?.designation !== undefined)
      payload.designation = String(req.body.designation).trim();
    if (req.body?.about !== undefined)
      payload.about = String(req.body.about).trim() || null;

    if (req.file && req.file.path) {
      tryUnlink(row.photoPath);

      const rel = String(req.file.path).replace(/\\/g, "/");
      const idx = rel.indexOf("uploads/");
      payload.photoPath = idx >= 0 ? rel.slice(idx) : rel.replace(/^\/+/, "");
    }

    await row.update(payload);
    await row.reload();

    res.json({
      ok: true,
      data: {
        id: row.id,
        name: row.name,
        designation: row.designation,
        photo: toUrl(row.photoPath),
        about: row.about,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const deletePerson = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId, personId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);

    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const where = subsectionId
      ? { id: Number(personId), subsectionId: ctx.subsection.id }
      : { id: Number(personId), sectionId: ctx.section.id, subsectionId: null };

    const row = await SectionPerson.findOne({ where });
    if (!row)
      return res.status(404).json({ ok: false, message: "Person not found" });

    await SectionPerson.destroy({ where });
    tryUnlink(row.photoPath);

    res.json({ ok: true, message: "Person deleted" });
  } catch (e) {
    next(e);
  }
};

export const getPersonPhoto = async (req, res, next) => {
  try {
    const { slugOrId, sectionId, subsectionId, personId } = req.params;
    const ctx = await ensureValidContext(slugOrId, sectionId, subsectionId);

    if (!ctx)
      return res
        .status(404)
        .json({ ok: false, message: "Invalid section or subsection" });

    const where = subsectionId
      ? { id: Number(personId), subsectionId: ctx.subsection.id }
      : { id: Number(personId), sectionId: ctx.section.id, subsectionId: null };

    const row = await SectionPerson.findOne({
      where,
      attributes: ["photoPath"],
    });
    if (!row)
      return res.status(404).json({ ok: false, message: "Person not found" });
    if (!row.photoPath)
      return res.status(404).json({ ok: false, message: "Photo not found" });

    const rel = String(row.photoPath).replace(/\\/g, "/").replace(/^\/+/, "");
    const absPath = path.isAbsolute(rel) ? rel : path.join(process.cwd(), rel);

    if (!fs.existsSync(absPath))
      return res
        .status(404)
        .json({ ok: false, message: "File missing on server" });

    res.sendFile(absPath);
  } catch (e) {
    next(e);
  }
};
