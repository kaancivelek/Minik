import React, { useState, useEffect } from 'react';
import { addLocation, updateLocationByLocationId, getLocationByUserId, deleteLocationByLocationId } from '../services/locationService';

export default function LocationManager({ user, onBack }) {
  const [action, setAction] = useState(null);
  const [locations, setLocations] = useState([]);
  const [editingLocation, setEditingLocation] = useState(null);
  const userId = user?.id || null;

  // Lokasyonları yükle
  useEffect(() => {
    if (userId) {
      loadLocations();
    }
  }, [userId]);

  const loadLocations = async () => {
    try {
      const locationData = await getLocationByUserId(userId);
      setLocations(locationData);
    } catch (error) {
      setLocations([]);
    }
  };

  // Yeni lokasyon ekle
  const handleAddLocationSubmit = async (e) => {
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
      loadLocations(); // Listeyi yenile
    } catch (error) {
      alert('Lokasyon eklenemedi.');
    }
  };

  // Lokasyon düzenleme başlat
  const handleLocationEdit = (locationId) => {
    const location = locations.find(loc => loc.id === parseInt(locationId));
    setEditingLocation(location);
    setAction('edit-form');
  };

  // Lokasyon güncelle
  const handleLocationUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const locationData = {
      id: editingLocation.id,
      country: formData.get('country'),
      city: formData.get('city'),
      address: formData.get('address'),
      latitude: editingLocation.latitude,
      longitude: editingLocation.longitude,
      user_id: userId,
    };

    try {
      await updateLocationByLocationId(editingLocation.id, locationData);
      alert('Lokasyon başarıyla güncellendi!');
      setAction(null);
      setEditingLocation(null);
      loadLocations(); // Listeyi yenile
    } catch (error) {
      alert('Lokasyon güncellenemedi.');
    }
  };

  // Lokasyon sil
  const handleLocationDelete = async (locationId) => {
    if (window.confirm('Bu lokasyonu silmek istediğinizden emin misiniz?')) {
      try {
        await deleteLocationByLocationId(locationId);
        alert('Lokasyon başarıyla silindi!');
        loadLocations(); // Listeyi yenile
      } catch (error) {
        alert('Lokasyon silinemedi.');
      }
    }
  };

  // Ana menü
  if (!action) {
    return (
      <div className="container">
        <h1>📍 Lokasyon Yönetimi</h1>
        <div className="action-grid">
          <button onClick={() => setAction('add')}>
            Yeni Lokasyon Ekle
          </button>
          <button onClick={() => setAction('view')}>
            Lokasyonları Görüntüle
          </button>
          <button onClick={() => setAction('edit')}>
            Lokasyon Düzenle/Sil
          </button>
        </div>
        <button type="button" onClick={onBack} className="back-button">
          Ana Menüye Dön
        </button>
      </div>
    );
  }

  // Yeni lokasyon ekle formu
  if (action === 'add') {
    return (
      <div className="container">
        <h1>Yeni Lokasyon Ekle</h1>
        <form onSubmit={handleAddLocationSubmit}>
          <div>
            <label>Ülke:</label>
            <input type="text" name="country" required />
          </div>
          <div>
            <label>Şehir:</label>
            <input type="text" name="city" required />
          </div>
          <div>
            <label>Adres:</label>
            <textarea name="address" required />
          </div>
          <button type="submit">Ekle</button>
          <button type="button" onClick={() => setAction(null)}>İptal</button>
        </form>
      </div>
    );
  }

  // Lokasyonları görüntüle
  if (action === 'view') {
    return (
      <div className="container">
        <h1>Mevcut Lokasyonlar</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {locations.length === 0 ? (
            <p>Henüz lokasyon eklenmemiş.</p>
          ) : (
            locations.map((loc) => (
              <div key={loc.id} className="item-card">
                <h3>{loc.country} - {loc.city}</h3>
                <p><strong>Adres:</strong> {loc.address}</p>
              </div>
            ))
          )}
        </div>
        <button type="button" onClick={() => setAction(null)}>Geri</button>
      </div>
    );
  }

  // Lokasyon düzenle/sil - seçim
  if (action === 'edit') {
    return (
      <div className="container">
        <h1>Lokasyon Düzenle/Sil</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {locations.length === 0 ? (
            <p>Henüz lokasyon eklenmemiş.</p>
          ) : (
            locations.map((loc) => (
              <div key={loc.id} className="item-card">
                <h3>{loc.country} - {loc.city}</h3>
                <p><strong>Adres:</strong> {loc.address}</p>
                <div className="card-actions">
                  <button onClick={() => handleLocationEdit(loc.id)}>
                    Düzenle
                  </button>
                  <button 
                    onClick={() => handleLocationDelete(loc.id)} 
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

  // Lokasyon düzenle formu
  if (action === 'edit-form' && editingLocation) {
    return (
      <div className="container">
        <h1>Lokasyon Düzenle</h1>
        <form onSubmit={handleLocationUpdateSubmit}>
          <div>
            <label>Ülke:</label>
            <input 
              type="text" 
              name="country" 
              defaultValue={editingLocation.country}
              required 
            />
          </div>
          <div>
            <label>Şehir:</label>
            <input 
              type="text" 
              name="city" 
              defaultValue={editingLocation.city}
              required 
            />
          </div>
          <div>
            <label>Adres:</label>
            <textarea 
              name="address" 
              defaultValue={editingLocation.address}
              required
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