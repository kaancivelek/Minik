import axios from 'axios';


import { API_BASE } from './api';

export interface Reservation {
  id: number;
  userId: number;
  tinyHouseId: number;
  totalPrice: number;
  status: string;
  checkIn: string;
  checkOut: string;
}

export interface ReservationCreate {
  userId: number;
  tinyHouseId: number;
  totalPrice: number;
  status: string;
  checkIn: string;
  checkOut: string;
}

export interface ReservationUpdate {
  tinyHouseId?: number;
  totalPrice?: number;
  status?: string;
  checkIn?: string;
  checkOut?: string;
}

export const getReservationsByUser = async (userId: number): Promise<Reservation[]> => {
  const res = await axios.get(`${API_BASE}/reservations/user/${userId}`);
  return res.data;
};

export const addReservation = async (data: ReservationCreate) => {
  const res = await axios.post(`${API_BASE}/reservations`, data);
  return res.data;
};

export const updateReservation = async (id: number, data: ReservationUpdate) => {
  const res = await axios.put(`${API_BASE}/reservations/${id}`, data);
  return res.data;
};

export const deleteReservation = async (id: number) => {
  const res = await axios.delete(`${API_BASE}/reservations/${id}`);
  return res.data;
};

export const updateReservationStatus = async (id: number, newStatus: string) => {
  const res = await axios.patch(`${API_BASE}/reservations/updatestatus/${id}`, newStatus, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

export const getAllReservations = async (): Promise<Reservation[]> => {
  const res = await axios.get(`${API_BASE}/reservations/all`);
  return res.data;
}; 