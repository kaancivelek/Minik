import React, { useEffect } from 'react';
import { Table, Button, Space, Input, Spin, Alert, Tag, message } from 'antd';
import { SearchOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchReservations, removeReservation, changeReservationStatus } from '../store/reservationSlice';

const Reservations: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reservations, loading, error } = useSelector((state: RootState) => state.reservations);

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(removeReservation(id));
    message.success('Rezervasyon silindi');
  };

  const handleStatusChange = (id: number, status: string) => {
    dispatch(changeReservationStatus({ id, status }));
    message.success(`Rezervasyon durumu "${status}" olarak güncellendi`);
  };

  const columns: ColumnsType<typeof reservations[0]> = [
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
      title: 'Misafir (User ID)',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Giriş Tarihi',
      dataIndex: 'checkIn',
      key: 'checkIn',
    },
    {
      title: 'Çıkış Tarihi',
      dataIndex: 'checkOut',
      key: 'checkOut',
    },
    {
      title: 'Toplam Tutar',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => `${price.toLocaleString('tr-TR')} ₺`,
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'Onaylandı') color = 'green';
        if (status === 'Beklemede') color = 'orange';
        if (status === 'İptal Edildi') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'Beklemede' && (
            <>
              <Button type="primary" icon={<CheckOutlined />} size="small" onClick={() => handleStatusChange(record.id, 'Onaylandı')}>
                Onayla
              </Button>
              <Button danger icon={<CloseOutlined />} size="small" onClick={() => handleStatusChange(record.id, 'İptal Edildi')}>
                Reddet
              </Button>
            </>
          )}
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
          placeholder="Rezervasyon ara..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
      </div>
      {loading ? (
        <Spin tip="Yükleniyor..." />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <Table columns={columns} dataSource={reservations} rowKey="id" />
      )}
    </div>
  );
};

export default Reservations; 