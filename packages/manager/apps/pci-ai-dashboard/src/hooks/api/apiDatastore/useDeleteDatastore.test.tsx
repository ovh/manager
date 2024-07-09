import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/apiDatastore';
import { useDeleteDatastore } from '@/hooks/api/apiDatastore/useDeleteDatastore';

vi.mock('@/data/api/apiDatastore', () => ({
  deleteDatastore: vi.fn(),
}));

describe('useDeleteDatastore', () => {
  it('should call useDeleteDatastore on mutation with data', async () => {
    const projectId = 'projectId';
    const region = 'region';
    const alias = 'alias';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(datastoreApi.deleteDatastore).mockResolvedValue(undefined);
    const { result } = renderHook(
      () => useDeleteDatastore({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const deleteDatastoreProps = {
      projectId,
      region,
      alias,
    };
    result.current.deleteDatastore(deleteDatastoreProps);

    await waitFor(() => {
      expect(datastoreApi.deleteDatastore).toHaveBeenCalledWith(
        deleteDatastoreProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        undefined,
        deleteDatastoreProps,
        undefined,
      );
    });
  });
});
