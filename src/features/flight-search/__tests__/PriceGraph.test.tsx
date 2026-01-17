import { screen } from '@testing-library/react';
import { PriceGraph } from '../components/PriceGraph';
import { renderWithProviders } from '@/shared/utils/testUtils';

describe('PriceGraph', () => {
  it('renders nothing when no flights are available', () => {
    const { container } = renderWithProviders(<PriceGraph />);
    expect(container.firstChild).toBeNull();
  });

  it('renders price graph when flights are available', () => {
    renderWithProviders(<PriceGraph />, {
      preloadedState: {
        flights: {
          flights: [
            {
              id: '1',
              price: 500,
              airline: 'Delta',
              duration: '5.5',
              stops: 0,
              departTime: '08:00',
              arriveTime: '11:30',
            },
          ],
          loading: false,
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

    expect(screen.getByText('Price Trends')).toBeInTheDocument();
    expect(
      screen.getByText(/Average price by departure date/i)
    ).toBeInTheDocument();
  });
});