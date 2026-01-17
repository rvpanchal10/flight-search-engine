import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { Airport } from '@/app/types/global';

export const useAirportSearch = () => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const searchAirports = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setAirports([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/airports/search?query=${encodeURIComponent(query)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setAirports(data);
      }
    } catch (error) {
      console.error('Airport search error:', error);
      setAirports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      searchAirports(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, searchAirports]);

  return {
    airports,
    loading,
    searchTerm,
    setSearchTerm,
    searchAirports,
  };
};