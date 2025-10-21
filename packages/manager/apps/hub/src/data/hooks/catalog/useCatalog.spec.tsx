import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import { aapi as Api } from '@ovh-ux/manager-core-api';

import { catalogData, rawCatalogData } from '@/__mocks__/catalog';
import { useFetchHubCatalog } from '@/data/hooks/catalog/useCatalog';
import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { CatalogData, CatalogItem } from '@/types/catalog';

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
vi.mock('i18next', () => ({
  default: {
    language: 'fr_FR',
  },
}));

describe('useFetchHubCatalog', () => {
  it('should return a list of highlighted products grouped by universe', async () => {
    const catalog: ApiEnvelope<CatalogData> = {
      data: {
        catalog: {
          data: rawCatalogData as CatalogItem[],
          status: 'OK',
        },
      },
      status: 'OK',
    };
    const getCatalog = vi.spyOn(Api, 'get').mockReturnValue(Promise.resolve({ data: catalog }));

    const { result } = renderHook(() => useFetchHubCatalog(), {
      wrapper,
    });

    await waitFor(() => {
      expect(getCatalog).toHaveBeenCalled();
      expect(result.current.data).toEqual(catalogData);
    });
  });
});
