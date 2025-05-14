export async function fetchUser() {
  const res = await fetch("http://localhost:3001/auth/user", {
    credentials: "include", // ⚠️ obligatoire
  });

  if (!res.ok) {
    throw new Error("Utilisateur non connecté");
  }

  return res.json();
}
