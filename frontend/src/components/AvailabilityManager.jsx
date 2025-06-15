import React, { useState, useEffect } from 'react';
import { addAvailability, updateAvailabilityByTinyHouseId, deleteAvailabilityByTinyHouseId } from '../services/availabilityService';
import { getTinyHouseByPropertyOwnerId } from '../services/tinyHouseService';

export default function AvailabilityManager({ user, onBack }) {
  const [action, setAction] = useState(null);
  const [tinyHouses, setTinyHouses] = useState([]);
  const [selectedTinyHouseId, setSelectedTinyHouseId] = useState('');
  const userId = user?.id || null;

  // Tiny house'ları yükle
  useEffect(() => {
    if (userId) {
      loadTinyHouses();
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

  // Müsaitlik ekle
  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const availableFrom = formData.get('availableFrom');
    const availableTo = formData.get('availableTo');

    // Tarih validasyonu
    if (new Date(availableFrom) >= new Date(availableTo)) {
      alert('Bitiş tarihi başlangıç tarihinden sonra olmalıdır.');
      return;
    }

    if (new Date(availableFrom) < new Date()) {
      alert('Başlangıç tarihi bugünden önce olamaz.');
      return;
    }

    const availabilityData = {
      id: 0,
      tinyHouseId: parseInt(selectedTinyHouseId),
      availableFrom: availableFrom,
      availableTo: availableTo,
      isAvailable: true,
    };

    try {
      await addAvailability(availabilityData);
      alert('Müsaitlik başarıyla eklendi!');
      setAction(null);
      setSelectedTinyHouseId('');
    } catch (error) {
      alert('Müsaitlik eklenemedi.');
    }
  };

  // Müsaitlik güncelle
  const handleAvailabilityUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const availableFrom = formData.get('availableFrom');
    const availableTo = formData.get('availableTo');

    // Tarih validasyonu
    if (new Date(availableFrom) >= new Date(availableTo)) {
      alert('Bitiş tarihi başlangıç tarihinden sonra olmalıdır.');
      return;
    }

    const availabilityData = {
      tinyHouseId: parseInt(selectedTinyHouseId),
      availableFrom: availableFrom,
      availableTo: availableTo,
      isAvailable: formData.get('isAvailable') === 'true',
    };

    try {
      await updateAvailabilityByTinyHouseId(selectedTinyHouseId, availabilityData);
      alert('Müsaitlik başarıyla güncellendi!');
      setAction(null);
      setSelectedTinyHouseId('');
    } catch (error) {
      alert('Müsaitlik güncellenemedi.');
    }
  };

  // Müsaitlik sil
  const handleAvailabilityDelete = async () => {
    if (window.confirm('Bu Tiny House\'un müsaitlik bilgilerini silmek istediğinizden emin misiniz?')) {
      try {
        await deleteAvailabilityByTinyHouseId(selectedTinyHouseId);
        alert('Müsaitlik başarıyla silindi!');
        setAction(null);
        setSelectedTinyHouseId('');
      } catch (error) {
        alert('Müsaitlik silinemedi.');
      }
    }
  };

  // Bugünün tarihi (input için minimum değer)
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Gelecek hafta tarihi (varsayılan bitiş tarihi)
  const getNextWeekDate = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  };

  // Ana menü
  if (!action) {
    return (
      <div className="container">
        <h1>📅 Müsaitlik Yönetimi</h1>
        <div className="action-grid">
          <button onClick={() => setAction('add')}>
            Müsaitlik Ekle
          </button>
          <button onClick={() => setAction('edit')}>
            Müsaitlik Düzenle
          </button>
          <button onClick={() => setAction('delete')}>
            Müsaitlik Sil
          </button>
        </div>
        <button type="button" onClick={onBack} className="back-button">
          Ana Menüye Dön
        </button>
      </div>
    );
  }

  // Müsaitlik ekle
  if (action === 'add') {
    return (
      <div className="container">
        <h1>Müsaitlik Ekle</h1>
        {tinyHouses.length === 0 ? (
          <div>
            <p>Müsaitlik eklemeden önce en az bir Tiny House eklemelisiniz.</p>
            <button type="button" onClick={() => setAction(null)}>Geri</button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label>Tiny House Seçin:</label>
              <select 
                value={selectedTinyHouseId} 
                onChange={(e) => setSelectedTinyHouseId(e.target.value)}
                required
              >
                <option value="">Tiny House Seçin</option>
                {tinyHouses.map((th) => (
                  <option key={th.id} value={th.id}>
                    {th.name} - {th.pricePerNight} TL/gece
                  </option>
                ))}
              </select>
            </div>
            
            {selectedTinyHouseId && (
              <form onSubmit={handleAvailabilitySubmit}>
                <div>
                  <label>Müsait Başlangıç Tarihi:</label>
                  <input 
                    type="date" 
                    name="availableFrom" 
                    min={getTodayDate()}
                    defaultValue={getTodayDate()}
                    required 
                  />
                </div>
                <div>
                  <label>Müsait Bitiş Tarihi:</label>
                  <input 
                    type="date" 
                    name="availableTo" 
                    min={getTodayDate()}
                    defaultValue={getNextWeekDate()}
                    required 
                  />
                </div>
                
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '5px' }}>
                  <h4>Seçilen Tiny House Bilgileri:</h4>
                  {(() => {
                    const selectedHouse = tinyHouses.find(th => th.id == selectedTinyHouseId);
                    return selectedHouse ? (
                      <div>
                        <p><strong>İsim:</strong> {selectedHouse.name}</p>
                        <p><strong>Fiyat:</strong> {selectedHouse.pricePerNight} TL/gece</p>
                        <p><strong>Max Kişi:</strong> {selectedHouse.maxGuests}</p>
                      </div>
                    ) : null;
                  })()}
                </div>
                
                <button type="submit">Müsaitlik Ekle</button>
                <button type="button" onClick={() => {
                  setAction(null);
                  setSelectedTinyHouseId('');
                }}>İptal</button>
              </form>
            )}
          </div>
        )}
      </div>
    );
  }

  // Müsaitlik düzenle
  if (action === 'edit') {
    return (
      <div className="container">
        <h1>Müsaitlik Düzenle</h1>
        {tinyHouses.length === 0 ? (
          <div>
            <p>Düzenlenecek Tiny House bulunamadı.</p>
            <button type="button" onClick={() => setAction(null)}>Geri</button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
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
                  <input 
                    type="date" 
                    name="availableFrom" 
                    min={getTodayDate()}
                    required 
                  />
                </div>
                <div>
                  <label>Müsait Bitiş Tarihi:</label>
                  <input 
                    type="date" 
                    name="availableTo" 
                    min={getTodayDate()}
                    required 
                  />
                </div>
                <div>
                  <label>Müsaitlik Durumu:</label>
                  <select name="isAvailable" required>
                    <option value="true">Müsait</option>
                    <option value="false">Müsait Değil</option>
                  </select>
                </div>
                
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
                  <small>
                    <strong>Not:</strong> Bu işlem seçilen Tiny House'un mevcut müsaitlik bilgilerini güncelleyecektir.
                  </small>
                </div>
                
                <button type="submit">Müsaitlik Düzenle</button>
                <button type="button" onClick={() => {
                  setAction(null);
                  setSelectedTinyHouseId('');
                }}>İptal</button>
              </form>
            )}
          </div>
        )}
      </div>
    );
  }

  // Müsaitlik sil
  if (action === 'delete') {
    return (
      <div className="container">
        <h1>Müsaitlik Sil</h1>
        {tinyHouses.length === 0 ? (
          <div>
            <p>Silinecek müsaitlik bulunamadı.</p>
            <button type="button" onClick={() => setAction(null)}>Geri</button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '5px' }}>
              <strong>⚠️ Dikkat:</strong> Bu işlem seçilen Tiny House'un tüm müsaitlik bilgilerini silecektir ve geri alınamaz.
            </div>
            
            <div style={{ marginBottom: '20px' }}>
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
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '5px' }}>
                  <h4>Silinecek Müsaitlik Bilgileri:</h4>
                  <p><strong>Tiny House:</strong> {tinyHouses.find(th => th.id == selectedTinyHouseId)?.name}</p>
                  <p>Bu Tiny House'a ait tüm müsaitlik kayıtları silinecektir.</p>
                </div>
                
                <button onClick={handleAvailabilityDelete} className="delete-button">
                  Müsaitlik Bilgilerini Sil
                </button>
                <button onClick={() => {
                  setAction(null);
                  setSelectedTinyHouseId('');
                }}>İptal</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}