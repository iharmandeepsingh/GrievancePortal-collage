import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  school: { type: String, required: true },
  category: { type: String, required: true },
  message: { type: String, required: true },
  assignedDept: { type: String, required: true },
  assignedTo: { type: String, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const Grievance = mongoose.model("Grievance", grievanceSchema);
export default Grievance;
