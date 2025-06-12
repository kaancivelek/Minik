import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7183/api';

export interface User {
  id: number;
  fullName: string;
  email: string;
  roleId?: number;
  phoneNumber?: string;
}

export interface UserUpdate {
  fullName?: string;
  email?: string;
  passwordHash?: string;
  roleId?: number;
  phoneNumber?: string;
}

export interface UserCreate {
  fullName: string;
  email: string;
  passwordHash: string;
  roleId?: number;
  phoneNumber?: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  const res = await axios.get(`${API_BASE}/User/users`);
  return res.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const res = await axios.get(`${API_BASE}/User/user/${id}`);
  return res.data;
};

export const updateUser = async (id: number, data: UserUpdate) => {
  const res = await axios.put(`${API_BASE}/User/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await axios.delete(`${API_BASE}/User/${id}`);
  return res.data;
};

export const createUser = async (data: UserCreate) => {
  const res = await axios.post(`${API_BASE}/Register/register`, data);
  return res.data;
}; 