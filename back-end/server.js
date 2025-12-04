import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";

import { testDB } from "./db.js";
import { initAndSeed } from "./models/index.js";

import userRoutes from "./routes/user.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import sectionRoutes from "./routes/section.routes.js";
import subSectionRoutes from "./routes/subsection.routes.js";
import sectionFileRoutes from "./routes/sectionFile.routes.js";
import sectionPersonRoutes from "./routes/sectionPerson.routes.js";
import sectionExcelFileRoutes from "./routes/sectionExcelFile.routes.js";
import sectionContentRoutes from "./routes/sectionContent.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running ✅",
    timestamp: new Date(),
  });
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/departments", sectionRoutes);
app.use("/api/departments", subSectionRoutes);
app.use("/api/departments", sectionFileRoutes);
app.use("/api/departments", sectionPersonRoutes);
app.use("/api/departments", sectionExcelFileRoutes);
app.use("/api/departments", sectionContentRoutes);
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ ok: false, message: err.message, code: err.code });
  }
  if (err) {
    console.error("❌ Error:", err);
    return res
      .status(500)
      .json({ ok: false, message: err.message || "Internal server error" });
  }
  return res.status(404).json({ ok: false, message: "Not found" });
});

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await testDB();
    await initAndSeed();
    app.listen(PORT, () =>
      console.log(`🚀 Server running at: http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
