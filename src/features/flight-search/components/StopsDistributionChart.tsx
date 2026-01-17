
'use client';

import React, { useMemo } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFlightFilters } from '../hooks/useFlightFilters';
import { Layers } from '@mui/icons-material';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export const StopsDistributionChart: React.FC = () => {
  const { filteredFlights } = useFlightFilters();

  const stopsData = useMemo(() => {
    const distribution = new Map<number, { count: number; totalPrice: number }>();

    filteredFlights.forEach((flight) => {
      const existing = distribution.get(flight.stops);
      if (existing) {
        existing.count += 1;
        existing.totalPrice += flight.price;
      } else {
        distribution.set(flight.stops, {
          count: 1,
          totalPrice: flight.price,
        });
      }
    });

    const total = filteredFlights.length;

    return Array.from(distribution.entries())
      .map(([stops, data]) => ({
        name: stops === 0 ? 'Nonstop' : `${stops} ${stops === 1 ? 'Stop' : 'Stops'}`,
        value: data.count,
        avgPrice: Math.round(data.totalPrice / data.count),
        percentage: Math.round((data.count / total) * 100),
      }))
      .sort((a, b) => {
        const stopsA = a.name === 'Nonstop' ? 0 : parseInt(a.name);
        const stopsB = b.name === 'Nonstop' ? 0 : parseInt(b.name);
        return stopsA - stopsB;
      });
  }, [filteredFlights]);

  if (filteredFlights.length === 0) return null;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Layers color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Flights by Number of Stops
        </Typography>
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={stopsData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {stopsData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name, props) => [`${value} flights (Avg: ${props.payload.avgPrice})`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};
