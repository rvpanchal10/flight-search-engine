
'use client';

import React, { useMemo } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFlightFilters } from '../hooks/useFlightFilters';
import { Schedule } from '@mui/icons-material';

export const DepartureTimeDistribution: React.FC = () => {
  const { filteredFlights } = useFlightFilters();

  const timeData = useMemo(() => {
    const timeSlots = [
      { name: 'Early Morning', range: [0, 6], label: '12AM-6AM' },
      { name: 'Morning', range: [6, 12], label: '6AM-12PM' },
      { name: 'Afternoon', range: [12, 18], label: '12PM-6PM' },
      { name: 'Evening', range: [18, 24], label: '6PM-12AM' },
    ];

    const distribution = timeSlots.map((slot) => ({
      timeSlot: slot.name,
      label: slot.label,
      count: 0,
      totalPrice: 0,
      avgPrice: 0,
    }));

    filteredFlights.forEach((flight) => {
      const hour = parseInt(flight.departTime.split(':')[0]);
      const slotIndex = timeSlots.findIndex(
        (slot) => hour >= slot.range[0] && hour < slot.range[1]
      );

      if (slotIndex !== -1) {
        distribution[slotIndex].count += 1;
        distribution[slotIndex].totalPrice += flight.price;
      }
    });

    distribution.forEach((slot) => {
      if (slot.count > 0) {
        slot.avgPrice = Math.round(slot.totalPrice / slot.count);
      }
    });

    return distribution;
  }, [filteredFlights]);

  if (filteredFlights.length === 0) return null;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Schedule color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Flights by Departure Time
        </Typography>
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={timeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis yAxisId="left" orientation="left" label={{ value: 'Number of Flights', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Avg Price ($)', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Bar yAxisId="left" dataKey="count" fill="#2563eb" name="Flights" />
          <Bar yAxisId="right" dataKey="avgPrice" fill="#f59e0b" name="Avg Price" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};