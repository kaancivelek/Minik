import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Spin, Alert, Modal, Form, DatePicker, Select, message } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchMaintenances, createMaintenance, editMaintenance, removeMaintenance } from '../store/maintenanceSlice';
import type { MaintenanceCreate, MaintenanceUpdate, MaintenanceStatus } from '../services/maintenanceService';
import dayjs from 'dayjs';

const statusOptions: MaintenanceStatus[] = ['Beklemede', 'Tamamlandı', 'İptal Edildi'];

const Maintenance: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { maintenances, loading, error } = useSelector((state: RootState) => state.maintenance);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchMaintenances());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(removeMaintenance(id));
    message.success('Bakım kaydı silindi');
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(createMaintenance({
        ...values,
        maintenanceDate: values.maintenanceDate.format('YYYY-MM-DD'),
      } as MaintenanceCreate));
      setIsModalOpen(false);
      form.resetFields();
      message.success('Bakım kaydı eklendi');
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
      maintenanceType: record.maintenanceType,
      maintenanceDate: dayjs(record.maintenanceDate),
      status: record.status,
    });
    setIsEditModalOpen(true);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await editForm.validateFields();
      await dispatch(editMaintenance({
        id: editingId!,
        data: {
          ...values,
          maintenanceDate: values.maintenanceDate.format('YYYY-MM-DD'),
        } as MaintenanceUpdate,
      }));
      setIsEditModalOpen(false);
      editForm.resetFields();
      setEditingId(null);
      message.success('Bakım kaydı güncellendi');
    } catch (err) {}
  };

  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
    setEditingId(null);
  };

  const columns: ColumnsType<typeof maintenances[0]> = [
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
      title: 'Bakım Türü',
      dataIndex: 'maintenanceType',
      key: 'maintenanceType',
    },
    {
      title: 'Bakım Tarihi',
      dataIndex: 'maintenanceDate',
      key: 'maintenanceDate',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: MaintenanceStatus) => {
        let color = 'default';
        if (status === 'Tamamlandı') color = 'green';
        if (status === 'Beklemede') color = 'orange';
        if (status === 'İptal Edildi') color = 'red';
        return <span style={{ color }}>{status}</span>;
      },
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
          placeholder="Bakım kaydı ara..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Yeni Bakım Kaydı
        </Button>
      </div>
      {loading ? (
        <Spin tip="Yükleniyor..." />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <Table columns={columns} dataSource={maintenances} rowKey="id" />
      )}
      {/* Bakım ekleme modalı */}
      <Modal
        title="Yeni Bakım Kaydı Ekle"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Ekle"
        cancelText="İptal"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tiny House ID" name="tinyHouseId" rules={[{ required: true, message: 'Tiny House ID giriniz' }]}> <Input type="number" /> </Form.Item>
          <Form.Item label="Bakım Türü" name="maintenanceType" rules={[{ required: true, message: 'Bakım türü giriniz' }]}> <Input /> </Form.Item>
          <Form.Item label="Bakım Tarihi" name="maintenanceDate" rules={[{ required: true, message: 'Bakım tarihi giriniz' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item label="Durum" name="status" rules={[{ required: true, message: 'Durum seçiniz' }]}> <Select options={statusOptions.map(s => ({ value: s, label: s }))} /> </Form.Item>
        </Form>
      </Modal>
      {/* Bakım düzenleme modalı */}
      <Modal
        title="Bakım Kaydını Düzenle"
        open={isEditModalOpen}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        okText="Kaydet"
        cancelText="İptal"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="Tiny House ID" name="tinyHouseId" rules={[{ required: true, message: 'Tiny House ID giriniz' }]}> <Input type="number" /> </Form.Item>
          <Form.Item label="Bakım Türü" name="maintenanceType" rules={[{ required: true, message: 'Bakım türü giriniz' }]}> <Input /> </Form.Item>
          <Form.Item label="Bakım Tarihi" name="maintenanceDate" rules={[{ required: true, message: 'Bakım tarihi giriniz' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item label="Durum" name="status" rules={[{ required: true, message: 'Durum seçiniz' }]}> <Select options={statusOptions.map(s => ({ value: s, label: s }))} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Maintenance; 