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
        .then(setMaintenanceRecords)
        .catch(() => setMaintenanceRecords([]));
    }
  }, [selectedTinyHouseId, action]);

  // Yeni bakım kaydı ekleme
  const handleMaintenanceSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const maintenanceData = {
      tinyHouseId: parseInt(selectedTinyHouseId),
      maintenanceType: formData.get('maintenanceType'),
      description: formData.get('description'),
      scheduledDate: formData.get('scheduledDate'),
      completedDate: formData.get('completedDate') || null,
      cost: parseFloat(formData.get('cost')) || 0,
      status: formData.get('status'),
      notes: formData.get('notes') || '',
    };

    try {
      await postMaintenance(maintenanceData);
      alert('Bakım kaydı başarıyla eklendi!');
      setAction(null);
    } catch {
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
                <select name="maintenanceType" required>
                  <option value="">Bakım Türü Seçin</option>
                  <option value="cleaning">Temizlik</option>
                  <option value="repair">Onarım</option>
                  <option value="inspection">İnceleme</option>
                  <option value="preventive">Önleyici Bakım</option>
                  <option value="emergency">Acil Müdahale</option>
                  <option value="upgrade">Yükseltme</option>
                  <option value="other">Diğer</option>
                </select>
              </div>
              
              <div>
                <label>Açıklama:</label>
                <textarea name="description" required placeholder="Bakım detaylarını açıklayın..."></textarea>
              </div>
              
              <div>
                <label>Planlanan Tarih:</label>
                <input type="date" name="scheduledDate" required />
              </div>
              
              <div>
                <label>Tamamlanma Tarihi (İsteğe bağlı):</label>
                <input type="date" name="completedDate" />
              </div>
              
              <div>
                <label>Maliyet (TL):</label>
                <input type="number" name="cost" step="0.01" min="0" defaultValue="0" />
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
              
              <div>
                <label>Notlar (İsteğe bağlı):</label>
                <textarea name="notes" placeholder="Ek notlar..."></textarea>
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
              {maintenanceRecords.length === 0 ? (
                <p>Bu Tiny House için bakım kaydı bulunamadı.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {maintenanceRecords.map((maintenance) => (
                    <div key={maintenance.id} className="item-card">
                      <h3>{maintenance.maintenanceType}</h3>
                      <p><strong>Açıklama:</strong> {maintenance.description}</p>
                      <p><strong>Planlanan Tarih:</strong> {new Date(maintenance.scheduledDate).toLocaleDateString('tr-TR')}</p>
                      {maintenance.completedDate && (
                        <p><strong>Tamamlanma Tarihi:</strong> {new Date(maintenance.completedDate).toLocaleDateString('tr-TR')}</p>
                      )}
                      <p><strong>Durum:</strong> {maintenance.status}</p>
                      <p><strong>Maliyet:</strong> {maintenance.cost} TL</p>
                      {maintenance.notes && (
                        <p><strong>Notlar:</strong> {maintenance.notes}</p>
                      )}
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
              {maintenanceRecords.length === 0 ? (
                <p>Bu Tiny House için bakım kaydı bulunamadı.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {maintenanceRecords.map((maintenance) => (
                    <div key={maintenance.id} className="item-card">
                      <h3>{maintenance.maintenanceType}</h3>
                      <p><strong>Açıklama:</strong> {maintenance.description}</p>
                      <p><strong>Planlanan Tarih:</strong> {new Date(maintenance.scheduledDate).toLocaleDateString('tr-TR')}</p>
                      <p><strong>Durum:</strong> {maintenance.status}</p>
                      <p><strong>Maliyet:</strong> {maintenance.cost} TL</p>
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