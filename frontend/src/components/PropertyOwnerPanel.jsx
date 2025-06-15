import React, { useEffect, useState } from "react";
import { getTinyHouseByPropertyOwnerId } from "../services/tinyHouseService";
import {
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  Button,
  Col,
  Row,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../styles/PropertyOwnerPanel.css"; // Assuming you have a CSS file for styles
import noListing from "../utils/noListing";
export default function PropertyOwnerPanel({ user }) {
  const [tinyHousesOfPropertyOwner, setTinyHouseOfUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const addStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const fetchTinyHousesOfPropertyOwner = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTinyHouseByPropertyOwnerId(user.id);
      setTinyHouseOfUser(response.data || response);
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.id !== null) {
      fetchTinyHousesOfPropertyOwner();
    } else {
      console.log("Kullanıcı bilgisi yok. Giriş yapılmamış olabilir.");
    }
  }, [user]);

 const goTinyHouseDetails = (tinyHouseId) => {
    navigate(`/TinyHouseDetails/${tinyHouseId}`, {
      state: { from: "PropertyOwnerPanel" },
    })};

  const goReservationList = (tinyHouseId) => {
    navigate(`/ReservationList/${tinyHouseId}`, {
      state: { from: "PropertyOwnerPanel" },
    });
  };
  const goInsertTinyHouse = () => {
    navigate("/insertTinyHouse");
  };

  return (
    <div className="listing-page" style={{ padding: "1rem" }}>
      {loading && <div>Yükleniyor...</div>}

      <h2>Ev Sahibi Paneli</h2>

      <Row>
        <input
          type="button"
          onClick={goInsertTinyHouse}
          value="İlan Bilgisi Ekle"
          style={{ background: "transparent", justifyContent: "center" }}
        ></input>
        {error ? noListing() : <></>}
        {tinyHousesOfPropertyOwner.map((item) => (
          <Col
            key={item.id}
            xs="12"
            sm="12"
            md="8"
            lg="6"
            className="mb-4 mx-auto d-flex"
            style={{ flexDirection: "column" }}
          >
            <Card className="flex-fill" style={{ width: "100%" }}>
              <CardBody
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2rem",
                }}
              >
                {/* 1. Ev Detayları */}
                <div>
                  <h5 style={{ marginBottom: 4 }}>{item.name}</h5>
                  <div style={{ color: "#666", fontSize: "1.05em" }}>
                    {item.city}, {item.country}
                  </div>
                  <CardSubtitle className="mb-2 text-muted" tag="h6">
                    {addStars(item.rating)}
                  </CardSubtitle>
                  <CardText>
                    <strong>Fiyat:</strong> {item.pricePerNight} ₺ / gece
                  </CardText>
                </div>
                {/* 2. Rezervasyon / Düzenleme */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button
                    color="success"
                    size="sm"
                    onClick={() => goReservationList(item.id)}
                  >
                    Rezervasyonlar
                  </Button>
                    <Button
                    color="success"
                    size="sm"
                    onClick={() => goTinyHouseDetails(item.id)} 
                  >
                    Düzenle
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
