import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, PropsWithChildren } from 'react';
import { describe, expect, test, afterEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { SetupServer } from 'msw/lib/node';
import { AxiosError } from 'axios';
import { TUseCatalogSelector, useCatalog } from './useCatalog';
import { TModelEntity, TRegionEntity } from '@/types/catalog/entity.types';
import { setupCatalogServer } from '@/__mocks__/catalog/node';
import { instancesQueryKey } from '@/utils';
import mockedCatalog1 from '@/__mocks__/catalog/catalogGenerated1.json';
import mockedCatalog2 from '@/__mocks__/catalog/catalogGenerated2.json';
import mockedCatalog3 from '@/__mocks__/catalog/catalogGenerated3.json';
import { TCatalogDto } from '@/types/catalog/api.types';
import expectedEntity1 from '@/__mocks__/catalog/expectedEntity1.json';
import expectedEntity2 from '@/__mocks__/catalog/expectedEntity2.json';
import expectedEntity3 from '@/__mocks__/catalog/expectedEntity3.json';
import expectedEntity4 from '@/__mocks__/catalog/expectedEntity4.json';
import { useAppStore } from '@/store/hooks/useAppStore';

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

// helpers
const expectStrictEqual = async (result: any, expected: any) => {
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toStrictEqual(expected);
};

// global data
const fakeProjectId = 'p42b4f068f404ef3832435304a316332';
const emptyCatalog: TCatalogDto = {
  projectId: fakeProjectId,
  models: [],
  categories: [],
  regionCategories: [],
  regions: [],
};

// msw server
let server: SetupServer;

describe('Considering the useCatalog() hook', () => {
  describe('When invoked with no selector', () => {
    // test data
    type Data = {
      projectId: string;
      queryPayload?: TCatalogDto;
      expectedRawData: TCatalogDto;
      enabled: boolean;
    };
    describe.each`
      projectId        | queryPayload      | expectedRawData   | enabled
      ${fakeProjectId} | ${undefined}      | ${undefined}      | ${true}
      ${fakeProjectId} | ${mockedCatalog3} | ${mockedCatalog3} | ${true}
      ${fakeProjectId} | ${mockedCatalog3} | ${undefined}      | ${false}
    `(
      'Given a projectId <$projectId> and a enabled option parameter <$enabled>',
      ({ projectId, queryPayload, expectedRawData, enabled }: Data) => {
        afterEach(() => {
          server?.close();
        });
        test('When invoking useCatalog() hook, then, expect to receive raw data', async () => {
          server = setupCatalogServer(queryPayload);

          const { wrapper, queryClient } = initQueryClient();
          const { result } = renderHook(
            () =>
              useCatalog(projectId, {
                enabled,
              }),
            {
              wrapper,
            },
          );
          const queryCache = queryClient.getQueryCache();
          if (!enabled) {
            await waitFor(() => expect(result.current.isPending).toBe(true));
          } else if (!queryPayload) {
            await waitFor(() => expect(result.current.isError).toBe(true));
            expect(result.current.error).toHaveProperty('response.status', 500);
            expect(result.current.error).instanceOf(AxiosError);
          } else {
            expectStrictEqual(result, expectedRawData);
            expect(
              queryCache.getAll().map((cache) => cache.queryKey)[0],
            ).toStrictEqual(instancesQueryKey(projectId, ['catalog']));
          }
        });
      },
    );
  });

  describe('When invoked with a forbidden selector (e.g. useCatalog("foo", { selector: "bar" as TUseCatalogSelector })', () => {
    afterAll(() => {
      server?.close();
    });
    test('When invoking useCatalog() hook, then, expect to receive raw data', async () => {
      server = setupCatalogServer(mockedCatalog1);

      const { wrapper } = initQueryClient();
      const { result } = renderHook(
        () =>
          useCatalog(fakeProjectId, {
            selector: 'foo' as TUseCatalogSelector,
          }),
        {
          wrapper,
        },
      );
      await expectStrictEqual(result, mockedCatalog1);
    });
  });

  describe('When invoked with model selector', () => {
    // test data
    type Data = {
      projectId: string;
      queryPayload: TCatalogDto;
      expectedModelEntity: TModelEntity;
    };
    describe.each`
      projectId        | queryPayload      | expectedModelEntity
      ${fakeProjectId} | ${emptyCatalog}   | ${{ models: { data: [], categories: [] } }}
      ${fakeProjectId} | ${mockedCatalog1} | ${expectedEntity1}
      ${fakeProjectId} | ${mockedCatalog2} | ${expectedEntity2}
    `(
      'Given a projectId <$projectId>',
      ({ projectId, queryPayload, expectedModelEntity }: Data) => {
        afterEach(() => {
          server?.close();
        });
        test("When invoking useCatalog() hook', then, expect the model entity to have been computed", async () => {
          server = setupCatalogServer(queryPayload);

          const { wrapper } = initQueryClient();
          const { result } = renderHook(
            () =>
              useCatalog<'modelSelector'>(projectId, {
                selector: 'modelSelector',
              }),
            {
              wrapper,
            },
          );
          await expectStrictEqual(result, expectedModelEntity);
        });
      },
    );
  });

  describe('When invoked with region selector', () => {
    // test data
    type Data = {
      projectId: string;
      modelName: string;
      queryPayload: TCatalogDto;
      expectedRegionEntity: TRegionEntity;
    };
    describe.each`
      projectId        | modelName    | queryPayload      | expectedRegionEntity
      ${fakeProjectId} | ${undefined} | ${emptyCatalog}   | ${undefined}
      ${fakeProjectId} | ${'b3-8'}    | ${emptyCatalog}   | ${undefined}
      ${fakeProjectId} | ${undefined} | ${mockedCatalog3} | ${undefined}
      ${fakeProjectId} | ${'b3-8'}    | ${mockedCatalog3} | ${expectedEntity3}
      ${fakeProjectId} | ${'b2-30'}   | ${mockedCatalog3} | ${expectedEntity4}
    `(
      'Given a projectId <$projectId> and a modelName <$modelName>',
      ({ projectId, queryPayload, expectedRegionEntity, modelName }: Data) => {
        afterEach(() => {
          server?.close();
        });
        test(`When invoking useCatalog() hook', then, expect the region entity to have been computed`, async () => {
          server = setupCatalogServer(queryPayload);

          const { wrapper } = initQueryClient();
          const { result: appStoreResult } = renderHook(() => useAppStore());
          act(() => {
            appStoreResult.current.setModelName(modelName);
          });

          const { result } = renderHook(
            () =>
              useCatalog<'regionSelector'>(projectId, {
                selector: 'regionSelector',
              }),
            {
              wrapper,
            },
          );
          await expectStrictEqual(result, expectedRegionEntity);
        });
      },
    );
  });
});
