
import { FilterState } from '@/app/types/global';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: FilterState = {
  maxPrice: 10000,
  stops: 'any',
  airlines: [],
  departTimeRange: [0, 24],
  duration: 72,
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setMaxPrice: (state, action: PayloadAction<number>) => {
      state.maxPrice = action.payload;
    },
    setStops: (state, action: PayloadAction<'any' | '0' | '1' | '2+'>) => {
      state.stops = action.payload;
    },
    toggleAirline: (state, action: PayloadAction<string>) => {
      const index = state.airlines.indexOf(action.payload);
      if (index > -1) {
        state.airlines.splice(index, 1);
      } else {
        state.airlines.push(action.payload);
      }
    },
    setDepartTimeRange: (state, action: PayloadAction<[number, number]>) => {
      state.departTimeRange = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    clearFilters: () => {
      return initialState;
    },
    resetFiltersToMax: (state, action: PayloadAction<{ maxPrice: number }>) => {
      state.maxPrice = action.payload.maxPrice;
      state.stops = 'any';
      state.airlines = [];
      state.departTimeRange = [0, 24];
      state.duration = 72;
    },
  },
});

export const {
  setMaxPrice,
  setStops,
  toggleAirline,
  setDepartTimeRange,
  setDuration,
  clearFilters,
  resetFiltersToMax,
} = filterSlice.actions;

export default filterSlice.reducer;
