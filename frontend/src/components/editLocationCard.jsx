import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/EditLocationCard.css'
import { toast } from 'react-toastify'
import { updateLocation } from '../services/locationService'
import {useState } from 'react'
export default function editLocationCard({userId}) {
    const [formData, setFormData] = useState({
        id:0,
        country:formData.country,
        city: formData.city,
        address: formData.address,
        latitude: 0,
        longitude: 0,
        user_Id:userId 
    });
  return (
    <div>
        <h2>Konum Bilgilerini Düzenle</h2>
        
      <form  onSubmit={()=>{}}></form>
    <div className="edit-location-form">
        <label htmlFor="country">Ülke:</label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          required
        /></div>
        <label htmlFor="city">Şehir:</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        />
        <label htmlFor="address">Adres:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
        

      <input type="submit" value="Kaydet" />
    </div>
  )}

