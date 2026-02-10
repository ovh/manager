import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useGetEnvironmentData } from './data';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import React from 'react';

describe('useGetEnvironmentData', () => {
  it('should return region and ovhSubsidiary from environment', () => {
    const mockContext = {
      shell: {},
      environment: {
        getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
        getRegion: vi.fn(() => 'EU'),
      },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ShellContext.Provider value={mockContext as any}>
        {children}
      </ShellContext.Provider>
    );

    const { result } = renderHook(() => useGetEnvironmentData(), { wrapper });

    expect(result.current).toEqual({
      region: 'EU',
      ovhSubsidiary: 'FR',
    });
    expect(mockContext.environment.getUser).toHaveBeenCalled();
    expect(mockContext.environment.getRegion).toHaveBeenCalled();
  });

  it('should return different values when environment changes', () => {
    const mockContext = {
      shell: {},
      environment: {
        getUser: vi.fn(() => ({ ovhSubsidiary: 'US' })),
        getRegion: vi.fn(() => 'CA'),
      },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ShellContext.Provider value={mockContext as any}>
        {children}
      </ShellContext.Provider>
    );

    const { result } = renderHook(() => useGetEnvironmentData(), { wrapper });

    expect(result.current).toEqual({
      region: 'CA',
      ovhSubsidiary: 'US',
    });
  });
});