import axios from 'axios';


import { API_BASE } from './api';

export interface House {
  id: number;
  name: string;
  description?: string;
  locationId: number;
  pricePerNight: number;
  maxGuests: number;
  property_owner_id: number;
  amenities?: string;
  country?: string;
  city?: string;
  rating?: number;
  is_freezed?: boolean;
}

export interface HouseCreate {
  name: string;
  description?: string;
  locationId: number;
  pricePerNight: number;
  maxGuests: number;
  property_owner_id: number;
  amenities?: string;
}

export interface HouseUpdate {
  name?: string;
  description?: string;
  locationId?: number;
  pricePerNight?: number;
  maxGuests?: number;
  property_owner_id?: number;
  amenities?: string;
  is_freezed?: boolean;
}

export const getAllHouses = async (): Promise<House[]> => {
  const res = await axios.get(`${API_BASE}/TinyHouses`);
  return res.data;
};

export const getHouseById = async (id: number): Promise<House> => {
  const res = await axios.get(`${API_BASE}/TinyHouses/${id}`);
  return res.data;
};

export const addHouse = async (data: HouseCreate) => {
  const res = await axios.post(`${API_BASE}/TinyHouses/add`, data);
  return res.data;
};

export const updateHouse = async (id: number, data: HouseUpdate) => {
  const res = await axios.patch(`${API_BASE}/TinyHouses/update/${id}`, data);
  return res.data;
};

export const updateHouseStatus = async (id: number, isFreezed: boolean) => {
  const requestData = { IsFreezed: isFreezed };
  console.log('Sending PATCH request:', {
    url: `${API_BASE}/TinyHouses/update/${id}`,
    data: requestData
  });
  const res = await axios.patch(`${API_BASE}/TinyHouses/update/${id}`, requestData);
  return res.data;
};

export const deleteHouse = async (id: number) => {
  const res = await axios.delete(`${API_BASE}/TinyHouses/delete/${id}`);
  return res.data;
}; 