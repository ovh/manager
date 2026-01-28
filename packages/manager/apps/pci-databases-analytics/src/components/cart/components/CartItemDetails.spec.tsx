import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CartItemDetails from './CartItemDetails.component';
import { CartItemDetail } from '../cart.types';
import { order } from '@/types/catalog';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string | number>): string => {
      return `${key} ${options?.price}`;
    },
  }),
}));
vi.mock('@datatr-ux/uxlib', () => ({
  AccordionContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="accordion-content" className={className}>
      {children}
    </div>
  ),
  Separator: ({ className }: { className?: string }) => (
    <hr data-testid="separator" className={className} />
  ),
}));

vi.mock('@/hooks/usePriceFormatter.hook', () => ({
  usePriceFormatter: ({ currency }: { currency: string }) => (value: number) =>
    `${currency} ${value.toFixed(3)}`,
}));

vi.mock('@/hooks/useLocale', () => ({
  useLocale: () => 'en_GB',
}));

describe('CartItemDetails component', () => {
  const defaultProps = {
    currency: order.CurrencyCodeEnum.USD,
  };

  it('should render all details with names, descriptions, and formatted prices', () => {
    const details: CartItemDetail[] = [
      { name: 'Detail 1', description: 'Description 1', price: 10.5 },
      { name: 'Detail 2', description: 'Description 2', price: 20.75 },
      { name: 'No price item', description: 'Description' },
    ];

    render(<CartItemDetails details={details} {...defaultProps} />);

    expect(screen.getByText('Detail 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('pricing_ht USD 10.500')).toBeInTheDocument();
    expect(screen.getByText('Detail 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
    expect(screen.getByText('pricing_ht USD 20.750')).toBeInTheDocument();
    expect(screen.getByText('No price item')).toBeInTheDocument();
  });

  it('should not display price when price is 0 or undefined', () => {
    const details: CartItemDetail[] = [
      { name: 'Free item', description: 'Price is 0', price: 0 },
      { name: 'Paid item', description: 'Has price', price: 10 },
      { name: 'No price', description: 'Price undefined' },
    ];

    render(<CartItemDetails details={details} {...defaultProps} />);

    expect(screen.getByText('pricing_ht USD 10.000')).toBeInTheDocument();
    // Only 1 price should be displayed
    const priceElements = screen.getAllByText(/USD/);
    expect(priceElements).toHaveLength(1);
  });

  it('should render separators between items and apply correct styling', () => {
    const details: CartItemDetail[] = [
      { name: 'Detail 1' },
      { name: 'Detail 2' },
      { name: 'Detail 3' },
    ];

    render(<CartItemDetails details={details} {...defaultProps} />);

    const separators = screen.getAllByTestId('separator');
    expect(separators).toHaveLength(2); // 3 items = 2 separators

    const separator = separators[0];
    expect(separator).toHaveClass('bg-[#ebebeb]');
    expect(separator).toHaveClass('h-[2px]');
    expect(separator).toHaveClass('mt-3');

    const accordionContent = screen.getByTestId('accordion-content');
    expect(accordionContent).toHaveClass('bg-[--ods-color-neutral-050]');
    expect(accordionContent).toHaveClass('px-6');
    expect(accordionContent).toHaveClass('py-3');
  });
});
