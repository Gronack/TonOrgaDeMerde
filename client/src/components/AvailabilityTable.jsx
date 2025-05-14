import { useState, useEffect } from "react";
import { fetchUser } from "../services/userService";
import { generateWeeks } from "../utils/weeks";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const slots = ["aprem", "soir"];
const weeks = generateWeeks();


export default function AvailabilityTable() {
  const [user, setUser] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(weeks[0]?.key);
  const [weekAvailability, setWeekAvailability] = useState({});
  const [commonSlots, setCommonSlots] = useState([]);

  // Récupère l'utilisateur connecté
  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);
  useEffect(() => {
	  fetch("http://localhost:3001/api/disponibilites/communes", {
		credentials: "include"
	  })
		.then(res => res.json())
		.then(setCommonSlots)
		.catch(err => console.error("Erreur chargement dispos communes", err));
	}, []);


  // Charge les disponibilités de la semaine sélectionnée
  useEffect(() => {
    if (!user || !selectedWeek) return;

    fetch(`http://localhost:3001/api/disponibilites?week=${selectedWeek}&userId=${user.id}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setWeekAvailability(data.data || {});
      })
      .catch(err => console.error("Erreur chargement disponibilités :", err));
  }, [user, selectedWeek]);

  const handleChange = (day, slot) => {
    setWeekAvailability(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [slot]: !(prev?.[day]?.[slot] || false),
      }
    }));
  };

  const handleSave = () => {
    if (!user) return alert("Utilisateur non connecté.");

	const payload = {
	 userId: user.id,
	 availability: weekAvailability || {},
	 week: selectedWeek // ← cette ligne est ESSENTIELLE
	};
	
	console.log(payload)
    fetch("http://localhost:3001/api/disponibilites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      credentials: "include"
    })
      .then(res => res.json())
      .then(() => alert("Disponibilités enregistrées !"))
      .catch(err => alert("Erreur : " + err));
  };
  
  const resetWeek = () => {
	const cleared = {};
	days.forEach(day => {
	  cleared[day] = { aprem: false, soir: false };
	});
	setWeekAvailability(cleared);
	};

  const resetAll = () => {
	const confirmReset = window.confirm("⚠️ Cela va supprimer toutes vos disponibilités. Êtes-vous sûr ?");
	if (!confirmReset || !user) return;

	fetch("http://localhost:3001/api/disponibilites/reset-all", {
	  method: "POST",
	  headers: {
	    "Content-Type": "application/json"
	  },
	  body: JSON.stringify({ userId: user.id }),
	  credentials: "include"
	})
	  .then(res => res.json())
	  .then(() => {
	    alert("Toutes vos disponibilités ont été réinitialisées !");
	    setWeekAvailability({});
	  })
	  .catch(err => alert("Erreur lors de la réinitialisation : " + err));
	};


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mes disponibilités</h2>

      <div className="mb-4">
        <label htmlFor="week" className="block mb-2 font-semibold">Semaine :</label>
        <select
          id="week"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="border p-2 rounded"
        >
          {weeks.map(w => (
            <option key={w.key} value={w.key}>{w.label}</option>
          ))}
        </select>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Jour</th>
            {slots.map((slot, i) => (
              <th key={i} className="border p-2">
                {slot === "aprem" ? "Aprem (14h-19h)" : "Soir (19h-00h)"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td className="border p-2">{day}</td>
              {slots.map((slot) => (
                <td key={slot} className="border text-center">
                  <input
                    type="checkbox"
                    checked={weekAvailability[day]?.[slot] || false}
                    onChange={() => handleChange(day, slot)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
			<div className="mt-8">
				  <h3 className="text-lg font-semibold mb-2">Créneaux communs :</h3>
				  <ul className="list-disc list-inside">
					{Array.isArray(commonSlots) && commonSlots.length > 0 ? (
					  commonSlots.map((slot, i) => (
						<li key={i}>
						  ✅ {slot.week} - {slot.day} - {slot.slot === "aprem" ? "Aprem (14h-19h)" : "Soir (19h-00h)"}
						</li>
					  ))
					) : (
					  <li>Aucun créneau commun pour le moment</li>
					)}
				  </ul>
				</div>
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Enregistrer mes dispos
      </button>
	 <div className="mt-4 flex gap-4">
  <button
    onClick={resetWeek}
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
  >
    Réinitialiser cette semaine
  </button>

  <button
    onClick={resetAll}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
  >
    Réinitialiser toutes les semaines
  </button>
</div>

    </div>
  );
}
