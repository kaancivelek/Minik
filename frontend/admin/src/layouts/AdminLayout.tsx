import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  BankOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
  NotificationOutlined,
  ToolOutlined,
  PercentageOutlined,
  BarChartOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  ToolFilled,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Kullanıcılar',
    },
    {
      key: 'houses',
      icon: <BankOutlined />,
      label: 'Evler',
    },
    {
      key: 'reservations',
      icon: <CalendarOutlined />,
      label: 'Rezervasyonlar',
    },
    {
      key: 'notifications',
      icon: <NotificationOutlined />,
      label: 'Bildirimler',
    },
    {
      key: 'maintenance',
      icon: <ToolOutlined />,
      label: 'Bakım',
    },
    {
      key: 'discounts',
      icon: <PercentageOutlined />,
      label: 'İndirimler',
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: 'Raporlar',
    },
    {
      key: 'logs',
      icon: <FileTextOutlined />,
      label: 'Loglar',
    },
    {
      key: 'support-tickets',
      icon: <CustomerServiceOutlined />,
      label: 'Destek Talepleri',
    },
    {
      key: 'system-settings',
      icon: <ToolFilled />,
      label: 'Sistem Ayarları',
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(`/admin/${key}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('user');
    navigate('/');
    location.reload();
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="dark">
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ float: 'right', marginRight: 24 }}>
            <LogoutOutlined 
              style={{ fontSize: 20, cursor: 'pointer' }} 
              onClick={handleLogout}
            />
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 