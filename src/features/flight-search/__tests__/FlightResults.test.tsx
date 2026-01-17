import { screen } from '@testing-library/react';
import { FlightResults } from '../components/FlightResults';
import { renderWithProviders } from '@/shared/utils/testUtils';

describe('FlightResults', () => {
  it('shows initial state before search', () => {
    renderWithProviders(<FlightResults />);
    expect(screen.getByText('Find Your Perfect Flight')).toBeInTheDocument();
  });

  it('shows loading state during search', () => {
    renderWithProviders(<FlightResults />, {
      preloadedState: {
        flights: {
          flights: [],
          loading: true,
          error: null,
          searched: true,
          searchParams: null,
        },
        filters: {
          maxPrice: 1000,
          stops: 'any',
          airlines: [],
          departTimeRange: [0, 24],
          duration: 24,
        },
      },
    });

    expect(screen.getByText('Finding the best flights...')).toBeInTheDocument();
  });

  it('shows error state on error', () => {
    renderWithProviders(<FlightResults />, {
      preloadedState: {
        flights: {
          flights: [],
          loading: false,
          error: 'Failed to fetch flights',
          searched: true,
          searchParams: null,
        },
        filters: {
          maxPrice: 1000,
          stops: 'any',
          airlines: [],
          departTimeRange: [0, 24],
          duration: 24,
        },
      },
    });

    expect(screen.getByText(/Oops! Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch flights')).toBeInTheDocument();
  });

  it('renders flights when available', () => {
    renderWithProviders(<FlightResults />, {
      preloadedState: {
        flights: {
          flights: [
            {
              id: '1',
              airline: 'Delta',
              flightNumber: 'DL123',
              price: 500,
              currency: 'USD',
              stops: 0,
              duration: '5.5',
              departTime: '08:00',
              arriveTime: '11:30',
              departDate: '2026-02-15',
              arriveDate: '2026-02-15',
              cabinClass: 'ECONOMY',
              seatsAvailable: 10,
              segments: [],
            },
          ],
          loading: false,
          error: null,
          searched: true,
          searchParams: {
            origin: 'JFK',
            destination: 'LAX',
            departDate: '2026-02-15',
            passengers: 1,
            cabinClass: 'ECONOMY',
          },
        },
        filters: {
          maxPrice: 1000,
          stops: 'any',
          airlines: [],
          departTimeRange: [0, 24],
          duration: 24,
        },
      },
    });

    expect(screen.getByText('1 Flight Found')).toBeInTheDocument();
    expect(screen.getByText('DL123')).toBeInTheDocument();
  });
});