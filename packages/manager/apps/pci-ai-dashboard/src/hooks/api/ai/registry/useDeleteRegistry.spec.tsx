import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as registryApi from '@/data/api/ai/registry.api';
import { useDeleteRegistry } from './useDeleteRegistry.hook';

vi.mock('@/data/api/ai/registry.api', () => ({
  deleteRegistry: vi.fn(),
}));

describe('useDeleteRegistry', () => {
  it('should call useDeleteRegistry on mutation with data', async () => {
    const projectId = 'projectId';
    const registryId = 'registryId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(registryApi.deleteRegistry).mockResolvedValue(undefined);
    const { result } = renderHook(
      () => useDeleteRegistry({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const deleteRegistryProps = {
      projectId,
      registryId,
    };
    result.current.deleteRegistry(deleteRegistryProps);

    await waitFor(() => {
      expect(registryApi.deleteRegistry).toHaveBeenCalledWith(
        deleteRegistryProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        undefined,
        deleteRegistryProps,
        undefined,
      );
    });
  });
});
