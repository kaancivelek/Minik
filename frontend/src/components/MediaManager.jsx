import React, { useState, useEffect } from 'react';
import { addTinyHouseImageByTinyHouseId, deleteTinyHouseImageById } from '../services/houseImages';
import { getTinyHouseByPropertyOwnerId } from '../services/tinyHouseService';

export default function MediaManager({ user, onBack }) {
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

  // Fotoğraf ekle
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
      setSelectedTinyHouseId('');
    } catch (error) {
      alert('Fotoğraf eklenemedi.');
    }
  };

  // Fotoğraf sil
  const handleImageDelete = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageId = formData.get('imageId');
    
    if (window.confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteTinyHouseImageById(imageId);
        alert('Fotoğraf başarıyla silindi!');
        setAction(null);
      } catch (error) {
        alert('Fotoğraf silinemedi.');
      }
    }
  };

  // URL validasyonu
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Gelişmiş fotoğraf ekle formu
  const handleAdvancedImageSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageUrl = formData.get('imageUrl');

    // URL validasyonu
    if (!isValidUrl(imageUrl)) {
      alert('Lütfen geçerli bir URL girin.');
      return;
    }

    const imageData = {
      imageUrl: imageUrl,
    };

    try {
      await addTinyHouseImageByTinyHouseId(selectedTinyHouseId, imageData);
      alert('Fotoğraf başarıyla eklendi!');
      setAction(null);
      setSelectedTinyHouseId('');
      // Formu temizle
      e.target.reset();
    } catch (error) {
      alert('Fotoğraf eklenemedi. Lütfen URL\'nin doğru olduğundan emin olun.');
    }
  };

  // Ana menü
  if (!action) {
    return (
      <div className="container">
        <h1>🖼️ Medya Yönetimi</h1>
        <div className="action-grid">
          <button onClick={() => setAction('add')}>
            Fotoğraf Ekle
          </button>
          <button onClick={() => setAction('delete')}>
            Fotoğraf Sil
          </button>
        </div>
        <button type="button" onClick={onBack} className="back-button">
          Ana Menüye Dön
        </button>
      </div>
    );
  }

  // Fotoğraf ekle
  if (action === 'add') {
    return (
      <div className="container">
        <h1>Fotoğraf Ekle</h1>
        {tinyHouses.length === 0 ? (
          <div>
            <p>Fotoğraf eklemeden önce en az bir Tiny House eklemelisiniz.</p>
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
              <form onSubmit={handleAdvancedImageSubmit}>
                <div>
                  <label>Fotoğraf URL:</label>
                  <input 
                    type="url" 
                    name="imageUrl" 
                    placeholder="https://example.com/image.jpg"
                    required 
                  />
                  <small style={{ display: 'block', color: '#666', marginTop: '5px' }}>
                    JPG, PNG, WebP formatlarında fotoğraf URL'si girin
                  </small>
                </div>
                
                <div style={{ marginTop: '20px' }}>
                  <h3>Seçilen Tiny House:</h3>
                  <div className="selected-house-info">
                    <strong>{tinyHouses.find(th => th.id == selectedTinyHouseId)?.name}</strong>
                  </div>
                </div>
                
                <button type="submit">Fotoğraf Ekle</button>
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

  // Fotoğraf sil
  if (action === 'delete') {
    return (
      <div className="container">
        <h1>Fotoğraf Sil</h1>
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '5px' }}>
          <strong>⚠️ Dikkat:</strong> Fotoğraf ID'sini doğru girdiğinizden emin olun. Bu işlem geri alınamaz.
        </div>
        
        <form onSubmit={handleImageDelete}>
          <div>
            <label>Fotoğraf ID:</label>
            <input 
              type="number" 
              name="imageId" 
              min="1"
              placeholder="Silinecek fotoğrafın ID numarası"
              required 
            />
            <small style={{ display: 'block', color: '#666', marginTop: '5px' }}>
              Fotoğraf ID'sini veritabanından veya geliştiriciden öğrenebilirsiniz
            </small>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <button type="submit" className="delete-button">
              Fotoğrafı Sil
            </button>
            <button type="button" onClick={() => setAction(null)}>
              İptal
            </button>
          </div>
        </form>
        
        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#d1ecf1', border: '1px solid #bee5eb', borderRadius: '5px' }}>
          <h4>💡 İpucu:</h4>
          <p>Fotoğraf ID'sini bulmak için:</p>
          <ul>
            <li>Veritabanı yönetim panelini kontrol edin</li>
            <li>Geliştirici araçlarını kullanın</li>
            <li>Sistem yöneticisinden yardım isteyin</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
}