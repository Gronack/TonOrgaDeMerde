export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/discord`;
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Se connecter avec Discord
    </button>
  );
}
