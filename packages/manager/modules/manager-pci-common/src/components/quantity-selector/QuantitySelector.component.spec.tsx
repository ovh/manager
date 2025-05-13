import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { QuantitySelector } from './QuantitySelector.component';
import { wrapper } from '@/wrapperRenders';

describe('QuantitySelector', () => {
  it('renders label correctly', () => {
    const { getByText } = render(
      <QuantitySelector label="Quantity" value={1} onValueChange={() => {}} />,
      { wrapper },
    );
    expect(getByText('Quantity')).toBeInTheDocument();
  });

  it('shows error message when value is below minimum', () => {
    const { getByText } = render(
      <QuantitySelector
        value={0}
        min={1}
        onValueChange={() => {}}
        id="selector"
      />,
      {
        wrapper,
      },
    );
    expect(getByText('common_field_error_min')).toBeInTheDocument();
  });

  it('shows error message when value is above maximum', () => {
    const { getByText } = render(
      <QuantitySelector
        value={6}
        max={5}
        onValueChange={() => {}}
        id="selector"
      />,
    );
    expect(getByText('common_field_error_max')).toBeInTheDocument();
  });

  it('shows error message when value is not a number', () => {
    const { getByText } = render(
      <QuantitySelector value={NaN} onValueChange={() => {}} />,
    );
    expect(getByText('common_field_error_number')).toBeInTheDocument();
  });
});
