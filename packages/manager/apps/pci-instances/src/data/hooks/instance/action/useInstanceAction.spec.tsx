import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SetupServer } from 'msw/lib/node';
import { FC, PropsWithChildren } from 'react';
import { describe, test, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { isAxiosError } from 'axios';
import { updateDeletedInstanceStatus, useInstances } from '../useInstances';
import { setupInstancesServer } from '@/__mocks__/instance/node';
import { TInstanceDto } from '@/types/instance/api.type';
import { TInstancesServerResponse } from '@/__mocks__/instance/handlers';
import { TMutationFnType, useInstanceAction } from './useInstanceAction';
import { TInstance } from '@/types/instance/entity.type';

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
  instanceId: string | undefined;
  type: TMutationFnType | null;
  queryPayload?: TInstanceDto[];
  mutationPayload?: null;
};

const fakeProjectId = '8c8c4fd6d4414aa29fc777752b00005198664';

const fakeInstancesDto: TInstanceDto[] = [
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
    actions: [],
  },
];

// msw server
let server: SetupServer;

// mocks
const handleError = vi.fn();
const handleSuccess = vi.fn(
  (instanceId: string, queryClient: QueryClient) => () =>
    updateDeletedInstanceStatus(fakeProjectId, queryClient, instanceId),
);

describe('Considering the useInstanceAction hook', () => {
  describe.each`
    projectId        | instanceId     | type          | queryPayload        | mutationPayload
    ${fakeProjectId} | ${'fake-id-1'} | ${'delete'}   | ${undefined}        | ${undefined}
    ${fakeProjectId} | ${'fake-id-1'} | ${null}       | ${undefined}        | ${undefined}
    ${fakeProjectId} | ${null}        | ${'stop'}     | ${undefined}        | ${undefined}
    ${fakeProjectId} | ${'fake-id-1'} | ${'start'}    | ${fakeInstancesDto} | ${null}
    ${fakeProjectId} | ${'fake-id-1'} | ${'stop'}     | ${fakeInstancesDto} | ${null}
    ${fakeProjectId} | ${'fake-id-1'} | ${'shelve'}   | ${fakeInstancesDto} | ${null}
    ${fakeProjectId} | ${'fake-id-1'} | ${'unshelve'} | ${fakeInstancesDto} | ${null}
  `(
    'Given a projectId <$projectId> and an instanceId <$instanceId>',
    ({ projectId, instanceId, type, queryPayload, mutationPayload }: Data) => {
      afterEach(() => {
        server?.close();
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
            useInstances(projectId, '', {
              limit: 10,
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
            useInstanceAction(type, projectId, {
              onSuccess: handleSuccess(instanceId as string, queryClient),
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
        act(() => useInstanceActionResult.current.mutationHandler(instanceId));

        if (mutationPayload === undefined) {
          await waitFor(() =>
            expect(useInstanceActionResult.current.isError).toBeTruthy(),
          );

          if (type && instanceId) {
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
          if (type === 'delete') {
            const deletedInstance = (useInstancesResult.current
              .data as TInstance[]).find((elt) => elt.id === instanceId);
            expect(handleSuccess).toHaveBeenCalled();
            expect(deletedInstance).toBeDefined();
            expect(deletedInstance?.status.state).toStrictEqual('DELETING');
          }
        }
      });
    },
  );
});
