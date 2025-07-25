import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCreditBalance, getStartupProgram } from '@/data/api/credit';
import { createWrapper } from '@/wrapperRenders';
import { useIsStartupProgramAvailable, useStartupProgram } from './useCredit';

vi.mock('@/data/api/credit', () => ({
  getCreditBalance: vi.fn(),
  getStartupProgram: vi.fn(),
}));

const mockGetCreditBalance = vi.mocked(getCreditBalance);
const mockGetStartupProgram = vi.mocked(getStartupProgram);

describe('useCredit hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useIsStartupProgramAvailable', () => {
    it('should return true when STARTUP_PROGRAM is included in credit balance', async () => {
      mockGetCreditBalance.mockResolvedValueOnce([
        'CREDIT_CARD',
        'STARTUP_PROGRAM',
        'PAYPAL',
      ]);

      const { result } = renderHook(() => useIsStartupProgramAvailable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockGetCreditBalance).toHaveBeenCalledTimes(1);
    });

    it('should return false when STARTUP_PROGRAM is not included in credit balance', async () => {
      mockGetCreditBalance.mockResolvedValueOnce(['CREDIT_CARD', 'PAYPAL']);

      const { result } = renderHook(() => useIsStartupProgramAvailable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockGetCreditBalance).toHaveBeenCalledTimes(1);
    });

    it('should return false when credit balance is empty', async () => {
      mockGetCreditBalance.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useIsStartupProgramAvailable(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should have loading state initially', () => {
      const { result } = renderHook(() => useIsStartupProgramAvailable(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });
  });

  describe('useStartupProgram', () => {
    const mockStartupProgramData = {
      amount: {
        value: 100,
        currencyCode: 'EUR',
        text: '100.00 €',
      },
      status: 'ACTIVE',
    };

    it('should fetch startup program data when enabled is true', async () => {
      mockGetStartupProgram.mockResolvedValueOnce(mockStartupProgramData);

      const { result } = renderHook(() => useStartupProgram(true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockStartupProgramData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockGetStartupProgram).toHaveBeenCalledTimes(1);
    });

    it('should not fetch startup program data when enabled is false', async () => {
      const { result } = renderHook(() => useStartupProgram(false), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockGetStartupProgram).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    it('should have loading state initially when enabled', () => {
      const { result } = renderHook(() => useStartupProgram(true), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    it('should handle different startup program data structures', async () => {
      const differentDataStructure = {
        balance: 50,
        currency: 'USD',
        isActive: true,
      };

      mockGetStartupProgram.mockResolvedValueOnce(differentDataStructure);

      const { result } = renderHook(() => useStartupProgram(true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(differentDataStructure);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle null startup program data', async () => {
      mockGetStartupProgram.mockResolvedValueOnce(null);

      const { result } = renderHook(() => useStartupProgram(true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
