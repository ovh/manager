import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { buildShellContextMock } from '@/commons/tests-utils/Mock.utils';
import { createMeWrapper } from '@/commons/tests-utils/Render.utils';
import type { IMe } from '@/hooks/me/IMe.type';
import { useMe } from '@/hooks/me/useMe';

describe('useMe', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when user data is available', () => {
    it('should return user data with ovhSubsidiary and currency', async () => {
      const mockMe: IMe = {
        ovhSubsidiary: 'FR',
        currency: { code: 'EUR' },
      };
      const mockShell = buildShellContextMock(mockMe);
      const wrapper = createMeWrapper(mockShell);

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => {
        expect(result.current.me).toEqual(mockMe);
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockShell.environment?.getUser).toHaveBeenCalled();
    });

    it('should return user data for US subsidiary', async () => {
      const mockMe: IMe = {
        ovhSubsidiary: 'US',
        currency: { code: 'USD' },
      };
      const mockShell = buildShellContextMock(mockMe);
      const wrapper = createMeWrapper(mockShell);

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => {
        expect(result.current.me?.ovhSubsidiary).toBe('US');
        expect(result.current.me?.currency.code).toBe('USD');
      });
    });

    it('should return user data for German subsidiary', async () => {
      const mockMe: IMe = {
        ovhSubsidiary: 'DE',
        currency: { code: 'EUR' },
      };
      const mockShell = buildShellContextMock(mockMe);
      const wrapper = createMeWrapper(mockShell);

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => {
        expect(result.current.me?.ovhSubsidiary).toBe('DE');
        expect(result.current.me?.currency.code).toBe('EUR');
      });
    });
  });

  describe('when user data is not available', () => {
    it('should return null when getUser returns null', async () => {
      const mockShell = buildShellContextMock(null);
      const wrapper = createMeWrapper(mockShell);

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => {
        expect(result.current.me).toBeNull();
      });
    });

    it('should return undefined when getUser returns undefined', async () => {
      const mockShell = buildShellContextMock(undefined);
      const wrapper = createMeWrapper(mockShell);

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => {
        expect(result.current.me).toBeFalsy();
      });
    });

    it('should return falsy when environment is not available', async () => {
      const wrapper = createMeWrapper({}); // no environment

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => {
        expect(result.current.me).toBeFalsy();
      });
    });

    it('should return falsy when context is not available', () => {
      const { result } = renderHook(() => useMe());
      expect(result.current.me).toBeFalsy();
    });
  });

  describe('different subsidiaries', () => {
    const subsidiaries: Array<{ subsidiary: string; currency: string }> = [
      { subsidiary: 'FR', currency: 'EUR' },
      { subsidiary: 'US', currency: 'USD' },
      { subsidiary: 'DE', currency: 'EUR' },
      { subsidiary: 'GB', currency: 'GBP' },
      { subsidiary: 'ES', currency: 'EUR' },
      { subsidiary: 'IT', currency: 'EUR' },
      { subsidiary: 'CA', currency: 'CAD' },
      { subsidiary: 'SG', currency: 'SGD' },
    ];

    subsidiaries.forEach(({ subsidiary, currency }) => {
      it(`should return correct data for ${subsidiary} subsidiary`, async () => {
        const mockMe: IMe = {
          ovhSubsidiary: subsidiary,
          currency: { code: currency },
        };
        const mockShell = buildShellContextMock(mockMe);
        const wrapper = createMeWrapper(mockShell);

        const { result } = renderHook(() => useMe(), { wrapper });

        await waitFor(() => {
          expect(result.current.me?.ovhSubsidiary).toBe(subsidiary);
          expect(result.current.me?.currency.code).toBe(currency);
        });
      });
    });
  });
});
