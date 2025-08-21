import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SetupServer } from 'msw/node';
import { FC, PropsWithChildren } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { isAxiosError } from 'axios';
import { updateInstancesFromCache, useInstances } from '../useInstances';
import { setupInstancesServer } from '@/__mocks__/instance/node';
import { TAggregatedInstanceDto } from '@/types/instance/api.type';
import { TInstancesServerResponse } from '@/__mocks__/instance/handlers';
import { TMutationFnType, useBaseInstanceAction } from './useInstanceAction';
import { TAggregatedInstance } from '@/types/instance/entity.type';

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
  instance: TAggregatedInstanceDto | null;
  type: TMutationFnType | null;
  queryPayload?: TAggregatedInstanceDto[];
  mutationPayload?: null;
};

const fakeProjectId = '8c8c4fd6d4414aa29fc777752b00005198664';

const fakeInstancesDto: TAggregatedInstanceDto[] = [
  {
    id: `fake-id-1`,
    name: `fake-instance-name-1`,
    flavorId: `fake-flavor-id-1`,
    flavorName: `fake-flavor-name-1`,
    imageId: `fake-image-id-1`,
    imageName: `fake-image-name-1`,
    region: `fake-region-1`,
    status: 'ACTIVE',
    addresses: [],
    volumes: [],
    actions: [],
    pendingTask: false,
    availabilityZone: null,
    taskState: '',
    isImageDeprecated: false,
  },
  {
    id: `fake-id-2`,
    name: `fake-instance-name-2`,
    flavorId: `fake-flavor-id-2`,
    flavorName: `fake-flavor-name-2`,
    imageId: `fake-image-id-2`,
    imageName: `fake-image-name-2`,
    region: `fake-region-2`,
    status: 'ACTIVE',
    addresses: [],
    volumes: [],
    pendingTask: false,
    actions: [],
    availabilityZone: null,
    taskState: '',
    isImageDeprecated: false,
  },
];

const fakeInstance = fakeInstancesDto[0];

// msw server
let server: SetupServer;

// mocks
const handleError = vi.fn();
const handleSuccess = vi.fn((instance, queryClient: QueryClient) => () =>
  updateInstancesFromCache(queryClient, {
    projectId: fakeProjectId,
    instance: { ...instance, task: { isPending: true, status: '' } },
  }),
);

describe('Considering the useInstanceAction hook', () => {
  describe.each`
    projectId        | instance        | type             | queryPayload        | mutationPayload
    ${fakeProjectId} | ${fakeInstance} | ${'delete'}      | ${undefined}        | ${undefined}
    ${fakeProjectId} | ${fakeInstance} | ${null}          | ${undefined}        | ${undefined}
    ${fakeProjectId} | ${null}         | ${'stop'}        | ${undefined}        | ${undefined}
    ${fakeProjectId} | ${fakeInstance} | ${'start'}       | ${fakeInstancesDto} | ${null}
    ${fakeProjectId} | ${fakeInstance} | ${'stop'}        | ${fakeInstancesDto} | ${null}
    ${fakeProjectId} | ${fakeInstance} | ${'shelve'}      | ${fakeInstancesDto} | ${null}
    ${fakeProjectId} | ${fakeInstance} | ${'unshelve'}    | ${fakeInstancesDto} | ${null}
    ${fakeProjectId} | ${fakeInstance} | ${'soft-reboot'} | ${fakeInstancesDto} | ${null}
  `(
    'Given a projectId <$projectId> and an instanceId <$instance.id>',
    ({ projectId, instance, type, queryPayload, mutationPayload }: Data) => {
      afterEach(() => {
        server.close();
      });
      test("When invoking mutationHandler() mutate's function", async () => {
        const serverResponse: TInstancesServerResponse[] = [
          {
            method: 'get',
            payload: queryPayload,
          },
          {
            method: type === 'delete' ? 'delete' : 'post',
            payload: mutationPayload,
          },
        ];
        server = setupInstancesServer(serverResponse);

        const { wrapper, queryClient } = initQueryClient();

        const { result: useInstancesResult } = renderHook(
          () =>
            useInstances({
              limit: 20,
              sort: 'name',
              sortOrder: 'asc',
              filters: [],
            }),
          {
            wrapper,
          },
        );

        const { result: useInstanceActionResult } = renderHook(
          () =>
            useBaseInstanceAction(type, projectId, {
              onSuccess: handleSuccess(
                instance as TAggregatedInstanceDto,
                queryClient,
              ),
              onError: handleError,
            }),
          {
            wrapper,
          },
        );

        await waitFor(() =>
          expect(useInstancesResult.current.isPending).toBe(false),
        );
        expect(useInstanceActionResult.current.isIdle).toBeTruthy();
        act(() =>
          useInstanceActionResult.current.mutationHandler(
            instance as TAggregatedInstanceDto,
          ),
        );

        if (mutationPayload === undefined) {
          await waitFor(() =>
            expect(useInstanceActionResult.current.isError).toBeTruthy(),
          );

          if (type && instance) {
            expect(useInstanceActionResult.current.error).toHaveProperty(
              'response.status',
              500,
            );
            expect(
              isAxiosError(useInstanceActionResult.current.error),
            ).toBeTruthy();
          }
          expect(handleError).toHaveBeenCalled();
        } else {
          await waitFor(() =>
            expect(useInstanceActionResult.current.isSuccess).toBeTruthy(),
          );

          const cacheInstance = (useInstancesResult.current
            .data as TAggregatedInstance[]).find(
            (elt) => elt.id === instance?.id,
          );
          expect(handleSuccess).toHaveBeenCalled();
          expect(cacheInstance).toBeDefined();
          expect(cacheInstance?.pendingTask).toBeTruthy();
        }
      });
    },
  );
});
