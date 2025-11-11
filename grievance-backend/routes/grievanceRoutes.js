import express from "express";
import {
  submitGrievance,
  getAllGrievances,
  getDepartmentGrievances,
  updateGrievanceStatus,
  // Optional: getAssignedGrievances,
} from "../controllers/grievanceController.js";
// import { verifyToken } from "../middleware/authMiddleware.js"; // optional JWT protection

const router = express.Router();

// 🟢 Students / Staff — Submit a new grievance
router.post("/", submitGrievance);

// 🟠 Main Admin — Get all grievances in the system
// router.get("/all", verifyToken, getAllGrievances);
router.get("/all", getAllGrievances);

// 🟣 Department Admins — Get grievances for their department
// router.get("/department/:deptName", verifyToken, getDepartmentGrievances);
router.get("/department/:deptName", getDepartmentGrievances);

// 🔵 Admin / Staff — Update grievance status (Resolved, Assigned, etc.)
// router.put("/:id", verifyToken, updateGrievanceStatus);
router.put("/:id", updateGrievanceStatus);

// 🔸 Optional — View grievances directly assigned to a specific admin
// router.get("/assigned/:adminId", getAssignedGrievances);

export default router;
