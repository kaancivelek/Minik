import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateTinyHouse } from '../services/tinyHouseService';
import { toast } from 'react-toastify';
import '../styles/EditHouseForm.css';

export default function TinyHouseEditing({ tinyHouse }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: tinyHouse?.name || '',
    description: tinyHouse?.description || '',
    pricePerNight: tinyHouse?.pricePerNight || '',
    maxGuests: tinyHouse?.maxGuests || '',
    country: tinyHouse?.country || '',
    city: tinyHouse?.city || '',
    amenities: tinyHouse?.amenities || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Açıklama için max 300 karakter
    if (name === "description" && value.length > 300) return;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateTinyHouse(tinyHouse.id, formData);
      if (!response) {
        toast.error("Güncelleme işlemi başarısız oldu.", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      } else if (response.message === "TinyHouse başarıyla güncellendi.") {
        toast.success(response.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
        setTimeout(() => {
          navigate(`/TinyHouseDetails/${tinyHouse.id}`);
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
    <div className="edit-house-form-container">
      <h6>Ev Bilgilerini Düzenle</h6>
      <form onSubmit={handleSubmit} className="edit-house-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="edit-house-input"
          placeholder="Başlık"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="edit-house-input"
          placeholder="Açıklama (max 300 karakter)"
          maxLength={300}
          rows={4}
          required
        />
        <input
          type="number"
          name="pricePerNight"
          value={formData.pricePerNight}
          onChange={handleChange}
          className="edit-house-input"
          placeholder="Gecelik Fiyat"
          required
        />
        <input
          type="number"
          name="maxGuests"
          value={formData.maxGuests}
          onChange={handleChange}
          className="edit-house-input"
          placeholder="Maksimum Kişi"
          required
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="edit-house-input"
          placeholder="Ülke"
          required
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="edit-house-input"
          placeholder="Şehir"
          required
        />
        <input
          type="text"
          name="amenities"
          value={formData.amenities}
          onChange={handleChange}
          className="edit-house-input"
          placeholder="Olanaklar"
        />
        <button
          type="submit"
          className="edit-house-submit"
        >
          Güncelle
        </button>
      </form>
    </div>
  );
}