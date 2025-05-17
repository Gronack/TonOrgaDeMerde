require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");

const discordAuth = require("./discord/discordAuth");
const availabilityRoutes = require("./routes/availability");
const authRoutes = require("./routes/auth");

const app = express();

// 🌍 CORS : autorise les cookies cross-origin entre frontend et backend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // 🔥 Nécessaire pour les cookies de session

// 🔐 Session : partage les cookies correctement sur HTTPS
app.use(session({
  secret: "super-secret", // à sécuriser en prod
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,           // ✅ Important sur Render
    httpOnly: true,
    sameSite: "none"        // ✅ Autorise les cookies cross-domain
  }
}));

// 🛂 Authentification
app.use(passport.initialize());
app.use(passport.session());
discordAuth(passport);

// 🚏 Routes API
app.use("/auth", authRoutes);
app.use("/api/disponibilites", availabilityRoutes);

// 🧪 Optionnel : message de test sur la racine
app.get("/", (req, res) => {
  res.send("TonOrga API backend is running 🚀");
});

// 🚀 Lancement
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
