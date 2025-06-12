import React from "react";
import { Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";

export default function Logon() {
  const navigate = useNavigate();



  return (
    <div>
      <Container style={{ display: "flex", alignItems:"center"}}>
        <Col style={{ justifyContent: "left", alignItems: "center" }}>
          <Row>
            <button
              style={{
                width: `20ch`,
                color :"#333",
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "16px",
                height: "40px", // tutarlı yükseklik
                cursor: "pointer",
              }}
              onClick={ ()=>navigate("/Login")}
            >
              GİRİŞ YAP
            </button>
          </Row>
          <Row>
            <button
              style={{
                width: `20ch`,
                border: "none",
                 color :"#333",
                background: "transparent",
                outline: "none",
                fontSize: "16px",
                height: "40px", // tutarlı yükseklik
                cursor: "pointer",
              }}
              onClick={ ()=>navigate("/Register")}
            >
              KAYIT OL
            </button>
          </Row>
        </Col>
        <Col style={{ justifyContent: "right", alignItems: "center" }}>
          <img
            src="../devs.jpg"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          ></img>
        </Col>
      </Container>
    </div>
  );
}
