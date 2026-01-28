import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CartContent from './CartContent.component';
import { CartItem } from '../cart.types';

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
}));

describe('CartContent component', () => {
  const mockRenderCartItem = vi.fn((item: CartItem) => (
    <div key={item.id} data-testid={`cart-item-${item.id}`}>
      {item.title}
    </div>
  ));

  const mockItems: CartItem[] = [
    {
      id: '1',
      title: 'Item 1',
      name: 'First Item',
      details: [{ name: 'Detail 1', description: 'Description 1', price: 100 }],
      expanded: true,
    },
    {
      id: '2',
      title: 'Item 2',
      name: 'Second Item',
      details: [{ name: 'Detail 2', description: 'Description 2', price: 200 }],
      expanded: false,
    },
    {
      id: '3',
      title: 'Item 3',
      details: [{ name: 'Detail 3' }],
      expanded: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all items using renderCartItem with correct data', () => {
    render(
      <CartContent items={mockItems} renderCartItem={mockRenderCartItem} />,
    );

    expect(mockRenderCartItem).toHaveBeenCalledTimes(3);
    expect(mockRenderCartItem).toHaveBeenCalledWith(mockItems[0]);
    expect(mockRenderCartItem).toHaveBeenCalledWith(mockItems[1]);
    expect(mockRenderCartItem).toHaveBeenCalledWith(mockItems[2]);
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-3')).toBeInTheDocument();
  });

  it('should set accordion defaultValue with expanded items only', () => {
    render(
      <CartContent items={mockItems} renderCartItem={mockRenderCartItem} />,
    );

    const accordion = screen.getByTestId('accordion');
    expect(accordion).toHaveAttribute('data-default-value', '1,3');
  });
});
