import express from "express";
import { register, login, getAllUsers, getUserById, getCurrentUser } from "./authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);
router.get("/user/:id", getUserById);
router.get("/currentUser", getCurrentUser);

export default router;
