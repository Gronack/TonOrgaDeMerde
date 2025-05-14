require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

const discordAuth = require("./discord/discordAuth");
const availabilityRoutes = require("./routes/availability");
const authRoutes = require("./routes/auth");

const app = express();



app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());


const cookieParser = require("cookie-parser");
app.use(cookieParser()); // 🔥 Ajoute ça

app.use(session({
  secret: "super-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());

discordAuth(passport); // ⚠️ doit être appelé avant les routes

app.use("/auth", authRoutes);
app.use("/api/disponibilites", availabilityRoutes);

app.listen(3001, () => {
  console.log("Serveur backend lancé sur http://localhost:3001");
});
