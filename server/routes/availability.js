// server/routes/availability.js
const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Enregistrement des disponibilités
router.post("/", async (req, res) => {
  console.log("Payload reçu côté backend :", req.body);	
  const { userId, week, availability } = req.body;


  if (!userId || !week || !availability) {
    return res.status(400).json({ message: "Champs manquants" });
  }
  console.log("Données envoyées à Supabase :", { user_id: userId, week, data: availability });
  const { data, error } = await supabase
    .from("availabilities")
    .upsert({ user_id: userId, week: week, data: availability}, { onConflict: ['user_id', 'week'] })
    .select()
    .single();
  console.log("Résultat brut Supabase :", { data, error });
  if (error) {
    return res.status(500).json({ message: "Erreur lors de l'enregistrement" });
  }

  res.json({ message: "Disponibilités enregistrées", data });
});

// Récupération des disponibilités d'une semaine
router.get("/", async (req, res) => {
  const { week, userId } = req.query;

  if (!week || !userId) {
    return res.status(400).json({ message: "week et userId requis" });
  }

  const { data, error } = await supabase
    .from("availabilities")
    .select("data")
    .eq("week", week)
    .eq("user_id", userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    return res.status(500).json({ message: "Erreur lors de la récupération" });
  }

  res.json({ data: data ? data.data : null });
});

module.exports = router;

// Réinitialisation complète
router.post("/reset-all", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "userId requis" });

  const { error } = await supabase
    .from("disponibilites")
    .delete()
    .eq("user_id", userId);

  if (error) {
    return res.status(500).json({ message: "Erreur lors de la suppression" });
  }

  res.json({ message: "Toutes les disponibilités ont été supprimées" });
});


router.get("/communes", async (req, res) => {
  const { data, error } = await supabase
    .from("disponibilites")
    .select("week, data, user_id");

  if (error) {
    console.error("Erreur récupération des dispos :", error);
    return res.status(500).json({ message: "Erreur récupération" });
  }

  // Extraire tous les users uniques
  const uniqueUsers = [...new Set(data.map(d => d.user_id))];

  // Grouper par semaine
  const grouped = {};
  for (const row of data) {
    const { week, data: dispo, user_id } = row;
    if (!grouped[week]) grouped[week] = {};
    grouped[week][user_id] = dispo;
  }

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const slots = ["aprem", "soir"];
  const result = [];

  for (const [week, usersDispos] of Object.entries(grouped)) {
    for (const day of days) {
      for (const slot of slots) {
        const allHaveSlot = uniqueUsers.every(userId =>
          usersDispos[userId]?.[day]?.[slot] === true
        );
        if (allHaveSlot) {
          result.push({ week, day, slot });
        }
      }
    }
  }

  res.json(result);
});