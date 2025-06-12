import axios from 'axios';

import { API_BASE } from './api';
export interface Discount {
  id: number;
  tinyHouseId: number;
  discountPercentage: number;
  validFrom: string;
  validUntil: string;
}

export interface DiscountCreate {
  tinyHouseId: number;
  discountPercentage: number;
  validFrom: string;
  validUntil: string;
}

export interface DiscountUpdate {
  tinyHouseId?: number;
  discountPercentage?: number;
  validFrom?: string;
  validUntil?: string;
}

export const getAllDiscounts = async (): Promise<Discount[]> => {
  const res = await axios.get(`${API_BASE}/discounts`);
  return res.data;
};

export const getDiscountById = async (id: number): Promise<Discount> => {
  const res = await axios.get(`${API_BASE}/discounts/${id}`);
  return res.data;
};

export const addDiscount = async (data: DiscountCreate) => {
  const res = await axios.post(`${API_BASE}/discounts`, data);
  return res.data;
};

export const updateDiscount = async (id: number, data: DiscountUpdate) => {
  const res = await axios.patch(`${API_BASE}/discounts/${id}`, data);
  return res.data;
};

export const deleteDiscount = async (id: number) => {
  const res = await axios.delete(`${API_BASE}/discounts/${id}`);
  return res.data;
}; 