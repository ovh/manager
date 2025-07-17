import { describe, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pricing } from './Pricing';
import { usePricing } from '../hooks';
import { TPricing } from '../api/data';

vi.mock('../hooks', async () => {
  const actual = await vi.importActual('../hooks');
  return {
    ...actual,
    usePricing: vi.fn(),
  };
});

describe('Pricing', () => {
  const getPriceDetails = vi.fn();
  const mockPricing: TPricing = { foo: 'bar' } as TPricing;

  beforeEach(() => {
    getPriceDetails.mockReset();
    vi.mocked((usePricing as unknown) as () => any).mockReturnValue({
      getPriceDetails,
    });
  });

  it('renders skeleton when price is falsy', () => {
    getPriceDetails.mockReturnValue(undefined);
    render(<Pricing pricing={mockPricing} />);
    expect(screen.getByTestId('loading')).toBeInTheDocument(); // OsdsSkeleton
  });

  it('renders primary price only', () => {
    getPriceDetails.mockReturnValue({
      primary: '€10',
    });
    render(<Pricing pricing={mockPricing} />);
    expect(screen.getByText('€10')).toBeInTheDocument();
  });

  it('renders primary and secondary with bold', () => {
    getPriceDetails.mockReturnValue({
      primary: '€10',
      secondary: 'HT',
    });
    render(<Pricing pricing={mockPricing} />);
    expect(screen.getByText('(HT)')).toBeInTheDocument();
    expect(screen.getByText('€10')).toHaveClass('font-bold');
  });

  it('renders with interval', () => {
    getPriceDetails.mockReturnValue({
      primary: '€10',
      secondary: 'HT',
      interval: 'month',
    });
    render(<Pricing pricing={mockPricing} />);
    expect(screen.getByText(/\/ month$/)).toBeInTheDocument();
  });
});
