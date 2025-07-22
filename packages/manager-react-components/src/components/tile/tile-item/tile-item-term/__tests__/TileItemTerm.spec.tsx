import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { TileItemTerm } from '../TileItemTerm.component';

describe('TileItemTerm', () => {
  it('should render the term text inside a Text component with label preset', () => {
    render(<TileItemTerm label="Domain Name" />);

    const textElement = screen.getByText('Domain Name');
    expect(textElement).toBeInTheDocument();

    expect(textElement.tagName).toBe('SPAN');
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

  it('should render tooltip when provided', () => {
    const tooltipMessage = 'Tooltip for IP address';
    const { container } = render(
      <TileItemTerm
        data-testid="tile-item-term"
        label="IP Address"
        tooltip={tooltipMessage}
        actions={<button data-testid="action-button">Edit</button>}
      />,
    );
    const tooltipElement = container.querySelector(
      'span[data-scope="tooltip"]',
    );
    expect(tooltipElement).toBeInTheDocument();

    userEvent.hover(tooltipElement);
    expect(screen.getByText(tooltipMessage)).toBeInTheDocument();
  });

  it('should render tooltip when not provided', () => {
    const { container } = render(
      <TileItemTerm
        data-testid="tile-item-term"
        label="IP Address"
        actions={<button data-testid="action-button">Edit</button>}
      />,
    );
    expect(
      container.querySelector('span[data-scope="tooltip"]'),
    ).not.toBeInTheDocument();
  });
});
