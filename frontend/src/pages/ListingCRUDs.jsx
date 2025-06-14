import React, { useState, useEffect } from 'react'
import { addAvailability, updateAvailabilityByTinyHouseId, deleteAvailabilityByTinyHouseId } from '../services/availabilityService'
import { createTinyHouse, getTinyHouseByPropertyOwnerId, updateTinyHouse, deleteTinyHouse } from '../services/tinyHouseService'
import { addTinyHouseImageByTinyHouseId, deleteTinyHouseImageById } from '../services/houseImages'
import { addLocation, updateLocationByLocationId, getLocationByUserId, deleteLocationByLocationId } from '../services/locationService'
import '../styles/ListingCRUDs.css'

export default function TinyHouseAdding({ user }) {
  const [action, setAction] = useState(null);
  const [locations, setLocations] = useState([]);
  const [tinyHouses, setTinyHouses] = useState([]);
  const [selectedTinyHouseId, setSelectedTinyHouseId] = useState('');
  const [editingLocation, setEditingLocation] = useState(null);
  const [editingTinyHouse, setEditingTinyHouse] = useState(null);
  const userId = user?.id || null;

  // Tiny house ve lokasyonları çek
  useEffect(() => {
    if (userId) {
      getLocationByUserId(userId).then(setLocations).catch(() => setLocations([]));
      getTinyHouseByPropertyOwnerId(userId).then(setTinyHouses).catch(() => setTinyHouses([]));
    }
  }, [userId, action]);

  // Lokasyon düzenleme fonksiyonları
  const handleLocationEdit = async (locationId) => {
    const location = locations.find(loc => loc.id === parseInt(locationId));
    setEditingLocation(location);
    setAction('edit-location-form');
  };

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
    } catch {
      alert('Lokasyon güncellenemedi.');
    }
  };

  // Lokasyon silme
  const handleLocationDelete = async (locationId) => {
    if (window.confirm('Bu lokasyonu silmek istediğinizden emin misiniz?')) {
      try {
        await deleteLocationByLocationId(locationId);
        alert('Lokasyon başarıyla silindi!');
        setAction(null);
      } catch {
        alert('Lokasyon silinemedi.');
      }
    }
  };

  // Tiny House düzenleme fonksiyonları
  const handleTinyHouseEdit = async (tinyHouseId) => {
    const tinyHouse = tinyHouses.find(th => th.id === parseInt(tinyHouseId));
    setEditingTinyHouse(tinyHouse);
    setAction('edit-tinyhouse-form');
  };

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
    } catch {
      alert('Tiny House güncellenemedi.');
    }
  };

  // Tiny House silme
  const handleTinyHouseDelete = async (tinyHouseId) => {
    if (window.confirm('Bu Tiny House\'u silmek istediğinizden emin misiniz?')) {
      try {
        await deleteTinyHouse(tinyHouseId);
        alert('Tiny House başarıyla silindi!');
        setAction(null);
      } catch {
        alert('Tiny House silinemedi.');
      }
    }
  };

  // Müsaitlik düzenleme
  const handleAvailabilityUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const availabilityData = {
      tinyHouseId: selectedTinyHouseId,
      availableFrom: formData.get('availableFrom'),
      availableTo: formData.get('availableTo'),
      isAvailable: formData.get('isAvailable') === 'true',
    };
    try {
      await updateAvailabilityByTinyHouseId(selectedTinyHouseId, availabilityData);
      alert('Müsaitlik başarıyla güncellendi!');
      setAction(null);
    } catch {
      alert('Müsaitlik güncellenemedi.');
    }
  };

  // Müsaitlik silme
  const handleAvailabilityDelete = async () => {
    if (window.confirm('Bu Tiny House\'un müsaitlik bilgilerini silmek istediğinizden emin misiniz?')) {
      try {
        await deleteAvailabilityByTinyHouseId(selectedTinyHouseId);
        alert('Müsaitlik başarıyla silindi!');
        setAction(null);
      } catch {
        alert('Müsaitlik silinemedi.');
      }
    }
  };

  // Fotoğraf silme
  const handleImageDelete = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageId = formData.get('imageId');
    
    if (window.confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteTinyHouseImageById(imageId);
        alert('Fotoğraf başarıyla silindi!');
        setAction(null);
      } catch {
        alert('Fotoğraf silinemedi.');
      }
    }
  };

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

      {/* Ana Menu */}
      {!action && (
        <div className="action-menu">
          <h2>Tiny House Yönetim Paneli</h2>
          <div className="action-grid">
            
            {/* Tiny House İşlemleri */}
            <div className="action-section tiny-house-section">
              <div className="section-title">🏠 Tiny House İşlemleri</div>
              <div className="section-buttons">
                <button onClick={() => setAction('add-tinyhouse')}>
                  Yeni Tiny House Ekle
                </button>
                <button onClick={() => setAction('edit-tinyhouse')}>
                  Tiny House Düzenle
                </button>
                <button onClick={() => setAction('delete-tinyhouse')}>
                  Tiny House Sil
                </button>
              </div>
            </div>

            {/* Lokasyon İşlemleri */}
            <div className="action-section location-section">
              <div className="section-title">📍 Lokasyon İşlemleri</div>
              <div className="section-buttons">
                <button onClick={() => setAction('add-location')}>
                  Yeni Lokasyon Ekle
                </button>
                <button onClick={() => setAction('edit-location')}>
                  Lokasyon Düzenle
                </button>
                <button onClick={() => setAction('view-locations')}>
                  Lokasyonları Görüntüle
                </button>
              </div>
            </div>

            {/* Medya İşlemleri */}
            <div className="action-section media-section">
              <div className="section-title">🖼️ Medya İşlemleri</div>
              <div className="section-buttons">
                <button onClick={() => setAction('add-image')}>
                  Fotoğraf Ekle
                </button>
                <button onClick={() => setAction('delete-image')}>
                  Fotoğraf Sil
                </button>
              </div>
            </div>

            {/* Müsaitlik İşlemleri */}
            <div className="action-section availability-section">
              <div className="section-title">📅 Müsaitlik İşlemleri</div>
              <div className="section-buttons">
                <button onClick={() => setAction('add-availability')}>
                  Müsaitlik Ekle
                </button>
                <button onClick={() => setAction('edit-availability')}>
                  Müsaitlik Düzenle
                </button>
                <button onClick={() => setAction('delete-availability')}>
                  Müsaitlik Sil
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Lokasyonları Görüntüle */}
      {action === 'view-locations' && (
        <div className="container">
          <h1>Mevcut Lokasyonlar</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {locations.map((loc) => (
              <div key={loc.id} className="item-card">
                <h3>{loc.country} - {loc.city}</h3>
                <p><strong>Adres:</strong> {loc.address}</p>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setAction(null)}>Geri</button>
        </div>
      )}

      {/* Lokasyon Düzenle - Seçim */}
      {action === 'edit-location' && (
        <div className="container">
          <h1>Düzenlenecek Lokasyonu Seçin</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {locations.map((loc) => (
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
            ))}
          </div>
          <button type="button" onClick={() => setAction(null)}>Geri</button>
        </div>
      )}

      {/* Lokasyon Düzenle - Form */}
      {action === 'edit-location-form' && editingLocation && (
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
      )}

      {/* Tiny House Ekle */}
      {action === 'add-tinyhouse' && (
        <div className="container">
          <h1>Yeni Tiny House Ekle</h1>
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
              <input type="number" name="maxGuests" required />
            </div>
            <div>
              <label>Özellikler:</label>
              <textarea name="amenities" />
            </div>
            <button className="submit-button" type="submit">Ekle</button>
            <button className="cancel-button" type="button" onClick={() => setAction(null)}>İptal</button>
          </form>
        </div>
      )}

      {/* Tiny House Düzenle - Seçim */}
      {action === 'edit-tinyhouse' && (
        <div className="container">
          <h1>Düzenlenecek Tiny House'u Seçin</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tinyHouses.map((th) => (
              <div key={th.id} className="item-card">
                <h3>{th.name}</h3>
                <p><strong>Açıklama:</strong> {th.description}</p>
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
            ))}
          </div>
          <button type="button" onClick={() => setAction(null)}>Geri</button>
        </div>
      )}

      {/* Tiny House Düzenle - Form */}
      {action === 'edit-tinyhouse-form' && editingTinyHouse && (
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
                defaultValue={editingTinyHouse.maxGuests}
                required 
              />
            </div>
            <div>
              <label>Özellikler:</label>
              <textarea 
                name="amenities" 
                defaultValue={editingTinyHouse.amenities}
              />
            </div>
            <button type="submit">Güncelle</button>
            <button type="button" onClick={() => setAction(null)}>İptal</button>
          </form>
        </div>
      )}

      {/* Lokasyon Ekle */}
      {action === 'add-location' && (
        <div className="container">
          <h1>Yeni Lokasyon Ekle</h1>
          <form onSubmit={handleAddressSubmit}>
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
      )}

      {/* Fotoğraf Ekle */}
      {action === 'add-image' && (
        <div className="container">
          <h1>Fotoğraf Ekle</h1>
          <div>
            <label>Tiny House Seçin:</label>
            <select 
              value={selectedTinyHouseId} 
              onChange={(e) => setSelectedTinyHouseId(e.target.value)}
              required
            >
              <option value="">Tiny House Seçin</option>
              {tinyHouses.map((th) => (
                <option key={th.id} value={th.id}>
                  {th.name}
                </option>
              ))}
            </select>
          </div>
          {selectedTinyHouseId && (
            <form onSubmit={handleImageSubmit}>
              <div>
                <label>Fotoğraf URL:</label>
                <input type="url" name="imageUrl" required />
              </div>
              <button type="submit">Ekle</button>
              <button type="button" onClick={() => setAction(null)}>İptal</button>
            </form>
          )}
        </div>
      )}

      {/* Fotoğraf Sil */}
      {action === 'delete-image' && (
        <div className="container">
          <h1>Fotoğraf Sil</h1>
          <form onSubmit={handleImageDelete}>
            <div>
              <label>Fotoğraf ID:</label>
              <input type="number" name="imageId" required />
            </div>
            <button type="submit">Sil</button>
            <button type="button" onClick={() => setAction(null)}>İptal</button>
          </form>
        </div>
      )}

      {/* Müsaitlik Ekle */}
      {action === 'add-availability' && (
        <div className="container">
          <h1>Müsaitlik Ekle</h1>
          <div>
            <label>Tiny House Seçin:</label>
            <select 
              value={selectedTinyHouseId} 
              onChange={(e) => setSelectedTinyHouseId(e.target.value)}
              required
            >
              <option value="">Tiny House Seçin</option>
              {tinyHouses.map((th) => (
                <option key={th.id} value={th.id}>
                  {th.name}
                </option>
              ))}
            </select>
          </div>
          {selectedTinyHouseId && (
            <form onSubmit={handleAvailabilitySubmit}>
              <div>
                <label>Müsait Başlangıç Tarihi:</label>
                <input type="date" name="availableFrom" required />
              </div>
              <div>
                <label>Müsait Bitiş Tarihi:</label>
                <input type="date" name="availableTo" required />
              </div>
              <button type="submit">Ekle</button>
              <button type="button" onClick={() => setAction(null)}>İptal</button>
            </form>
          )}
        </div>
      )}

      {/* Müsaitlik Düzenle */}
      {action === 'edit-availability' && (
        <div className="container">
          <h1>Müsaitlik Düzenle</h1>
          <div>
            <label>Tiny House Seçin:</label>
            <select 
              value={selectedTinyHouseId} 
              onChange={(e) => setSelectedTinyHouseId(e.target.value)}
              required
            >
              <option value="">Tiny House Seçin</option>
              {tinyHouses.map((th) => (
                <option key={th.id} value={th.id}>
                  {th.name}
                </option>
              ))}
            </select>
          </div>
          {selectedTinyHouseId && (
            <form onSubmit={handleAvailabilityUpdate}>
              <div>
                <label>Müsait Başlangıç Tarihi:</label>
                <input type="date" name="availableFrom" required />
              </div>
              <div>
                <label>Müsait Bitiş Tarihi:</label>
                <input type="date" name="availableTo" required />
              </div>
              <div>
                <label>Müsait mi?</label>
                <select name="isAvailable" required>
                  <option value="true">Evet</option>
                  <option value="false">Hayır</option>
                </select>
              </div>
              <button type="submit">Güncelle</button>
              <button type="button" onClick={() => setAction(null)}>İptal</button>
            </form>
          )}
        </div>
      )}

      {/* Müsaitlik Sil */}
      {action === 'delete-availability' && (
        <div className="container">
          <h1>Müsaitlik Sil</h1>
          <div>
            <label>Tiny House Seçin:</label>
            <select 
              value={selectedTinyHouseId} 
              onChange={(e) => setSelectedTinyHouseId(e.target.value)}
              required
            >
              <option value="">Tiny House Seçin</option>
              {tinyHouses.map((th) => (
                <option key={th.id} value={th.id}>
                  {th.name}
                </option>
              ))}
            </select>
          </div>
          {selectedTinyHouseId && (
            <div>
              <p>Seçilen Tiny House'un tüm müsaitlik bilgileri silinecek.</p>
              <button onClick={handleAvailabilityDelete}>Sil</button>
              <button onClick={() => setAction(null)}>İptal</button>
            </div>
          )}
        </div>
      )}

      {/* Tiny House Sil */}
      {action === 'delete-tinyhouse' && (
        <div className="container">
          <h1>Tiny House Sil</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tinyHouses.map((th) => (
              <div key={th.id} className="item-card">
                <h3>{th.name}</h3>
                <p><strong>Açıklama:</strong> {th.description}</p>
                <p><strong>Fiyat:</strong> {th.pricePerNight} TL/gece</p>
                <div className="card-actions">
                  <button 
                    onClick={() => handleTinyHouseDelete(th.id)} 
                    className="delete-button"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setAction(null)}>Geri</button>
        </div>
      )}

    </div>
  );
}