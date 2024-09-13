import { AxiosError } from 'axios';
import { SetupServer } from 'msw/node';
import { FC, PropsWithChildren } from 'react';
import { describe, expect, test, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FilterComparator } from '@ovh-ux/manager-core-api';
import {
  TInstance,
  TInstanceStatus,
  useInstances,
  TUseInstancesQueryParams,
} from './useInstances';
import { TInstanceDto, TInstanceStatusDto } from '@/data/api/instances';
import { setupInstanceServer } from '@/_mocks_/instances/node';

// builders
const instanceDtoBuilder = (
  addresses: TInstanceDto['addresses'],
  status: TInstanceStatusDto,
): TInstanceDto => ({
  id: `fake-id`,
  name: `fake-instance-name`,
  flavorId: `fake-flavor-id`,
  flavorName: `fake-flavor-name`,
  imageId: `fake-image-id`,
  imageName: `fake-image-name`,
  region: `fake-region`,
  status,
  addresses,
});

const instanceBuilder = (
  instanceDto: TInstanceDto,
  addresses: TInstance['addresses'],
  status: TInstanceStatus,
): TInstance => ({
  ...instanceDto,
  addresses,
  status,
});

// initializers
const initQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const wrapper: FC<PropsWithChildren> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper, queryClient };
};

// test data
type Data = {
  projectId: string;
  queryParamaters: TUseInstancesQueryParams;
  queryPayload?: TInstanceDto[];
  expectedInstances: TInstance[];
  expectedQueryHasNext: boolean;
  expectedInstancesAfterRefetch: TInstance[];
  expectedQueryKey: string[];
};

const fakeProjectId = 'p42b4f068f404ef3832435304a316332';
const fakeQueryParamaters1: TUseInstancesQueryParams = {
  limit: 10,
  sort: 'name',
  sortOrder: 'asc',
  filters: [],
};
const fakeQueryParamaters2: TUseInstancesQueryParams = {
  limit: 1,
  sort: 'name',
  sortOrder: 'asc',
  filters: [],
};
const fakeQueryParamaters3: TUseInstancesQueryParams = {
  limit: 10,
  sort: 'image',
  sortOrder: 'desc',
  filters: [],
};
const fakeQueryParamaters4: TUseInstancesQueryParams = {
  limit: 10,
  sort: 'flavor',
  sortOrder: 'asc',
  filters: [
    {
      key: 'search',
      label: 'flavor',
      comparator: FilterComparator.IsEqual,
      value: 'foo',
    },
  ],
};

const fakeInstanceDto1: TInstanceDto = instanceDtoBuilder([], 'ACTIVE');
const fakeInstance1: TInstance = instanceBuilder(fakeInstanceDto1, new Map(), {
  state: 'ACTIVE',
  severity: 'success',
});

const fakeInstanceDto2: TInstanceDto = instanceDtoBuilder(
  [{ type: 'private', ip: '192.00.123.34', gatewayIp: '', version: 1 }],
  'ERROR',
);
const fakeInstance2: TInstance = instanceBuilder(
  fakeInstanceDto2,
  new Map().set('private', [
    {
      ip: '192.00.123.34',
      gatewayIp: '',
      version: 1,
    },
  ]),
  { state: 'ERROR', severity: 'error' },
);

const fakeInstanceDto3: TInstanceDto = instanceDtoBuilder(
  [
    { type: 'private', ip: '192.00.123.34', gatewayIp: '', version: 1 },
    { type: 'public', ip: '193.02.689.00', gatewayIp: '', version: 2 },
    { type: 'public', ip: '191.01.045.10', gatewayIp: '', version: 7 },
  ],
  'DELETING',
);
const fakeInstance3: TInstance = instanceBuilder(
  fakeInstanceDto3,
  new Map()
    .set('private', [
      {
        ip: '192.00.123.34',
        gatewayIp: '',
        version: 1,
      },
    ])
    .set('public', [
      { ip: '193.02.689.00', gatewayIp: '', version: 2 },
      { ip: '191.01.045.10', gatewayIp: '', version: 7 },
    ]),
  { state: 'DELETING', severity: 'info' },
);

const fakeInstanceDto4: TInstanceDto = instanceDtoBuilder(
  [
    { type: 'public', ip: '193.02.689.00', gatewayIp: '', version: 2 },
    { type: 'public', ip: '193.02.689.00', gatewayIp: '', version: 7 },
  ],
  'BUILD',
);
const fakeInstance4: TInstance = instanceBuilder(
  fakeInstanceDto4,
  new Map().set('public', [
    {
      ip: '193.02.689.00',
      gatewayIp: '',
      version: 2,
    },
  ]),
  { state: 'BUILD', severity: 'warning' },
);

const fakeQueryKey1 = [
  'project',
  'p42b4f068f404ef3832435304a316332',
  'instances',
  'list',
  'sort',
  'name',
  'asc',
];

