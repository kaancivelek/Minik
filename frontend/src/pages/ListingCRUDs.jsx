import React, { useState, useEffect } from 'react';
import { getLocationByUserId } from '../services/locationService';
import { getTinyHouseByPropertyOwnerId } from '../services/tinyHouseService';

// Component imports - Bu componentleri ayrı dosyalarda oluşturmanız gerekecek
import TinyHouseManager from '../components/TinyHouseManager';
import LocationManager from '../components/LocationManager';
import MediaManager from '../components/MediaManager';
import AvailabilityManager from '../components/AvailabilityManager';
import MaintenanceManager from '../components/MaintenanceManager';

import '../styles/ListingCRUDs.css';

export default function TinyHouseAdding({ user }) {
  const [currentManager, setCurrentManager] = useState(null);
  const [locations, setLocations] = useState([]);
  const [tinyHouses, setTinyHouses] = useState([]);
  const userId = user?.id || null;

  // Lokasyonları ve Tiny House'ları yükle
  useEffect(() => {
    if (userId) {
      getLocationByUserId(userId)
        .then(setLocations)
        .catch(() => setLocations([]));
      
      getTinyHouseByPropertyOwnerId(userId)
        .then(setTinyHouses)
        .catch(() => setTinyHouses([]));
    }
  }, [userId, currentManager]);

  // Ana menüye dönüş fonksiyonu
  const handleBackToMain = () => {
    setCurrentManager(null);
  };

  // Belirli manager'ları render et
  const renderCurrentManager = () => {
    const commonProps = {
      user,
      tinyHouses,
      locations,
      userId,
      onBack: handleBackToMain,
    };

    switch (currentManager) {
      case 'tinyhouse':
        return <TinyHouseManager {...commonProps} />;
      case 'location':
        return <LocationManager {...commonProps} />;
      case 'media':
        return <MediaManager {...commonProps} />;
      case 'availability':
        return <AvailabilityManager {...commonProps} />;
      case 'maintenance':
        return <MaintenanceManager {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Ana Menü */}
      {!currentManager && (
        <div className="action-menu">
          <h2>Tiny House Yönetim Paneli</h2>
          <div className="action-grid">
            
            {/* Tiny House İşlemleri */}
            <div className="action-section tiny-house-section">
       
              <div className="section-buttons">
                <button onClick={() => setCurrentManager('tinyhouse')}>
                  Tiny House Yönetimi
                </button>
              </div>
              
            </div>

            {/* Lokasyon İşlemleri */}
            <div className="action-section location-section">
      
              <div className="section-buttons">
                <button onClick={() => setCurrentManager('location')}>
                  Lokasyon Yönetimi
                </button>
              </div>
            
            </div>

            {/* Medya İşlemleri */}
            <div className="action-section media-section">
         
              <div className="section-buttons">
                <button onClick={() => setCurrentManager('media')}>
                  Medya Yönetimi
                </button>
              </div>
           
            </div>

            {/* Müsaitlik İşlemleri */}
            <div className="action-section availability-section">
            
              <div className="section-buttons">
                <button onClick={() => setCurrentManager('availability')}>
                  Müsaitlik Yönetimi
                </button>
              </div>
          
            </div>

            {/* Bakım İşlemleri */}
            <div className="action-section maintenance-section">
          
              <div className="section-buttons">
                <button onClick={() => setCurrentManager('maintenance')}>
                  Bakım Yönetimi
                </button>
              </div>
             
            </div>

          </div>

          {/* İstatistikler */}
          <div className="stats-section">
            <h3>📊 Özet Bilgiler</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{locations.length}</span>
                <span className="stat-label">Lokasyon</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{tinyHouses.length}</span>
                <span className="stat-label">Tiny House</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seçili Manager'ı Render Et */}
      {currentManager && renderCurrentManager()}
    </div>
  );
}