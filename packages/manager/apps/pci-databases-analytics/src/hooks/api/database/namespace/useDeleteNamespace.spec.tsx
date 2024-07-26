import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useDeleteNamespace } from './useDeleteNamespace.hook';
import * as databaseAPI from '@/data/api/database/namespace.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';

vi.mock('@/data/api/database/namespace.api', () => ({
  getNamespaces: vi.fn(),
  addNamespace: vi.fn(),
  editNamespace: vi.fn(),
  deleteNamespace: vi.fn(),
}));

describe('useDeleteNamespace', () => {
  it('should call useDeleteNamespace on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.m3db;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.deleteNamespace).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useDeleteNamespace({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const deleteNamespaceProps = {
      projectId,
      engine,
      serviceId,
      namespaceId: 'namespaceId',
    };
    result.current.deleteNamespace(deleteNamespaceProps);

    await waitFor(() => {
      expect(databaseAPI.deleteNamespace).toHaveBeenCalledWith(
        deleteNamespaceProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        undefined,
        deleteNamespaceProps,
        undefined,
      );
    });
  });
});