const fakeQueryKey2 = [
  'project',
  'p42b4f068f404ef3832435304a316332',
  'instances',
  'list',
  'sort',
  'image',
  'desc',
];

const fakeQueryKey3 = [
  'project',
  'p42b4f068f404ef3832435304a316332',
  'instances',
  'list',
  'sort',
  'flavor',
  'asc',
  'filter',
  'flavor',
  'is_equal',
  'foo',
];

// msw server
let server: SetupServer;

describe('UseInstances hook', () => {
  describe.each`
    projectId        | queryParamaters         | queryPayload                            | expectedInstances                 | expectedQueryHasNext | expectedInstancesAfterRefetch     | expectedQueryKey
    ${fakeProjectId} | ${fakeQueryParamaters1} | ${[]}                                   | ${[]}                             | ${false}             | ${undefined}                      | ${fakeQueryKey1}
    ${fakeProjectId} | ${fakeQueryParamaters1} | ${[fakeInstanceDto1]}                   | ${[fakeInstance1]}                | ${false}             | ${undefined}                      | ${fakeQueryKey1}
    ${fakeProjectId} | ${fakeQueryParamaters3} | ${[fakeInstanceDto1]}                   | ${[fakeInstance1]}                | ${false}             | ${undefined}                      | ${fakeQueryKey2}
    ${fakeProjectId} | ${fakeQueryParamaters4} | ${[fakeInstanceDto1]}                   | ${[fakeInstance1]}                | ${false}             | ${undefined}                      | ${fakeQueryKey3}
    ${fakeProjectId} | ${fakeQueryParamaters1} | ${[fakeInstanceDto1, fakeInstanceDto2]} | ${[fakeInstance1, fakeInstance2]} | ${false}             | ${undefined}                      | ${fakeQueryKey1}
    ${fakeProjectId} | ${fakeQueryParamaters2} | ${[fakeInstanceDto1, fakeInstanceDto2]} | ${[fakeInstance1]}                | ${true}              | ${[fakeInstance1, fakeInstance1]} | ${fakeQueryKey1}
    ${fakeProjectId} | ${fakeQueryParamaters1} | ${[fakeInstanceDto2]}                   | ${[fakeInstance2]}                | ${false}             | ${undefined}                      | ${fakeQueryKey1}
    ${fakeProjectId} | ${fakeQueryParamaters1} | ${[fakeInstanceDto3]}                   | ${[fakeInstance3]}                | ${false}             | ${undefined}                      | ${fakeQueryKey1}
    ${fakeProjectId} | ${fakeQueryParamaters1} | ${[fakeInstanceDto4]}                   | ${[fakeInstance4]}                | ${false}             | ${undefined}                      | ${fakeQueryKey1}
    ${fakeProjectId} | ${fakeQueryParamaters1} | ${undefined}                            | ${undefined}                      | ${false}             | ${undefined}                      | ${fakeQueryKey1}
  `(
    'Given a projectId <$projectId> and query parameters <$queryParamaters>',
    ({
      projectId,
      queryParamaters,
      queryPayload,
      expectedInstances,
      expectedQueryHasNext,
      expectedInstancesAfterRefetch,
      expectedQueryKey,
    }: Data) => {
      describe('useInstances() hook', () => {
        afterEach(() => {
          server?.close();
        });
        test(`When invoking useInstances() hook', then, expect the computed instances to be '${JSON.stringify(
          expectedInstances,
        )}' and the query hasNext property to be ${expectedQueryHasNext}`, async () => {
          server = setupInstanceServer<TInstanceDto[]>(queryPayload);

          const { wrapper, queryClient } = initQueryClient();
          const { result } = renderHook(
            () => useInstances(projectId, queryParamaters),
            {
              wrapper,
            },
          );

          expect(result.current.isPending).toBe(true);

          if (queryPayload) {
            await waitFor(() => expect(result.current.isSuccess).toBe(true));
          } else {
            await waitFor(() => expect(result.current.isError).toBe(true));
            expect(result.current.error).toHaveProperty('response.status', 500);
            expect(result.current.error).instanceOf(AxiosError);
          }

          const queryCache = queryClient.getQueryCache();
          expect(result.current.hasNextPage).toBe(expectedQueryHasNext);
          expect(result.current.data).toStrictEqual(expectedInstances);

          if (result.current.hasNextPage) {
            await act(() => result.current.fetchNextPage());
            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(result.current.data).toStrictEqual(
              expectedInstancesAfterRefetch,
            );
          }

          expect(
            queryCache.getAll().map((cache) => cache.queryKey)[0],
          ).toStrictEqual(expectedQueryKey);

          act(() => result.current.refresh());
          expect(
            queryCache.getAll().map((cache) => cache.queryKey).length,
          ).toStrictEqual(0);
        });
      });
    },
  );
});
