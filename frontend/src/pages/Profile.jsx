import { useEffect, useState } from "react";
import CustomerPanel from "../components/CustomerPanel";
import PropertyOwnerPanel from "../components/PropertyOwnerPanel";

import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";

export default function Profile({ user, setUser, insertTinyHouse }) {
  const navigate = useNavigate();
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsUserLoading(false);
  }, []);

  useEffect(() => {
    if (!isUserLoading && !user) {
      navigate("/");
    }

    if (!isUserLoading && user?.roleId === 3) {
      navigate("/admin");
    }
  }, [user, isUserLoading, navigate]);

  const getRoleName = (roleId) => {
    switch (roleId) {
      case 3:
        return "Admin";
      case 1:
        return "Müşteri";
      case 2:
        return "Emlak Sahibi";
      default:
        return "Bilinmeyen Rol";
    }
  };

  const getPanelByRole = (roleId) => {
    switch (roleId) {
      case 1:
        return <CustomerPanel user={user} insertTinyHouse={insertTinyHouse} />;
      case 2:
        return (
          <PropertyOwnerPanel
            user={user}
            insertTinyHouse={insertTinyHouse}
          />
        );
      case 3:
        return null; // Admin yönlendirildiği için burada panel dönmüyoruz
      default:
        return <div>Panel bulunamadı</div>;
    }
  };

  if (isUserLoading || !user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        Yükleniyor...
      </div>
    );
  }

  return (
    <>
      <div
        className="profile-container"
        style={{
          padding: "20px",
          maxWidth: "300px",
          margin: "auto",
          border: "1px solid #ccc",
          borderRadius: "10px",
        }}
      >
        <h2>Profil Bilgileri</h2>
        <p>
          <strong>Ad Soyad:</strong> {user.fullName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Telefon:</strong> {user.phoneNumber}
        </p>
        <p>
          <strong>Rol:</strong> {getRoleName(user.roleId)}
        </p>
        <Button
          color="info"
          style={{ background: "transparent", border: "1px solid #ccc", marginRight: "10px" }}
          onClick={() => {
            localStorage.removeItem("user");
            setUser(null);
            navigate("/logout");
          }}
        >
          Çıkış Yap
        </Button>
        <Button
          color="info"
          style={{ background: "transparent", border: "1px solid #ccc" }}
          onClick={() => navigate("/EditProfile")}
        >
          Bilgilerini Düzenle
        </Button>
      </div>

      <div>{getPanelByRole(user.roleId)}</div>
    </>
  );
}
