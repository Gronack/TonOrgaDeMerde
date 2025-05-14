export function generateWeeks() {
  const weeks = [];
  const start = new Date("2025-05-19"); // lundi de la 1re semaine
  const end = new Date("2025-12-28");   // dimanche de la dernière semaine

  let current = new Date(start);

  while (current <= end) {
    const monday = new Date(current);
    const sunday = new Date(current);
    sunday.setDate(sunday.getDate() + 6);

    const label = `${monday.toLocaleDateString("fr-FR")} au ${sunday.toLocaleDateString("fr-FR")}`;
    const key = `${monday.toISOString().slice(0, 10)}_${sunday.toISOString().slice(0, 10)}`;

    weeks.push({ label, key });

    current.setDate(current.getDate() + 7); // passe à la semaine suivante
  }

  return weeks;
}
