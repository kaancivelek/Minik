import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import houseReducer from './houseSlice';
import reservationReducer from './reservationSlice';
import maintenanceReducer from './maintenanceSlice';
import discountReducer from './discountSlice';

const store = configureStore({
  reducer: {
    users: userReducer,
    houses: houseReducer,
    reservations: reservationReducer,
    maintenance: maintenanceReducer,
    discounts: discountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 