// src/App.jsx
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import { fetchUser } from "./services/userService";
import LoginButton from "./components/LoginButton";
import UserStatus from "./components/UserStatus";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">---</h1>
      <Dashboard />

      {!user ? (
        <LoginButton />
      ) : (
        <div className="mt-4 flex items-center gap-4">
          <img
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
            width={50}
            alt="avatar"
            className="rounded-full"
          />
          <div>
            <p>Connecté en tant que <strong>{user.username}</strong></p>
            <a href="http://localhost:3001/auth/logout">
              <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded">
                Se déconnecter
              </button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
