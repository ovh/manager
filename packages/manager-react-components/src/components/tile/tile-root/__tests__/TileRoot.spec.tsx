import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CARD_COLOR } from '@ovhcloud/ods-react';
import { TileRoot } from '../TileRoot.component';

describe('TileRoot', () => {
  const defaultProps = {
    title: 'Test Title',
    children: (
      <>
        <dt>Label</dt>
        <dd>Value</dd>
      </>
    ),
  };

  it('should render the component with title and children', () => {
    render(<TileRoot {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Label')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('should render the Card with correct default color (neutral)', () => {
    render(<TileRoot {...defaultProps} data-testid="card" />);
    const card = screen.getByTestId('card');
    expect(card.className).toContain(`${CARD_COLOR.neutral}`);
  });

  it('should allow custom color to be passed', () => {
    render(
      <TileRoot
        {...defaultProps}
        color={CARD_COLOR.information}
        data-testid="card"
      />,
    );
    const card = screen.getByTestId('card');
    expect(card.className).toContain(`${CARD_COLOR.information}`);
  });

  it('should render the TileDivider inside the section', () => {
    render(<TileRoot {...defaultProps} />);
    const separator = screen.getByRole('separator');
    expect(separator).toBeInTheDocument();
  });

  it('should apply default className and merge custom className', () => {
    render(
      <TileRoot
        {...defaultProps}
        className="custom-class extra-padding"
        data-testid="card"
      />,
    );

    const card = screen.getByTestId('card');

    expect(card).toHaveClass('w-full');
    expect(card).toHaveClass('flex-col');
    expect(card).toHaveClass('p-[1rem]');
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('extra-padding');
  });

  it('should render title using Text component with heading4 preset', () => {
    render(<TileRoot {...defaultProps} />);
    const titleElement = screen.getByText('Test Title');

    expect(titleElement.tagName).toBe('H4');
  });

  it('should structure content inside <section> with flex column layout', () => {
    render(<TileRoot {...defaultProps} data-testid="card" />);

    const section = screen.getByTestId('card').firstChild;
    expect(section).toHaveClass('flex', 'flex-col', 'w-full');
  });

  it('should wrap children in <dl> with preset styles (m-0, flex-col)', () => {
    render(<TileRoot {...defaultProps} data-testid="card" />);
    const dlList = screen.getByTestId('card').getElementsByTagName('dl');
    expect(dlList.length).toBe(1);
    expect(dlList[0]).toHaveClass('flex', 'flex-col', 'm-0');
  });
});
