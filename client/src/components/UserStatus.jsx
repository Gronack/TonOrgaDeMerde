import { useEffect, useState } from "react";

export default function UserStatus() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/user`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error("Non connecté");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  if (!user) {
    return <p>❌ Non connecté</p>;
  }

  return (
    <div className="flex items-center gap-2">
      ✅ Connecté en tant que <strong>{user.username}</strong>
      <img
        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
        alt="avatar"
        className="w-8 h-8 rounded-full"
      />
    </div>
  );
}
