import React, { useEffect, useState } from "react";
import { getReservationByUserId } from "../services/reservationService";
import { postComment } from "../services/CommentService";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Col,
  Row,
} from "reactstrap";
import "../styles/CustomerPanel.css";
import { toast, Slide } from "react-toastify";
import noListing from "../utils/noListing";
export default function CustomerPanel({ user }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Form verilerini ayrı ayrı saklamak için
  const [formStates, setFormStates] = useState({});

  const handleRatingChange = (tinyHouseId, rating) => {
    setFormStates((prev) => ({
      ...prev,
      [tinyHouseId]: {
        ...(prev[tinyHouseId] || {}),
        rating,
      },
    }));
  };

  const handleCommentChange = (tinyHouseId, comment) => {
    setFormStates((prev) => ({
      ...prev,
      [tinyHouseId]: {
        ...(prev[tinyHouseId] || {}),
        comment,
      },
    }));
  };

  const ratingMeter = (tinyHouseId) => {
    const currentRating = formStates[tinyHouseId]?.rating || 0;
    return (
      <div className="rating">
        {[5, 4, 3, 2, 1].map((star) => (
          <React.Fragment key={star}>
            <input
              type="radio"
              id={`rating-${tinyHouseId}-${star}`}
              name={`rating-${tinyHouseId}`}
              value={star}
              checked={currentRating === star}
              onChange={() => handleRatingChange(tinyHouseId, star)}
            />
            <label className="star" htmlFor={`rating-${tinyHouseId}-${star}`}>
              
            </label>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const handleCommentSubmit = (tinyHouseId, e) => {
    e.preventDefault();
    const { rating = 0, comment = "" } = formStates[tinyHouseId] || {};

    if (!comment.trim()) {
      toast.error("Lütfen yorumunuzu girin.", {
        transition: Slide,
        autoClose: 3000,
      });
      return;
    }

    if (rating === 0) {
      toast.error("Lütfen bir puan seçin.", {
        transition: Slide,
        autoClose: 3000,
      });
      return;
    }

    const commentData = {
      id: 0,
      userId: user.id,
      tinyHouseId,
      rating,
      comment,
      reviewDate: new Date().toISOString(),
    };

    postComment(commentData)
      .then(() => {
        toast.success("Yorumunuz başarıyla eklendi.", {
          transition: Slide,
          autoClose: 3000,
        });
        setFormStates((prev) => ({
          ...prev,
          [tinyHouseId]: { rating: 0, comment: "" },
        }));
      })
      .catch((error) => {
        console.error("Yorum eklenirken hata oluştu:", error);
        toast.error("Yorum eklenirken bir hata oluştu.");
      });
  };

  const fetchReservationsByUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getReservationByUserId(user.id);
      setReservations(response.data || response);
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchReservationsByUser();
    } else {
      alert("Kullanıcı bilgisi yok.");
    }
  }, [user]);

  const getColorByResStatus = (status) => {
    switch (status) {
      case "confirmed":
        return "lightgreen";
      case "pending":
        return "orange";
      case "cancelled":
        return "red";
      default:
        return "#ccc";
    }
  };

const translateStatus = (status) => {
  switch (status) {
    case "confirmed":
      return "Onaylandı";
    case "pending":
      return "Beklemede";
    case "cancelled":
      return "İptal Edildi";
    case "completed":
      return "Tamamlandı";
    default:
      return status;
  }
}
  
  const showCommentForm = (reservation) => {
    const { status, tinyHouseId } = reservation;
    if (status === "completed") {
      return (
        <form onSubmit={(e) => handleCommentSubmit(tinyHouseId, e)}>
          <div className="form-group">
            {ratingMeter(tinyHouseId)}
            <textarea
              className="form-control mt-2"
              value={formStates[tinyHouseId]?.comment || ""}
              onChange={(e) => handleCommentChange(tinyHouseId, e.target.value)}
              rows="3"
              placeholder="Yorumunuzu buraya yazın..."
            />
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            Yorum Ekle
          </button>
        </form>
      );
    }
    return <p style={{fontSize:"12px"}}>Yorum eklemek için rezervasyonun tamamlanmasını bekleyin.</p>;
  };

  return (
    <div className="listing-page" style={{ padding: "1rem" }}>
      {loading && <div>Yükleniyor...</div>}

      <h2>Müşteri Paneli</h2>
      <Row>
         {error==="Bu kullanıcıya ait rezervasyon bulunamadı."?noListing():<></>}
        {reservations.map((item) => (
          <Col
            key={item.tinyHouseId}
            xs="12"
            sm="6"
            md="4"
            lg="3"
            className="mb-4 d-flex"
          >
            <Card
              className="flex-fill"
              style={{
                cursor: "pointer",
                borderColor: getColorByResStatus(item.status),
              }}
            >
              <CardBody>
                <h5>
                  {item.checkIn.split("T")[0]} <br />
                  {item.checkOut.split("T")[0]}
                </h5>
                <CardTitle tag="h5">
                  {translateStatus(item.status)}, {item.totalPrice} ₺
                </CardTitle>
                <CardSubtitle className="mb-2 text-muted" tag="h6">
                  {item.amenities}
                </CardSubtitle>
                <CardText></CardText>
                {showCommentForm(item)}
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
