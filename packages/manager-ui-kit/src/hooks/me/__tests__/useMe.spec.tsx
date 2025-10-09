import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { useMe } from '../useMe';
import { IMe } from '../useMe.props';

const createShellContext = (me: IMe | null = null) => ({
  environment: {
    getUser: vi.fn(() => me),
  },
});

const createWrapper = (shellContext: any) => {
  return ({ children }: { children: ReactNode }) => (
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      {children}
    </ShellContext.Provider>
  );
};

describe('useMe', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when user data is available', () => {
    it('should return user data with ovhSubsidiary and currency', async () => {
      const mockMe: IMe = {
        ovhSubsidiary: 'FR',
        currency: {
          code: 'EUR',
        },
      };

      const shellContext = createShellContext(mockMe);
      const wrapper = createWrapper(shellContext);

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => {
        expect(result.current.me).toEqual(mockMe);
      });

      expect(shellContext.environment.getUser).toHaveBeenCalled();
    });

    it('should return user data for US subsidiary', async () => {
      const mockMe: IMe = {
        ovhSubsidiary: 'US',
        currency: {
          code: 'USD',
        },
      };

      const shellContext = createShellContext(mockMe);
      const wrapper = createWrapper(shellContext);

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => {
        expect(result.current.me).toEqual(mockMe);
        expect(result.current.me?.ovhSubsidiary).toBe('US');
        expect(result.current.me?.currency.code).toBe('USD');
      });
    });

    it('should return user data for German subsidiary', async () => {
      const mockMe: IMe = {
        ovhSubsidiary: 'DE',
        currency: {
          code: 'EUR',
        },
      };

      const shellContext = createShellContext(mockMe);
      const wrapper = createWrapper(shellContext);

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => {
        expect(result.current.me?.ovhSubsidiary).toBe('DE');
        expect(result.current.me?.currency.code).toBe('EUR');
      });
    });
  });

  describe('when user data is not available', () => {
    it('should return null when getUser returns null', async () => {
      const shellContext = createShellContext(null);
      const wrapper = createWrapper(shellContext);

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => {
        expect(result.current.me).toBeNull();
      });
    });

    it('should return null or undefined when getUser returns undefined', async () => {
      const shellContext = {
        environment: {
          getUser: vi.fn(() => undefined),
        },
      };
      const wrapper = createWrapper(shellContext);

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => {
        expect(result.current.me).toBeFalsy();
      });
    });

    it('should return null or undefined when environment is not available', async () => {
      const shellContext = {};
      const wrapper = createWrapper(shellContext);

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => {
        expect(result.current.me).toBeFalsy();
      });
    });

    it('should return null when context is not available', () => {
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
          currency: {
            code: currency,
          },
        };

        const shellContext = createShellContext(mockMe);
        const wrapper = createWrapper(shellContext);

        const { result } = renderHook(() => useMe(), { wrapper });

        await waitFor(() => {
          expect(result.current.me?.ovhSubsidiary).toBe(subsidiary);
          expect(result.current.me?.currency.code).toBe(currency);
        });
      });
    });
  });
});
