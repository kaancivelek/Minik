import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Modal,
  message,
  Popconfirm,
  Flex,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { supportTicketService } from '../services/supportTicketService';
import type { SupportTicket } from '../services/supportTicketService';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await supportTicketService.getAllTickets();
      setTickets(data);
    } catch (error) {
      console.error('Destek talepleri yüklenirken hata:', error);
      message.error('Destek talepleri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreate = () => {
    setEditingTicket(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (ticket: SupportTicket) => {
    setEditingTicket(ticket);
    form.setFieldsValue({
      userId: ticket.userId,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      assignedTo: ticket.assignedTo,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await supportTicketService.deleteTicket(id);
      message.success('Destek talebi başarıyla silindi.');
      fetchTickets();
    } catch (error) {
      console.error('Destek talebi silinirken hata:', error);
      message.error('Destek talebi silinirken bir hata oluştu.');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingTicket) {
        await supportTicketService.updateTicket(editingTicket.id, values);
        message.success('Destek talebi başarıyla güncellendi.');
      } else {
        await supportTicketService.createTicket(values);
        message.success('Destek talebi başarıyla oluşturuldu.');
      }
      setModalVisible(false);
      fetchTickets();
    } catch (error) {
      console.error('İşlem sırasında hata:', error);
      message.error('İşlem sırasında bir hata oluştu.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'blue';
      case 'inprogress':
        return 'orange';
      case 'resolved':
        return 'green';
      case 'closed':
        return 'gray';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'green';
      case 'medium':
        return 'blue';
      case 'high':
        return 'orange';
      case 'urgent':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Kullanıcı',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
    {
      title: 'Konu',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Öncelik',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Atanan',
      dataIndex: 'assignedToEmail',
      key: 'assignedToEmail',
      render: (email: string | null) => email ?? '-',
    },
    {
      title: 'Oluşturulma Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('tr-TR'),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 120,
      render: (_: any, record: SupportTicket) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bu destek talebini silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredTickets = tickets.filter((ticket) => {
    return (
      (filters.status === '' || ticket.status === filters.status) &&
      (filters.priority === '' || ticket.priority === filters.priority) &&
      (filters.search === '' ||
        ticket.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.userEmail.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Flex 
          justify="space-between" 
          align="center" 
          style={{ marginBottom: 24 }}
        >
          <Title level={2}>Destek Talepleri</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Yeni Talep
          </Button>
        </Flex>

        <Space style={{ marginBottom: 16 }}>
          <Select
            style={{ width: 120 }}
            placeholder="Durum"
            allowClear
            onChange={(value) => setFilters({ ...filters, status: value })}
          >
            <Option value="Open">Açık</Option>
            <Option value="InProgress">İşlemde</Option>
            <Option value="Resolved">Çözüldü</Option>
            <Option value="Closed">Kapalı</Option>
          </Select>

          <Select
            style={{ width: 120 }}
            placeholder="Öncelik"
            allowClear
            onChange={(value) => setFilters({ ...filters, priority: value })}
          >
            <Option value="Low">Düşük</Option>
            <Option value="Medium">Orta</Option>
            <Option value="High">Yüksek</Option>
            <Option value="Urgent">Acil</Option>
          </Select>

          <Input
            placeholder="Ara..."
            prefix={<SearchOutlined />}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ width: 200 }}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={filteredTickets}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingTicket ? 'Destek Talebini Düzenle' : 'Yeni Destek Talebi'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {!editingTicket && (
            <Form.Item
              name="userId"
              label="Kullanıcı ID"
              rules={[{ required: true, message: 'Lütfen kullanıcı ID girin' }]}
            >
              <Input type="number" />
            </Form.Item>
          )}

          <Form.Item
            name="subject"
            label="Konu"
            rules={[{ required: true, message: 'Lütfen konu girin' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Açıklama"
            rules={[{ required: true, message: 'Lütfen açıklama girin' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Durum"
            rules={[{ required: true, message: 'Lütfen durum seçin' }]}
          >
            <Select>
              <Option value="Open">Açık</Option>
              <Option value="InProgress">İşlemde</Option>
              <Option value="Resolved">Çözüldü</Option>
              <Option value="Closed">Kapalı</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Öncelik"
            rules={[{ required: true, message: 'Lütfen öncelik seçin' }]}
          >
            <Select>
              <Option value="Low">Düşük</Option>
              <Option value="Medium">Orta</Option>
              <Option value="High">Yüksek</Option>
              <Option value="Urgent">Acil</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="assignedTo"
            label="Atanan Kullanıcı ID"
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingTicket ? 'Güncelle' : 'Oluştur'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                İptal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupportTickets;