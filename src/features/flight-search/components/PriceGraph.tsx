
'use client';

import React, { useMemo } from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { TrendingDown } from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useFlightFilters } from '../hooks/useFlightFilters';

export const PriceGraph: React.FC = () => {
  const { filteredFlights } = useFlightFilters();

  const priceGraphData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      let avgPrice = 0;
      if (i === 0) {
        avgPrice =
          filteredFlights.length > 0
            ? Math.round(filteredFlights.reduce((sum, f) => sum + f.price, 0) / filteredFlights.length)
            : 0;
      } else {
        const variance = Math.random() * 100 - 50;
        avgPrice =
          filteredFlights.length > 0
            ? Math.round(filteredFlights.reduce((sum, f) => sum + f.price, 0) / filteredFlights.length + variance)
            : 400 + variance;
      }

      data.push({
        date: date.toISOString().split('T')[0],
        price: avgPrice,
        label: i === 0 ? 'Today' : `${i > 0 ? '+' : ''}${i}d`,
      });
    }

    return data;
  }, [filteredFlights]);

  if (filteredFlights.length === 0) return null;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Price Trends
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Average price by departure date
          </Typography>
        </Box>
        <Chip
          icon={<TrendingDown />}
          label="Best deals today"
          color="success"
          size="small"
        />
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={priceGraphData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="label"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: unknown) => [`${value}`, 'Avg Price']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={3}
            fill="url(#colorPrice)"
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};