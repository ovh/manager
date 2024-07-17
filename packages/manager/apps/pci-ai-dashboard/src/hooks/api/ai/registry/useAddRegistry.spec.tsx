import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as registryApi from '@/data/api/ai/registry.api';
import {
  mockedRegistry,
  mockedRegistryInput,
} from '@/__tests__/helpers/mocks/registry';
import { useAddRegistry } from './useAddRegistry.hook';

vi.mock('@/data/api/ai/registry.api', () => ({
  addRegistry: vi.fn(),
}));

describe('useAddRegistry', () => {
  it('should call useAddRegistry on mutation with data', async () => {
    const projectId = 'projectId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(registryApi.addRegistry).mockResolvedValue(mockedRegistry);
    const { result } = renderHook(
      () => useAddRegistry({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const addRegistryProps = {
      projectId,
      registry: mockedRegistryInput,
    };
    result.current.addRegistry(addRegistryProps);

    await waitFor(() => {
      expect(registryApi.addRegistry).toHaveBeenCalledWith(addRegistryProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedRegistry,
        addRegistryProps,
        undefined,
      );
    });
  });
});
