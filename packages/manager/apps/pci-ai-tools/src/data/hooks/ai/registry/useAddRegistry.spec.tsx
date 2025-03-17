import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as registryApi from '@/data/api/ai/registry/registry.api';
import {
  mockedRegistry,
  mockedRegistryInput,
} from '@/__tests__/helpers/mocks/shared/registry';
import { useAddRegistry } from './useAddRegistry.hook';

vi.mock('@/data/api/ai/registry/registry.api', () => ({
  addRegistry: vi.fn(),
}));

describe('useAddRegistry', () => {
  it('should call useAddRegistry on mutation with data', async () => {
    const projectId = 'projectId';
    const onAddSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(registryApi.addRegistry).mockResolvedValue(mockedRegistry);
    const { result } = renderHook(
      () => useAddRegistry({ onError, onAddSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const addRegistryProps = {
      projectId,
      registry: mockedRegistryInput,
    };
    result.current.addRegistry(addRegistryProps);

    await waitFor(() => {
      expect(registryApi.addRegistry).toHaveBeenCalledWith(addRegistryProps);
      expect(onAddSuccess).toHaveBeenCalledWith(mockedRegistry);
    });
  });
});
