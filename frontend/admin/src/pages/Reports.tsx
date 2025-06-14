import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Typography, Spin } from 'antd';
import axios from 'axios';

const { Title } = Typography;

import { API_BASE } from '../services/api';

const Reports: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [monthlyReservations, setMonthlyReservations] = useState<any[]>([]);
  const [topTinyHouses, setTopTinyHouses] = useState<any[]>([]);
  const [monthlyUsers, setMonthlyUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [summaryRes, monthlyRes, topHousesRes, monthlyUsersRes] = await Promise.all([
          axios.get(`${API_BASE}/admin/reports/summary`),
          axios.get(`${API_BASE}/admin/reports/monthly-reservations`),
          axios.get(`${API_BASE}/admin/reports/top-tinyhouses`),
          axios.get(`${API_BASE}/admin/reports/monthly-users`),
        ]);
        setSummary(summaryRes.data);
        setMonthlyReservations(monthlyRes.data);
        setTopTinyHouses(topHousesRes.data);
        setMonthlyUsers(monthlyUsersRes.data);
      } catch (err) {
        // Hata yönetimi
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <Title level={2}>Raporlar & İstatistikler</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card title="Toplam Rezervasyon" bordered={false}>{summary?.totalReservations}</Card>
        </Col>
        <Col span={6}>
          <Card title="Toplam Gelir" bordered={false}>{summary?.totalIncome} ₺</Card>
        </Col>
        <Col span={6}>
          <Card title="Toplam Kullanıcı" bordered={false}>{summary?.totalUsers}</Card>
        </Col>
        <Col span={6}>
          <Card title="Toplam Tiny House" bordered={false}>{summary?.totalTinyHouses}</Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Aylık Rezervasyonlar">
            <Table
              dataSource={monthlyReservations}
              columns={[
                { title: 'Ay', dataIndex: 'month', key: 'month' },
                { title: 'Rezervasyon Sayısı', dataIndex: 'count', key: 'count' },
              ]}
              pagination={false}
              rowKey="month"
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Aylık Kullanıcı Artışı">
            <Table
              dataSource={monthlyUsers}
              columns={[
                { title: 'Ay', dataIndex: 'month', key: 'month' },
                { title: 'Kullanıcı Sayısı', dataIndex: 'count', key: 'count' },
              ]}
              pagination={false}
              rowKey="month"
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="En Çok Rezervasyon Alan Tiny House'lar">
            <Table
              dataSource={topTinyHouses}
              columns={[
                { title: 'Tiny House', dataIndex: 'tinyHouseName', key: 'tinyHouseName' },
                { title: 'Rezervasyon Sayısı', dataIndex: 'reservationCount', key: 'reservationCount' },
              ]}
              pagination={false}
              rowKey="tinyHouseName"
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reports; 