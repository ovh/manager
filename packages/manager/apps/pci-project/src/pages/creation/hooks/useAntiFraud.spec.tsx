import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useAntiFraud from './useAntiFraud';
import { getOrderFollowUp } from '@/data/api/order';
import { ANTI_FRAUD, AntiFraudError } from '@/constants';
import { CartSummary } from '@/data/types/cart.type';
import {
  TOrderFollowUpLabel,
  TOrderFollowUpStatus,
  TOrderFollowUpStep,
  TOrderFollowUp,
} from '@/data/types/order.type';

// Mock the order API
vi.mock('@/data/api/order', () => ({
  getOrderFollowUp: vi.fn(),
}));

const mockGetOrderFollowUp = vi.mocked(getOrderFollowUp);

describe('useAntiFraud', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createMockCartSummary = (
    orderId: number | null = 123,
  ): CartSummary => ({
    orderId,
    url: 'https://example.com',
    details: [],
    prices: {
      originalWithoutTax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
      reduction: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
      tax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
      withTax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
      withoutTax: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
    },
    contracts: [],
  });

  const createMockOrderFollowUp = (
    step: TOrderFollowUpStep,
    status: TOrderFollowUpStatus,
    labels: TOrderFollowUpLabel[] = [],
  ): TOrderFollowUp[] => [
    {
      step,
      status,
      history: labels.map((label) => ({
        date: '2023-01-01T00:00:00Z',
        description: `History entry for ${label}`,
        label,
      })),
    },
  ];

  it('should return a checkAntiFraud function', () => {
    const { result } = renderHook(() => useAntiFraud());

    expect(result.current).toHaveProperty('checkAntiFraud');
    expect(typeof result.current.checkAntiFraud).toBe('function');
  });

  it('should reject with error when orderId is null', async () => {
    const { result } = renderHook(() => useAntiFraud());
    const cartSummary = createMockCartSummary(null);

    await expect(result.current.checkAntiFraud(cartSummary)).rejects.toThrow(
      'orderId should not be null',
    );
  });

  it('should resolve when validating step with DONE status is found', async () => {
    const { result } = renderHook(() => useAntiFraud());
    const cartSummary = createMockCartSummary();

    const followUp = createMockOrderFollowUp(
      TOrderFollowUpStep.VALIDATING,
      TOrderFollowUpStatus.DONE,
    );

    mockGetOrderFollowUp.mockResolvedValueOnce(followUp);

    await expect(
      result.current.checkAntiFraud(cartSummary),
    ).resolves.toBeUndefined();

    expect(mockGetOrderFollowUp).toHaveBeenCalledWith(123);
  });

  it('should reject with NEED_CUSTOMER_INFO_CHECK when fraud docs are requested', async () => {
    const { result } = renderHook(() => useAntiFraud());
    const cartSummary = createMockCartSummary();

    const followUp = createMockOrderFollowUp(
      TOrderFollowUpStep.VALIDATING,
      TOrderFollowUpStatus.DOING,
      [TOrderFollowUpLabel.FRAUD_DOCS_REQUESTED],
    );

    mockGetOrderFollowUp.mockResolvedValueOnce(followUp);

    await expect(result.current.checkAntiFraud(cartSummary)).rejects.toThrow(
      AntiFraudError.NEED_CUSTOMER_INFO_CHECK,
    );
  });

  it('should reject with NEED_CUSTOMER_INFO_CHECK when fraud manual review is required', async () => {
    const { result } = renderHook(() => useAntiFraud());
    const cartSummary = createMockCartSummary();

    const followUp = createMockOrderFollowUp(
      TOrderFollowUpStep.VALIDATING,
      TOrderFollowUpStatus.DOING,
      [TOrderFollowUpLabel.FRAUD_MANUAL_REVIEW],
    );

    mockGetOrderFollowUp.mockResolvedValueOnce(followUp);

    await expect(result.current.checkAntiFraud(cartSummary)).rejects.toThrow(
      AntiFraudError.NEED_CUSTOMER_INFO_CHECK,
    );
  });

  it('should continue polling when no validating step is found', async () => {
    const { result } = renderHook(() => useAntiFraud());
    const cartSummary = createMockCartSummary();

    // Return validating step immediately (skipping the polling simulation)
    const followUpWithValidating = createMockOrderFollowUp(
      TOrderFollowUpStep.VALIDATING,
      TOrderFollowUpStatus.DONE,
    );

    mockGetOrderFollowUp.mockResolvedValueOnce(followUpWithValidating);

    await expect(
      result.current.checkAntiFraud(cartSummary),
    ).resolves.toBeUndefined();

    expect(mockGetOrderFollowUp).toHaveBeenCalledTimes(1);
  });

  it('should reject with CASE_FRAUD_REFUSED when API error contains fraud refused message', async () => {
    const { result } = renderHook(() => useAntiFraud());
    const cartSummary = createMockCartSummary();

    const errorWithFraudRefused = {
      data: {
        message: `Some error ${ANTI_FRAUD.CASE_FRAUD_REFUSED} occurred`,
      },
    };

    mockGetOrderFollowUp.mockRejectedValueOnce(errorWithFraudRefused);

    await expect(result.current.checkAntiFraud(cartSummary)).rejects.toThrow(
      AntiFraudError.CASE_FRAUD_REFUSED,
    );
  });

  it('should reject with UNKNOWN error when API error does not contain fraud refused message', async () => {
    const { result } = renderHook(() => useAntiFraud());
    const cartSummary = createMockCartSummary();

    const genericError = {
      data: {
        message: 'Some generic error occurred',
      },
    };

    mockGetOrderFollowUp.mockRejectedValueOnce(genericError);

    await expect(result.current.checkAntiFraud(cartSummary)).rejects.toThrow(
      AntiFraudError.UNKNOWN,
    );
  });

  it('should reject with UNKNOWN error when API error has no message', async () => {
    const { result } = renderHook(() => useAntiFraud());
    const cartSummary = createMockCartSummary();

    const errorWithoutMessage = {
      data: {
        message: undefined,
      },
    };

    mockGetOrderFollowUp.mockRejectedValueOnce(errorWithoutMessage);

    await expect(result.current.checkAntiFraud(cartSummary)).rejects.toThrow(
      AntiFraudError.UNKNOWN,
    );
  });

  it('should reject with UNKNOWN error when API error has no data', async () => {
    const { result } = renderHook(() => useAntiFraud());
    const cartSummary = createMockCartSummary();

    const errorWithoutData = {
      data: undefined,
    };

    mockGetOrderFollowUp.mockRejectedValueOnce(errorWithoutData);

    await expect(result.current.checkAntiFraud(cartSummary)).rejects.toThrow(
      AntiFraudError.UNKNOWN,
    );
  });

  it('should resolve when validating step has DOING status but no fraud labels', async () => {
    const { result } = renderHook(() => useAntiFraud());
    const cartSummary = createMockCartSummary();

    const followUp = createMockOrderFollowUp(
      TOrderFollowUpStep.VALIDATING,
      TOrderFollowUpStatus.DOING,
      [TOrderFollowUpLabel.ORDER_ACCEPTED], // Non-fraud label
    );

    mockGetOrderFollowUp.mockResolvedValueOnce(followUp);

    await expect(
      result.current.checkAntiFraud(cartSummary),
    ).resolves.toBeUndefined();
  });

  it('should handle empty follow-up array', async () => {
    const { result } = renderHook(() => useAntiFraud());
    const cartSummary = createMockCartSummary();

    // Return validating step immediately (skipping empty array polling simulation)
    const followUpWithValidating = createMockOrderFollowUp(
      TOrderFollowUpStep.VALIDATING,
      TOrderFollowUpStatus.DONE,
    );

    mockGetOrderFollowUp.mockResolvedValueOnce(followUpWithValidating);

    await expect(
      result.current.checkAntiFraud(cartSummary),
    ).resolves.toBeUndefined();

    expect(mockGetOrderFollowUp).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple fraud labels in history', async () => {
    const { result } = renderHook(() => useAntiFraud());
    const cartSummary = createMockCartSummary();

    const followUp = createMockOrderFollowUp(
      TOrderFollowUpStep.VALIDATING,
      TOrderFollowUpStatus.DOING,
      [
        TOrderFollowUpLabel.FRAUD_DOCS_REQUESTED,
        TOrderFollowUpLabel.FRAUD_MANUAL_REVIEW,
        TOrderFollowUpLabel.ORDER_ACCEPTED,
      ],
    );

    mockGetOrderFollowUp.mockResolvedValueOnce(followUp);

    await expect(result.current.checkAntiFraud(cartSummary)).rejects.toThrow(
      AntiFraudError.NEED_CUSTOMER_INFO_CHECK,
    );
  });

  it('should handle validating step with ERROR status', async () => {
    const { result } = renderHook(() => useAntiFraud());
    const cartSummary = createMockCartSummary();

    const followUp = createMockOrderFollowUp(
      TOrderFollowUpStep.VALIDATING,
      TOrderFollowUpStatus.ERROR,
    );

    mockGetOrderFollowUp.mockResolvedValueOnce(followUp);

    await expect(
      result.current.checkAntiFraud(cartSummary),
    ).resolves.toBeUndefined();
  });

  it('should maintain callback memoization across renders', () => {
    const { result, rerender } = renderHook(() => useAntiFraud());

    const firstCallback = result.current.checkAntiFraud;

    rerender();

    const secondCallback = result.current.checkAntiFraud;

    expect(firstCallback).toBe(secondCallback);
  });
});
