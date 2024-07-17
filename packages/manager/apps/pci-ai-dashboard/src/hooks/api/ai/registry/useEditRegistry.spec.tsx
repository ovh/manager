import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as registryApi from '@/data/api/ai/registry.api';
import {
  mockedRegistry,
  mockedRegistryEdit,
} from '@/__tests__/helpers/mocks/registry';
import { useEditRegistry } from './useEditRegistry.hook';

vi.mock('@/data/api/ai/registry.api', () => ({
  editRegistry: vi.fn(),
}));

describe('useEditRegistry', () => {
  it('should call useEditRegistry on mutation with data', async () => {
    const projectId = 'projectId';
    const registryId = 'registryId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(registryApi.editRegistry).mockResolvedValue(mockedRegistry);
    const { result } = renderHook(
      () => useEditRegistry({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const editRegistryProps = {
      projectId,
      registryId,
      registry: mockedRegistryEdit,
    };
    result.current.editRegistry(editRegistryProps);

    await waitFor(() => {
      expect(registryApi.editRegistry).toHaveBeenCalledWith(editRegistryProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedRegistry,
        editRegistryProps,
        undefined,
      );
    });
  });
});
