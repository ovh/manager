import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TileDivider } from '../TileDivider.component';

const renderDivider = ({ ...props }) => {
  render(<TileDivider data-testid="tile-divider" {...props} />);
};

describe('TileDivider', () => {
  it('should render the Divider component', () => {
    renderDivider({});
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });

  it('should forward additional HTML attributes correctly', () => {
    renderDivider({
      id: 'custom-divider',
      className: 'extra-class',
    });

    const divider = screen.getByTestId('tile-divider');
    expect(divider).toHaveAttribute('id', 'custom-divider');
    expect(divider).toHaveClass('extra-class');
  });

  it('should render without errors when no props are passed', () => {
    expect(() => render(<TileDivider />)).not.toThrow();
  });
});
