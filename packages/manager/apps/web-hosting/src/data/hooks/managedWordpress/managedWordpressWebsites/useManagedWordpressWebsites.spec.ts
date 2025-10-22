import { useParams } from 'react-router-dom';

import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { vi } from 'vitest';

import { IcebergFetchResultV2 } from '@ovh-ux/manager-core-api';

import { managedWordpressWebsitesMock } from '@/data/__mocks__/managedWordpress/website';
import * as api from '@/data/api/managedWordpress';
import { ManagedWordpressWebsites } from '@/data/types/product/managedWordpress/website';
import { renderHook, waitFor } from '@/utils/test.provider';

import { useManagedWordpressWebsites } from './useManagedWordpressWebsites';

vi.mocked(useParams).mockReturnValue({ serviceName: 'test' });

vi.spyOn(api, 'getManagedCmsResourceWebsites').mockResolvedValue({
  data: managedWordpressWebsitesMock,
  cursorNext: null,
  status: 200,
} as IcebergFetchResultV2<ManagedWordpressWebsites>);

type UseManagedWordpressWebsitesReturn = UseInfiniteQueryResult<
  ManagedWordpressWebsites[],
  Error
> & {
  fetchAllPages: () => void;
};
describe('useManagedWordpressWebsites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return website list', async () => {
    const { result } = renderHook(() => useManagedWordpressWebsites());
    const typedResult = result as {
      current: UseManagedWordpressWebsitesReturn;
    };

    await waitFor(() => {
      expect(typedResult.current.isSuccess).toBe(true);
    });

    expect(typedResult.current.data).toEqual(managedWordpressWebsitesMock);
  });
});
