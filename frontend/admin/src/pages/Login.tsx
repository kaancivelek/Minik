import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../services/api';


interface LoginForm {
  email: string;
  passwordHash: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onFinish = async (values: LoginForm) => {
    setErrorMessage(null); // Her giriş denemesinde önce hata mesajını temizle
    try {
      setLoading(true);
      console.log('Login attempt with:', values.email);
      
      const response = await axios.post(`${API_BASE}/User/login`, {
        email: values.email,
        passwordHash: values.passwordHash,
      });

      console.log('Login response:', response.data);

      if (response.data && response.data.roleId === 3) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify({
          email: values.email,
          roleId: response.data.roleId
        }));
        message.success('Giriş başarılı!');
        navigate('/admin/dashboard');
      } else if (response.data && response.data.roleId !== 3) {
        setErrorMessage('Bu sayfaya erişim yetkiniz yok!');
      } else {
        setErrorMessage('Bilinmeyen bir hata oluştu.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 401) {
        setErrorMessage('E-posta veya şifre hatalı!');
      } else {
        setErrorMessage('Giriş başarısız! Lütfen bilgilerinizi kontrol edin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Admin Panel</h2>
        {errorMessage && (
          <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 16 }} />
        )}
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Lütfen e-posta adresinizi girin!' },
              { type: 'email', message: 'Geçerli bir e-posta adresi girin!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="E-posta" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="passwordHash"
            rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Şifre"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;