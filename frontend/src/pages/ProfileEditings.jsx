import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ListingPage.css";
import { updateUser } from "../services/UserService";
import { toast } from "react-toastify";
import { getUserByEmail } from "../services/LogonService";

export default function ProfileEditings({ user, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || null,
    email: user?.email || null,
    phoneNumber: user?.phoneNumber || null,
    roleId: user?.role_id || null,
    passwordHash: null,
  });

  const fetchUserData = async () => {
    try {
      const cleanedData = {
        ...formData,
        roleId: formData.roleId === "" ? null : parseInt(formData.roleId, 10),
      };

      const response = await updateUser(user.email, cleanedData);

      if (response.message === "Kullanıcı başarıyla güncellendi.") {
        toast.success(response.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });

        +getUserByEmail(formData.email)
          .then((res) => {
            if (res) {
              localStorage.setItem("user", JSON.stringify(res));
              setUser(res);
              setTimeout(() => navigate("/Profile"), 2500);
            } else {
              console.error("Kullanıcı bulunamadı.");
            }
          })
          .catch((error) => {
            console.error("Kullanıcı bilgileri alınırken hata:", error);
          });
      } else {
        toast.error(response.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form verileri:", formData);
    console.log("Form gönderildi");
    fetchUserData();
  };

  return (
    <div
      className="profile-edit-container"
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h2>Bilgilerini Düzenle</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label htmlFor="full_name">Ad Soyad:</label>
          <input
            type="text"
            id="full_name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div>
          <label htmlFor="phone_number">Telefon:</label>
          <input
            type="text"
            id="phone_number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div>
          <label htmlFor="password">Şifre:</label>
          <input
            type="password"
            id="password"
            name="passwordHash"
            value={formData.passwordHash}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "var(--accent-color)",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}
