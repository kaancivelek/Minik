import axios from 'axios';


import { API_BASE } from './api';

export type MaintenanceStatus = 'Beklemede' | 'Tamamlandı' | 'İptal Edildi';

export interface Maintenance {
  id: number;
  tinyHouseId: number;
  maintenanceType: string;
  maintenanceDate: string;
  status: MaintenanceStatus;
}

export interface MaintenanceCreate {
  tinyHouseId: number;
  maintenanceType: string;
  maintenanceDate: string;
  status: MaintenanceStatus;
}

export interface MaintenanceUpdate {
  maintenanceType?: string;
  maintenanceDate?: string;
  status?: MaintenanceStatus;
}

export const getAllMaintenance = async (): Promise<Maintenance[]> => {
  const res = await axios.get(`${API_BASE}/maintenance`);
  return res.data;
};

export const getMaintenanceById = async (id: number): Promise<Maintenance> => {
  const res = await axios.get(`${API_BASE}/maintenance/${id}`);
  return res.data;
};

export const addMaintenance = async (data: MaintenanceCreate) => {
  const res = await axios.post(`${API_BASE}/maintenance`, data);
  return res.data;
};

export const updateMaintenance = async (id: number, data: MaintenanceUpdate) => {
  const res = await axios.patch(`${API_BASE}/maintenance/${id}`, data);
  return res.data;
};

export const deleteMaintenance = async (id: number) => {
  const res = await axios.delete(`${API_BASE}/maintenance/${id}`);
  return res.data;
};

export const getMaintenanceByTinyHouse = async (tinyHouseId: number): Promise<Maintenance[]> => {
  const res = await axios.get(`${API_BASE}/maintenance/tinyhouse/${tinyHouseId}`);
  return res.data;
}; 