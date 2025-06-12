import axios from 'axios';


import { API_BASE } from './api';

export interface SupportTicket {
  id: number;
  userId: number;
  userEmail: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string | null;
  assignedTo: number | null;
  assignedToEmail: string | null;
}

export const supportTicketService = {
  getAllTickets: async (): Promise<SupportTicket[]> => {
    const response = await axios.get(`${API_BASE}/api/supporttickets`);
    return response.data;
  },

  getTicketById: async (id: number): Promise<SupportTicket> => {
    const response = await axios.get(`${API_BASE}/api/supporttickets/${id}`);
    return response.data;
  },

  createTicket: async (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'userEmail' | 'assignedToEmail'>): Promise<void> => {
    await axios.post(`${API_BASE}/api/supporttickets`, ticket);
  },

  updateTicket: async (id: number, ticket: Partial<SupportTicket>): Promise<void> => {
    await axios.patch(`${API_BASE}/api/supporttickets/${id}`, ticket);
  },

  deleteTicket: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/api/supporttickets/${id}`);
  }
}; 