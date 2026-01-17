
import { Flight, SearchParams } from '@/app/types/global';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface FlightState {
  flights: Flight[];
  loading: boolean;
  error: string | null;
  searched: boolean;
  searchParams: SearchParams | null;
}

const initialState: FlightState = {
  flights: [],
  loading: false,
  error: null,
  searched: false,
  searchParams: null,
};

export const searchFlights = createAsyncThunk(
  'flights/search',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/flights/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to search flights');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const flightSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    clearFlights: (state) => {
      state.flights = [];
      state.searched = false;
      state.error = null;
      state.searchParams = null;
    },
    setSearchParams: (state, action: PayloadAction<SearchParams>) => {
      state.searchParams = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFlights.fulfilled, (state, action: PayloadAction<Flight[]>) => {
        state.loading = false;
        state.flights = action.payload;
        state.searched = true;
        state.error = null;
      })
      .addCase(searchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to search flights';
        state.searched = true;
        state.flights = [];
      });
  },
});

export const { clearFlights, setSearchParams } = flightSlice.actions;
export default flightSlice.reducer;
