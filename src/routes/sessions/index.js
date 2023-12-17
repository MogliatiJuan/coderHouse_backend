import { Router } from "express";
import { login, logout, register, profile } from "../../dao/index.js";
import passport from "passport";

const router = new Router();

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/api/views/products");
  }
);
router.get("/logout", logout);
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  (req, res) => {
    res.redirect("/api/views/login");
  }
);
router.get("/profile", profile);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/api/views/profile");
  }
);

export default router;
