import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllReservations,
  addReservation,
  updateReservation,
  deleteReservation,
  updateReservationStatus,
  type Reservation,
  type ReservationCreate,
  type ReservationUpdate,
} from '../services/reservationService';

interface ReservationState {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
}

const initialState: ReservationState = {
  reservations: [],
  loading: false,
  error: null,
};

// Artık tüm rezervasyonları çeken endpoint kullanılıyor
export const fetchReservations = createAsyncThunk('reservations/fetchReservations', async () => {
  return await getAllReservations();
});

export const createReservation = createAsyncThunk('reservations/createReservation', async (data: ReservationCreate) => {
  const newReservation = await addReservation(data);
  return newReservation;
});

export const editReservation = createAsyncThunk('reservations/editReservation', async ({ id, data }: { id: number; data: ReservationUpdate }) => {
  const updated = await updateReservation(id, data);
  return updated;
});

export const removeReservation = createAsyncThunk('reservations/removeReservation', async (id: number) => {
  await deleteReservation(id);
  return id;
});

export const changeReservationStatus = createAsyncThunk('reservations/changeReservationStatus', async ({ id, status }: { id: number; status: string }) => {
  const updated = await updateReservationStatus(id, status);
  return updated;
});

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Rezervasyonlar yüklenemedi';
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.reservations.push(action.payload);
      })
      .addCase(editReservation.fulfilled, (state, action) => {
        const idx = state.reservations.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.reservations[idx] = action.payload;
      })
      .addCase(removeReservation.fulfilled, (state, action) => {
        state.reservations = state.reservations.filter(r => r.id !== action.payload);
      })
      .addCase(changeReservationStatus.fulfilled, (state, action) => {
        const idx = state.reservations.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.reservations[idx] = action.payload;
      });
  },
});

export default reservationSlice.reducer; 