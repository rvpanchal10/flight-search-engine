
import { configureStore } from '@reduxjs/toolkit';
import flightReducer from '@/features/flight-search/store/flightSlice';
import filterReducer from '@/features/flight-search/store/filterSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      flights: flightReducer,
      filters: filterReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['flights/setFlights'],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];