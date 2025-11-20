import { UseMutateFunction } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CurrencyCode } from '@ovh-ux/manager-react-components';

import { CartConfiguration } from '@/data/models/Cart.type';
import { TEligibilityVoucher } from '@/data/models/Eligibility.type';

import * as useVoucherModule from '../../../hooks/useVoucher';
import Voucher from '../Voucher';

type ApiError = AxiosError<{ message: string }>;

vi.mock('../../hooks/useVoucher');

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
    checkEligibility: vi.fn() as unknown as UseMutateFunction<
      TEligibilityVoucher | undefined,
      ApiError,
      string
    >,
    handleRemove: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (
      vi.spyOn(useVoucherModule, 'useVoucher') as ReturnType<typeof vi.spyOn> & {
        mockReturnValue: (value: typeof defaultMockReturn) => void;
      }
    ).mockReturnValue(defaultMockReturn);
  });

  it('disables add button when voucher is empty', () => {
    render(<Voucher {...defaultProps} />);

    const addVoucherButton = document.querySelector(
      'ods-button[label="pci_projects_new_voucher_form_add"]',
    ) as Element;

    expect(addVoucherButton).toHaveAttribute('is-disabled', 'true');
  });

  it('disables input and button when loading', () => {
    (
      vi.spyOn(useVoucherModule, 'useVoucher') as ReturnType<typeof vi.spyOn> & {
        mockReturnValue: (value: typeof defaultMockReturn & { isPending: boolean }) => void;
      }
    ).mockReturnValue({
      ...defaultMockReturn,
      isPending: true,
    });

    render(<Voucher {...defaultProps} />);

    const voucherInput = document.querySelector('ods-input[name="voucher"]') as Element;

    const addVoucherButton = document.querySelector(
      'ods-button[label="pci_projects_new_voucher_form_add"]',
    ) as Element;

    expect(voucherInput).toHaveAttribute('is-disabled', 'true');
    expect(addVoucherButton).toHaveAttribute('is-disabled', 'true');
  });

  it('calls setVoucher on input change', async () => {
    const setVoucher = vi.fn();
    (
      vi.spyOn(useVoucherModule, 'useVoucher') as ReturnType<typeof vi.spyOn> & {
        mockReturnValue: (
          value: typeof defaultMockReturn & { setVoucher: ReturnType<typeof vi.fn> },
        ) => void;
      }
    ).mockReturnValue({
      ...defaultMockReturn,
      setVoucher,
    });

    render(<Voucher {...defaultProps} />);

    const voucherInput = document.querySelector('ods-input[name="voucher"]') as Element;

    // Simulate ODS input change event
    fireEvent(
      voucherInput,
      new CustomEvent('odsChange', {
        detail: { value: 'CODE123' },
      }),
    );

    await waitFor(() => {
      expect(setVoucher).toHaveBeenCalledWith('CODE123');
    });
  });

  it('shows error message if error is present', () => {
    (
      vi.spyOn(useVoucherModule, 'useVoucher') as ReturnType<typeof vi.spyOn> & {
        mockReturnValue: (value: typeof defaultMockReturn & { error: string }) => void;
      }
    ).mockReturnValue({
      ...defaultMockReturn,
      error: 'error_code',
    });
    render(<Voucher {...defaultProps} />);
    expect(screen.getByText(/error_code/i)).toBeInTheDocument();
  });

  it('shows the voucher section with the voucher data if voucherData is present', () => {
    (
      vi.spyOn(useVoucherModule, 'useVoucher') as ReturnType<typeof vi.spyOn> & {
        mockReturnValue: (
          value: typeof defaultMockReturn & { voucherData: TEligibilityVoucher },
        ) => void;
      }
    ).mockReturnValue({
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
    (
      vi.spyOn(useVoucherModule, 'useVoucher') as ReturnType<typeof vi.spyOn> & {
        mockReturnValue: (
          value: typeof defaultMockReturn & {
            voucherData: TEligibilityVoucher;
            handleRemove: ReturnType<typeof vi.fn>;
          },
        ) => void;
      }
    ).mockReturnValue({
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
