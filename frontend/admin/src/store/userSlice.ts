import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsers, deleteUser, createUser, updateUser, type User, type UserCreate, type UserUpdate } from '../services/userService';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  return await getAllUsers();
});

export const removeUser = createAsyncThunk('users/removeUser', async (id: number) => {
  await deleteUser(id);
  return id;
});

export const addUser = createAsyncThunk('users/addUser', async (user: UserCreate) => {
  const newUser = await createUser(user);
  return newUser;
});

export const editUser = createAsyncThunk('users/editUser', async ({ id, data }: { id: number; data: UserUpdate }) => {
  const updated = await updateUser(id, data);
  return updated;
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Kullanıcılar yüklenemedi';
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(editUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex(u => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      });
  },
});

export default userSlice.reducer; 