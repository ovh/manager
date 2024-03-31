import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import PriceUnitSwitch from './../../components/price-unit-switch';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('PriceUnitSwitch', () => {
  it('renders hourly button', () => {
    render(<PriceUnitSwitch showMonthly={false} onChange={() => {}} />);
    screen.debug();
    const hourlyButton = screen.getByTestId('pricing_button_hourly');
    expect(hourlyButton).toBeInTheDocument();
    expect(hourlyButton).toHaveTextContent('pricing_button_hourly');
  });

  it('renders monthly button', () => {
    render(<PriceUnitSwitch showMonthly={true} onChange={() => {}} />);
    const monthlyButton = screen.getByTestId('pricing_button_monthly');
    expect(monthlyButton).toBeInTheDocument();
    expect(monthlyButton).toHaveTextContent('pricing_button_monthly');
  });

  
  it('calls onChange with correct value when hourly button clicked', () => {
    screen.debug();
    const mockOnChange = vi.fn();
    render(<PriceUnitSwitch showMonthly={true} onChange={mockOnChange} />);
    const hourlyButton = screen.getByTestId('pricing_button_hourly');
    fireEvent.click(hourlyButton);
    expect(mockOnChange).toHaveBeenCalledWith(false);
    screen.debug();
  });

  it('calls onChange with correct value when monthly button clicked', () => {
    const mockOnChange = vi.fn();
    render(<PriceUnitSwitch showMonthly={false} onChange={mockOnChange} />);
    const monthlyButton = screen.getByTestId('pricing_button_monthly');
    fireEvent.click(monthlyButton);
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });
});