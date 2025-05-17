export async function fetchUser() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/user`, {
    credentials: "include" // ✅ indispensable
  });

  if (!res.ok) throw new Error("Utilisateur non connecté");
  return res.json();
}
