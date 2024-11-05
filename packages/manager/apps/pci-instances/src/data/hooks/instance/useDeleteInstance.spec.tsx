import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SetupServer } from 'msw/lib/node';
import { FC, PropsWithChildren } from 'react';
import { describe, test, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';
import {
  TInstance,
  updateDeletedInstanceStatus,
  useInstances,
} from './useInstances';
import { setupInstancesServer } from '@/__mocks__/instance/node';
import { useDeleteInstance } from './useDeleteInstance';
import { TInstanceDto } from '@/types/instance/api.types';
import { TInstancesServerResponse } from '@/__mocks__/instance/handlers';

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
  instanceId: string;
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
  },
];

// msw server
let server: SetupServer;

// mocks
const handleError = vi.fn();
const handleSuccess = vi.fn(
  (instanceId: string, queryClient: QueryClient) => () =>
    updateDeletedInstanceStatus(queryClient, instanceId),
);

describe('Considering the useDeleteInstance hook', () => {
  describe.each`
    projectId        | instanceId     | queryPayload        | mutationPayload
    ${fakeProjectId} | ${'fake-id-1'} | ${undefined}        | ${undefined}
    ${fakeProjectId} | ${'fake-id-1'} | ${fakeInstancesDto} | ${undefined}
    ${fakeProjectId} | ${'fake-id-1'} | ${fakeInstancesDto} | ${null}
  `(
    'Given a projectId <$projectId> and an instanceId <$instanceId>',
    ({ projectId, instanceId, queryPayload, mutationPayload }: Data) => {
      afterEach(() => {
        server?.close();
      });
      test("When invoking deleteInstance() mutate's function", async () => {
        const serverResponse: TInstancesServerResponse[] = [
          {
            method: 'get',
            payload: queryPayload,
          },
          {
            method: 'delete',
            payload: mutationPayload,
          },
        ];
        server = setupInstancesServer(serverResponse);

        const { wrapper, queryClient } = initQueryClient();

        const { result: useInstancesResult } = renderHook(
          () =>
            useInstances(projectId, {
              limit: 10,
              sort: 'name',
              sortOrder: 'asc',
              filters: [],
            }),
          {
            wrapper,
          },
        );

        const { result: useDeleteInstanceResult } = renderHook(
          () =>
            useDeleteInstance(projectId, {
              onSuccess: handleSuccess(instanceId, queryClient),
              onError: handleError,
            }),
          {
            wrapper,
          },
        );

        await waitFor(() =>
          expect(useInstancesResult.current.isPending).toBe(false),
        );
        expect(useDeleteInstanceResult.current.isIdle).toBeTruthy();
        act(() => useDeleteInstanceResult.current.deleteInstance(instanceId));

        if (mutationPayload === undefined) {
          await waitFor(() =>
            expect(useDeleteInstanceResult.current.isError).toBeTruthy(),
          );
          expect(useDeleteInstanceResult.current.error).toHaveProperty(
            'response.status',
            500,
          );
          expect(useDeleteInstanceResult.current.error).instanceOf(AxiosError);
          expect(handleError).toHaveBeenCalled();
        } else {
          await waitFor(() =>
            expect(useDeleteInstanceResult.current.isSuccess).toBeTruthy(),
          );
          const deletedInstance = (useInstancesResult.current
            .data as TInstance[]).find((elt) => elt.id === instanceId);
          expect(handleSuccess).toHaveBeenCalled();
          expect(deletedInstance).toBeDefined();
          expect(deletedInstance?.status.state).toStrictEqual('DELETING');
        }
      });
    },
  );
});
