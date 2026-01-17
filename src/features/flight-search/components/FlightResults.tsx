
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Grid,
  IconButton,
  Drawer,
} from '@mui/material';
import { FilterList, Search as SearchIcon } from '@mui/icons-material';
import { useFlightFilters } from '../hooks/useFlightFilters';
import { FlightCard } from './FlightCard';
import { FilterSidebar } from './FilterSidebar';
import { PriceGraph } from './PriceGraph';
import { resetFiltersToMax } from '../store/filterSlice';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hooks';
import { AirlineDistributionChart } from './AirlineDistributionChart';
import { StopsDistributionChart } from './StopsDistributionChart';
import { DepartureTimeDistribution } from './DepartureTimeDistribution';

export const FlightResults: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, searched, error, searchParams } = useAppSelector((state) => state.flights);
  const { filteredFlights, priceRange } = useFlightFilters();
  const [sortBy, setSortBy] = useState('price');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (filteredFlights.length > 0 && priceRange.max > 0) {
      dispatch(resetFiltersToMax({ maxPrice: priceRange.max }));
    }
  }, [priceRange.max, dispatch]);

  const sortedFlights = React.useMemo(() => {
    const sorted = [...filteredFlights];
    switch (sortBy) {
      case 'price':
        return sorted.sort((a, b) => a.price - b.price);
      case 'duration':
        return sorted.sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration));
      case 'departure':
        return sorted.sort((a, b) => a.departTime.localeCompare(b.departTime));
      default:
        return sorted;
    }
  }, [filteredFlights, sortBy]);

  if (!searched) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'primary.50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <SearchIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Find Your Perfect Flight
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search from thousands of flights to find the best deals for your trip
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Finding the best flights...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', bgcolor: 'error.50' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Oops! Something went wrong
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {error}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <PriceGraph />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <AirlineDistributionChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <StopsDistributionChart />
        </Grid>
      </Grid>

      <DepartureTimeDistribution />

      <Grid container spacing={3}>
        {/* Desktop Filter Sidebar */}
        <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          <FilterSidebar />
        </Grid>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="left"
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <Box sx={{ width: 300, p: 2 }}>
            <FilterSidebar />
          </Box>
        </Drawer>


        {/* Flight Results */}
        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {filteredFlights.length} {filteredFlights.length === 1 ? 'Flight' : 'Flights'} Found
                </Typography>
                {searchParams && (
                  <Typography variant="body2" color="text.secondary">
                    {searchParams.origin} → {searchParams.destination} • {new Date(searchParams.departDate).toLocaleDateString()}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <IconButton
                  onClick={() => setMobileFilterOpen(true)}
                  sx={{ display: { xs: 'flex', md: 'none' } }}
                >
                  <FilterList />
                </IconButton>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort by"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="price">Lowest Price</MenuItem>
                    <MenuItem value="duration">Shortest Duration</MenuItem>
                    <MenuItem value="departure">Earliest Departure</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {sortedFlights.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" gutterBottom>
                  No flights match your filters
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your filters to see more results
                </Typography>
              </Box>
            ) : (
              <Box>
                {sortedFlights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};