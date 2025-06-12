import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Spin, Alert, Modal, Form, message, Select } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchUsers, removeUser, addUser, editUser } from '../store/userSlice';
import type { UserCreate, UserUpdate } from '../services/userService';

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(removeUser(id));
  };

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(addUser(values as UserCreate));
      setIsModalOpen(false);
      form.resetFields();
      message.success('Kullanıcı eklendi');
    } catch (err) {
      // validation error
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Düzenle işlemleri
  const handleEditUser = (user: any) => {
    setEditingUserId(user.id);
    editForm.setFieldsValue({
      fullName: user.fullName,
      email: user.email,
     roleId: user.roleId,
      phoneNumber: user.phoneNumber
      
    });
    setIsEditModalOpen(true);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await editForm.validateFields();
      await dispatch(editUser({ id: editingUserId!, data: values as UserUpdate }));
      setIsEditModalOpen(false);
      editForm.resetFields();
      setEditingUserId(null);
      message.success('Kullanıcı güncellendi');
    } catch (err) {
      // validation error
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
    setEditingUserId(null);
  };

  const columns: ColumnsType<typeof users[0]> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ad Soyad',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'E-posta',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Telefon',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Rol',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (roleId: number | undefined) => {
        switch (roleId) {
          case 1: return 'Customer';
          case 2: return 'Property Owner';
          case 3: return 'Admin';
          default: return 'Bilinmeyen';
        }
      },
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEditUser(record)}>
            Düzenle
          </Button>
          <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record.id)}>
            Sil
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Kullanıcı ara..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
          Yeni Kullanıcı
        </Button>
      </div>
      {loading ? (
        <Spin tip="Yükleniyor..." />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <Table columns={columns} dataSource={users} rowKey="id" />
      )}
      {/* Kullanıcı ekleme modalı */}
      <Modal
        title="Yeni Kullanıcı Ekle"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Ekle"
        cancelText="İptal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Ad Soyad"
            name="fullName"
            rules={[{ required: true, message: 'Ad soyad giriniz' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="E-posta"
            name="email"
            rules={[{ required: true, message: 'E-posta giriniz' }, { type: 'email', message: 'Geçerli bir e-posta giriniz' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Şifre"
            name="passwordHash"
            rules={[{ required: true, message: 'Şifre giriniz' }, { min: 8, message: 'En az 8 karakter olmalı' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="Telefon" name="phoneNumber">
            <Input />
          </Form.Item>
          <Form.Item label="Rol" name="roleId" initialValue={1}>
            <Select>
              <Select.Option value={1}>Customer</Select.Option>
              <Select.Option value={2}>Property Owner</Select.Option>
              <Select.Option value={3}>Admin</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {/* Kullanıcı düzenleme modalı */}
      <Modal
        title="Kullanıcıyı Düzenle"
        open={isEditModalOpen}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        okText="Kaydet"
        cancelText="İptal"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Ad Soyad"
            name="fullName"
            rules={[{ required: true, message: 'Ad soyad giriniz' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="E-posta"
            name="email"
            rules={[{ required: true, message: 'E-posta giriniz' }, { type: 'email', message: 'Geçerli bir e-posta giriniz' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Telefon" name="phoneNumber">
            <Input />
          </Form.Item>
          <Form.Item label="Rol" name="roleId">
            <Select>
              <Select.Option value={1}>Customer</Select.Option>
              <Select.Option value={2}>Property Owner</Select.Option>
              <Select.Option value={3}>Admin</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users; 