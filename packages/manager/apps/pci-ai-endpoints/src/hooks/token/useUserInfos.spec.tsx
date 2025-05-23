import { renderHook } from '@testing-library/react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import useUserInfos from './useUserInfos';

describe('useUserInfos', () => {
  const mockGetUser = vi.fn();
  const mockShellContext = ({
    environment: {
      getUser: mockGetUser,
    },
  } as unknown) as ShellContextType;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ShellContext.Provider value={mockShellContext}>
      {children}
    </ShellContext.Provider>
  );

  it.each([
    [{ auth: { roles: ['ADMIN'] } }, true],
    [{ auth: { roles: ['USER'] } }, false],
    [{ auth: { roles: [] } }, false],
    [{ auth: { roles: null } }, false],
    [undefined, false],
  ])('should return isAdmin=%s for user=%j', (user, expected) => {
    mockGetUser.mockReturnValue(user);
    const { result } = renderHook(() => useUserInfos(), { wrapper });
    expect(result.current.isAdmin).toBe(expected);
  });
});
