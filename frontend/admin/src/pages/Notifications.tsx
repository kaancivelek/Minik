import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Typography, Spin, Button, Form, Input, Select, message, Popconfirm } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;
import { API_BASE } from '../services/api';

interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface User {
  id: number;
  fullName: string;
}

const Notifications: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/User/users`);
      setUsers(res.data);
    } catch (err) {
      message.error('Kullanıcılar yüklenemedi');
    }
    setLoading(false);
  };

  const fetchNotifications = async (userId: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/notifications/user/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      message.error('Bildirimler yüklenemedi');
    }
    setLoading(false);
  };

  const onUserChange = (userId: number) => {
    setSelectedUser(userId);
    fetchNotifications(userId);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/notifications`, {
        userId: values.userId,
        title: values.title,
        message: values.message,
      });
      message.success('Bildirim gönderildi');
      form.resetFields(['title', 'message']);
      fetchNotifications(values.userId);
    } catch (err) {
      message.error('Bildirim gönderilemedi');
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/notifications/${id}`);
      message.success('Bildirim silindi');
      if (selectedUser) fetchNotifications(selectedUser);
    } catch (err) {
      message.error('Bildirim silinemedi');
    }
    setLoading(false);
  };

  return (
    <div>
      <Title level={2}>Bildirim Yönetimi</Title>
      <Card style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="inline"
          onFinish={onFinish}
          initialValues={{ userId: undefined }}
        >
          <Form.Item
            name="userId"
            rules={[{ required: true, message: 'Kullanıcı seçin' }]}
          >
            <Select
              showSearch
              placeholder="Kullanıcı seçin"
              style={{ width: 200 }}
              onChange={onUserChange}
              optionFilterProp="children"
              filterOption={(input, option) =>
                ((option?.children as unknown as string) || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {users.map((user) => (
                <Option key={user.id} value={user.id}>{user.fullName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            rules={[{ required: true, message: 'Başlık girin' }]}
          >
            <Input placeholder="Başlık" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item
            name="message"
            rules={[{ required: true, message: 'Mesaj girin' }]}
          >
            <Input placeholder="Mesaj" style={{ width: 300 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Gönder
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Bildirimler">
        {loading ? (
          <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
        ) : (
          <Table
            dataSource={notifications}
            columns={[
              { title: 'Başlık', dataIndex: 'title', key: 'title' },
              { title: 'Mesaj', dataIndex: 'message', key: 'message' },
              { title: 'Tarih', dataIndex: 'createdAt', key: 'createdAt', render: (val: string) => new Date(val).toLocaleString('tr-TR') },
              { title: 'Okundu', dataIndex: 'isRead', key: 'isRead', render: (val: boolean) => val ? 'Evet' : 'Hayır' },
              {
                title: 'İşlem',
                key: 'action',
                render: (_, record) => (
                  <Popconfirm title="Silmek istediğinize emin misiniz?" onConfirm={() => handleDelete(record.id)}>
                    <Button danger size="small">Sil</Button>
                  </Popconfirm>
                ),
              },
            ]}
            rowKey="id"
            pagination={false}
            locale={{ emptyText: selectedUser ? 'Bildirim yok' : 'Kullanıcı seçin' }}
          />
        )}
      </Card>
    </div>
  );
};

export default Notifications; 