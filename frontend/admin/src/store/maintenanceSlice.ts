import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllMaintenance,
  addMaintenance,
  updateMaintenance,
  deleteMaintenance,
  type Maintenance,
  type MaintenanceCreate,
  type MaintenanceUpdate,
} from '../services/maintenanceService';

interface MaintenanceState {
  maintenances: Maintenance[];
  loading: boolean;
  error: string | null;
}

const initialState: MaintenanceState = {
  maintenances: [],
  loading: false,
  error: null,
};

export const fetchMaintenances = createAsyncThunk('maintenance/fetchMaintenances', async () => {
  return await getAllMaintenance();
});

export const createMaintenance = createAsyncThunk('maintenance/createMaintenance', async (data: MaintenanceCreate) => {
  const newMaintenance = await addMaintenance(data);
  return newMaintenance;
});

export const editMaintenance = createAsyncThunk('maintenance/editMaintenance', async ({ id, data }: { id: number; data: MaintenanceUpdate }) => {
  const updated = await updateMaintenance(id, data);
  return updated;
});

export const removeMaintenance = createAsyncThunk('maintenance/removeMaintenance', async (id: number) => {
  await deleteMaintenance(id);
  return id;
});

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaintenances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenances.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenances = action.payload;
      })
      .addCase(fetchMaintenances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Bakım kayıtları yüklenemedi';
      })
      .addCase(createMaintenance.fulfilled, (state, action) => {
        state.maintenances.push(action.payload);
      })
      .addCase(editMaintenance.fulfilled, (state, action) => {
        const idx = state.maintenances.findIndex(m => m.id === action.payload.id);
        if (idx !== -1) state.maintenances[idx] = action.payload;
      })
      .addCase(removeMaintenance.fulfilled, (state, action) => {
        state.maintenances = state.maintenances.filter(m => m.id !== action.payload);
      });
  },
});

export default maintenanceSlice.reducer; 