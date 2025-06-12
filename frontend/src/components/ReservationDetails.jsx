import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Badge
} from 'reactstrap';
import '../styles/ReservationDetails.css';

export default function ReservationDetails({ reservationInfo }) {
  if (!reservationInfo || reservationInfo.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'Onaylandı';
      case 'pending':
        return 'Beklemede';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  return (
    <div className="reservation-details-container">
      <CardTitle tag="h4" className="reservation-title">
        Rezervasyon Bilgileri
      </CardTitle>
      <div className="reservation-cards">
        {reservationInfo.map((reservation, index) => (
          <Card key={index} className="reservation-card">
            <CardBody>
              <ListGroup flush>
                <ListGroupItem className="d-flex justify-content-between align-items-center flex-wrap">
                  <span className="text-muted">Giriş:</span>
                  <span className="fw-bold">{formatDate(reservation.checkIn)}</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center flex-wrap">
                  <span className="text-muted">Çıkış:</span>
                  <span className="fw-bold">{formatDate(reservation.checkOut)}</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center flex-wrap">
                  <span className="text-muted">Toplam Tutar:</span>
                  <span className="fw-bold">{reservation.totalPrice} ₺</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center flex-wrap">
                  <span className="text-muted">Durum:</span>
                  <Badge color={getStatusColor(reservation.status)} pill style={{whiteSpace:'nowrap', maxWidth:'100%', overflow:'hidden', textOverflow:'ellipsis'}}>
                    {getStatusText(reservation.status)}
                  </Badge>
                </ListGroupItem>
              </ListGroup>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}


