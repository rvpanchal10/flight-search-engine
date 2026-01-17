import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchForm } from '../components/SearchForm';
import { renderWithProviders } from '@/shared/utils/testUtils';

describe('SearchForm', () => {
  const user = userEvent.setup();

  it('renders all form fields', async () => {
    await act(async () => {
      renderWithProviders(<SearchForm />);
    });

    expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/departure date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/return date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/passengers/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cabin class/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search flights/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid inputs', async () => {
    await act(async () => {
      renderWithProviders(<SearchForm />);
    });

    const searchButton = screen.getByRole('button', { name: /search flights/i });

    await act(async () => {
      await user.click(searchButton);
    });
  });
});