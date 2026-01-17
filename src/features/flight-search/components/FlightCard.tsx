
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import {
  Flight as FlightIcon,
  AccessTime,
  AirlineSeatReclineNormal,
  Luggage,
} from '@mui/icons-material';
import { Flight } from '@/app/types/global';

interface FlightCardProps {
  flight: Flight;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  return (
    <Card elevation={2} sx={{ mb: 2, '&:hover': { elevation: 4 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          {/* Left Section - Flight Details */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            {/* Airline Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: 'primary.50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FlightIcon color="primary" />
              </Box>
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {flight.airline}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {flight.flightNumber}
                </Typography>
              </Box>
            </Box>

            {/* Flight Times */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold">
                  {flight.departTime}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {flight.segments[0]?.departure?.iataCode || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                  <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
                  <AccessTime fontSize="small" color="action" />
                  <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
                </Box>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {flight.duration}h • {flight.stops === 0 ? 'Nonstop' : `${flight.stops} ${flight.stops === 1 ? 'Stop' : 'Stops'}`}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold">
                  {flight.arriveTime}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {flight.segments[flight.segments.length - 1]?.arrival?.iataCode || 'N/A'}
                </Typography>
              </Box>
            </Box>

            {/* Additional Info */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<AirlineSeatReclineNormal />}
                label={flight.cabinClass}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<Luggage />}
                label="1 carry-on"
                size="small"
                variant="outlined"
              />
              <Chip
                label={`${flight.seatsAvailable} seats left`}
                size="small"
                color={flight.seatsAvailable < 5 ? 'warning' : 'default'}
              />
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

          {/* Right Section - Price & Action */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              minWidth: 160,
            }}
          >
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                ${flight.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                per person
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Select
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
