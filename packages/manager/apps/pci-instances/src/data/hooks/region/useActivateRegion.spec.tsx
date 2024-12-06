import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SetupServer } from 'msw/lib/node';
import { FC, PropsWithChildren } from 'react';
import { describe, test, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';
import { setupRegionServer } from '@/__mocks__/region/node';
import { useActivateRegion } from './useActivateRegion';
import regionActivated from '@/__mocks__/region/regionActivated.json';
import { TCatalogDto } from '@/types/catalog/api.types';
import { updateCatalogQueryData, useCatalog } from '../catalog/useCatalog';
import { TActivatedRegionDto } from '@/types/region/api.types';

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
  regionName: string;
  mutationPayload?: TActivatedRegionDto;
};

const fakeProjectId = '8c8c4fd6d4414aa29fc777752b00005198664';

// msw server
let server: SetupServer;

// mocks
const handleError = vi.fn();
const handleSuccess = vi.fn(
  (projectId: string, queryClient: QueryClient) => (name: string) =>
    updateCatalogQueryData(queryClient, projectId, name),
);

describe('Considering the useActivateRegion hook', () => {
  describe.each`
    projectId        | regionName               | mutationPayload
    ${fakeProjectId} | ${''}                    | ${undefined}
    ${fakeProjectId} | ${'EU-CENTRAL-LZ-PRG-A'} | ${undefined}
    ${fakeProjectId} | ${'EU-CENTRAL-LZ-PRG-A'} | ${regionActivated}
  `(
    'Given a projectId <$projectId> and a regionName <$regionName>',
    ({ projectId, regionName, mutationPayload }: Data) => {
      afterEach(() => {
        server?.close();
      });
      test("When invoking activateRegion() mutate's function", async () => {
        server = setupRegionServer(mutationPayload);

        const { wrapper, queryClient } = initQueryClient();

        const { result: useCatalogResult } = renderHook(
          () => useCatalog(projectId),
          {
            wrapper,
          },
        );

        const { result: useActivateRegionResult } = renderHook(
          () =>
            useActivateRegion(projectId, {
              onSuccess: handleSuccess(projectId, queryClient),
              onError: handleError,
            }),
          {
            wrapper,
          },
        );

        expect(useActivateRegionResult.current.isIdle).toBeTruthy();

        act(() => useActivateRegionResult.current.activateRegion(regionName));

        if (!mutationPayload || !regionName.length) {
          await waitFor(() =>
            expect(useActivateRegionResult.current.isError).toBeTruthy(),
          );
          expect(useActivateRegionResult.current.error).toHaveProperty(
            'response.status',
            500,
          );
          expect(useActivateRegionResult.current.error).instanceOf(AxiosError);
          expect(handleError).toHaveBeenCalled();
        } else {
          await waitFor(() =>
            expect(useActivateRegionResult.current.isSuccess).toBeTruthy(),
          );
          const activatedRegion = (useCatalogResult.current
            .data as TCatalogDto).regions.find(
            (region) => region.name === regionName,
          );
          expect(handleSuccess).toHaveBeenCalled();
          expect(activatedRegion).toBeDefined();
          expect(activatedRegion?.isActivated).toBeTruthy();
        }
      });
    },
  );
});
