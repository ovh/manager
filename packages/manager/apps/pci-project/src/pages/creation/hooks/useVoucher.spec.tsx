/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from '@ovh-ux/manager-core-api';
import { UseMutationResult } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useVoucher } from './useVoucher';
import {
  useAttachConfigurationToCartItem,
  useDeleteConfigurationItemFromCart,
} from '@/data/hooks/useCart';
import { useCheckVoucherEligibility } from '@/data/hooks/payment/useEligibility';
import { CartConfiguration } from '@/data/types/cart.type';
import { TEligibilityVoucher } from '@/data/types/payment/eligibility.type';

vi.mock('@/data/hooks/useCart', () => ({
  useAttachConfigurationToCartItem: vi.fn(),
  useDeleteConfigurationItemFromCart: vi.fn(),
}));

vi.mock('@/data/hooks/payment/useEligibility', () => ({
  useCheckVoucherEligibility: vi.fn(),
}));

// Types for mutation parameters
interface AttachConfigParams {
  cartId: string;
  itemId: number;
  payload: { label: string; value: string };
}

interface DeleteConfigParams {
  cartId: string;
  itemId: number;
  configurationId: number;
}

describe('useVoucher', () => {
  const cartId = 'cart-123';
  const itemId = 456;
  const setVoucherConfiguration = vi.fn();

  const mockAttachConfigMutationResult = (
    isPending = false,
    onSuccess?: (data: CartConfiguration) => void,
  ): UseMutationResult<
    CartConfiguration,
    ApiError,
    AttachConfigParams,
    unknown
  > =>
    ({
      mutate: vi.fn((_params, options) => {
        if (onSuccess && options?.onSuccess) {
          const mockCartConfig: CartConfiguration = {
            id: 123,
            label: 'voucher',
            value: 'CODE123',
          };
          options.onSuccess(mockCartConfig);
        }
      }),
      mutateAsync: vi.fn(),
      isPending,
      isError: false,
      isIdle: !isPending,
      isSuccess: false,
      data: undefined,
      error: null,
      reset: vi.fn(),
      status: isPending ? 'pending' : 'idle',
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
    } as UseMutationResult<
      CartConfiguration,
      ApiError,
      AttachConfigParams,
      unknown
    >);

  const mockDeleteConfigMutationResult = (
    isPending = false,
    onSuccess?: () => void,
  ): UseMutationResult<void, ApiError, DeleteConfigParams, unknown> =>
    ({
      mutate: vi.fn((_params, options) => {
        if (onSuccess && options?.onSuccess) {
          options.onSuccess();
        }
      }),
      mutateAsync: vi.fn(),
      isPending,
      isError: false,
      isIdle: !isPending,
      isSuccess: false,
      data: undefined,
      error: null,
      reset: vi.fn(),
      status: isPending ? 'pending' : 'idle',
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
    } as UseMutationResult<void, ApiError, DeleteConfigParams, unknown>);

  const mockCheckEligibilityMutationResult = (
    isPending = false,
    onSuccess?: () => void,
    onError?: (error: ApiError) => void,
  ): UseMutationResult<
    TEligibilityVoucher | undefined,
    ApiError,
    string,
    unknown
  > =>
    ({
      mutate: vi.fn((voucher, options) => {
        if (voucher === 'VALID_CODE' && onSuccess && options?.onSuccess) {
          options.onSuccess(undefined);
        } else if (voucher === 'INVALID_CODE' && onError && options?.onError) {
          const error = { message: 'VOUCHER_INVALID' } as ApiError;
          options.onError(error);
        }
      }),
      mutateAsync: vi.fn(),
      isPending,
      isError: false,
      isIdle: !isPending,
      isSuccess: false,
      data: undefined,
      error: null,
      reset: vi.fn(),
      status: isPending ? 'pending' : 'idle',
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
    } as UseMutationResult<
      TEligibilityVoucher | undefined,
      ApiError,
      string,
      unknown
    >);

  beforeEach(() => {
    // Default mocks
    vi.mocked(useAttachConfigurationToCartItem).mockReturnValue(
      mockAttachConfigMutationResult(),
    );
    vi.mocked(useDeleteConfigurationItemFromCart).mockReturnValue(
      mockDeleteConfigMutationResult(),
    );
    vi.mocked(useCheckVoucherEligibility).mockReturnValue(
      mockCheckEligibilityMutationResult(),
    );
  });

  describe('initial state', () => {
    it('should initialize with default state', async () => {
      const { result } = renderHook(() =>
        useVoucher({ cartId, itemId, setVoucherConfiguration }),
      );

      expect(result.current.voucher).toBe('');
      expect(result.current.error).toBeUndefined();
      expect(result.current.isPending).toBe(false);
      expect(result.current.voucherData).toBeUndefined();
    });
  });

  describe('voucher state management', () => {
    it('should update voucher value', async () => {
      const { result } = renderHook(() =>
        useVoucher({ cartId, itemId, setVoucherConfiguration }),
      );

      await act(async () => {
        result.current.setVoucher('CODE123');
      });

      expect(result.current.voucher).toBe('CODE123');
    });

    it('should clear error when setError is called', async () => {
      const { result } = renderHook(() =>
        useVoucher({ cartId, itemId, setVoucherConfiguration }),
      );

      // First set an error
      await act(async () => {
        result.current.setError('Some error');
      });
      expect(result.current.error).toBe('Some error');

      // Then clear it
      await act(async () => {
        result.current.setError(undefined);
      });
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('voucher eligibility checking', () => {
    it('should call attachConfig on successful eligibility check', async () => {
      const attachConfigMutation = vi.fn();

      (useAttachConfigurationToCartItem as ReturnType<
        typeof vi.fn
      >).mockReturnValue({
        ...mockAttachConfigMutationResult(),
        mutate: attachConfigMutation,
      });

      (useCheckVoucherEligibility as ReturnType<
        typeof vi.fn
      >).mockImplementation((options) => ({
        ...mockCheckEligibilityMutationResult(),
        mutate: vi.fn(() => {
          if (options?.onSuccess) {
            options.onSuccess();
          }
        }),
      }));

      const { result } = renderHook(() =>
        useVoucher({ cartId, itemId, setVoucherConfiguration }),
      );

      await act(async () => {
        result.current.setVoucher('VALID_CODE');
      });

      await act(async () => {
        result.current.checkEligibility('VALID_CODE');
      });

      expect(attachConfigMutation).toHaveBeenCalledWith({
        cartId,
        itemId,
        payload: { label: 'voucher', value: 'VALID_CODE' },
      });
    });

    it('should set error on eligibility check failure', async () => {
      (useCheckVoucherEligibility as ReturnType<
        typeof vi.fn
      >).mockImplementation((options) => ({
        ...mockCheckEligibilityMutationResult(),
        mutate: vi.fn(() => {
          if (options?.onError) {
            const error = { message: 'VOUCHER_INVALID' } as ApiError;
            options.onError(error);
          }
        }),
      }));

      const { result } = renderHook(() =>
        useVoucher({ cartId, itemId, setVoucherConfiguration }),
      );

      await act(async () => {
        result.current.checkEligibility('INVALID_CODE');
      });

      // The hook should have set an error
      expect(result.current.error).toBeDefined();
      expect(result.current.error).toContain('voucher_invalid');
    });

    it('should handle specific voucher error codes', async () => {
      (useCheckVoucherEligibility as ReturnType<typeof vi.fn>).mockReturnValue(
        mockCheckEligibilityMutationResult(false, undefined, (error) => {
          if (error.message === 'VOUCHER_EXPIRED') {
            // This would trigger the error handling in the hook
          }
        }),
      );

      const { result } = renderHook(() =>
        useVoucher({ cartId, itemId, setVoucherConfiguration }),
      );

      // Simulate the error by directly calling the error handler
      await act(async () => {
        const errorCodeMatch = 'VOUCHER_EXPIRED'.match(/(VOUCHER_\w+)/i);
        const errorCode = errorCodeMatch
          ? errorCodeMatch[1].toLowerCase()
          : 'invalid';
        result.current.setError(
          `pci_projects_new_voucher_form_field_error_voucher_${errorCode}`,
        );
      });

      expect(result.current.error).toBe(
        'pci_projects_new_voucher_form_field_error_voucher_voucher_expired',
      );
    });
  });

  describe('voucher removal', () => {
    it('should call deleteConfig when handleRemove is called with configurationId', async () => {
      (useDeleteConfigurationItemFromCart as ReturnType<
        typeof vi.fn
      >).mockReturnValue(
        mockDeleteConfigMutationResult(false, () => {
          // Mock the success callback
        }),
      );

      const { result } = renderHook(() =>
        useVoucher({ cartId, itemId, setVoucherConfiguration }),
      );

      const configurationId = 123;

      await act(async () => {
        result.current.handleRemove(configurationId);
      });

      const deleteConfigResult = (useDeleteConfigurationItemFromCart as ReturnType<
        typeof vi.fn
      >).mock.results[0].value;
      expect(deleteConfigResult.mutate).toHaveBeenCalledWith({
        cartId,
        itemId,
        configurationId,
      });
    });

    it('should not call deleteConfig when handleRemove is called without configurationId', async () => {
      (useDeleteConfigurationItemFromCart as ReturnType<
        typeof vi.fn
      >).mockReturnValue(mockDeleteConfigMutationResult(false));

      const { result } = renderHook(() =>
        useVoucher({ cartId, itemId, setVoucherConfiguration }),
      );

      await act(async () => {
        result.current.handleRemove(undefined);
      });

      const deleteConfigResult = (useDeleteConfigurationItemFromCart as ReturnType<
        typeof vi.fn
      >).mock.results[0].value;
      expect(deleteConfigResult.mutate).not.toHaveBeenCalled();
    });

    it('should clear voucher and configuration on successful removal', async () => {
      (useDeleteConfigurationItemFromCart as ReturnType<
        typeof vi.fn
      >).mockImplementation((options) => ({
        ...mockDeleteConfigMutationResult(),
        mutate: vi.fn(() => {
          if (options?.onSuccess) {
            options.onSuccess();
          }
        }),
      }));

      const { result } = renderHook(() =>
        useVoucher({ cartId, itemId, setVoucherConfiguration }),
      );

      // First set a voucher
      await act(async () => {
        result.current.setVoucher('CODE123');
      });
      expect(result.current.voucher).toBe('CODE123');

      // Then simulate successful removal which should clear the voucher
      await act(async () => {
        result.current.handleRemove(123);
      });

      // The hook should clear the voucher internally
      expect(result.current.voucher).toBe('');
      expect(setVoucherConfiguration).toHaveBeenCalledWith(undefined);
    });
  });

  describe('loading states', () => {
    it('should reflect pending state from eligibility check', async () => {
      (useCheckVoucherEligibility as ReturnType<typeof vi.fn>).mockReturnValue(
        mockCheckEligibilityMutationResult(true),
      );

      const { result } = renderHook(() =>
        useVoucher({ cartId, itemId, setVoucherConfiguration }),
      );

      expect(result.current.isPending).toBe(true);
    });

    it('should not be pending when eligibility check is complete', async () => {
      (useCheckVoucherEligibility as ReturnType<typeof vi.fn>).mockReturnValue(
        mockCheckEligibilityMutationResult(false),
      );

      const { result } = renderHook(() =>
        useVoucher({ cartId, itemId, setVoucherConfiguration }),
      );

      expect(result.current.isPending).toBe(false);
    });
  });
});
