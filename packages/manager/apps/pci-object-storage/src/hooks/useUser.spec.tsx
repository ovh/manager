import { expect, describe, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUser } from '@/hooks/useUser';
import { mockedUser } from '@/__tests__/helpers/mocks/user';

vi.mock('@ovh-ux/manager-react-shell-client', () => {
  return {
    useShell: vi.fn(() => ({
      environment: {
        getEnvironment: vi.fn(() => ({
          getUser: vi.fn(() => mockedUser),
        })),
      },
    })),
  };
});

describe('useUser', () => {
  it('should init properly', async () => {
    const { result } = renderHook(() => useUser());
    await waitFor(() => {
      expect(result.current).toBe(mockedUser);
    });
  });
});
