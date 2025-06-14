import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  register,
  login,
  getAllUsers,
  getUserById,
  getCurrentUser,
} from "./authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);
router.get("/user/:id", getUserById);
router.get("/currentUser", getCurrentUser);

//google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=OAuthFailed`,
  }),
  (req, res) => {
    // console.log("successful login, user:", req.user);

    if (!req.user) return res.redirect(`${process.env.CLIENT_URL}/login`);

    // JWT token
    const token = jwt.sign(
      {
        id: req.user._id,
        email: req.user.email,
        name: req.user.fullName,
        avatar: req.user.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`${process.env.CLIENT_URL}/login-success?token=${token}`);
  }
);

export default router;
