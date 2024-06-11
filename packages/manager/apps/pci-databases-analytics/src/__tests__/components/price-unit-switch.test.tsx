import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import PriceUnitSwitch from '@/components/price-unit-switch';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('PriceUnitSwitch component', () => {
  it('renders hourly button', () => {
    render(<PriceUnitSwitch showMonthly={false} onChange={() => {}} />);
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
    const mockOnChange = vi.fn();
    render(<PriceUnitSwitch showMonthly={true} onChange={mockOnChange} />);
    const hourlyButton = screen.getByTestId('pricing_button_hourly');
    fireEvent.click(hourlyButton);
    expect(mockOnChange).toHaveBeenCalledWith(false);
  });

  it('calls onChange with correct value when monthly button clicked', () => {
    const mockOnChange = vi.fn();
    render(<PriceUnitSwitch showMonthly={false} onChange={mockOnChange} />);
    const monthlyButton = screen.getByTestId('pricing_button_monthly');
    fireEvent.click(monthlyButton);
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });
});
