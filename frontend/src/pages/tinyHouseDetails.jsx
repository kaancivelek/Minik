import React, { useEffect, useState } from "react";
import { addStars } from "../utils/countingStars";
import { getTinyHouseById } from "../services/tinyHouseService";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardSubtitle,
} from "reactstrap";
import MakeReservation from "../components/MakeReservation";
import TinyHouseEditing from "../components/TinyHouseEditing";
import Comment from "../components/Comment";
import { getTinyHouseImagesByTinyHouseId } from "../services/houseImages";
import { useLocation, useParams } from "react-router-dom";
import "../styles/TinyHouseDetails.css";
import ReservationDetails from "../components/ReservationDetails";
function TinyHouseDetails({ user }) {
  const [tinyHouse, setTinyHouse] = useState(null);
  const [houseImages, setHouseImages] = useState([]);
  const [houseLoading, setHouseLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const location = useLocation();
  const routingFrom = location.state?.from;
  const reservationInfo = location.state?.reservationInfo || [];
  const { tinyHouseId } = useParams();

const showComments = (routingFrom) => {
  if(routingFrom !=="CustomerPanel"){
    return tinyHouse && <Comment tinyHouseId={tinyHouse.id}></Comment>
}}

  const showTinyHouseEditing = (routingFrom) => {
    if (routingFrom === "PropertyOwnerPanel") {
      return tinyHouse && <TinyHouseEditing tinyHouse={tinyHouse} />;
    }
    return null;
  };

  function showMakeReservationPanel(user, routingFrom) {
    if (
      (user.roleId === 1 || user.roleId === 3) &&
      routingFrom !== "CustomerPanel"
    ) {
      return tinyHouse && <MakeReservation tinyHouse={tinyHouse} />;
    } else {
      return null;
    }
  }

  const fetchTinyHouseDetails = async () => {
    setHouseLoading(true);
    try {
      const data = await getTinyHouseById(tinyHouseId);
      setTinyHouse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setHouseLoading(false);
    }
  };

  const fetchTinyHouseImages = async () => {
    setImagesLoading(true);
    try {
      const data = await getTinyHouseImagesByTinyHouseId(tinyHouseId);
      setHouseImages(data);
      setActiveImageIdx(0);
    } catch (err) {
      console.error("Error loading images:", err);
      // Continue even if images fail to load
    } finally {
      setImagesLoading(false);
    }
  };

  useEffect(() => {
    fetchTinyHouseDetails();
    fetchTinyHouseImages();
  }, []);

  if (houseLoading) return <p>Konut bilgileri yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;
  if (!tinyHouse) return <p>Veri bulunamadı.</p>;

  // Helper function to generate optimized image URL
  const getOptimizedImageUrl = (url) => {
    if (!url) return null;
    // If already has query params, append ours
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}w=600&h=400&fit=crop&auto=format`;
  };

  // Carousel ileri/geri fonksiyonları
  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIdx((prev) =>
      prev === 0 ? houseImages.length - 1 : prev - 1
    );
  };
  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIdx((prev) =>
      prev === houseImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs="12" md="8">
          <div className="tinyhouse-details-flow">
            {/* 1. Ev Detayları - Üstte büyük şekilde */}
            <Card className="tinyhouse-card">
              {imagesLoading ? (
                <div className="tinyhouse-img-loading">
                  <p>Resimler yükleniyor...</p>
                </div>
              ) : houseImages.length > 0 ? (
                <div className="tinyhouse-img-carousel">
                  <button
                    className="carousel-btn carousel-btn-left"
                    onClick={handlePrevImage}
                    aria-label="Önceki fotoğraf"
                  ></button>
                  <img
                    alt={tinyHouse.name}
                    src={getOptimizedImageUrl(houseImages[activeImageIdx].imageUrl)}
                    className="tinyhouse-img"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/600x400?text=Resim+Yüklenemedi";
                      e.target.onerror = null;
                    }}
                  />
                  <button
                    className="carousel-btn carousel-btn-right"
                    onClick={handleNextImage}
                    aria-label="Sonraki fotoğraf"
                  ></button>
                  <div className="carousel-indicator">
                    {houseImages.map((img, idx) => (
                      <span
                        key={idx}
                        className={idx === activeImageIdx ? "active" : ""}
                        onClick={() => setActiveImageIdx(idx)}
                        aria-label={`Fotoğraf ${idx + 1}`}
                      >
                        ●
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="tinyhouse-img-notfound">
                  <p>Resim bulunamadı</p>
                </div>
              )}

              <CardBody>
                <CardTitle tag="h1" className="mb-3">
                  {tinyHouse.name} <br></br>
                  {addStars(tinyHouse.rating)}
                </CardTitle>
                <CardSubtitle
                  className="mb-2 text-muted"
                  style={{ textTransform: "capitalize" }}
                >
                  {tinyHouse.amenities}
                </CardSubtitle>
                <CardText className="mb-2">{tinyHouse.description}</CardText>
                <CardText>
                  {tinyHouse.city}, {tinyHouse.country}
                </CardText>
                <CardText>
                  <strong>Fiyat:</strong> {tinyHouse.pricePerNight} ₺ / gece
                </CardText>
                <CardText>
                  <strong>Maksimum Misafir:</strong> {tinyHouse.maxGuests} kişi
                </CardText>
              </CardBody>
            </Card>
            {/* 2. Rezervasyon/Düzenleme ve Yorumlar yan yana */}
            <div className="tinyhouse-details-sections">
              <div className="tinyhouse-section-card">
                {user && (
                  <>
                    {showTinyHouseEditing(routingFrom)}
                    {showMakeReservationPanel(user, routingFrom)}
                    <ReservationDetails reservationInfo={reservationInfo} />
                  </>
                )}
              </div>
              <div className="tinyhouse-section-card">
                
                {showComments(routingFrom)}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default TinyHouseDetails;
