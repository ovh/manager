/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getSavingsPlans } from '@/data/api/savingsPlans';
import { SavingsPlan } from '@/data/types/savingPlan.type';
import { createOptimalWrapper } from '@/test-utils/lightweight-wrappers';
import {
  useHasActiveOrPendingSavingsPlan,
  useSavingsPlans,
} from './useSavingsPlans';

// Mock the API function
vi.mock('@/data/api/savingsPlans', () => ({
  getSavingsPlans: vi.fn(),
}));

describe('useSavingsPlans hooks', () => {
  const mockSavingsPlans: SavingsPlan[] = [
    {
      id: 'plan-1',
      status: 'ACTIVE',
      displayName: 'Test Plan 1',
      endDate: '2024-08-23',
      flavor: 'b3-8',
      offerId: 'urn:fake-saving-plan-offer:1',
      period: 'P6M',
      periodEndAction: 'REACTIVATE',
      periodEndDate: '2024-08-23',
      periodStartDate: '2024-02-23',
      plannedChanges: [
        {
          plannedOn: '2024-08-23',
          properties: {
            status: 'TERMINATED',
          },
        },
      ],
      size: 2,
      startDate: '2024-02-23',
    },
    {
      id: 'plan-2',
      status: 'PENDING',
      displayName: 'Test Plan 2',
      endDate: '2024-08-23',
      flavor: 'b3-8',
      offerId: 'urn:fake-saving-plan-offer:2',
      period: 'P6M',
      periodEndAction: 'REACTIVATE',
      periodEndDate: '2024-08-23',
      periodStartDate: '2024-02-23',
      plannedChanges: [
        {
          plannedOn: '2024-08-23',
          properties: {
            status: 'TERMINATED',
          },
        },
      ],
      size: 2,
      startDate: '2024-02-23',
    },
    {
      id: 'plan-3',
      status: 'EXPIRED',
      displayName: 'Test Plan 3',
      endDate: '2024-08-23',
      flavor: 'b3-8',
      offerId: 'urn:fake-saving-plan-offer:3',
      period: 'P6M',
      periodEndAction: 'REACTIVATE',
      periodEndDate: '2024-08-23',
      periodStartDate: '2024-02-23',
      plannedChanges: [
        {
          plannedOn: '2024-08-23',
          properties: {
            status: 'TERMINATED',
          },
        },
      ],
      size: 2,
      startDate: '2024-02-23',
    },
  ];

  describe('useSavingsPlans', () => {
    it('should fetch savings plans when feature is available', async () => {
      vi.mocked(getSavingsPlans).mockResolvedValueOnce(mockSavingsPlans);

      const { result } = renderHook(
        () => useSavingsPlans('service-123', true),
        { wrapper: createOptimalWrapper({ queries: true }) },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(getSavingsPlans).toHaveBeenCalledWith('service-123');
      expect(result.current.data).toEqual(mockSavingsPlans);
      expect(result.current.error).toBeNull();
    });

    it('should not fetch savings plans when feature is not available', async () => {
      const { result } = renderHook(
        () => useSavingsPlans('service-123', false),
        { wrapper: createOptimalWrapper({ queries: true }) },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(getSavingsPlans).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    it('should not fetch savings plans when serviceId is empty', async () => {
      const { result } = renderHook(() => useSavingsPlans('', true), {
        wrapper: createOptimalWrapper({ queries: true }),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(getSavingsPlans).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });
  });

  describe('useHasActiveOrPendingSavingsPlan', () => {
    it('should return true when there is an active savings plan', async () => {
      vi.mocked(getSavingsPlans).mockResolvedValueOnce(mockSavingsPlans);

      const { result } = renderHook(
        () => useHasActiveOrPendingSavingsPlan('service-123', true),
        { wrapper: createOptimalWrapper({ queries: true }) },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(getSavingsPlans).toHaveBeenCalledWith('service-123');
      expect(result.current.data).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should return true when there is a pending savings plan', async () => {
      const pendingPlans: SavingsPlan[] = [
        {
          id: 'plan-1',
          status: 'PENDING',
          displayName: 'Test Plan 1',
          endDate: '2024-08-23',
          flavor: 'b3-8',
          offerId: 'urn:fake-saving-plan-offer:1',
          period: 'P6M',
          periodEndAction: 'REACTIVATE',
          periodEndDate: '2024-08-23',
          periodStartDate: '2024-02-23',
          plannedChanges: [
            {
              plannedOn: '2024-08-23',
              properties: {
                status: 'TERMINATED',
              },
            },
          ],
          size: 2,
          startDate: '2024-02-23',
        },
      ];
      vi.mocked(getSavingsPlans).mockResolvedValueOnce(pendingPlans);

      const { result } = renderHook(
        () => useHasActiveOrPendingSavingsPlan('service-123', true),
        { wrapper: createOptimalWrapper({ queries: true }) },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(getSavingsPlans).toHaveBeenCalledWith('service-123');
      expect(result.current.data).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should return false when there are no active or pending savings plans', async () => {
      const expiredPlans: SavingsPlan[] = [
        {
          id: 'plan-1',
          status: 'EXPIRED',
          displayName: 'Test Plan 1',
          endDate: '2024-08-23',
          flavor: 'b3-8',
          offerId: 'urn:fake-saving-plan-offer:1',
          period: 'P6M',
          periodEndAction: 'REACTIVATE',
          periodEndDate: '2024-08-23',
          periodStartDate: '2024-02-23',
          plannedChanges: [
            {
              plannedOn: '2024-08-23',
              properties: {
                status: 'TERMINATED',
              },
            },
          ],
          size: 2,
          startDate: '2024-02-23',
        },
      ];
      vi.mocked(getSavingsPlans).mockResolvedValueOnce(expiredPlans);

      const { result } = renderHook(
        () => useHasActiveOrPendingSavingsPlan('service-123', true),
        { wrapper: createOptimalWrapper({ queries: true }) },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(getSavingsPlans).toHaveBeenCalledWith('service-123');
      expect(result.current.data).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should not fetch savings plans when feature is not available', async () => {
      const { result } = renderHook(
        () => useHasActiveOrPendingSavingsPlan('service-123', false),
        { wrapper: createOptimalWrapper({ queries: true }) },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(getSavingsPlans).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    it('should not fetch savings plans when serviceId is empty', async () => {
      const { result } = renderHook(
        () => useHasActiveOrPendingSavingsPlan('', true),
        { wrapper: createOptimalWrapper({ queries: true }) },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(getSavingsPlans).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });
  });
});
