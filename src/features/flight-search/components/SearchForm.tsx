'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { searchSchema } from '../schemas/searchSchema';
import { AirportAutocomplete } from './AirportAutocomplete';
import { searchFlights } from '../store/flightSlice';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hooks';
import { SearchFormUIData } from '@/app/types/global';

export const SearchForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.flights);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormUIData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      origin: null,
      destination: null,
      departDate: new Date().toISOString().split('T')[0],
      returnDate: '',
      passengers: 1,
      cabinClass: 'ECONOMY',
    },
  });

  const onSubmit = async (data: SearchFormUIData) => {
    await dispatch(
      searchFlights({
        ...data,
        origin: data.origin!.iataCode,
        destination: data.destination!.iataCode,
      })
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        Search Flights
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="origin"
              control={control}
              render={({ field }) => (
                <AirportAutocomplete
                  label="From"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.origin?.message}
                  type="origin"
                  disabled={loading}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="destination"
              control={control}
              render={({ field }) => (
                <AirportAutocomplete
                  label="To"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.destination?.message}
                  type="destination"
                  disabled={loading}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="departDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="date"
                  label="Departure Date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.departDate}
                  helperText={errors.departDate?.message}
                  disabled={loading}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="returnDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="date"
                  label="Return Date (Optional)"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.returnDate}
                  helperText={errors.returnDate?.message}
                  disabled={loading}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="passengers"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Passengers"
                  error={!!errors.passengers}
                  helperText={errors.passengers?.message}
                  disabled={loading}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <MenuItem key={n} value={n}>
                      {n} {n === 1 ? 'Passenger' : 'Passengers'}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="cabinClass"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Cabin Class"
                  error={!!errors.cabinClass}
                  helperText={errors.cabinClass?.message}
                  disabled={loading}
                >
                  <MenuItem value="ECONOMY">Economy</MenuItem>
                  <MenuItem value="PREMIUM_ECONOMY">Premium Economy</MenuItem>
                  <MenuItem value="BUSINESS">Business</MenuItem>
                  <MenuItem value="FIRST">First Class</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              startIcon={loading ? null : <Search />}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Searching...' : 'Search Flights'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
