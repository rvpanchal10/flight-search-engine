
import { useMemo } from 'react';
import { Flight } from '@/app/types/global';
import { useAppSelector } from '@/app/lib/redux/hooks';

export const useFlightFilters = () => {
  const flights = useAppSelector((state) => state.flights.flights);

  const filters = useAppSelector((state) => state.filters);

  const filteredFlights = useMemo(() => {
    return flights.filter((flight: Flight) => {
      if (flight.price > filters.maxPrice) return false;

      if (filters.stops !== 'any') {
        const stopsValue = filters.stops === '2+' ? 2 : parseInt(filters.stops);
        if (filters.stops === '2+' && flight.stops < 2) return false;
        if (filters.stops !== '2+' && flight.stops !== stopsValue) return false;
      }

      if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
        return false;
      }

      const departHour = parseInt(flight.departTime.split(':')[0]);
      if (departHour < filters.departTimeRange[0] || departHour > filters.departTimeRange[1]) {
        return false;
      }

      const durationHours = parseFloat(flight.duration);
      if (durationHours > filters.duration) return false;

      return true;
    });
  }, [flights, filters]);

  const uniqueAirlines = useMemo(() => {
    return [...new Set(flights.map((f: Flight) => f.airline))];
  }, [flights]);

  const priceRange = useMemo(() => {
    if (flights.length === 0) return { min: 0, max: 1000 };
    const prices = flights.map((f: Flight) => f.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [flights]);

  return {
    filteredFlights,
    uniqueAirlines,
    priceRange,
  };
};

