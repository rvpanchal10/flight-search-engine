'use client';

import React, { useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Typography } from '@mui/material';
import { FlightTakeoff, FlightLand } from '@mui/icons-material';
import { useAirportSearch } from '../hooks/useAirportSearch';
import { Airport } from '@/app/types/global';

interface AirportAutocompleteProps {
  label: string;
  value: Airport | null;
  onChange: (value: Airport | null) => void;
  error?: string;
  type: 'origin' | 'destination';
  disabled?: boolean;
}

export const AirportAutocomplete: React.FC<AirportAutocompleteProps> = ({
  label,
  value,
  onChange,
  error,
  type,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);

  const { airports, loading: searchLoading, searchTerm, setSearchTerm, } = useAirportSearch();

  return (
    <Autocomplete
      fullWidth
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={searchTerm}
      onInputChange={(_, newInputValue) => { setSearchTerm(newInputValue); }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;

        if (option.type === 'CITY') {
          return `${option.city} (${option.iataCode}), ${option.country}`;
        }

        return `${option.name} (${option.iataCode})`;
      }}
      options={airports}
      loading={searchLoading}
      disabled={disabled}
      isOptionEqualToValue={(option, value) =>
        option.iataCode === value.iataCode &&
        option.type === value.type
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                {type === 'origin' ? (
                  <FlightTakeoff sx={{ mr: 1, color: 'action.active' }} />
                ) : (
                  <FlightLand sx={{ mr: 1, color: 'action.active' }} />
                )}
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.iataCode} sx={{ '& > *': { mr: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Box
              sx={{
                minWidth: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: option.type === 'AIRPORT' ? 'primary.50' : 'secondary.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                color: option.type === 'AIRPORT' ? 'primary.main' : 'secondary.main',
              }}
            >
              {option.iataCode}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" fontWeight="medium">
                {option.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {option.city}, {option.country}
                {option.type && (
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      px: 1,
                      py: 0.25,
                      borderRadius: 0.5,
                      bgcolor: option.type === 'AIRPORT' ? 'primary.50' : 'secondary.50',
                      color: option.type === 'AIRPORT' ? 'primary.main' : 'secondary.main',
                      fontSize: '0.7rem',
                      fontWeight: 'medium',
                    }}
                  >
                    {option.type}
                  </Box>
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      noOptionsText={
        searchTerm.length < 2
          ? 'Type at least 2 characters to search...'
          : searchLoading
            ? 'Searching...'
            : 'No airports found'
      }
    />
  );
};