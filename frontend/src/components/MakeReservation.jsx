import { postReservation } from "../services/reservationService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import CheckoutForm from "./CheckoutForm";
import "../styles/MakeReservation.css";
import { toast, Slide } from "react-toastify";
import { checkDateRangeAvailability } from "../utils/availabilityUtils";
import { postPayment } from "../services/paymentService";

function MakeReservation({ tinyHouse }) {
  const [reservationInfo, setReservationInfo] = useState({
    startDate: "",
    endDate: "",
    guestCount: 1,
    cardNumber: "",
    expiryDate: "",
    cardHolder: "",
  });

  const [step, setStep] = useState(0); // 0 = form, 1 = ödeme
  const navigate = useNavigate();

  const getNightCount = () => {
    const { startDate, endDate } = reservationInfo;
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

  const nightCount = getNightCount();
  const totalPrice = nightCount * tinyHouse.pricePerNight;

  const handlePayment = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const { startDate, endDate } = reservationInfo;

    // Check availability before creating reservation
    const isAvailable = await checkDateRangeAvailability(startDate, endDate, tinyHouse.id);
    
    if (!isAvailable) {
      toast.error("Seçilen tarihler müsait değil. Lütfen farklı tarihler seçin.", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });
      setStep(0); // Go back to date selection
      return;
    }

    const reservationData = {
      userId: storedUser.id,
      tinyHouseId: tinyHouse.id,
      checkIn: startDate,
      checkOut: endDate,
      totalPrice,
      status: "pending",
    };

    try {
      const response = await postReservation(reservationData);
      if (response) {
        toast.success("Rezervasyon isteği yollandı!", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
          transition: Slide,
        });
        setTimeout(() => navigate("/Profile"), 2500);
      }
    } catch (error) {
      console.error("Rezervasyon oluşturulurken hata:", error);
      toast.error("Rezervasyon oluşturulamadı. Lütfen tekrar deneyin.", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
        transition: Slide,
      });
    }
  };

  return (
    <div>
      {step === 0 ? (
        <ReservationForm
          reservationInfo={reservationInfo}
          setReservationInfo={setReservationInfo}
          nightCount={nightCount}
          totalPrice={totalPrice}
          tinyHouse={tinyHouse}
          setStep={setStep}
        />
      ) : (
        <CheckoutForm
          reservationInfo={reservationInfo}
          setReservationInfo={setReservationInfo}
          totalPrice={totalPrice}
          nightCount={nightCount}
          handlePayment={handlePayment}
          setStep={setStep}
        />
      )}

     
    </div>
  );
}

export default MakeReservation;
