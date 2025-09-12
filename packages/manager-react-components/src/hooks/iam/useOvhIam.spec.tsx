import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  getAuthorizationCheckUrl,
  useAuthorizationIam,
  useGetResourceTags,
} from './useOvhIam';
import { useDataApi } from '../data-api';

const mocks = vi.hoisted(() => ({
  useDataApi: vi.fn(),
}));

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
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

vi.mock('../data-api', () => {
  return {
    useDataApi: mocks.useDataApi,
  };
});

describe('getAuthorizationCheckUrl', () => {
  it('encodes the urn if it contains /', () => {
    expect(getAuthorizationCheckUrl('test/urn')).toBe(
      '/iam/resource/test%2Furn/authorization/check',
    );
  });
});

describe('useAuthorizationIam', () => {
  it('should not fetch data if urn is nil', () => {
    const { result } = renderHook(() => useAuthorizationIam(['test'], ''), {
      wrapper,
    });
    expect(result.current?.isFetching).toBe(false);
  });
  it('should not fetch data if actions is nil', () => {
    const { result } = renderHook(() => useAuthorizationIam([], 'urn'), {
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

describe('useGetResourceTags', () => {
  it('should get and format iam tags for resourceType', async () => {
    mocks.useDataApi.mockReturnValue({
      flattenData: [
        {
          tags: {
            test: 'value1',
            test2: 'value',
          },
        },
        {
          tags: {
            test: 'value2',
          },
        },
      ],
      isLoading: false,
    });
    const { result } = renderHook(
      () => useGetResourceTags({ resourceType: 'dedicatedServer' }),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.tags).toEqual([
        {
          key: 'test',
          values: ['value1', 'value2'],
        },
        {
          key: 'test2',
          values: ['value'],
        },
      ]);
    });
  });
});
