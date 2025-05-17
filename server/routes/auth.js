const express = require("express");
const passport = require("passport");

const router = express.Router();

// URL vers ton frontend hébergé (modifiable via .env pour dev/prod)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// 👉 Démarre l'authentification Discord
router.get("/discord", passport.authenticate("discord"));

// 👉 Callback de Discord après connexion
router.get(
  "/discord/redirect",
  passport.authenticate("discord", {
    failureRedirect: `${FRONTEND_URL}/auth/failed`,
    session: true
  }),
  (req, res) => {
    res.redirect(FRONTEND_URL); // Redirige vers le front si succès
  }
);

// 👉 Récupère l'utilisateur connecté
router.get("/user", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Utilisateur non connecté" });
  }
});

// 👉 Déconnexion
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(FRONTEND_URL);
  });
});

module.exports = router;
