import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllDiscounts,
  addDiscount,
  updateDiscount,
  deleteDiscount,
  type Discount,
  type DiscountCreate,
  type DiscountUpdate,
} from '../services/discountService';

interface DiscountState {
  discounts: Discount[];
  loading: boolean;
  error: string | null;
}

const initialState: DiscountState = {
  discounts: [],
  loading: false,
  error: null,
};

export const fetchDiscounts = createAsyncThunk('discounts/fetchDiscounts', async () => {
  return await getAllDiscounts();
});

export const createDiscount = createAsyncThunk('discounts/createDiscount', async (data: DiscountCreate) => {
  const newDiscount = await addDiscount(data);
  return newDiscount;
});

export const editDiscount = createAsyncThunk('discounts/editDiscount', async ({ id, data }: { id: number; data: DiscountUpdate }) => {
  const updated = await updateDiscount(id, data);
  return updated;
});

export const removeDiscount = createAsyncThunk('discounts/removeDiscount', async (id: number) => {
  await deleteDiscount(id);
  return id;
});

const discountSlice = createSlice({
  name: 'discounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        state.discounts = action.payload;
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'İndirimler yüklenemedi';
      })
      .addCase(createDiscount.fulfilled, (state, action) => {
        state.discounts.push(action.payload);
      })
      .addCase(editDiscount.fulfilled, (state, action) => {
        const idx = state.discounts.findIndex(d => d.id === action.payload.id);
        if (idx !== -1) state.discounts[idx] = action.payload;
      })
      .addCase(removeDiscount.fulfilled, (state, action) => {
        state.discounts = state.discounts.filter(d => d.id !== action.payload);
      });
  },
});

export default discountSlice.reducer; 