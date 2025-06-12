import React from 'react';
import { Card, Form, Input, Button, Switch, Select, Space } from 'antd';

const Settings: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <div>
      <h1>Ayarlar</h1>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Genel Ayarlar">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              siteName: 'Minik Tiny House',
              email: 'info@miniktinyhouse.com',
              phone: '+90 555 123 4567',
              currency: 'TRY',
              maintenanceMode: false,
            }}
          >
            <Form.Item
              label="Site Adı"
              name="siteName"
              rules={[{ required: true, message: 'Lütfen site adını giriniz' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="E-posta"
              name="email"
              rules={[
                { required: true, message: 'Lütfen e-posta adresini giriniz' },
                { type: 'email', message: 'Geçerli bir e-posta adresi giriniz' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Telefon"
              name="phone"
              rules={[{ required: true, message: 'Lütfen telefon numarasını giriniz' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Para Birimi"
              name="currency"
              rules={[{ required: true, message: 'Lütfen para birimini seçiniz' }]}
            >
              <Select>
                <Select.Option value="TRY">Türk Lirası (₺)</Select.Option>
                <Select.Option value="USD">Amerikan Doları ($)</Select.Option>
                <Select.Option value="EUR">Euro (€)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Bakım Modu"
              name="maintenanceMode"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Kaydet
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="Bildirim Ayarları">
          <Form layout="vertical">
            <Form.Item
              label="E-posta Bildirimleri"
              name="emailNotifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="SMS Bildirimleri"
              name="smsNotifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default Settings; 