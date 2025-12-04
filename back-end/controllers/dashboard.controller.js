import { Department } from "../models/index.js";

export const getDashboardData = async (req, res) => {
  try {
    const departments = await Department.findAll({ order: [["id", "ASC"]] });
    return res.json({
      user: { id: req.user.id, email: req.user.email, role: req.user.role },
      departments,
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};
