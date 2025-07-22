import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TileItemTerm } from '../TileItemTerm.component';

describe('TileItemTerm', () => {
  it('should render the term text inside a Text component with label preset', () => {
    render(<TileItemTerm label="Domain Name" />);

    const textElement = screen.getByText('Domain Name');
    expect(textElement).toBeInTheDocument();

    expect(textElement.tagName).toBe('LABEL');
    expect(textElement).toHaveClass('font-bold');
  });

  it('should render inside a <dt> element', () => {
    render(<TileItemTerm label="Status" data-testid="tile-item-term" />);

    const dt = screen.getByTestId('tile-item-term');
    expect(dt.tagName).toBe('DT');
    expect(dt).toHaveClass('flex', 'justify-between');
  });

  it('should not render actions when not provided', () => {
    render(<TileItemTerm label="Status" data-testid="tile-item-term" />);

    const dt = screen.getByTestId('tile-item-term');
    expect(dt.children.length).toBe(1);
  });

  it('should render actions when provided (e.g. button or link)', () => {
    render(
      <TileItemTerm
        data-testid="tile-item-term"
        label="IP Address"
        actions={<button data-testid="action-button">Edit</button>}
      />,
    );

    const actionButton = screen.getByTestId('action-button');
    expect(actionButton).toBeInTheDocument();
    expect(actionButton).toHaveTextContent('Edit');

    const dt = screen.getByTestId('tile-item-term');
    expect(dt).toContainElement(actionButton);
  });
});
