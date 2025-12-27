import type { ReactNode } from 'react';

import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import type { ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { createHelpUrlMap } from '@/commons/utils/create-help-url-map/CreateHelpUrlMap';

import { useHelpLink } from './useHelpLink';
import { HELP_LOCALES, HELP_ROOT, USA_HELP_ROOT } from './useHelpLink.constant';

describe('useHelpLink', () => {
  const customRenderHook = (mockShell: ShellContextType) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ShellContext.Provider value={mockShell}>{children}</ShellContext.Provider>
    );

    return renderHook(() => useHelpLink(), { wrapper });
  };

  const helpLinks = createHelpUrlMap(HELP_ROOT, {
    paths: HELP_LOCALES,
    overrides: {
      US: USA_HELP_ROOT,
    },
  });

  it.each([['FR'], ['GB'], ['US']])(
    'returns the correct help link for subsidiary %s',
    (subsidiary) => {
      const mockShell = {
        environment: {
          getUser: vi.fn(() => ({ ovhSubsidiary: subsidiary })),
        },
      } as unknown as ShellContextType;

      const { result } = customRenderHook(mockShell);

      expect(result.current).toBe(helpLinks[subsidiary as keyof typeof helpLinks]);
    },
  );

  it('returns HELP_ROOT when subsidiary is missing', () => {
    const mockShell = {
      environment: {
        getUser: vi.fn(() => ({ ovhSubsidiary: undefined })),
      },
    } as unknown as ShellContextType;

    const { result } = customRenderHook(mockShell);

    expect(result.current).toBe(HELP_ROOT);
  });

  it('returns HELP_ROOT when subsidiary is not mapped', () => {
    const mockShell = {
      environment: {
        getUser: vi.fn(() => ({ ovhSubsidiary: 'ZZ' })),
      },
    } as unknown as ShellContextType;

    const { result } = customRenderHook(mockShell);

    expect(result.current).toBe(HELP_ROOT);
  });
});
