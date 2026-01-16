import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CartItemHeader from './CartItemHeader.component';

vi.mock('@datatr-ux/uxlib', () => ({
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
}));

describe('CartItemHeader component', () => {
  it('should render children correctly as button element', () => {
    render(
      <CartItemHeader>
        <span>Title</span>
        <span>Subtitle</span>
        <span>Price</span>
      </CartItemHeader>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();

    const trigger = screen.getByTestId('accordion-trigger');
    expect(trigger.tagName).toBe('BUTTON');
  });

  it('should apply base and state-dependent styling classes', () => {
    render(
      <CartItemHeader>
        <div>Content</div>
      </CartItemHeader>,
    );
    const trigger = screen.getByTestId('accordion-trigger');
    expect(trigger).toHaveClass('border');
    expect(trigger).toHaveClass('border-gray-200');
    expect(trigger).toHaveClass('p-4');
    expect(trigger).toHaveClass('hover:no-underline');
    expect(trigger).toHaveClass('data-[state=open]:rounded-t-sm');
    expect(trigger).toHaveClass('data-[state=closed]:rounded-sm');
  });
});
