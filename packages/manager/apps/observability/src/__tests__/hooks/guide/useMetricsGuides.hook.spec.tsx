import React from 'react';

import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { GUIDE_LIST, useMetricsGuides } from '@/hooks/guide/useMetricsGuides.hook';

describe('useMetricsGuides', () => {
  const mockGetEnvironment = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = (ovhSubsidiary: CountryCode | string) => {
    mockGetEnvironment.mockResolvedValue({
      getUser: () => ({ ovhSubsidiary }),
    });

    const shellContextValue = {
      shell: {
        environment: {
          getEnvironment: mockGetEnvironment,
        },
      },
    };

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <ShellContext.Provider value={shellContextValue as never}>{children}</ShellContext.Provider>
    );
    Wrapper.displayName = 'TestWrapper';
    return Wrapper;
  };

  it('should return GB links as default when country code is not in the list', async () => {
    const { result } = renderHook(() => useMetricsGuides(), {
      wrapper: createWrapper('UNKNOWN'),
    });

    await waitFor(() => {
      expect(result.current.gettingStarted).toBe(GUIDE_LIST.gettingStarted?.[CountryCode.GB]);
      expect(result.current.documentation).toBe(GUIDE_LIST.documentation?.[CountryCode.GB]);
    });
  });

  it('should return the correct links when a valid country code is provided', async () => {
    const { result } = renderHook(() => useMetricsGuides(), {
      wrapper: createWrapper(CountryCode.DE),
    });

    await waitFor(() => {
      expect(result.current.gettingStarted).toBe(GUIDE_LIST.gettingStarted?.[CountryCode.DE]);
      expect(result.current.documentation).toBe(GUIDE_LIST.documentation?.[CountryCode.DE]);
    });
  });

  it.each([
    { subsidiary: CountryCode.MA, description: 'Morocco (MA)' },
    { subsidiary: CountryCode.SN, description: 'Senegal (SN)' },
    { subsidiary: CountryCode.TN, description: 'Tunisia (TN)' },
  ])('should return FR links for $description subsidiary', async ({ subsidiary }) => {
    const { result } = renderHook(() => useMetricsGuides(), {
      wrapper: createWrapper(subsidiary),
    });

    await waitFor(() => {
      expect(result.current.gettingStarted).toBe(GUIDE_LIST.gettingStarted?.[CountryCode.FR]);
      expect(result.current.documentation).toBe(GUIDE_LIST.documentation?.[CountryCode.FR]);
    });
  });
});
