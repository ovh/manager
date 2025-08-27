import { describe, it, vi, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { Region, User } from '@ovh-ux/manager-config';
import useHelpLink from './useHelpLink';
import { HELP_ROOT, HELP_URL } from './useHelpLink.constants';

describe('useHelpLink', () => {
  const customRenderHook = (mockShell: ShellContextType) => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ShellContext.Provider value={mockShell}>
        {children}
      </ShellContext.Provider>
    );

    return renderHook(() => useHelpLink(), { wrapper });
  };

  it.each([
    ['EU', 'FR'],
    ['CA', 'CA'],
    ['US', 'US'],
  ])(
    `should return the correct help link for a valid region: %s and subsidiary: %s`,
    (region: string, subsidiary: string) => {
      const mockShell = ({
        environment: {
          getRegion: vi.fn(() => region as Region),
          getUser: vi.fn(() => ({ ovhSubsidiary: subsidiary } as User)),
        },
      } as unknown) as ShellContextType;
      const { result } = customRenderHook(mockShell);
      expect(result.current).toBe(HELP_URL[region as Region][subsidiary]);
    },
  );

  it('should return HELP_ROOT if the region is not in list of supported regions', () => {
    const mockShell = ({
      environment: {
        getRegion: vi.fn(() => 'ASIA'), // Non-existent region
        getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
      },
    } as unknown) as ShellContextType;
    const { result } = customRenderHook(mockShell);
    expect(result.current).toBe(HELP_ROOT);
  });

  it('should return HELP_ROOT if the subsidiary is invalid for a valid region', () => {
    const mockShell = ({
      environment: {
        getRegion: vi.fn(() => 'US'),
        getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })), // Non-existent subsidiary in US
      },
    } as unknown) as ShellContextType;
    const { result } = customRenderHook(mockShell);
    expect(result.current).toBe(HELP_ROOT);
  });

  it('should return HELP_ROOT if no region or subsidiary is provided', () => {
    const mockShell = ({
      environment: {
        getRegion: vi.fn(() => undefined), // No region provided
        getUser: vi.fn(() => ({ ovhSubsidiary: undefined })), // No subsidiary provided
      },
    } as unknown) as ShellContextType;
    const { result } = customRenderHook(mockShell);
    expect(result.current).toBe(HELP_ROOT);
  });
});
