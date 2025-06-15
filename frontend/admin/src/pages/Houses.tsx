import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Spin, Alert, Modal, Form, message, Switch } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchHouses, createHouse, editHouse, removeHouse } from '../store/houseSlice';
import type { HouseCreate, HouseUpdate } from '../services/houseService';
import { updateHouseStatus } from '../services/houseService';

const Houses: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { houses, loading, error } = useSelector((state: RootState) => state.houses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingHouseId, setEditingHouseId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchHouses());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(removeHouse(id));
  };

  const handleAddHouse = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(createHouse(values as HouseCreate));
      setIsModalOpen(false);
      form.resetFields();
      message.success('Tiny house eklendi');
    } catch (err) {
      // validation error
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Düzenle işlemleri
  const handleEditHouse = (house: any) => {
    setEditingHouseId(house.id);
    editForm.setFieldsValue({
      name: house.name,
      description: house.description,
      locationId: house.locationId,
      pricePerNight: house.pricePerNight,
      maxGuests: house.maxGuests,
      property_owner_id: house.property_owner_id,
      amenities: house.amenities,
    });
    setIsEditModalOpen(true);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await editForm.validateFields();
      await dispatch(editHouse({ id: editingHouseId!, data: values as HouseUpdate }));
      setIsEditModalOpen(false);
      editForm.resetFields();
      setEditingHouseId(null);
      message.success('Tiny house güncellendi');
    } catch (err) {
      // validation error
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
    setEditingHouseId(null);
  };

  const handleStatusChange = async (checked: boolean, record: any) => {
    try {
      await updateHouseStatus(record.id, !checked);
      dispatch(fetchHouses()); // Listeyi yenile
      message.success('Durum güncellendi');
    } catch (err) {
      console.error('PATCH Error:', err);
      message.error('Durum güncellenirken bir hata oluştu');
    }
  };

  const columns: ColumnsType<typeof houses[0]> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'İsim',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Konum',
      render: (_, record) => `${record.city || ''}, ${record.country || ''}`,
      key: 'location',
    },
    {
      title: 'Fiyat',
      dataIndex: 'pricePerNight',
      key: 'pricePerNight',
      render: (price: number) => `${price.toLocaleString('tr-TR')} ₺`,
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Space>
          <Switch
            checked={!record.is_freezed}
            onChange={(checked) => handleStatusChange(checked, record)}
            checkedChildren="Aktif"
            unCheckedChildren="Pasif"
          />
        </Space>
      ),
    },
    {
      title: 'Kapasite',
      dataIndex: 'maxGuests',
      key: 'maxGuests',
    },
    {
      title: 'Puan',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEditHouse(record)}>
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
          placeholder="Tiny House ara..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddHouse}>
          Yeni Tiny House
        </Button>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin>
            <div style={{ padding: '50px' }}>Yükleniyor...</div>
          </Spin>
        </div>
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <Table columns={columns} dataSource={houses} rowKey="id" />
      )}
      {/* Tiny house ekleme modalı */}
      <Modal
        title="Yeni Tiny House Ekle"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Ekle"
        cancelText="İptal"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="İsim" name="name" rules={[{ required: true, message: 'İsim giriniz' }]}> <Input /> </Form.Item>
          <Form.Item label="Açıklama" name="description"> <Input.TextArea /> </Form.Item>
          <Form.Item label="Konum ID" name="locationId" rules={[{ required: true, message: 'Konum ID giriniz' }]}> <Input type="number" /> </Form.Item>
          <Form.Item label="Fiyat (₺)" name="pricePerNight" rules={[{ required: true, message: 'Fiyat giriniz' }]}> <Input type="number" /> </Form.Item>
          <Form.Item label="Kapasite" name="maxGuests" rules={[{ required: true, message: 'Kapasite giriniz' }]}> <Input type="number" /> </Form.Item>
          <Form.Item label="Sahip ID" name="property_owner_id" rules={[{ required: true, message: 'Sahip ID giriniz' }]}> <Input type="number" /> </Form.Item>
          <Form.Item label="Olanaklar" name="amenities"> <Input /> </Form.Item>
        </Form>
      </Modal>
      {/* Tiny house düzenleme modalı */}
      <Modal
        title="Tiny House Düzenle"
        open={isEditModalOpen}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        okText="Kaydet"
        cancelText="İptal"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="İsim" name="name" rules={[{ required: true, message: 'İsim giriniz' }]}> <Input /> </Form.Item>
          <Form.Item label="Açıklama" name="description"> <Input.TextArea /> </Form.Item>
          <Form.Item label="Konum ID" name="locationId" rules={[{ required: true, message: 'Konum ID giriniz' }]}> <Input type="number" /> </Form.Item>
          <Form.Item label="Fiyat (₺)" name="pricePerNight" rules={[{ required: true, message: 'Fiyat giriniz' }]}> <Input type="number" /> </Form.Item>
          <Form.Item label="Kapasite" name="maxGuests" rules={[{ required: true, message: 'Kapasite giriniz' }]}> <Input type="number" /> </Form.Item>
          <Form.Item label="Sahip ID" name="property_owner_id" rules={[{ required: true, message: 'Sahip ID giriniz' }]}> <Input type="number" /> </Form.Item>
          <Form.Item label="Olanaklar" name="amenities"> <Input /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Houses; 