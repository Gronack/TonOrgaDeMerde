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
