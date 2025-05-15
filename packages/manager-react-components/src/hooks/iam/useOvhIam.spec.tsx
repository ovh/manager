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

const mocks = vi.hoisted(() => ({
  fetchIcebergV2: vi.fn(),
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
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

vi.mock('@ovh-ux/manager-core-api', async (importOriginal) => {
  const original = await importOriginal<
    typeof import('@ovh-ux/manager-core-api')
  >();
  return {
    ...original,
    apiClient: {
      v2: {
        get: vi.fn(),
      },
    },
    fetchIcebergV2: mocks.fetchIcebergV2,
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

describe('useGetResourceTags', () => {
  it('should get and format iam tags for resourceType', async () => {
    mocks.fetchIcebergV2.mockResolvedValue({
      data: [
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
