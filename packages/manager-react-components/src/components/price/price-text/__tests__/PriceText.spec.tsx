import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriceText } from '../PriceText.component';
import { PriceTextPreset } from '../PriceText.props';

describe('PriceText Component', () => {
  const defaultProps = {
    price: '€9.99',
  };

  it('should render price with BASE preset by default', () => {
    render(<PriceText {...defaultProps} />);
    const span = screen.getByText('€9.99').parentElement;

    expect(span).toBeInTheDocument();
    expect(span).toHaveClass('font-semibold');
    expect(span).toHaveClass('text-[--ods-color-text]');
    expect(span).toHaveClass('text-[16px]');
    expect(span).toHaveClass('leading-[20px]');
  });

  it('should render price with WITH_TAX preset', () => {
    render(<PriceText {...defaultProps} preset={PriceTextPreset.WITH_TAX} />);
    const span = screen.getByText('€9.99').parentElement;

    expect(screen.getByText('(', { exact: false })).toBeInTheDocument();
    expect(screen.getByText(')', { exact: false })).toBeInTheDocument();

    expect(span).toBeInTheDocument();
    expect(span).toHaveClass('text-[--ods-color-neutral-500]');
    expect(span).toHaveClass('text-[14px]');
    expect(span).toHaveClass('leading-[18px]');
  });

  it('should render label when provided with BASE preset', () => {
    render(<PriceText {...defaultProps} label="excl. VAT" />);
    expect(screen.getByText('excl. VAT')).toBeInTheDocument();
    expect(screen.getByText('excl. VAT')).toHaveClass('mr-1');
  });

  it('should render label without mr-1 when using WITH_TAX preset', () => {
    render(
      <PriceText
        {...defaultProps}
        label="incl. tax"
        preset={PriceTextPreset.WITH_TAX}
      />,
    );
    expect(screen.getByText('incl. tax')).toBeInTheDocument();
    expect(screen.queryByText('incl. tax')?.classList.contains('mr-1')).toBe(
      false,
    );
  });

  it('should render intervalUnitText only with BASE preset', () => {
    render(<PriceText {...defaultProps} intervalUnitText="/mo" />);
    expect(screen.getByText('/mo')).toBeInTheDocument();
  });

  it('should NOT render intervalUnitText with non-BASE preset', () => {
    render(
      <PriceText
        {...defaultProps}
        intervalUnitText="/mo"
        preset={PriceTextPreset.WITH_TAX}
      />,
    );
    expect(screen.queryByText('/mo')).not.toBeInTheDocument();
  });

  it('should apply correct classnames to price span (always has mr-1)', () => {
    render(<PriceText {...defaultProps} />);
    const priceSpan = screen.getByText('€9.99');

    expect(priceSpan).toBeInTheDocument();
    expect(priceSpan).toHaveClass('mr-1');
  });

  it('should render all parts together correctly', () => {
    render(
      <PriceText
        {...defaultProps}
        preset={PriceTextPreset.WITH_TAX}
        label="incl. VAT"
        intervalUnitText="/mo"
      />,
    );

    expect(screen.getByText('(', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('€9.99')).toBeInTheDocument();
    expect(screen.getByText('incl. VAT')).toBeInTheDocument();
    expect(screen.queryByText('/mo', { exact: false })).not.toBeInTheDocument();
    expect(screen.getByText(')', { exact: false })).toBeInTheDocument();
  });
});
