import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, PropsWithChildren } from 'react';
import { describe, expect, test, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { SetupServer } from 'msw/lib/node';
import { AxiosError } from 'axios';
import { modelSelector, TModelSelector, useCatalog } from './useCatalog';
import { TModelEntity } from '@/types/catalog/entity.types';
import { setupCatalogServer } from '@/__mocks__/catalog/node';
import { instancesQueryKey } from '@/utils';
import mockedCatalog1 from '@/__mocks__/catalog/catalogGenerated1.json';
import mockedCatalog2 from '@/__mocks__/catalog/catalogGenerated2.json';
import { TCatalogDto } from '@/types/catalog/api.types';
import expectedEntity1 from '@/__mocks__/catalog/expectedEntity1.json';
import expectedEntity2 from '@/__mocks__/catalog/expectedEntity2.json';

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
  selector: TModelSelector;
  queryPayload: TCatalogDto;
  expectedModelEntity: TModelEntity;
};

const fakeProjectId = 'p42b4f068f404ef3832435304a316332';

// msw server
let server: SetupServer;

describe('useCatalog hook', () => {
  describe.each`
    projectId        | queryPayload                      | selector         | expectedModelEntity
    ${fakeProjectId} | ${undefined}                      | ${modelSelector} | ${undefined}
    ${fakeProjectId} | ${{ models: [], categories: [] }} | ${modelSelector} | ${{ models: { data: [], categories: [] } }}
    ${fakeProjectId} | ${mockedCatalog1}                 | ${modelSelector} | ${expectedEntity1}
    ${fakeProjectId} | ${mockedCatalog2}                 | ${modelSelector} | ${expectedEntity2}
  `(
    'Given a projectId <$projectId> and a selector <$selector>',
    ({ projectId, selector, queryPayload, expectedModelEntity }: Data) => {
      afterEach(() => {
        server?.close();
      });
      test(`When invoking useCatalog() hook', then, expect the computed model entity to be '${JSON.stringify(
        expectedModelEntity,
      )}'`, async () => {
        server = setupCatalogServer(queryPayload);

        const { wrapper, queryClient } = initQueryClient();
        const { result } = renderHook(() => useCatalog(projectId, selector), {
          wrapper,
        });
        const queryCache = queryClient.getQueryCache();

        expect(result.current.isPending).toBe(true);
        if (queryPayload) {
          await waitFor(() => expect(result.current.isSuccess).toBe(true));
        } else {
          await waitFor(() => expect(result.current.isError).toBe(true));
          expect(result.current.error).toHaveProperty('response.status', 500);
          expect(result.current.error).instanceOf(AxiosError);
        }
        expect(result.current.data).toStrictEqual(expectedModelEntity);
        expect(
          queryCache.getAll().map((cache) => cache.queryKey)[0],
        ).toStrictEqual(instancesQueryKey(projectId, ['catalog']));
      });
    },
  );
});
