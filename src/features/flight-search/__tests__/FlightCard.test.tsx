import { render, screen } from '@testing-library/react';
import { FlightCard } from '../components/FlightCard';
import { ThemeProvider } from '@/shared/components/theme/ThemeProvider';

const mockFlight = {
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
  segments: [
    {
      departure: { iataCode: 'JFK', at: '2026-02-15T08:00:00' },
      arrival: { iataCode: 'LAX', at: '2026-02-15T11:30:00' },
      carrierCode: 'DL',
      flightNumber: '123',
      aircraft: 'Boeing 737',
      duration: 'PT5H30M',
    },
  ],
};

describe('FlightCard', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('renders flight information correctly', () => {
    renderWithTheme(<FlightCard flight={mockFlight} />);

    expect(screen.getByText('Delta')).toBeInTheDocument();
    expect(screen.getByText('DL123')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('08:00')).toBeInTheDocument();
    expect(screen.getByText('11:30')).toBeInTheDocument();
  });

  it('displays nonstop for zero stops', () => {
    renderWithTheme(<FlightCard flight={mockFlight} />);
    expect(screen.getByText(/Nonstop/i)).toBeInTheDocument();
  });

  it('displays stops correctly', () => {
    const flightWithStops = { ...mockFlight, stops: 1 };
    renderWithTheme(<FlightCard flight={flightWithStops} />);
    expect(screen.getByText(/1 Stop/i)).toBeInTheDocument();
  });

  it('displays cabin class', () => {
    renderWithTheme(<FlightCard flight={mockFlight} />);
    expect(screen.getByText('ECONOMY')).toBeInTheDocument();
  });

  it('shows seats available', () => {
    renderWithTheme(<FlightCard flight={mockFlight} />);
    expect(screen.getByText('10 seats left')).toBeInTheDocument();
  });

  it('displays select button', () => {
    renderWithTheme(<FlightCard flight={mockFlight} />);
    expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument();
  });
});