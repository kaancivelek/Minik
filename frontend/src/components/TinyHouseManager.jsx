import React, { useState, useEffect } from 'react';
import { createTinyHouse, getTinyHouseByPropertyOwnerId, updateTinyHouse, deleteTinyHouse } from '../services/tinyHouseService';
import { getLocationByUserId } from '../services/locationService';

export default function TinyHouseManager({ user, onBack }) {
  const [action, setAction] = useState(null);
  const [tinyHouses, setTinyHouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [editingTinyHouse, setEditingTinyHouse] = useState(null);
  const userId = user?.id || null;

  // Tiny house'ları ve lokasyonları yükle
  useEffect(() => {
    if (userId) {
      loadTinyHouses();
      loadLocations();
    }
  }, [userId]);

  const loadTinyHouses = async () => {
    try {
      const tinyHouseData = await getTinyHouseByPropertyOwnerId(userId);
      setTinyHouses(tinyHouseData);
    } catch (error) {
      setTinyHouses([]);
    }
  };

  const loadLocations = async () => {
    try {
      const locationData = await getLocationByUserId(userId);
      setLocations(locationData);
    } catch (error) {
      setLocations([]);
    }
  };

  // Yeni tiny house ekle
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
      loadTinyHouses(); // Listeyi yenile
    } catch (error) {
      alert('Tiny House eklenemedi.');
    }
  };

  // Tiny house düzenleme başlat
  const handleTinyHouseEdit = (tinyHouseId) => {
    const tinyHouse = tinyHouses.find(th => th.id === parseInt(tinyHouseId));
    setEditingTinyHouse(tinyHouse);
    setAction('edit-form');
  };

  // Tiny house güncelle
  const handleTinyHouseUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tinyHouseData = {
      id: editingTinyHouse.id,
      name: formData.get('name'),
      description: formData.get('description'),
      locationId: parseInt(formData.get('locationId')),
      pricePerNight: parseFloat(formData.get('pricePerNight')),
      maxGuests: parseInt(formData.get('maxGuests')),
      propertyOwnerId: userId,
      amenities: formData.get('amenities'),
    };

    try {
      await updateTinyHouse(editingTinyHouse.id, tinyHouseData);
      alert('Tiny House başarıyla güncellendi!');
      setAction(null);
      setEditingTinyHouse(null);
      loadTinyHouses(); // Listeyi yenile
    } catch (error) {
      alert('Tiny House güncellenemedi.');
    }
  };

  // Tiny house sil
  const handleTinyHouseDelete = async (tinyHouseId) => {
    if (window.confirm('Bu Tiny House\'u silmek istediğinizden emin misiniz?')) {
      try {
        await deleteTinyHouse(tinyHouseId);
        alert('Tiny House başarıyla silindi!');
        loadTinyHouses(); // Listeyi yenile
      } catch (error) {
        alert('Tiny House silinemedi.');
      }
    }
  };

  // Lokasyon adını getir
  const getLocationName = (locationId) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? `${location.country} - ${location.city}` : 'Bilinmeyen Lokasyon';
  };

  // Ana menü
  if (!action) {
    return (
      <div className="container">
        <h1>🏠 Tiny House Yönetimi</h1>
        <div className="action-grid">
          <button onClick={() => setAction('add')}>
            Yeni Tiny House Ekle
          </button>
          <button onClick={() => setAction('view')}>
            Tiny House'ları Görüntüle
          </button>
          <button onClick={() => setAction('edit')}>
            Tiny House Düzenle/Sil
          </button>
        </div>
        <button type="button" onClick={onBack} className="back-button">
          Ana Menüye Dön
        </button>
      </div>
    );
  }

  // Yeni tiny house ekle formu
  if (action === 'add') {
    return (
      <div className="container">
        <h1>Yeni Tiny House Ekle</h1>
        {locations.length === 0 ? (
          <div>
            <p>Tiny House eklemeden önce en az bir lokasyon eklemelisiniz.</p>
            <button type="button" onClick={() => setAction(null)}>Geri</button>
          </div>
        ) : (
          <form onSubmit={handleTinyHouseSubmit}>
            <div>
              <label>İsim:</label>
              <input type="text" name="name" required />
            </div>
            <div>
              <label>Açıklama:</label>
              <textarea name="description" required />
            </div>
            <div>
              <label>Lokasyon:</label>
              <select name="locationId" required>
                <option value="">Lokasyon Seçin</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.country} - {loc.city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Gecelik Fiyat (TL):</label>
              <input type="number" name="pricePerNight" step="0.01" required />
            </div>
            <div>
              <label>Maksimum Kişi Sayısı:</label>
              <input type="number" name="maxGuests" min="1" required />
            </div>
            <div>
              <label>Özellikler:</label>
              <textarea name="amenities" placeholder="WiFi, Klima, Mutfak vb..." />
            </div>
            <button className="submit-button" type="submit">Ekle</button>
            <button className="cancel-button" type="button" onClick={() => setAction(null)}>İptal</button>
          </form>
        )}
      </div>
    );
  }

  // Tiny house'ları görüntüle
  if (action === 'view') {
    return (
      <div className="container">
        <h1>Mevcut Tiny House'lar</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tinyHouses.length === 0 ? (
            <p>Henüz Tiny House eklenmemiş.</p>
          ) : (
            tinyHouses.map((th) => (
              <div key={th.id} className="item-card">
                <h3>{th.name}</h3>
                <p><strong>Açıklama:</strong> {th.description}</p>
                <p><strong>Lokasyon:</strong> {getLocationName(th.locationId)}</p>
                <p><strong>Fiyat:</strong> {th.pricePerNight} TL/gece</p>
                <p><strong>Max Kişi:</strong> {th.maxGuests}</p>
                {th.amenities && (
                  <p><strong>Özellikler:</strong> {th.amenities}</p>
                )}
              </div>
            ))
          )}
        </div>
        <button type="button" onClick={() => setAction(null)}>Geri</button>
      </div>
    );
  }

  // Tiny house düzenle/sil - seçim
  if (action === 'edit') {
    return (
      <div className="container">
        <h1>Tiny House Düzenle/Sil</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tinyHouses.length === 0 ? (
            <p>Henüz Tiny House eklenmemiş.</p>
          ) : (
            tinyHouses.map((th) => (
              <div key={th.id} className="item-card">
                <h3>{th.name}</h3>
                <p><strong>Açıklama:</strong> {th.description}</p>
                <p><strong>Lokasyon:</strong> {getLocationName(th.locationId)}</p>
                <p><strong>Fiyat:</strong> {th.pricePerNight} TL/gece</p>
                <p><strong>Max Kişi:</strong> {th.maxGuests}</p>
                <div className="card-actions">
                  <button onClick={() => handleTinyHouseEdit(th.id)}>
                    Düzenle
                  </button>
                  <button 
                    onClick={() => handleTinyHouseDelete(th.id)} 
                    className="delete-button"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <button type="button" onClick={() => setAction(null)}>Geri</button>
      </div>
    );
  }

  // Tiny house düzenle formu
  if (action === 'edit-form' && editingTinyHouse) {
    return (
      <div className="container">
        <h1>Tiny House Düzenle</h1>
        <form onSubmit={handleTinyHouseUpdateSubmit}>
          <div>
            <label>İsim:</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={editingTinyHouse.name}
              required 
            />
          </div>
          <div>
            <label>Açıklama:</label>
            <textarea 
              name="description" 
              defaultValue={editingTinyHouse.description}
              required 
            />
          </div>
          <div>
            <label>Lokasyon:</label>
            <select name="locationId" defaultValue={editingTinyHouse.locationId} required>
              <option value="">Lokasyon Seçin</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.country} - {loc.city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Gecelik Fiyat (TL):</label>
            <input 
              type="number" 
              name="pricePerNight" 
              step="0.01" 
              defaultValue={editingTinyHouse.pricePerNight}
              required 
            />
          </div>
          <div>
            <label>Maksimum Kişi Sayısı:</label>
            <input 
              type="number" 
              name="maxGuests" 
              min="1"
              defaultValue={editingTinyHouse.maxGuests}
              required 
            />
          </div>
          <div>
            <label>Özellikler:</label>
            <textarea 
              name="amenities" 
              defaultValue={editingTinyHouse.amenities || ''}
              placeholder="WiFi, Klima, Mutfak vb..."
            />
          </div>
          <button type="submit">Güncelle</button>
          <button type="button" onClick={() => setAction(null)}>İptal</button>
        </form>
      </div>
    );
  }

  return null;
}