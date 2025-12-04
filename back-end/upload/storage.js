import multer from "multer";
import fs from "fs";
import path from "path";

const ensure = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const pdfStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = "uploads/pdfs";
    ensure(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ts = Date.now();
    const ext = path.extname(file.originalname) || ".pdf";
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-")
      .toLowerCase();
    cb(null, `${base}-${ts}${ext}`);
  },
});
export const uploadPdf = multer({
  storage: pdfStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, 
  fileFilter: (_req, file, cb) =>
    file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(new Error("Only PDF files allowed")),
});

const photoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = "uploads/photos";
    ensure(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ts = Date.now();
    const ext = path.extname(file.originalname) || ".jpg";
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-")
      .toLowerCase();
    cb(null, `${base}-${ts}${ext}`);
  },
});
export const uploadPhoto = multer({ storage: photoStorage });

const excelFileFilter = (_req, file, cb) => {
  const allowedExt = [".xls", ".xlsx", ".csv"];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMime = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "application/csv",
    "text/plain",
  ];
  if (allowedExt.includes(ext) || allowedMime.includes(file.mimetype))
    cb(null, true);
  else cb(new Error("Only Excel files are allowed (.xls, .xlsx, .csv)"));
};

const excelDiskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = "uploads/excel";
    ensure(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ts = Date.now();
    const ext = path.extname(file.originalname) || ".xlsx";
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-")
      .toLowerCase();
    cb(null, `${base}-${ts}${ext}`);
  },
});

export const uploadExcel = multer({
  storage: excelDiskStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: excelFileFilter,
});

export const uploadExcelMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: excelFileFilter,
});


const imageFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed (.jpg, .jpeg, .png, .webp)"));
};

export const uploadSectionPhoto = multer({
  storage: photoStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});