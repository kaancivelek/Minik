import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateLocation } from "../services/locationService";
import { toast } from "react-toastify";
import "../styles/EditLocationCard.css";

export default function LocationEditing({ location }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    country: location?.country || "",
    city: location?.city || "",
    address: location?.address || "",
    user_Id: location?.user_Id || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateLocation(location.id, formData);
      if (!response) {
        toast.error("Güncelleme işlemi başarısız oldu.", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      } else if (response.message === "Lokasyon başarıyla güncellendi.") {
        toast.success(response.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
        setTimeout(() => {
          navigate(`/LocationDetails/${location.id}`);
        }, 2000);
      } else {
        toast.error(response.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Güncelleme sırasında hata oluştu:", error);
      toast.error("Bir hata oluştu.", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  return (
    <div className="edit-location-form-container">
      <h6>Lokasyon Bilgilerini Düzenle</h6>
      <form onSubmit={handleSubmit} className="edit-location-form">
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="edit-location-input"
          placeholder="Ülke"
          required
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="edit-location-input"
          placeholder="Şehir"
          required
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="edit-location-input"
          placeholder="Adres"
          required
        />
        <input
          type="number"
          name="user_Id"
          value={formData.user_Id}
          onChange={handleChange}
          className="edit-location-input"
          placeholder="Kullanıcı ID"
          required
        />
        <button type="submit" className="edit-location-submit">
          Güncelle
        </button>
      </form>
    </div>
  );
}
