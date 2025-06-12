import { Card, CardBody, CardText, CardTitle, Button } from "reactstrap";
import "../styles/MakeReservation.css";
import { useEffect, useState } from "react";
import { checkDateRangeAvailability } from "../utils/availabilityUtils";
import ReservationCalendar from "./ReservationCalendar";

function ReservationForm({ reservationInfo, setReservationInfo, nightCount, totalPrice, tinyHouse, setStep }) {
  const { startDate, endDate, guestCount } = reservationInfo;
  const [isDateRangeValid, setIsDateRangeValid] = useState(true);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Check availability when dates change
  useEffect(() => {
    const checkAvailability = async () => {
      if (startDate && endDate) {
        setIsCheckingAvailability(true);
        try {
          const isAvailable = await checkDateRangeAvailability(startDate, endDate, tinyHouse.id);
          setIsDateRangeValid(isAvailable === 1);
        } catch (error) {
          console.error("Error checking availability:", error);
          setIsDateRangeValid(false);
        } finally {
          setIsCheckingAvailability(false);
        }
      }
    };

    checkAvailability();
  }, [startDate, endDate, tinyHouse.id]);

  const updateField = (field, value) => {
    setReservationInfo((prev) => ({ ...prev, [field]: value }));
  };

  const increaseGuests = () => {
    if (guestCount < tinyHouse.maxGuests) {
      updateField("guestCount", guestCount + 1);
    }
  };

  const decreaseGuests = () => {
    if (guestCount > 1) {
      updateField("guestCount", guestCount - 1);
    }
  };

  return (
    <Card body>
      <CardBody>
        <CardTitle style={{textAlign:"center"}} tag="h5">Rezervasyon Yap</CardTitle>

        {/* Calendar Component */}
        <ReservationCalendar 
          tinyHouse={tinyHouse}
          startDate={startDate}
          endDate={endDate}
          onDateChange={updateField}
        />

        <div className="mb-3 mt-3">
          <label>Kişi Sayısı: </label>
          <div className="guest-counter">
            <Button size="sm" onClick={decreaseGuests}>-</Button>
            <span>{guestCount}</span>
            <Button size="sm" onClick={increaseGuests}>+</Button>
          </div>
          <small className="text-muted"><br></br>Maksimum  {tinyHouse.maxGuests} kişi</small>
        </div>

        {nightCount > 0 && (
          <CardText className="price-summary">
            {nightCount} gece × {tinyHouse.pricePerNight} ₺ = <strong>{totalPrice} ₺</strong>
          </CardText>
        )}

        {isCheckingAvailability && (
          <div className="mb-3 text-info">
            Müsaitlik kontrol ediliyor...
          </div>
        )}

        <Button 
          disabled={nightCount === 0 || !isDateRangeValid || isCheckingAvailability} 
          onClick={() => setStep(1)}
          className="reservation-confirm-btn"
        >
          Rezervasyonu Onayla
        </Button>
      </CardBody>
    </Card>
  );
}

export default ReservationForm;
