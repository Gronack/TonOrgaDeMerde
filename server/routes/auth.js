const express = require("express");
const passport = require("passport");

const router = express.Router();

// URL du frontend (environnement de production ou fallback local)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// 👉 Lancer l'authentification avec Discord
router.get("/discord", passport.authenticate("discord"));

// 👉 Callback après authentification Discord
router.get(
  "/discord/redirect",
  passport.authenticate("discord", {
    failureRedirect: `${FRONTEND_URL}/auth/failed`,
    session: true
  }),
  (req, res) => {
    // Ici, req.user doit exister
    console.log("✅ Connecté via Discord :", req.user);
    res.redirect(FRONTEND_URL);
  }
);

// 👉 Récupération de l'utilisateur connecté
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Utilisateur non connecté" });
  }
});

// 👉 Déconnexion
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("connect.sid"); // Facultatif : vider le cookie manuellement
    res.redirect(FRONTEND_URL);
  });
});

module.exports = router;
