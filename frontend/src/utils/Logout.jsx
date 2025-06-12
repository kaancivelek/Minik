import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // logout işlemi tamamlanınca anasayfaya at
  }, [navigate, setUser]);

  return null; // kullanıcıyı bekletmeden hemen yönlendiriyoruz
}
