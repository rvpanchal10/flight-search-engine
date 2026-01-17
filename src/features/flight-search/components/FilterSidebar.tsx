
'use client';

import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Slider,
} from '@mui/material';
import {
  setMaxPrice,
  setStops,
  toggleAirline,
  setDepartTimeRange,
  setDuration,
  clearFilters,
} from '../store/filterSlice';
import { useFlightFilters } from '../hooks/useFlightFilters';
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hooks';

export const FilterSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const { uniqueAirlines, priceRange } = useFlightFilters();

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 16 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Filters
        </Typography>
        <Button
          size="small"
          onClick={() => dispatch(clearFilters())}
          sx={{ textTransform: 'none' }}
        >
          Clear all
        </Button>
      </Box>

      {/* Max Price */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight="medium" gutterBottom>
          Max Price: ${filters.maxPrice}
        </Typography>
        <Slider
          value={filters.maxPrice}
          onChange={(e, value) => dispatch(setMaxPrice(value as number))}
          min={priceRange.min}
          max={priceRange.max}
          step={50}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}`}
        />
      </Box>

      {/* Stops */}
      <Box sx={{ mb: 3 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 'medium' }}>
            Stops
          </FormLabel>
          <RadioGroup
            value={filters.stops}
            /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
            onChange={(e) => dispatch(setStops(e.target.value as any))}
          >
            <FormControlLabel value="any" control={<Radio size="small" />} label="Any" />
            <FormControlLabel value="0" control={<Radio size="small" />} label="Nonstop" />
            <FormControlLabel value="1" control={<Radio size="small" />} label="1 Stop" />
            <FormControlLabel value="2+" control={<Radio size="small" />} label="2+ Stops" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Airlines */}
      {uniqueAirlines.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            Airlines
          </Typography>
          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {uniqueAirlines.map((airline) => (
              <FormControlLabel
                key={airline}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.airlines.includes(airline)}
                    onChange={() => dispatch(toggleAirline(airline))}
                  />
                }
                label={airline}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Departure Time */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight="medium" gutterBottom>
          Departure Time: {filters.departTimeRange[0]}:00 - {filters.departTimeRange[1]}:00
        </Typography>
        <Slider
          value={filters.departTimeRange}
          onChange={(e, value) => dispatch(setDepartTimeRange(value as [number, number]))}
          min={0}
          max={24}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}:00`}
        />
      </Box>

      {/* Max Duration */}
      <Box>
        <Typography variant="body2" fontWeight="medium" gutterBottom>
          Max Duration: {filters.duration}h
        </Typography>
        <Slider
          value={filters.duration}
          onChange={(e, value) => dispatch(setDuration(value as number))}
          min={1}
          max={72}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}h`}
        />
      </Box>
    </Paper>
  );
};
