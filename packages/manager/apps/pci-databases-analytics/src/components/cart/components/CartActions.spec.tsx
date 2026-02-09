import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CartActions from './CartActions.component';

describe('CartActions component', () => {
  it('should render children correctly', () => {
    render(
      <CartActions>
        <button>Cancel</button>
        <button>Submit</button>
      </CartActions>,
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <CartActions className="justify-end gap-2">
        <button>Action</button>
      </CartActions>,
    );
    const actionsElement = container.firstChild as HTMLElement;
    expect(actionsElement).toHaveClass('flex');
    expect(actionsElement).toHaveClass('p-4');
    expect(actionsElement).toHaveClass('justify-end');
    expect(actionsElement).toHaveClass('gap-2');
  });
});
