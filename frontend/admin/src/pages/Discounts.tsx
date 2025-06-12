import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Spin, Alert, Modal, Form, DatePicker, message } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchDiscounts, createDiscount, editDiscount, removeDiscount } from '../store/discountSlice';
import type { DiscountCreate, DiscountUpdate } from '../services/discountService';
import dayjs from 'dayjs';

const Discounts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { discounts, loading, error } = useSelector((state: RootState) => state.discounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchDiscounts());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(removeDiscount(id));
    message.success('İndirim kaydı silindi');
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(createDiscount({
        ...values,
        validFrom: values.validFrom.format('YYYY-MM-DD'),
        validUntil: values.validUntil.format('YYYY-MM-DD'),
      } as DiscountCreate));
      setIsModalOpen(false);
      form.resetFields();
      message.success('İndirim kaydı eklendi');
    } catch (err) {}
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    editForm.setFieldsValue({
      tinyHouseId: record.tinyHouseId,
      discountPercentage: record.discountPercentage,
      validFrom: dayjs(record.validFrom),
      validUntil: dayjs(record.validUntil),
    });
    setIsEditModalOpen(true);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await editForm.validateFields();
      await dispatch(editDiscount({
        id: editingId!,
        data: {
          ...values,
          validFrom: values.validFrom.format('YYYY-MM-DD'),
          validUntil: values.validUntil.format('YYYY-MM-DD'),
        } as DiscountUpdate,
      }));
      setIsEditModalOpen(false);
      editForm.resetFields();
      setEditingId(null);
      message.success('İndirim kaydı güncellendi');
    } catch (err) {}
  };

  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
    setEditingId(null);
  };

  const columns: ColumnsType<typeof discounts[0]> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tiny House ID',
      dataIndex: 'tinyHouseId',
      key: 'tinyHouseId',
    },
    {
      title: 'İndirim (%)',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
    },
    {
      title: 'Başlangıç',
      dataIndex: 'validFrom',
      key: 'validFrom',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Bitiş',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
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
          placeholder="İndirim ara..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Yeni İndirim
        </Button>
      </div>
      {loading ? (
        <Spin tip="Yükleniyor..." />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <Table columns={columns} dataSource={discounts} rowKey="id" />
      )}
      {/* İndirim ekleme modalı */}
      <Modal
        title="Yeni İndirim Ekle"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Ekle"
        cancelText="İptal"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tiny House ID" name="tinyHouseId" rules={[{ required: true, message: 'Tiny House ID giriniz' }]}> <Input type="number" /> </Form.Item>
          <Form.Item label="İndirim (%)" name="discountPercentage" rules={[{ required: true, message: 'İndirim oranı giriniz' }]}> <Input type="number" min={1} max={100} /> </Form.Item>
          <Form.Item label="Başlangıç" name="validFrom" rules={[{ required: true, message: 'Başlangıç tarihi giriniz' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item label="Bitiş" name="validUntil" rules={[{ required: true, message: 'Bitiş tarihi giriniz' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
        </Form>
      </Modal>
      {/* İndirim düzenleme modalı */}
      <Modal
        title="İndirimi Düzenle"
        open={isEditModalOpen}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        okText="Kaydet"
        cancelText="İptal"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="Tiny House ID" name="tinyHouseId" rules={[{ required: true, message: 'Tiny House ID giriniz' }]}> <Input type="number" /> </Form.Item>
          <Form.Item label="İndirim (%)" name="discountPercentage" rules={[{ required: true, message: 'İndirim oranı giriniz' }]}> <Input type="number" min={1} max={100} /> </Form.Item>
          <Form.Item label="Başlangıç" name="validFrom" rules={[{ required: true, message: 'Başlangıç tarihi giriniz' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item label="Bitiş" name="validUntil" rules={[{ required: true, message: 'Bitiş tarihi giriniz' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Discounts; 