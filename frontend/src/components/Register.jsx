import React, { useState } from "react";
import { Form, FormGroup, Input, Label, Button, Alert, FormText } from "reactstrap";
import { createNewUser } from "../services/LogonService";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    passwordHash: "",
    confirmPassword: "",
    roleId: 1,
    phoneNumber: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "roleId" ? parseInt(value) : value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.passwordHash || !formData.phoneNumber) {
      setError("Tüm alanları doldurunuz.");
      return false;
    }

    if (formData.passwordHash !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Geçerli bir e-posta adresi giriniz.");
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
    if (!passwordRegex.test(formData.passwordHash)) {
      setError("Şifre en az 8 karakter, bir büyük harf, bir rakam ve bir özel karakter içermelidir.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      // Create a new object without confirmPassword
      const { confirmPassword, ...userData } = formData;
      
      const response = await createNewUser(userData);
      
      if (response.message === "Kayıt başarılı.") {
        setSuccess("Kayıt başarılı! Giriş yapabilirsiniz.");
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          passwordHash: "",
          confirmPassword: "",
          roleId: 1,
          phoneNumber: ""
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
        // Navigate after success
        
      } else {
        setError(response?.message || "Kayıt sırasında bir hata oluştu.");
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      setError(error?.message || "Kayıt sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="register-container">
      <Form className="register-form" onSubmit={handleSubmit}>
        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}
        
        <FormGroup>
          <Label for="fullName">Ad Soyad</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Ad Soyad"
            type="text"
            className="animated-input"
          />
        </FormGroup>

        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@example.com"
            type="email"
            className="animated-input"
          />
        </FormGroup>

        <FormGroup>
          <Label for="phoneNumber">Telefon Numarası</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="05XX XXX XX XX"
            type="tel"
            className="animated-input"
          />
        </FormGroup>

        <FormGroup>
          <Label>Hesap Türü</Label>
          <div className="role-selection">
            <div className="form-check">
              <Input
                type="radio"
                name="roleId"
                value={1}
                checked={formData.roleId === 1}
                onChange={handleChange}
                id="customer"
              />
              <Label for="customer" className="form-check-label">
                Müşteri
              </Label>
            </div>
            <div className="form-check">
              <Input
                type="radio"
                name="roleId"
                value={2}
                checked={formData.roleId === 2}
                onChange={handleChange}
                id="propertyOwner"
              />
              <Label for="propertyOwner" className="form-check-label">
                Ev Sahibi
              </Label>
            </div>
          </div>
        </FormGroup>

        <FormGroup>
          <Label for="passwordHash">Şifre</Label>
          <Input
            id="passwordHash"
            name="passwordHash"
            value={formData.passwordHash}
            onChange={handleChange}
            placeholder="••••••••"
            type="password"
            className="animated-input"
          />
          <FormText color="muted">
            Şifre en az 8 karakter, bir büyük harf, bir rakam ve bir özel karakter içermelidir.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label for="confirmPassword">Şifre Tekrar</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            type="password"
            className="animated-input"
          />
        </FormGroup>

        <Button color="secondary" block className="animated-button" type="submit">
          Kayıt Ol
        </Button>
      </Form>
    </div>
  );
}
