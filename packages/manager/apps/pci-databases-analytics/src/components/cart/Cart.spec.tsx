import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Cart from './Cart.component';
import { CartItem as CartItemType } from './cart.types';
import { order } from '@/types/catalog';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string | number>): string => {
      return `${key} ${options?.price}`;
    },
  }),
}));
vi.mock('@/hooks/usePriceFormatter.hook', () => ({
  usePriceFormatter: ({ currency }: { locale: string; currency: string }) => (
    value: number,
  ) => `${currency} ${value.toFixed(3)}`,
}));
vi.mock('@/hooks/useLocale', () => ({
  useLocale: () => 'en_GB',
}));

vi.mock('@datatr-ux/uxlib', () => ({
  Accordion: ({
    children,
    defaultValue,
  }: {
    children: React.ReactNode;
    defaultValue: string[];
  }) => (
    <div data-testid="accordion" data-default-value={defaultValue.join(',')}>
      {children}
    </div>
  ),
  AccordionItem: ({
    children,
    value,
    className,
  }: {
    children: React.ReactNode;
    value: string;
    className?: string;
  }) => (
    <div data-testid={`accordion-item-${value}`} className={className}>
      {children}
    </div>
  ),
  AccordionTrigger: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <button data-testid="accordion-trigger" className={className}>
      {children}
    </button>
  ),
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

describe('Cart component', () => {
  const defaultProps = {
    items: [] as CartItemType[],
    actionButtons: <button>Submit</button>,
    currency: order.CurrencyCodeEnum.USD,
    totalText: 'Total',
  };

  it('should render basic cart structure with styling and action buttons', () => {
    const { container, rerender } = render(<Cart {...defaultProps} />);

    // Check styling
    const cartElement = container.querySelector('.sticky.top-4.h-fit');
    expect(cartElement).toBeInTheDocument();
    expect(container.querySelector('.rounded-md.border')).toBeInTheDocument();

    // Check single button
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();

    // Check multiple buttons
    const actionButtons = (
      <>
        <button>Cancel</button>
        <button>Save</button>
        <button>Submit</button>
      </>
    );
    rerender(<Cart {...defaultProps} actionButtons={actionButtons} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('should render items with titles, names, details, and formatted prices', () => {
    const items: CartItemType[] = [
      {
        id: '1',
        title: 'service one',
        name: 'prod-service-01',
        details: [
          { name: 'CPU', description: '2 cores', price: 10.5 },
          { name: 'Memory', description: '4GB RAM', price: 20.75 },
          { name: 'No price item', description: 'Free' },
        ],
        expanded: false,
      },
      {
        id: '2',
        title: 'Service Two',
        details: [
          { name: 'Storage', description: '50GB', price: 0 },
          { name: 'Network', price: 5 },
        ],
        expanded: false,
      },
    ];

    const { container } = render(<Cart {...defaultProps} items={items} />);

    // Check titles are uppercased
    expect(screen.getByText('SERVICE ONE')).toBeInTheDocument();
    expect(screen.getByText('SERVICE TWO')).toBeInTheDocument();

    // Check name when provided
    expect(screen.getByText('prod-service-01')).toBeInTheDocument();

    // Check no label when name not provided
    const labels = container.querySelectorAll('label');
    expect(labels.length).toBe(1); // Only one item has a name

    // Check details and descriptions
    expect(screen.getByText('CPU')).toBeInTheDocument();
    expect(screen.getByText('2 cores')).toBeInTheDocument();
    expect(screen.getByText('Memory')).toBeInTheDocument();
    expect(screen.getByText('4GB RAM')).toBeInTheDocument();
    expect(screen.getByText('No price item')).toBeInTheDocument();
    expect(screen.getByText('Storage')).toBeInTheDocument();
    expect(screen.getByText('Network')).toBeInTheDocument();

    // Check formatted prices (not zero or undefined)
    expect(screen.getByText('pricing_ht USD 10.500')).toBeInTheDocument();
    expect(screen.getByText('pricing_ht USD 20.750')).toBeInTheDocument();
    expect(screen.getByText('pricing_ht USD 5.000')).toBeInTheDocument();
    // Zero price should not be displayed
    expect(screen.queryByText('pricing_ht USD 0.000')).not.toBeInTheDocument();
  });

  it('should calculate total price correctly and support different currencies', () => {
    const items: CartItemType[] = [
      {
        id: '1',
        title: 'Service 1',
        details: [
          { name: 'Detail 1', price: 10 },
          { name: 'Detail 2', price: 20 },
          { name: 'Detail 3' }, // undefined price
        ],
        expanded: false,
      },
      {
        id: '2',
        title: 'Service 2',
        details: [
          { name: 'Detail 4', price: 15 },
          { name: 'Detail 5', price: 0 }, // zero price
        ],
        expanded: false,
      },
    ];

    const { rerender } = render(<Cart {...defaultProps} items={items} />);

    // Check total calculation (10 + 20 + 0 + 15 + 0 = 45)
    expect(screen.getByText('total_hour_label undefined')).toBeInTheDocument();
    expect(screen.getByText('pricing_ht USD 45.000')).toBeInTheDocument();

    // Check with empty items
    rerender(<Cart {...defaultProps} items={[]} />);
    expect(screen.getAllByText('pricing_ht USD 0.000')).toHaveLength(2); // hour + monthly total
    // Check different locale and currency
    const euroItems: CartItemType[] = [
      {
        id: '1',
        title: 'Service',
        details: [{ name: 'Detail', price: 25.5 }],
        expanded: false,
      },
    ];
    rerender(
      <Cart
        items={euroItems}
        actionButtons={<button>Submit</button>}
        currency={order.CurrencyCodeEnum.EUR}
      />,
    );
    expect(screen.getAllByText('pricing_ht EUR 25.500')).toHaveLength(2); // detail + total
  });

  it('should integrate all sub-components with accordion, separators, and expanded state', () => {
    const items: CartItemType[] = [
      {
        id: '1',
        title: 'Database Service',
        name: 'prod-db-01',
        details: [
          { name: 'Flavor', description: 'db1-7', price: 0.5 },
          { name: 'Storage', description: '50GB', price: 0.1 },
          { name: 'Backup', description: 'Daily', price: 0.2 },
        ],
        expanded: true,
      },
      {
        id: '2',
        title: 'Network Service',
        details: [{ name: 'Bandwidth', price: 0.3 }],
        expanded: false,
      },
      {
        id: '3',
        title: 'Monitoring',
        name: 'prod-monitoring',
        details: [{ name: 'Metrics', price: 0.1 }],
        expanded: true,
      },
    ];

    render(<Cart {...defaultProps} items={items} />);

    // Check accordion with expanded items as default
    const accordion = screen.getByTestId('accordion');
    expect(accordion).toHaveAttribute('data-default-value', '1,3');

    // Check accordion items, triggers, and content
    expect(screen.getByTestId('accordion-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-item-3')).toBeInTheDocument();

    const triggers = screen.getAllByTestId('accordion-trigger');
    expect(triggers).toHaveLength(3);

    const contents = screen.getAllByTestId('accordion-content');
    expect(contents).toHaveLength(3);

    // Check separators (3 details in first item = 2 separators)
    const separators = screen.getAllByTestId('separator');
    expect(separators.length).toBeGreaterThan(0);

    // Check all sub-components are integrated
    expect(screen.getByText('DATABASE SERVICE')).toBeInTheDocument();
    expect(screen.getByText('prod-db-01')).toBeInTheDocument();
    expect(screen.getByText('Flavor')).toBeInTheDocument();
    expect(screen.getByText('db1-7')).toBeInTheDocument();

    // Check total price calculation (0.5 + 0.1 + 0.2 + 0.3 + 0.1 = 1.2)
    expect(screen.getByText('pricing_ht USD 1.200')).toBeInTheDocument();

    // Check action button
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
});
