import React, { useEffect } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { validateUser, getUserByEmail } from "../services/LogonService";
import { toast, Slide } from "react-toastify";

export default function Login({ setUser }) {
  const navigate = useNavigate();

  const fetchUserByEmail = async (email) => {
    try {
      const response = await getUserByEmail(email);
      if (response) {
        localStorage.setItem("user", JSON.stringify(response));
        setUser(response);
        toast.success(" Giriş Başarılı!", {
          position: "top-center",
          autoClose: 1000,
          theme: "dark",
          transition: Slide,
        });
        setTimeout(() => navigate("/"), 500);
      } else {
        console.error("Kullanıcı bulunamadı.");
      }
    } catch (error) {
      console.error("Kullanıcı bilgileri alınırken hata:", error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      toast.error("Email ve şifre alanları boş olamaz!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
        transition: Slide,
      });
      return;
    }

    //console.log("Giriş yapılmak istenen email:", email); // GÖZLEMLEME AMAÇLI

    try {
      const response = await validateUser(email, password);

      if (response === "Giriş başarılı.") {
        await fetchUserByEmail(email);
      } else {
        toast.error(`⚠️ Giriş hatası: ${response}`, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
          transition: Slide,
        });
      }
    } catch (error) {
      console.error("Giriş hatası:", error);

      const msg = error.message;

      if (msg.includes("Şifre hatalı")) {
        toast.error("❌ Şifre hatalı!", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
          transition: Slide,
        });
      } else if (msg.includes("Kullanıcı bulunamadı")) {
        toast.error("❌ Kullanıcı bulunamadı!", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
          transition: Slide,
        });
      } else {
        toast.error(`🚨 Giriş sırasında hata: ${msg}`, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
          transition: Slide,
        });
      }
    }
  };

  return (
    <div className="login-container">
      <Form className="login-form" onSubmit={handleLogin}>
        <FormGroup>
          <Label for="Email">Email</Label>
          <Input
            id="Email"
            name="email"
            placeholder="example@example.com"
            type="email"
            className="animated-input"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="Password">Password</Label>
          <Input
            id="Password"
            name="password"
            placeholder="••••••"
            type="password"
            className="animated-input"
            required
          />
        </FormGroup>
        <Button
          color="secondary"
          block
          type="submit"
          className="animated-button"
        >
          Giriş Yap
        </Button>
        {/* <Button
          type="button"
          onClick={() => {
             const response = {
               id: 11,
               full_name: "Kaan Civelek",
               email: "kaancivelek17@gmail.com",
               roleId: "1",
               phone_number: "0532 123 4567",
             };
             toast.success("Giriş yapıldı.", {
               position: "top-center",
               autoClose: 2000,
               theme: "dark",
               transition: Slide,
             });

             localStorage.setItem("user", JSON.stringify(response));
             setUser(response);
            setTimeout(() => navigate("/"), 2500);
         
          }}
        >
          DEMO
        </Button> */}
      </Form>
    </div>
  );
}
