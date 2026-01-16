import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CartItem from './CartItem.component';

vi.mock('@datatr-ux/uxlib', () => ({
  AccordionItem: ({
    children,
    value,
    className,
  }: {
    children: React.ReactNode;
    value: string;
    className?: string;
  }) => (
    <div data-testid="accordion-item" data-value={value} className={className}>
      {children}
    </div>
  ),
}));

describe('CartItem component', () => {
  it('should render children correctly and pass value prop to AccordionItem', () => {
    render(
      <CartItem value="test-value">
        <div>Header</div>
        <div>Body</div>
        <div>Footer</div>
      </CartItem>,
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();

    const accordionItem = screen.getByTestId('accordion-item');
    expect(accordionItem).toHaveAttribute('data-value', 'test-value');
  });

  it('should apply custom className to AccordionItem', () => {
    render(
      <CartItem value="item-1">
        <div>Content</div>
      </CartItem>,
    );
    const accordionItem = screen.getByTestId('accordion-item');
    expect(accordionItem).toHaveClass('border-none');
    expect(accordionItem).toHaveClass('[&>button]:rounded-t-sm');
  });
});
