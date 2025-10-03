import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TileItemRoot } from '../TileItemRoot.component';

describe('TileItemRoot', () => {
  it('should render without children', () => {
    render(<TileItemRoot data-testid="tile-root-item"></TileItemRoot>);
    const container = screen.getByTestId('tile-root-item');
    expect(container).toBeInTheDocument();
    expect(container.tagName).toBe('DIV');
    expect(container).toHaveClass('flex', 'flex-col', 'gap-1');
  });

  it('should render with multiple children', () => {
    render(
      <TileItemRoot data-testid="tile-root-item">
        <dt>Label</dt>
        <dd>Value</dd>
      </TileItemRoot>,
    );

    expect(screen.getByText('Label')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });
});
