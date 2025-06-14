import React, { useState, useEffect } from 'react';
import { getSelectableDateRanges } from '../utils/availabilityUtils';
import '../styles/ReservationCalendar.css';

const ReservationCalendar = ({ tinyHouse, startDate, endDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [unavailableDays, setUnavailableDays] = useState({});
  const [availableRanges, setAvailableRanges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const daysOfWeek = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  useEffect(() => {
    const fetchCalendarData = async () => {
      if (tinyHouse?.id) {
        setIsLoading(true);

        try {
          const { selectableRanges, unavailableDays: unavailable } = await getSelectableDateRanges(tinyHouse.id);
     
          setAvailableRanges(selectableRanges);
          setUnavailableDays(unavailable);
        } catch (error) {
          console.error('Calendar data fetch error:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCalendarData();
  }, [tinyHouse?.id]);

  const formatDateKey = (date) => {
    // Saat dilimi problemini çözmek için local tarih kullan
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formatted = `${year}-${month}-${day}`;
    return formatted;
  };

  const getDayStatus = (date) => {
    const dateKey = formatDateKey(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    if (date < today) {
      return 'past';
    }
    if (date > oneYearLater) {
      return 'future';
    }

    // Bakım günlerini kontrol et
    if (unavailableDays[dateKey] === 'maintenance') {
      return 'maintenance';
    }

    // Rezervasyon günlerini kontrol et
    // ÖNEMLİ: Check-out günü dahil değil, sadece check-in günü dahil
    if (unavailableDays[dateKey] === 'reservation') {
      return 'reservation';
    }

    // Müsait aralıklarda mı kontrol et
    const isAvailable = availableRanges.some(range => {
      const rangeStart = new Date(range.start);
      const rangeEnd = new Date(range.end);
      rangeStart.setHours(0, 0, 0, 0);
      rangeEnd.setHours(0, 0, 0, 0);
      
      // Check-in dahil, check-out dahil değil mantığı
      // Yani 14-15 rezervasyonunda 14 dahil, 15 dahil değil
      return date >= rangeStart && date < rangeEnd;
    });

    return isAvailable ? 'available' : 'unavailable';
  };

  const getDayClass = (date, status) => {
    let baseClass = 'calendar-day';

    const isStartDate = startDate && formatDateKey(date) === startDate;
    const isEndDate = endDate && formatDateKey(date) === endDate;
    const isInRange = startDate && endDate &&
      date > new Date(startDate) && date < new Date(endDate);

    if (isStartDate || isEndDate) {
      baseClass += ' selected-date';
    } else if (isInRange) {
      baseClass += ' in-range';
    }

    switch (status) {
      case 'maintenance':
        baseClass += ' maintenance-day'; // mavi
        break;
      case 'reservation':
        baseClass += ' reservation-day'; // mor
        break;
      case 'available':
        baseClass += ' available-day'; // yeşil
        break;
      default:
        baseClass += ' unavailable-day'; // kırmızı
    }

    return baseClass;
  };

  const handleDateClick = (date) => {
    const status = getDayStatus(date);
    
    if (status !== 'available') {
      console.log('Clicked unavailable date:', formatDateKey(date), 'Status:', status);
      return;
    }

    const clickedDateStr = formatDateKey(date);

    if (!startDate || (startDate && endDate)) {
      console.log('🎯 Setting start date:', clickedDateStr);
      onDateChange('startDate', clickedDateStr);
      onDateChange('endDate', '');
    } else if (startDate && !endDate) {
      const startDateObj = new Date(startDate);
      if (date < startDateObj) {
        // Daha erken bir tarih seçildi, start date'i güncelle
        onDateChange('startDate', clickedDateStr);
      } else {
        // End date seçildi
        onDateChange('endDate', clickedDateStr);
      }
    }
  };

  const navigateMonth = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const renderCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    const days = [];

    // Önceki ayın günleri
    for (let i = 0; i < firstDayWeekday; i++) {
      const prevDate = new Date(currentYear, currentMonth, -firstDayWeekday + i + 1);
      const status = getDayStatus(prevDate);

      days.push(
        <div
          key={`prev-${i}`}
          className={`${getDayClass(prevDate, status)} other-month`}
          onClick={() => handleDateClick(prevDate)}
          title="Geçmiş ay"
        >
          {prevDate.getDate()}
        </div>
      );
    }

    // Mevcut ayın günleri
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const status = getDayStatus(currentDate);

      days.push(
        <div
          key={day}
          className={getDayClass(currentDate, status)}
          onClick={() => handleDateClick(currentDate)}
          title={
            status === 'maintenance' ? 'Bakım günü' :
            status === 'reservation' ? 'Rezerve edilmiş' :
            status === 'available' ? 'Müsait' :
            status === 'past' ? 'Geçmiş tarih' :
            'Müsait değil'
          }
        >
          {day}
        </div>
      );
    }

    return days;
  };

  if (isLoading) {
    return <div className="calendar-loading">Takvim yükleniyor...</div>;
  }

  return (
    <div className="reservation-calendar">
      <div className="calendar-header">
        <button className="nav-button" onClick={() => navigateMonth(-1)} type="button">‹</button>
        <h3 className="month-year">{months[currentMonth]} {currentYear}</h3>
        <button className="nav-button" onClick={() => navigateMonth(1)} type="button">›</button>
      </div>

      <div className="calendar-weekdays">
        {daysOfWeek.map((day, index) => (
          <div key={day || index} className="weekday">
            {day || 'N/A'}
          </div>
        ))}
      </div>

      <div className="calendar-grid">{renderCalendarDays()}</div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color available-day"></span>
          <span>Müsait</span>
        </div>
        <div className="legend-item">
          <span className="legend-color reservation-day"></span>
          <span>Rezerve</span>
        </div>
        <div className="legend-item">
          <span className="legend-color maintenance-day"></span>
          <span>Bakım</span>
        </div>
        <div className="legend-item">
          <span className="legend-color unavailable-day"></span>
          <span>Müsait Değil</span>
        </div>
      </div>
    </div>
  );
};

export default ReservationCalendar;