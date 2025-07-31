/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UseMutateFunction } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { CurrencyCode } from '@ovh-ux/manager-react-components';
import Voucher from './Voucher';
import * as useVoucherModule from '../hooks/useVoucher';
import { CartConfiguration } from '@/data/types/cart.type';
import { TEligibilityVoucher } from '@/data/types/payment/eligibility.type';

vi.mock('../hooks/useVoucher');

describe('Voucher component', () => {
  const defaultProps = {
    cartId: 'cart-1',
    itemId: 123,
    voucherConfiguration: undefined as CartConfiguration | undefined,
    setVoucherConfiguration: vi.fn(),
  };

  const defaultMockReturn = {
    voucher: '',
    setVoucher: vi.fn(),
    error: undefined,
    setError: vi.fn(),
    voucherData: undefined as TEligibilityVoucher | undefined,
    isPending: false,
    checkEligibility: (vi.fn() as unknown) as UseMutateFunction<
      TEligibilityVoucher | undefined,
      ApiError,
      string
    >,
    handleRemove: vi.fn(),
  };

  beforeEach(() => {
    vi.spyOn(useVoucherModule, 'useVoucher').mockReturnValue(defaultMockReturn);
  });

  it('disables add button when voucher is empty', async () => {
    render(<Voucher {...defaultProps} />);

    const addVoucherButton = screen.getByTestId('ods-button');

    expect(addVoucherButton).toBeDisabled();
  });

  it('disables input and button when loading', async () => {
    vi.spyOn(useVoucherModule, 'useVoucher').mockReturnValue({
      ...defaultMockReturn,
      isPending: true,
    });

    render(<Voucher {...defaultProps} />);

    const voucherInput = screen.getByTestId('ods-input');
    const addVoucherButton = screen.getByTestId('ods-button');

    expect(voucherInput).toBeDisabled();
    expect(addVoucherButton).toBeDisabled();
  });

  it('calls setVoucher on input change', async () => {
    const setVoucher = vi.fn();
    vi.spyOn(useVoucherModule, 'useVoucher').mockReturnValue({
      ...defaultMockReturn,
      setVoucher,
    });

    render(<Voucher {...defaultProps} />);

    const voucherInput = document.querySelector(
      'input[name="voucher"]',
    ) as Element;

    // Simulate input change event
    fireEvent.change(voucherInput, { target: { value: 'CODE123' } });

    await waitFor(() => {
      expect(setVoucher).toHaveBeenCalledWith('CODE123');
    });
  });

  it('shows error message if error is present', async () => {
    vi.spyOn(useVoucherModule, 'useVoucher').mockReturnValue({
      ...defaultMockReturn,
      error: 'error_code',
    });
    render(<Voucher {...defaultProps} />);
    expect(screen.getByText(/error_code/i)).toBeInTheDocument();
  });

  it('shows the voucher section with the voucher data if voucherData is present', async () => {
    vi.spyOn(useVoucherModule, 'useVoucher').mockReturnValue({
      ...defaultMockReturn,
      voucherData: {
        paymentMethodRequired: false,
        credit: {
          text: '10',
          currencyCode: CurrencyCode.EUR,
          priceInUcents: 1000,
          value: 10,
        },
      },
    });
    const propsWithVoucherConfiguration = {
      ...defaultProps,
      voucherConfiguration: { id: 1 } as CartConfiguration,
    };
    render(<Voucher {...propsWithVoucherConfiguration} />);

    const voucherSection = screen.getByTestId('voucher-section_display');
    expect(voucherSection).toBeVisible();
  });

  it('calls handleRemove when trash button is clicked', async () => {
    const handleRemove = vi.fn();
    vi.spyOn(useVoucherModule, 'useVoucher').mockReturnValue({
      ...defaultMockReturn,
      voucherData: {
        paymentMethodRequired: false,
        credit: {
          text: '10',
          currencyCode: CurrencyCode.EUR,
          priceInUcents: 1000,
          value: 10,
        },
      },
      handleRemove,
    });
    const propsWithVoucherConfiguration = {
      ...defaultProps,
      voucherConfiguration: { id: 1 } as CartConfiguration,
    };

    render(<Voucher {...propsWithVoucherConfiguration} />);

    const removeButton = screen.getByTestId('voucher-section_remove_button');

    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(handleRemove).toHaveBeenCalledWith(1);
    });
  });
});
