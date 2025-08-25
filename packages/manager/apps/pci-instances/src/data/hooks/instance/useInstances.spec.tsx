import { isAxiosError } from 'axios';
import { SetupServer } from 'msw/node';
import { FC, PropsWithChildren } from 'react';
import { describe, expect, test, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FilterComparator } from '@ovh-ux/manager-core-api';
import { useInstances, TUseInstancesQueryParams } from './useInstances';
import {
  TAggregatedInstanceDto,
  TInstanceStatusDto,
} from '@/types/instance/api.type';
import { setupInstancesServer } from '@/__mocks__/instance/node';
import { TInstancesServerResponse } from '@/__mocks__/instance/handlers';
import {
  TAggregatedInstance,
  TAggregatedInstanceStatus,
} from '@/types/instance/entity.type';

// builders
const instanceDtoBuilder = (
  addresses: TAggregatedInstanceDto['addresses'],
  status: TInstanceStatusDto,
): TAggregatedInstanceDto => ({
  id: `fake-id`,
  name: `fake-instance-name`,
  flavorId: `fake-flavor-id`,
  flavorName: `fake-flavor-name`,
  imageId: `fake-image-id`,
  imageName: `fake-image-name`,
  region: `fake-region`,
  status,
  addresses,
  volumes: [],
  actions: [],
  pendingTask: false,
  availabilityZone: null,
  taskState: '',
  isImageDeprecated: false,
});

