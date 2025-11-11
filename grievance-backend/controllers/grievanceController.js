import Grievance from "../models/grievanceModel.js";

// 🧭 Maps category → department name and admin ID
const departmentMap = {
  accounts: "Accounts",
  "student welfare": "Student Welfare",
  admission: "Admission",
  examination: "Examination",
};

const adminMap = {
  Accounts: "ADM_ACCOUNT",
  "Student Welfare": "ADM_WELFARE",
  Admission: "ADM_ADMISSION",
  Examination: "ADM_EXAM",
};

// ✅ Submit a new grievance (students/staff)
export const submitGrievance = async (req, res) => {
  try {
    const { userId, name, email, school, category, message } = req.body;

    if (!userId || !name || !email || !school || !category || !message)
      return res.status(400).json({ message: "All fields are required" });

    const rawCategory = category.trim().toLowerCase();
    const assignedDept = departmentMap[rawCategory] || "General";
    const assignedTo = adminMap[assignedDept] || "ADM01"; // fallback to main admin

    const grievance = await Grievance.create({
      userId,
      name,
      email,
      school,
      category: assignedDept,
      message,
      assignedDept,
      assignedTo,
      status: "Pending",
    });

    res.status(201).json({
      message: "✅ Grievance submitted successfully",
      grievance,
    });
  } catch (error) {
    console.error("❌ Error submitting grievance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get all grievances (main admin)
export const getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find().sort({ createdAt: -1 });
    res.json(grievances);
  } catch (error) {
    console.error("❌ getAllGrievances:", error);
    res.status(500).json({ message: "Failed to fetch grievances" });
  }
};

// ✅ Get grievances for a specific department admin
export const getDepartmentGrievances = async (req, res) => {
  try {
    const { deptName } = req.params;
    const grievances = await Grievance.find({
      assignedDept: new RegExp(`^${deptName}$`, "i"),
    }).sort({ createdAt: -1 });
    res.json(grievances);
  } catch (error) {
    console.error("❌ getDepartmentGrievances:", error);
    res.status(500).json({ message: "Error fetching department grievances" });
  }
};

// ✅ Update grievance (assign, resolve, etc.)
export const updateGrievanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolvedBy, assignedTo } = req.body;

    const grievance = await Grievance.findByIdAndUpdate(
      id,
      { status, resolvedBy, assignedTo },
      { new: true }
    );

    if (!grievance)
      return res.status(404).json({ message: "Grievance not found" });

    res.json({ message: "✅ Grievance updated successfully", grievance });
  } catch (error) {
    console.error("❌ updateGrievanceStatus:", error);
    res.status(500).json({ message: "Error updating grievance" });
  }
};
