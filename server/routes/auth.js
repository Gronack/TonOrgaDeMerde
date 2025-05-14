const express = require("express");
const passport = require("passport");

const router = express.Router();

// Redirige l'utilisateur vers Discord
router.get("/discord", passport.authenticate("discord"));

// Discord redirige ici après l'authentification
router.get(
  "/discord/redirect",
  passport.authenticate("discord", {
    failureRedirect: "/auth/failed"
  }),
  function (req, res) {
    // Redirige vers le frontend après connexion
    res.redirect("http://localhost:5173");
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

// Route de déconnexion (optionnelle mais utile)
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:5173");
  });
});

module.exports = router;
