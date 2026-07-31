// import express from 'express';
// import { getProfile, registerUser, updateProfile, verifyOtp } from '../controllers/authControllers.js';
// import { authenticateToken,authorizeRoles } from '../middleware/authmiddleware.js';


// const authrouter = express.Router();

// authrouter.post('/register', registerUser);
// authrouter.post("/verify-otp", verifyOtp);
// authrouter.post("/complete-profile", completeProfile);
// authrouter.post("/login", loginUser);
// authrouter.post("/register-admin", registerAdmin);


// //protected routers
// authrouter.get("/me",authenticateToken, getProfile);
// authrouter.put("/update-profile",authenticateToken, updateProfile);
// authrouter.get("/users",authenticateToken, authorizeRoles("admin"),getUsers);

// export default authrouter;

import express from "express";

import {
  registerUser,
  verifyOtp,
  completeProfile,
  loginUser,
  registerAdmin,
  getProfile,
  updateProfile,
  getUsers,
} from "../controllers/authControllers.js";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authmiddleware.js";

const authrouter = express.Router();

authrouter.post("/register", registerUser);
authrouter.post("/verify-otp", verifyOtp);
authrouter.post("/complete-profile", completeProfile);
authrouter.post("/login", loginUser);
authrouter.post("/register-admin", registerAdmin);

// Protected Routes
authrouter.get("/me", authenticateToken, getProfile);
authrouter.put("/update-profile", authenticateToken, updateProfile);
authrouter.get("/users", authenticateToken, authorizeRoles("admin"), getUsers);

export default authrouter;