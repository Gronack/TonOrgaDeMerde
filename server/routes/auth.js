const express = require("express");
const passport = require("passport");

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Redirige l'utilisateur vers Discord
router.get("/discord", passport.authenticate("discord"));

// Discord redirige ici après l'authentification
router.get(
  "/discord/redirect",
  passport.authenticate("discord", {
    failureRedirect: `${FRONTEND_URL}/auth/failed`
  }),
  function (req, res) {
    // Redirige vers le frontend après connexion
    res.redirect(FRONTEND_URL);
  }
);

// Récupère l'utilisateur actuellement connecté
router.get("/user", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Utilisateur non connecté" });
  }
});

// Route de déconnexion
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(FRONTEND_URL);
  });
});

module.exports = router;
