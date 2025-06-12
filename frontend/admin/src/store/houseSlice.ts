import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllHouses,
  addHouse,
  updateHouse,
  deleteHouse,
  type House,
  type HouseCreate,
  type HouseUpdate,
} from '../services/houseService';

interface HouseState {
  houses: House[];
  loading: boolean;
  error: string | null;
}

const initialState: HouseState = {
  houses: [],
  loading: false,
  error: null,
};

export const fetchHouses = createAsyncThunk('houses/fetchHouses', async () => {
  return await getAllHouses();
});

export const createHouse = createAsyncThunk('houses/createHouse', async (data: HouseCreate) => {
  const newHouse = await addHouse(data);
  return newHouse;
});

export const editHouse = createAsyncThunk('houses/editHouse', async ({ id, data }: { id: number; data: HouseUpdate }) => {
  const updated = await updateHouse(id, data);
  return updated;
});

export const removeHouse = createAsyncThunk('houses/removeHouse', async (id: number) => {
  await deleteHouse(id);
  return id;
});

const houseSlice = createSlice({
  name: 'houses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHouses.fulfilled, (state, action) => {
        state.loading = false;
        state.houses = action.payload;
      })
      .addCase(fetchHouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Tiny house listesi yüklenemedi';
      })
      .addCase(createHouse.fulfilled, (state, action) => {
        state.houses.push(action.payload);
      })
      .addCase(editHouse.fulfilled, (state, action) => {
        const idx = state.houses.findIndex(h => h.id === action.payload.id);
        if (idx !== -1) state.houses[idx] = action.payload;
      })
      .addCase(removeHouse.fulfilled, (state, action) => {
        state.houses = state.houses.filter(h => h.id !== action.payload);
      });
  },
});

export default houseSlice.reducer; 