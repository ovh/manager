import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { type Mock, vi, vitest } from 'vitest';

import { MockPage } from '@/commons/tests-utils/Type.utils';
import { UseQueryResult } from '@/hooks/data-api/infra/tanstack';
import { IamCheckResponse } from '@/hooks/iam/IAM.type';
import { useAuthorizationIam } from '@/hooks/iam/useOvhIam';

export const mockTrackPage = vitest.fn();
export const mockGetEnvironment = vitest.fn();

export const shellContext = {
  shell: {
    environment: { getEnvironment: mockGetEnvironment },
    tracking: { trackPage: mockTrackPage },
    navigation: {
      navigateTo: vitest.fn(),
      reload: vitest.fn(),
    },
    ux: { hidePreloader: vitest.fn() },
  },
};

export const buildIamMock = (
  overrides?: Partial<UseQueryResult<IamCheckResponse> & { isAuthorized: boolean }>,
): ReturnType<typeof useAuthorizationIam> => {
  const baseData: IamCheckResponse = {
    urn: 'urn:v18:eu:resource:m--components:test',
    authorizedActions: ['test:action:read'],
    unauthorizedActions: [],
  };

  return {
    data: baseData,
    error: undefined,
    isError: false,
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    status: 'success',
    isAuthorized: true,
    refetch: vitest.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useAuthorizationIam>;
};

export const mockUseAuthorizationIam = useAuthorizationIam as unknown as Mock<
  () => ReturnType<typeof useAuthorizationIam>
>;

export const mockUseBreadcrumb = () =>
  vi.mock('@/hooks/breadcrumb/useBreadcrumb', () => ({
    useBreadcrumb: vi.fn(({ hideRootLabel }: { hideRootLabel?: boolean }) => [
      { label: 'vRack services', href: '/', hideLabel: hideRootLabel },
      { label: 'vRack service', href: '/:id', hideLabel: false },
      { label: 'vRack service listing', href: '/:id/listing', hideLabel: false },
    ]),
  }));

export async function fetchNextPage(
  fn: (() => Promise<unknown>) | (() => void),
  numberOfTimes: number,
): Promise<void> {
  for (let i = 0; i < numberOfTimes; i += 1) {
    const result = fn();
    if (result instanceof Promise) {
      await result;
    }
  }
}

const mockData: InfiniteData<MockPage> = {
  pages: [],
  pageParams: [],
};

export const mockResult: UseInfiniteQueryResult<InfiniteData<MockPage>, Error> = {
  data: mockData,
  fetchNextPage: vi.fn(),
  fetchPreviousPage: vi.fn(),
  hasNextPage: false,
  hasPreviousPage: false,
  isFetching: false,
  isFetchingNextPage: false,
  isFetchingPreviousPage: false,
  isError: false,
  isLoading: false,
  isSuccess: true,
  status: 'success',
  error: null,
  refetch: vi.fn(),
  // optional flags present in TanStack v5
  isPending: false,
  isLoadingError: false,
  isRefetchError: false,
  isFetchNextPageError: false,
} as Partial<UseInfiniteQueryResult<InfiniteData<MockPage>, Error>> as UseInfiniteQueryResult<
  InfiniteData<MockPage>,
  Error
>;

const mockInfiniteData: InfiniteData<MockPage> = {
  pages: [],
  pageParams: [],
};

export const mockInfiniteResult: UseInfiniteQueryResult<InfiniteData<MockPage>, Error> = {
  data: mockInfiniteData,
  fetchNextPage: vi.fn(),
  fetchPreviousPage: vi.fn(),
  hasNextPage: false,
  hasPreviousPage: false,
  isFetching: false,
  isFetchingNextPage: false,
  isFetchingPreviousPage: false,
  isError: false,
  isLoading: false,
  isSuccess: true,
  status: 'success',
  error: null,
  refetch: vi.fn(),
  isPending: false,
  isLoadingError: false,
  isRefetchError: false,
  isFetchNextPageError: false,
} as Partial<UseInfiniteQueryResult<InfiniteData<MockPage>, Error>> as UseInfiniteQueryResult<
  InfiniteData<MockPage>,
  Error
>;

export const mockQueryResult: Partial<UseQueryResult<Record<string, unknown>, Error>> = {
  data: {},
  error: null,
  status: 'success',
  isSuccess: true,
  isError: false,
};
