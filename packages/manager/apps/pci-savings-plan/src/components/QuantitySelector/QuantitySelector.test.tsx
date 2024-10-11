import React from 'react';
import { vi, describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import QuantitySelector, { MAX_QUANTITY } from './QuantitySelector';
import '@testing-library/jest-dom';

import { render } from '@/utils/testProvider';

const defaultProps = {
  quantity: 1,
  onMinusClick: vi.fn(),
  onPlusClick: vi.fn(),
  onChangeQuantity: vi.fn(),
};

const setupSpecTest = async (props = defaultProps) =>
  render(<QuantitySelector {...props} />);

describe('QuantitySelector', () => {
  it('should render the quantity input with the correct value', async () => {
    await setupSpecTest();
    const input = screen.getByTestId('input-quantity');
    expect(input).toHaveValue(defaultProps.quantity);
  });

  it('should call onMinusClick when minus button is clicked', async () => {
    await setupSpecTest();
    const minusButton = screen.getByTestId('minus-button');
    fireEvent.click(minusButton);
    expect(defaultProps.onMinusClick).toHaveBeenCalled();
  });

  it('should call onPlusClick when plus button is clicked', async () => {
    await setupSpecTest();
    const plusButton = screen.getByTestId('plus-button');
    fireEvent.click(plusButton);
    expect(defaultProps.onPlusClick).toHaveBeenCalled();
  });

  it('should call onChangeQuantity with the correct value when input changes', async () => {
    await setupSpecTest();
    const input = screen.getByTestId('input-quantity');
    fireEvent.change(input, { target: { value: '5' } });
    expect(defaultProps.onChangeQuantity).toHaveBeenCalledWith(5);
  });
  it('should not call onChangeQuantity with a value greater than MAX_QUANTITY', async () => {
    await setupSpecTest();
    const input = screen.getByTestId('input-quantity');
    fireEvent.change(input, { target: { value: MAX_QUANTITY + 1 } });
    expect(defaultProps.onChangeQuantity).not.toHaveBeenCalledWith(
      MAX_QUANTITY + 1,
    );
  });
});
