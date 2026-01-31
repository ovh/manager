import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Cart from './Cart.component';

describe('Cart component', () => {
  it('should render children correctly', () => {
    render(
      <Cart>
        <div>Test Content</div>
      </Cart>,
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Cart className="custom-class bg-red-500">
        <div>Content</div>
      </Cart>,
    );
    const cartElement = container.firstChild as HTMLElement;
    expect(cartElement).toHaveClass('rounded-md');
    expect(cartElement).toHaveClass('border');
    expect(cartElement).toHaveClass('custom-class');
    expect(cartElement).toHaveClass('bg-red-500');
  });
});
