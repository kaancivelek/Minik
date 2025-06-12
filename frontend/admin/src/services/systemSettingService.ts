import axios from 'axios';


import { API_BASE } from './api';

export interface SystemSetting {
  id: number;
  category: string;
  key: string;
  value: string;
  description: string;
  dataType: string;
  createdAt: string;
  updatedAt: string | null;
}

export const systemSettingService = {
  getAllSettings: async (): Promise<SystemSetting[]> => {
    const response = await axios.get(`${API_BASE}/api/systemsettings`);
    return response.data;
  },

  getSettingsByCategory: async (category: string): Promise<SystemSetting[]> => {
    const response = await axios.get(`${API_BASE}/api/systemsettings/category/${category}`);
    return response.data;
  },

  getSettingById: async (id: number): Promise<SystemSetting> => {
    const response = await axios.get(`${API_BASE}/api/systemsettings/${id}`);
    return response.data;
  },

  createSetting: async (setting: Omit<SystemSetting, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    await axios.post(`${API_BASE}/api/systemsettings`, setting);
  },

  updateSetting: async (id: number, setting: Partial<SystemSetting>): Promise<void> => {
    await axios.patch(`${API_BASE}/api/systemsettings/${id}`, setting);
  },

  deleteSetting: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/api/systemsettings/${id}`);
  }
}; 