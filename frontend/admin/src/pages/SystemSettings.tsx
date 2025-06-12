import React, { useEffect, useState } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  message,
  Space,
  Typography,
  Popconfirm,
} from 'antd';
import { systemSettingService } from '../services/systemSettingService';
import type { SystemSetting } from '../services/systemSettingService';

const { TextArea } = Input;
const { Title } = Typography;

interface CategoryFormValues {
  [key: string]: any;
}

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState<{ [key: string]: any }>({});

  const categories = [
    { key: 'General', label: 'Genel Ayarlar' },
    { key: 'Email', label: 'E-posta Ayarları' },
    { key: 'Notification', label: 'Bildirim Ayarları' },
    { key: 'Reservation', label: 'Rezervasyon Ayarları' },
    { key: 'Payment', label: 'Ödeme Ayarları' },
  ];

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await systemSettingService.getAllSettings();
      setSettings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
      message.error('Ayarlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdate = async (setting: SystemSetting, values: CategoryFormValues) => {
    try {
      const value = values[setting.key];
      await systemSettingService.updateSetting(setting.id, { value });
      message.success('Ayar başarıyla güncellendi.');
      fetchSettings();
    } catch (error) {
      console.error('Ayar güncellenirken hata:', error);
      message.error('Ayar güncellenirken bir hata oluştu.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await systemSettingService.deleteSetting(id);
      message.success('Ayar başarıyla silindi.');
      fetchSettings();
    } catch (error) {
      console.error('Ayar silinirken hata:', error);
      message.error('Ayar silinirken bir hata oluştu.');
    }
  };

  const handleFormFinish = async (category: string, values: CategoryFormValues) => {
    const categorySettings = Array.isArray(settings) ? settings.filter(s => s.category === category) : [];
    
    // Her ayarı ayrı ayrı güncelle
    for (const setting of categorySettings) {
      if (values[setting.key] !== undefined) {
        await handleUpdate(setting, values);
      }
    }
  };

  const parseValue = (setting: SystemSetting) => {
    try {
      switch (setting.dataType.toLowerCase()) {
        case 'number':
          return Number(setting.value);
        case 'boolean':
          return setting.value === 'true' || setting.value === 'false';
        case 'json':
          return typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
        default:
          return setting.value;
      }
    } catch {
      return setting.value;
    }
  };

  const renderSettingInput = (setting: SystemSetting) => {
    switch (setting.dataType.toLowerCase()) {
      case 'number':
        return <InputNumber style={{ width: '100%' }} />;
      case 'boolean':
        return <Switch />;
      case 'json':
        return <TextArea rows={4} />;
      default:
        return <Input />;
    }
  };

  const getInitialValues = (category: string) => {
    const categorySettings = Array.isArray(settings) ? settings.filter(s => s.category === category) : [];
    const initialValues: CategoryFormValues = {};
    
    categorySettings.forEach(setting => {
      initialValues[setting.key] = parseValue(setting);
    });
    
    return initialValues;
  };

  const renderSettingsForm = (category: string) => {
    const categorySettings = Array.isArray(settings) ? settings.filter(s => s.category === category) : [];

    if (categorySettings.length === 0) {
      return <div>Bu kategori için ayar bulunmuyor.</div>;
    }

    return (
      <Form 
        layout="vertical"
        onFinish={(values) => handleFormFinish(category, values)}
        initialValues={getInitialValues(category)}
        key={category} // Form'u yeniden render etmek için key eklendi
      >
        {categorySettings.map((setting) => (
          <div key={setting.id}>
            <Form.Item
              label={setting.description || setting.key}
              name={setting.key}
              rules={[{ required: true, message: 'Bu alan zorunludur' }]}
              style={{ marginBottom: 16 }}
            >
              {renderSettingInput(setting)}
            </Form.Item>
            
            <Space style={{ marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                {setting.key} Ayarını Kaydet
              </Button>
              <Popconfirm
                title="Bu ayarı silmek istediğinizden emin misiniz?"
                onConfirm={() => handleDelete(setting.id)}
                okText="Evet"
                cancelText="Hayır"
              >
                <Button danger>Sil</Button>
              </Popconfirm>
            </Space>
          </div>
        ))}
        
        <Form.Item style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit" size="large">
            Tüm {category} Ayarlarını Kaydet
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const tabItems = categories.map((category) => ({
    key: category.key,
    label: category.label,
    children: renderSettingsForm(category.key),
  }));

  return (
    <div style={{ padding: 24 }}>
      <Card loading={loading}>
        <Title level={2}>Sistem Ayarları</Title>
        <Tabs defaultActiveKey="General" items={tabItems} />
      </Card>
    </div>
  );
};

export default SystemSettings;