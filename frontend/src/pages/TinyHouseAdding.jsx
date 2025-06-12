import React, { useState, useEffect } from 'react'
import { addAvailability } from '../services/availabilityService'
import { createTinyHouse, getTinyHouseByPropertyOwnerId } from '../services/tinyHouseService'
import { addTinyHouseImageByTinyHouseId } from '../services/houseImages'
import { addLocation, getLocationByUserId } from '../services/locationService'
import '../styles/TinyHouseAdding.css'

export default function TinyHouseAdding({ user }) {
  const [action, setAction] = useState(null);
  const [locations, setLocations] = useState([]);
  const [tinyHouses, setTinyHouses] = useState([]);
  const [selectedTinyHouseId, setSelectedTinyHouseId] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const userId = user?.id || null;

  // Tiny house ve lokasyonları çek
  useEffect(() => {
    if (userId) {
      getLocationByUserId(userId).then(setLocations).catch(() => setLocations([]));
      getTinyHouseByPropertyOwnerId(userId).then(setTinyHouses).catch(() => setTinyHouses([]));
    }
  }, [userId, action]);

  // --- FORMLAR ---
  // 1. Yeni Lokasyon Ekle
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const locationData = {
      id: 0,
      country: formData.get('country'),
      city: formData.get('city'),
      address: formData.get('address'),
      latitude: 0,
      longitude: 0,
      user_id: parseInt(userId),
    };
    try {
      await addLocation(locationData);
      alert('Lokasyon başarıyla eklendi!');
      setAction(null);
    } catch {
      alert('Adres eklenemedi.');
    }
  };

  // 2. Yeni Tiny House Ekle
  const handleTinyHouseSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tinyHouseData = {
      name: formData.get('name'),
      description: formData.get('description'),
      locationId: parseInt(formData.get('locationId')),
      pricePerNight: parseFloat(formData.get('pricePerNight')),
      maxGuests: parseInt(formData.get('maxGuests')),
      propertyOwnerId: userId,
      amenities: formData.get('amenities'),
    };
    try {
      await createTinyHouse(tinyHouseData);
      alert('Tiny House başarıyla eklendi!');
      setAction(null);
    } catch {
      alert('Tiny House eklenemedi.');
    }
  };

  // 3. Mevcut Tiny House'a Fotoğraf Ekle
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageData = {
      imageUrl: formData.get('imageUrl'),
    };
    try {
      await addTinyHouseImageByTinyHouseId(selectedTinyHouseId, imageData);
      alert('Fotoğraf başarıyla eklendi!');
      setAction(null);
    } catch {
      alert('Fotoğraf eklenemedi.');
    }
  };

  // 4. Mevcut Tiny House'a Müsaitlik Ekle
  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const availabilityData = {
      id: 0,
      tinyHouseId: selectedTinyHouseId,
      availableFrom: formData.get('availableFrom'),
      availableTo: formData.get('availableTo'),
      isAvailable: true,
    };
    try {
      await addAvailability(availabilityData);
      alert('Müsaitlik başarıyla eklendi!');
      setAction(null);
    } catch {
      alert('Müsaitlik eklenemedi.');
    }
  };

  // --- ARAYÜZ ---
  return (
    <div>
      {!action && (
        <div className="action-menu">
          <h2>Ne yapmak istersiniz?</h2>
          <button onClick={() => setAction('add-tinyhouse')}>Yeni Tiny House Ekle</button>
          <button onClick={() => setAction('add-image')}>Mevcut Tiny House'a Fotoğraf Ekle</button>
          <button onClick={() => setAction('add-availability')}>Mevcut Tiny House'a Müsaitlik Ekle</button>
          <button onClick={() => setAction('add-location')}>Yeni Lokasyon Ekle</button>
          <button onClick={() => setAction('view-locations')}>Mevcut Lokasyonları Görüntüle</button>
        </div>
      )}

      {action === 'add-location' && (
        <form onSubmit={handleAddressSubmit}>
          <h1>Yeni Lokasyon Ekle</h1>
          <input type="text" placeholder="Ülke" name="country" required />
          <input type="text" placeholder="Şehir" name="city" required />
          <input type="text" placeholder="Adres" name="address" required />
          <button type="submit">Kaydet</button>
          <button type="button" onClick={() => setAction(null)}>Geri</button>
        </form>
      )}

      {action === 'add-tinyhouse' && (
        <form onSubmit={handleTinyHouseSubmit}>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '8px' }}>
  <strong>Not:</strong> Tiny House eklemeden önce bir lokasyon girmiş olmanız gerekmektedir.
</p>
          <h1>Yeni Tiny House Ekle</h1>
          <input type="text" placeholder="İsim" name="name" required />
          <input type="text" placeholder="Açıklama" name="description" required />
          <select name="locationId" required>
            <option value="">Adres Seçiniz</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.country} - {loc.city} - {loc.address}
              </option>
            ))}
          </select>
          <input type="text" placeholder="Fiyat (gecelik)" name="pricePerNight" required />
          <input type="text" placeholder="Max Kişi" name="maxGuests" required />
          <input type="text" placeholder="Özellikler (amenities)" name="amenities" />
          <button type="submit">Kaydet</button>
          <button type="button" onClick={() => setAction(null)}>Geri</button>
        </form>
      )}

      {action === 'add-image' && (
        <form onSubmit={handleImageSubmit}>
          <h1>Mevcut Tiny House'a Fotoğraf Ekle</h1>
          <select
            value={selectedTinyHouseId}
            onChange={e => setSelectedTinyHouseId(e.target.value)}
            required
          >
            <option value="">Tiny House Seçiniz</option>
            {tinyHouses.map((th) => (
              <option key={th.id} value={th.id}>{th.name}</option>
            ))}
          </select>
          <input type="text" placeholder="Fotoğraf URL" name="imageUrl" required />
          <button type="submit">Kaydet</button>
          <button type="button" onClick={() => setAction(null)}>Geri</button>
        </form>
      )}

      {action === 'add-availability' && (
        <form onSubmit={handleAvailabilitySubmit}>
          <h1>Mevcut Tiny House'a Müsaitlik Ekle</h1>
          <select
            value={selectedTinyHouseId}
            onChange={e => setSelectedTinyHouseId(e.target.value)}
            required
          >
            <option value="">Tiny House Seçiniz</option>
            {tinyHouses.map((th) => (
              <option key={th.id} value={th.id}>{th.name}</option>
            ))}
          </select>
          <input type="datetime-local" placeholder="Uygunluk Başlangıcı" name="availableFrom" required />
          <input type="datetime-local" placeholder="Uygunluk Bitişi" name="availableTo" required />
          <button type="submit">Kaydet</button>
          <button type="button" onClick={() => setAction(null)}>Geri</button>
        </form>
      )}

      {action === 'view-locations' && (
        <div>
          <h1>Mevcut Lokasyonlar</h1>
          <ul>
            {locations.map((loc) => (
              <li key={loc.id}>
                {loc.country} - {loc.city} - {loc.address}
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setAction(null)}>Geri</button>
        </div>
      )}
    </div>
  );
}
