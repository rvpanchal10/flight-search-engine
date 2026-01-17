
'use client';

import React, { useMemo } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFlightFilters } from '../hooks/useFlightFilters';
import { Flight } from '@mui/icons-material';

export const AirlineDistributionChart: React.FC = () => {
  const { filteredFlights } = useFlightFilters();

  const airlineData = useMemo(() => {
    const distribution = new Map<string, { count: number; totalPrice: number; minPrice: number }>();

    filteredFlights.forEach((flight) => {
      const existing = distribution.get(flight.airline);
      if (existing) {
        existing.count += 1;
        existing.totalPrice += flight.price;
        existing.minPrice = Math.min(existing.minPrice, flight.price);
      } else {
        distribution.set(flight.airline, {
          count: 1,
          totalPrice: flight.price,
          minPrice: flight.price,
        });
      }
    });

    return Array.from(distribution.entries())
      .map(([airline, data]) => ({
        airline,
        count: data.count,
        avgPrice: Math.round(data.totalPrice / data.count),
        minPrice: data.minPrice,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 airlines
  }, [filteredFlights]);

  if (filteredFlights.length === 0 || airlineData.length === 0) return null;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Flight color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Airlines Distribution
        </Typography>
      </Box>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={airlineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="airline" />
          <YAxis yAxisId="left" orientation="left" label={{ value: 'Flights', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Price ($)', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="count" fill="#2563eb" name="No Of Flights" />
          <Bar yAxisId="right" dataKey="avgPrice" fill="#10b981" name="Avg Price" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};