import React, { useState, useEffect } from 'react';
import { getMaintenanceByTinyHouseId, deleteMaintenanceById, postMaintenance } from '../services/maintanenceService';

export default function MaintenanceManager({ tinyHouses, userId, onBack }) {
  const [action, setAction] = useState(null);
  const [selectedTinyHouseId, setSelectedTinyHouseId] = useState('');
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [editingMaintenance, setEditingMaintenance] = useState(null);

  // Seçilen tiny house için bakım kayıtlarını getir
  useEffect(() => {
    if (selectedTinyHouseId) {
      getMaintenanceByTinyHouseId(selectedTinyHouseId)
        .then(data => {
          // Status'u undefined olan kayıtları filtrele
          const filteredData = data.filter(maintenance => 
            maintenance.maintenanceType !== 'undefined' && 
            maintenance.status !== null
          );
          setMaintenanceRecords(filteredData);
        })
        .catch(() => setMaintenanceRecords([]));
    }
  }, [selectedTinyHouseId, action]);

  // Durum string'ini enum değerine çevir
  const getStatusEnum = (statusString) => {
    const statusMap = {
      'planned': 0,
      'pending': 1,
      'completed': 2,
      'cancelled': 3
    };
    return statusMap[statusString] || 0;
  };

  // Yeni bakım kaydı ekleme
  const handleMaintenanceSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // API'nin beklediği formata uygun veri hazırla
    const maintenanceData = {
      id: 0, // Yeni kayıt için 0
      tinyHouseId: parseInt(selectedTinyHouseId),
      maintenanceType: formData.get('maintenanceType'),
      maintenanceDate: formData.get('scheduledDate') + 'T00:00:00.000Z', // ISO string format
      status: getStatusEnum(formData.get('status'))
    };

    try {
      await postMaintenance(maintenanceData);
      alert('Bakım kaydı başarıyla eklendi!');
      setAction(null);
    } catch (error) {
      console.error('Bakım kaydı eklenirken hata:', error);
      alert('Bakım kaydı eklenemedi.');
    }
  };

  // Bakım kaydı silme
  const handleMaintenanceDelete = async (maintenanceId) => {
    if (window.confirm('Bu bakım kaydını silmek istediğinizden emin misiniz?')) {
      try {
        await deleteMaintenanceById(maintenanceId);
        alert('Bakım kaydı başarıyla silindi!');
        setAction('view-maintenance'); // Listeyi yenile
      } catch {
        alert('Bakım kaydı silinemedi.');
      }
    }
  };

  // Durum enum'unu string'e çevir (görüntüleme için)
  const getStatusText = (statusEnum) => {
    const statusMap = {
      0: 'Planlandı',
      1: 'Devam Ediyor',
      2: 'Tamamlandı',
      3: 'İptal Edildi'
    };
    return statusMap[statusEnum] || 'Bilinmiyor';
  };

  // Status'u geçerli olan kayıtları filtrele (render sırasında da kontrol)
  const validMaintenanceRecords = maintenanceRecords.filter(maintenance => 
    maintenance.status !== undefined && 
    maintenance.status !== null
  );

  return (
    <div>
      {/* Ana Bakım Menu */}
      {!action && (
        <div className="container">
          <h2>🔧 Bakım Yönetimi</h2>
          <div className="action-grid">
            <button onClick={() => setAction('add-maintenance')}>
              Yeni Bakım Kaydı Ekle
            </button>
            <button onClick={() => setAction('view-maintenance')}>
              Bakım Kayıtlarını Görüntüle
            </button>
            <button onClick={() => setAction('delete-maintenance')}>
              Bakım Kaydı Sil
            </button>
          </div>
          <button type="button" onClick={onBack} className="cancel-button">
            Ana Menüye Dön
          </button>
        </div>
      )}

      {/* Yeni Bakım Kaydı Ekle */}
      {action === 'add-maintenance' && (
        <div className="container">
          <h1>Yeni Bakım Kaydı Ekle</h1>
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
            <form onSubmit={handleMaintenanceSubmit}>
              <div>
                <label>Bakım Türü:</label>
                <input 
                  type="text" 
                  name="maintenanceType" 
                  required 
                  placeholder="Örn: Temizlik, Onarım, İnceleme"
                />
              </div>
              
              <div>
                <label>Bakım Tarihi:</label>
                <input type="date" name="scheduledDate" required />
              </div>
              
              <div>
                <label>Durum:</label>
                <select name="status" required>
                  <option value="planned">Planlandı</option>
                  <option value="in_progress">Devam Ediyor</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="cancelled">İptal Edildi</option>
                </select>
              </div>
              
              <button type="submit" className="submit-button">Kaydet</button>
              <button type="button" onClick={() => setAction(null)} className="cancel-button">İptal</button>
            </form>
          )}
        </div>
      )}

      {/* Bakım Kayıtlarını Görüntüle */}
      {action === 'view-maintenance' && (
        <div className="container">
          <h1>Bakım Kayıtları</h1>
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
            <div style={{ marginTop: '20px' }}>
              {validMaintenanceRecords.length === 0 ? (
                <p>Bu Tiny House için geçerli bakım kaydı bulunamadı.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {validMaintenanceRecords.map((maintenance) => (
                    <div key={maintenance.id} className="item-card">
                      <h3>{maintenance.maintenanceType}</h3>
                      <p><strong>Tarih:</strong> {new Date(maintenance.maintenanceDate).toLocaleDateString('tr-TR')}</p>
                      <p><strong>Durum:</strong> {getStatusText(maintenance.status)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <button type="button" onClick={() => setAction(null)} className="cancel-button">
            Geri
          </button>
        </div>
      )}

      {/* Bakım Kaydı Sil */}
      {action === 'delete-maintenance' && (
        <div className="container">
          <h1>Bakım Kaydı Sil</h1>
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
            <div style={{ marginTop: '20px' }}>
              {validMaintenanceRecords.length === 0 ? (
                <p>Bu Tiny House için silinebilir bakım kaydı bulunamadı.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {validMaintenanceRecords.map((maintenance) => (
                    <div key={maintenance.id} className="item-card">
                      <h3>{maintenance.maintenanceType}</h3>
                      <p><strong>Tarih:</strong> {new Date(maintenance.maintenanceDate).toLocaleDateString('tr-TR')}</p>
                      <p><strong>Durum:</strong> {getStatusText(maintenance.status)}</p>
                      <div className="card-actions">
                        <button 
                          onClick={() => handleMaintenanceDelete(maintenance.id)} 
                          className="delete-button"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <button type="button" onClick={() => setAction(null)} className="cancel-button">
            Geri
          </button>
        </div>
      )}
    </div>
  );
}