const instanceBuilder = (
  instanceDto: TAggregatedInstanceDto,
  addresses: TAggregatedInstance['addresses'],
  status: TAggregatedInstanceStatus,
): TAggregatedInstance => ({
  ...instanceDto,
  addresses,
  status,
  actions: new Map(),
  taskState: null,
  creationDate: null,
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
  queryParamaters: TUseInstancesQueryParams;
  queryPayload?: TAggregatedInstanceDto[];
  expectedInstances: TAggregatedInstance[];
  expectedQueryHasNext: boolean;
  expectedInstancesAfterRefetch: TAggregatedInstance[];
  expectedQueryKey: string[];
};

const fakeQueryParamaters1: TUseInstancesQueryParams = {
  limit: 20,
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
  limit: 20,
  sort: 'image',
  sortOrder: 'desc',
  filters: [],
};
const fakeQueryParamaters4: TUseInstancesQueryParams = {
  limit: 20,
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

const fakeInstanceDto1: TAggregatedInstanceDto = instanceDtoBuilder(
  [],
  'ACTIVE',
);
const fakeInstance1: TAggregatedInstance = instanceBuilder(
  fakeInstanceDto1,
  new Map(),
  {
    label: 'ACTIVE',
    severity: 'success',
  },
);

const fakeInstanceDto2: TAggregatedInstanceDto = instanceDtoBuilder(
  [{ type: 'private', ip: '192.00.123.34', gatewayIp: '', version: 1 }],
  'ERROR',
);
const fakeInstance2: TAggregatedInstance = instanceBuilder(
  fakeInstanceDto2,
  new Map().set('private', [
    {
      ip: '192.00.123.34',
      gatewayIp: '',
      version: 1,
    },
  ]),
  { label: 'ERROR', severity: 'error' },
);

const fakeInstanceDto3: TAggregatedInstanceDto = instanceDtoBuilder(
  [
    { type: 'private', ip: '192.00.123.34', gatewayIp: '', version: 1 },
    { type: 'public', ip: '193.02.689.00', gatewayIp: '', version: 2 },
    { type: 'public', ip: '191.01.045.10', gatewayIp: '', version: 7 },
  ],
  'DELETING',
);
const fakeInstance3: TAggregatedInstance = instanceBuilder(
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
  { label: 'DELETING', severity: 'info' },
);

const fakeInstanceDto4: TAggregatedInstanceDto = instanceDtoBuilder(
  [
    { type: 'public', ip: '193.02.689.00', gatewayIp: '', version: 2 },
    { type: 'public', ip: '193.02.689.00', gatewayIp: '', version: 7 },
  ],
  'BUILD',
);
const fakeInstance4: TAggregatedInstance = instanceBuilder(
  fakeInstanceDto4,
  new Map().set('public', [
    {
      ip: '193.02.689.00',
      gatewayIp: '',
      version: 2,
    },
  ]),
  { label: 'BUILD', severity: 'warning' },
);

const fakeQueryKey1 = [
  'project',
  '8c8c4fd6d4414aa29fc777752b00005198664',
  'instances',
  'list',
  'sort',
  'name',
  'asc',
];

const fakeQueryKey2 = [
  'project',
  '8c8c4fd6d4414aa29fc777752b00005198664',
  'instances',
  'list',
  'sort',
  'image',
  'desc',
];

const fakeQueryKey3 = [
  'project',
  '8c8c4fd6d4414aa29fc777752b00005198664',
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
    queryParamaters         | queryPayload                            | expectedInstances                 | expectedQueryHasNext | expectedInstancesAfterRefetch     | expectedQueryKey
    ${fakeQueryParamaters1} | ${[]}                                   | ${[]}                             | ${false}             | ${undefined}                      | ${fakeQueryKey1}
    ${fakeQueryParamaters1} | ${[fakeInstanceDto1]}                   | ${[fakeInstance1]}                | ${false}             | ${undefined}                      | ${fakeQueryKey1}
    ${fakeQueryParamaters3} | ${[fakeInstanceDto1]}                   | ${[fakeInstance1]}                | ${false}             | ${undefined}                      | ${fakeQueryKey2}
    ${fakeQueryParamaters4} | ${[fakeInstanceDto1]}                   | ${[fakeInstance1]}                | ${false}             | ${undefined}                      | ${fakeQueryKey3}
    ${fakeQueryParamaters1} | ${[fakeInstanceDto1, fakeInstanceDto2]} | ${[fakeInstance1, fakeInstance2]} | ${false}             | ${undefined}                      | ${fakeQueryKey1}
    ${fakeQueryParamaters2} | ${[fakeInstanceDto1, fakeInstanceDto2]} | ${[fakeInstance1]}                | ${true}              | ${[fakeInstance1, fakeInstance1]} | ${fakeQueryKey1}
    ${fakeQueryParamaters1} | ${[fakeInstanceDto2]}                   | ${[fakeInstance2]}                | ${false}             | ${undefined}                      | ${fakeQueryKey1}
    ${fakeQueryParamaters1} | ${[fakeInstanceDto3]}                   | ${[fakeInstance3]}                | ${false}             | ${undefined}                      | ${fakeQueryKey1}
    ${fakeQueryParamaters1} | ${[fakeInstanceDto4]}                   | ${[fakeInstance4]}                | ${false}             | ${undefined}                      | ${fakeQueryKey1}
    ${fakeQueryParamaters1} | ${undefined}                            | ${undefined}                      | ${false}             | ${undefined}                      | ${fakeQueryKey1}
  `(
    'Given query parameters <$queryParamaters>',
    ({
      queryParamaters,
      queryPayload,
      expectedInstances,
      expectedQueryHasNext,
      expectedInstancesAfterRefetch,
      expectedQueryKey,
    }: Data) => {
      describe('useInstances() hook', () => {
        afterEach(() => {
          server.close();
        });
        test(`When invoking useInstances() hook', then, expect the computed instances to be '${JSON.stringify(
          expectedInstances,
        )}' and the query hasNext property to be ${expectedQueryHasNext}`, async () => {
          const serverResponse: TInstancesServerResponse[] = [
            {
              method: 'get',
              payload: queryPayload,
            },
          ];
          server = setupInstancesServer(serverResponse);

          const { wrapper, queryClient } = initQueryClient();
          const { result } = renderHook(() => useInstances(queryParamaters), {
            wrapper,
          });

          expect(result.current.isPending).toBe(true);

          if (queryPayload) {
            await waitFor(() => expect(result.current.isSuccess).toBe(true));
          } else {
            await waitFor(() => expect(result.current.isError).toBe(true));
            expect(result.current.error).toHaveProperty('response.status', 500);
            expect(isAxiosError(result.current.error)).toBeTruthy();
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
          ).toStrictEqual(1);
        });
      });
    },
  );
});
