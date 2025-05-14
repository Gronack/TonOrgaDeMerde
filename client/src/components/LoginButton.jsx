export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = "http://localhost:3001/auth/discord";
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
