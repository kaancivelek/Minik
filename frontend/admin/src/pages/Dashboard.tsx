import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, BankOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Toplam Kullanıcı"
              value={1128}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Toplam Tiny House"
              value={42}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Aktif Rezervasyon"
              value={93}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Aylık Gelir"
              value={154000}
              prefix={<DollarOutlined />}
              suffix="₺"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 