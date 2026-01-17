/* eslint-disable  @typescript-eslint/no-explicit-any */
import React from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import flightReducer from '@/features/flight-search/store/flightSlice';
import filterReducer from '@/features/flight-search/store/filterSlice';
import { ThemeProvider } from '@/shared/components/theme/ThemeProvider';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: any;
  store?: any;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        flights: flightReducer,
        filters: filterReducer,
      } as any,
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider>{children}</ThemeProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}