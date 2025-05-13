import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { getAuthorizationCheckUrl, useAuthorizationIam } from './useOvhIam';

const shellContext = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'mocked_ovhSubsidiary' }),
  },
  shell: {
    navigation: {
      getURL: vi.fn(),
    },
  },
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

vi.mock('@ovh-ux/manager-core-api', () => ({
  apiClient: {
    v2: {
      get: vi.fn(),
    },
  },
}));

describe('getAuthorizationCheckUrl', () => {
  it('encodes the urn if it contains /', () => {
    expect(getAuthorizationCheckUrl('test/urn')).toBe(
      '/iam/resource/test%2Furn/authorization/check',
    );
  });
});

describe('useAuthorizationIam', () => {
  it('should not fetch data if urn is nil', () => {
    const { result } = renderHook(
      () => useAuthorizationIam(['test'], undefined),
      {
        wrapper,
      },
    );
    expect(result.current?.isFetching).toBe(false);
  });
  it('should not fetch data if actions is nil', () => {
    const { result } = renderHook(() => useAuthorizationIam(undefined, 'urn'), {
      wrapper,
    });
    expect(result.current?.isFetching).toBe(false);
  });
  it('should fetch data if both actions and urn are not nil', () => {
    const { result } = renderHook(() => useAuthorizationIam(['test'], 'urn'), {
      wrapper,
    });
    expect(result.current?.isFetching).toBe(true);
  });
});
