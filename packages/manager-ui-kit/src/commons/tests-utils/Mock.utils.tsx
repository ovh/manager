import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { vi, vitest } from 'vitest';

import type { User } from '@ovh-ux/manager-config';
import { Environment } from '@ovh-ux/manager-config';
import type { ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { MockPage } from '@/commons/tests-utils/Type.utils';
import type { IMe } from '@/hooks';
import { UseQueryResult } from '@/hooks/data-api/infra/tanstack';
import { IamCheckResponse } from '@/hooks/iam/IAM.type';
import { useAuthorizationIam } from '@/hooks/iam/useOvhIam';
import { locations1AZ, locations3AZ, locationsLZ } from '@/hooks/location/__mocks__/location';

export const mockTrackPage = vitest.fn();
export const mockGetEnvironment = vitest.fn();
export const mockGetLocations = vitest.fn(() =>
  Promise.resolve([...locations3AZ, ...locations1AZ, ...locationsLZ]),
);

export const shellContext = {
  shell: {
    environment: { getEnvironment: mockGetEnvironment },
    tracking: { trackPage: mockTrackPage },
    navigation: {
      navigateTo: vitest.fn(),
      reload: vitest.fn(),
    },
    ux: { hidePreloader: vitest.fn() },
    location: {
      getLocations: mockGetLocations,
    },
  },
} as unknown as ShellContextType;

export const buildShellContextMock = (me: IMe | null | undefined): Partial<ShellContextType> => {
  const env = new Environment();
  env.getUser = vi.fn(() => me as unknown as User);
  env.setUser = vi.fn();
  env.setRegion = vi.fn();
  env.setVersion = vi.fn();

  return {
    environment: env,
    shell: {
      navigation: { navigateTo: vi.fn(), reload: vi.fn() },
      tracking: { trackPage: vi.fn() },
      ux: { displaySuccessMessage: vi.fn(), displayErrorMessage: vi.fn() },
      i18n: { getLocale: vi.fn(() => 'en_GB') },
      routing: { getRoute: vi.fn() },
      auth: { login: vi.fn(), logout: vi.fn() },
      location: {
        getLocations: mockGetLocations,
      },
      logger: { log: vi.fn(), error: vi.fn() },
    } as unknown as ShellContextType['shell'],
  };
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

export const mockUseAuthorizationIam = vi.fn();

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

export const mockQueryResult: Partial<UseQueryResult<Record<string, unknown>, Error>> = {
  data: {},
  error: null,
  status: 'success',
  isSuccess: true,
  isError: false,
};
