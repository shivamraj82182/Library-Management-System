import express from "express";

import {
  registerUser,
  verifyOtp,
  completeProfile,
  loginUser,
  googleLogin,
  registerAdmin,
  createStudentByAdmin,
  getProfile,
  updateProfile,
  getUsers,
  forgotPassword,
  resetPassword,
} from "../controllers/authControllers.js";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const authrouter = express.Router();

authrouter.post("/register", registerUser);
authrouter.post("/verify-otp", verifyOtp);
authrouter.post("/complete-profile", completeProfile);
authrouter.post("/login", loginUser);
authrouter.post("/google-login", googleLogin);
authrouter.post("/register-admin", registerAdmin);
authrouter.post(
  "/admin/create-student",authenticateToken,authorizeRoles("admin"),createStudentByAdmin);

//forget password
authrouter.post("/forgot-password", forgotPassword);
authrouter.post("/reset-password", resetPassword);

// Protected Routes
authrouter.get("/me", authenticateToken, getProfile);
authrouter.put("/update-profile", authenticateToken, updateProfile);
authrouter.get("/users", authenticateToken, authorizeRoles("admin"), getUsers);

export default authrouter;