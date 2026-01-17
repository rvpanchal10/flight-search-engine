import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AirportAutocomplete } from '../components/AirportAutocomplete';

// Mock fetch globally
global.fetch = jest.fn();

describe('AirportAutocomplete', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the autocomplete input', () => {
    const mockOnChange = jest.fn();

    render(
      <AirportAutocomplete
        label="From"
        value={null}
        onChange={mockOnChange}
        type="origin"
      />
    );

    expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
  });

  it('shows loading state when searching', async () => {
    const mockOnChange = jest.fn();

    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => [],
              }),
            100
          )
        )
    );

    await act(async () => {
      render(
        <AirportAutocomplete
          label="From"
          value={null}
          onChange={mockOnChange}
          type="origin"
        />
      );
    });

    const input = screen.getByLabelText(/from/i);
    await act(async () => {
      await user.type(input, 'JFK');
    });

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('displays airport options after search', async () => {
    const mockAirports = [
      {
        iataCode: 'JFK',
        name: 'John F. Kennedy International',
        city: 'New York',
        country: 'USA',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockAirports,
    });

    const mockOnChange = jest.fn();

    await act(async () => {
      render(
        <AirportAutocomplete
          label="From"
          value={null}
          onChange={mockOnChange}
          type="origin"
        />
      );
    });

    const input = screen.getByLabelText(/from/i);

    await act(async () => {
      await user.type(input, 'JFK');
    });

    expect(
      await screen.findByText(/John F. Kennedy/i)
    ).toBeInTheDocument();
  });

  it('calls onChange with airport object when an option is selected', async () => {
    const mockAirports = [
      {
        iataCode: 'JFK',
        name: 'John F. Kennedy International',
        city: 'New York',
        country: 'USA',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockAirports,
    });

    const mockOnChange = jest.fn();

    await act(async () => {
      render(
        <AirportAutocomplete
          label="From"
          value={null}
          onChange={mockOnChange}
          type="origin"
        />
      );
    });

    const input = screen.getByLabelText(/from/i);

    await act(async () => {
      await user.type(input, 'JFK');
    });

    const option = await screen.findByText(/John F. Kennedy/i);

    await act(async () => {
      await user.click(option);
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        iataCode: 'JFK',
        name: 'John F. Kennedy International',
        city: 'New York',
        country: 'USA',
      })
    );
  });

  it('displays error message when provided', async () => {
    const mockOnChange = jest.fn();

    await act(async () => {
      render(
        <AirportAutocomplete
          label="From"
          value={null}
          onChange={mockOnChange}
          type="origin"
          error="Airport code is required"
        />
      );
    });

    expect(
      screen.getByText('Airport code is required')
    ).toBeInTheDocument();
  });
});
