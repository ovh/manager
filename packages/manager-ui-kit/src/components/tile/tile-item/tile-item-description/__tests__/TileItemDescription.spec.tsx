import { render, screen } from '@testing-library/react';
import { describe, expect, it, vitest } from 'vitest';

import { TileItemDescription } from '../TileItemDescription.component';

vitest.mock('../../../tile-divider/TileDivider.component', () => ({
  TileDivider: () => <hr data-testid="tile-divider" />,
}));

describe('TileItemDescription', () => {
  it('should render inside a <dd> element with preset margin', () => {
    render(<TileItemDescription label="Test description" />);

    const dd = screen.getByRole('definition');
    expect(dd).toBeInTheDocument();
    expect(dd.tagName).toBe('DD');
    expect(dd).toHaveClass('m-0');
  });

  it('should render the description inside a Text component with preset=span', () => {
    render(<TileItemDescription label="This is a network setting." />);

    const textElement = screen.getByText('This is a network setting.');
    expect(textElement).toBeInTheDocument();
    expect(textElement.tagName).toBe('SPAN');
  });

  it('should not render description when not provided and renders divider by default', () => {
    render(<TileItemDescription />);
    const dd = screen.getByRole('definition');
    expect(dd.getElementsByTagName('span').length).toBe(0);
    expect(dd.children.length).toBeLessThanOrEqual(1);
    expect(dd.children[0].tagName).toBe('HR');
  });

  it('should render children if provided', () => {
    render(
      <TileItemDescription>
        <code>/var/www</code>
      </TileItemDescription>,
    );

    const codeElement = screen.getByText('/var/www');
    expect(codeElement.tagName).toBe('CODE');
    expect(screen.getByRole('definition')).toContainElement(codeElement);
  });

  it('should conditionally show/hide divider based on prop', () => {
    const { rerender } = render(<TileItemDescription label="Desc" divider={true} />);

    expect(screen.getByTestId('tile-divider')).toBeInTheDocument();

    rerender(<TileItemDescription label="Desc" divider={false} />);
    expect(screen.queryByTestId('tile-divider')).not.toBeInTheDocument();
  });

  it('should render description and children together', () => {
    render(
      <TileItemDescription label="Hosted on">
        <strong>Server A</strong>
      </TileItemDescription>,
    );

    expect(screen.getByText('Hosted on')).toBeInTheDocument();
    expect(screen.getByText('Server A')).toBeInTheDocument();
  });
});
