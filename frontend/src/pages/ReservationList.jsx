import "../styles/ReservationList.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getReservationsByTinyHouseId } from "../services/availabilityService";
import { getUserById } from "../services/UserService";
import { updateReservationStatus } from "../services/reservationService";

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const routingFrom = location.state?.from;
  const { tinyHouseId } = useParams();

  // 1. Rezervasyonları getir
  const fetchReservations = async (tinyHouseId) => {
    try {
      const data = await getReservationsByTinyHouseId(tinyHouseId);

      const reservationsWithNames = await Promise.all(
        data.map(async (reservation) => {
          const user = await getUserById(reservation.userId);
          return {
            ...reservation,
            customerName: user?.fullName || "Bilinmiyor",
          };
        })
      );

      setReservations(reservationsWithNames);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  // 2. Durum güncelle
  const ReservationStatusHandler = async (reservationId, newStatus) => {
    try {
      if (newStatus === "confirmed" || newStatus === "cancelled") {
        await updateReservationStatus(reservationId, newStatus);
        fetchReservations(tinyHouseId);
      }
    } catch (error) {
      console.error("Error updating reservation status:", error);
    }
  };

  // 3. Seçenek butonları
  const showChoices = (reservationId, status) => {
    if (status === "pending") {
      return (
        <div className="choice-buttons">
          <input
            type="button"
            value="✓"
            className="accept-button"
            onClick={() => ReservationStatusHandler(reservationId, "confirmed")}
          />
          <input
            type="button"
            value="✘"
            className="reject-button"
            onClick={() => ReservationStatusHandler(reservationId, "cancelled")}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  // 4. Component yüklendiğinde veriyi getir
  useEffect(() => {
    if (tinyHouseId) {
      fetchReservations(tinyHouseId);
    } else {
      navigate("/profile");
    }
  }, [tinyHouseId, navigate]);

  // 5. Ekrana yazdır
  if (routingFrom === "PropertyOwnerPanel") {
    return (
      <div>
        <h2 className="reservation-list-title">Rezervasyon Listesi</h2>
        <div className="reservation-list-container">
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <div
                key={reservation.id || reservation.checkOut}
                className={`reservation-card status-${reservation.status.toLowerCase()}`}
              >
                <p>
                  <strong>Toplam ücret:</strong> {reservation.totalPrice} TL
                </p>
                <p>
                  <strong>Rezervasyon Tarihi:</strong>{" "}
                  {new Date(reservation.checkIn).toLocaleDateString()} -{" "}
                  {new Date(reservation.checkOut).toLocaleDateString()}
                </p>
                <p>
                  <strong>Rezervasyon Durumu:</strong> {reservation.status}
                </p>
                <p>
                  <strong>Müşteri Adı:</strong> {reservation.customerName}
                </p>
                {showChoices(reservation.id, reservation.status)}
              </div>
            ))
          ) : (
            <p>Henüz rezervasyon bulunmamaktadır.</p>
          )}
        </div>
      </div>
    );
  } else {
    navigate("/profile");
    return null;
  }
}
