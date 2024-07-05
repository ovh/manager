import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useAddNamespace } from './useAddNamespace.hook';
import * as databaseAPI from '@/data/api/database/namespace.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  mockedAddNamespace,
  mockedNamespaces,
} from '@/__tests__/helpers/mocks/namespaces';

vi.mock('@/data/api/database/namespace.api', () => ({
  getNamespaces: vi.fn(),
  addNamespace: vi.fn(),
  editNamespace: vi.fn(),
  deleteNamespace: vi.fn(),
}));

describe('useAddNamespace', () => {
  it('should call useAddConnectionPool on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.m3db;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.addNamespace).mockResolvedValue(mockedNamespaces);
    const { result } = renderHook(
      () => useAddNamespace({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const addNamespaceProps = {
      projectId,
      engine,
      serviceId,
      namespace: mockedAddNamespace,
    };
    result.current.addNamespace(addNamespaceProps);

    await waitFor(() => {
      expect(databaseAPI.addNamespace).toHaveBeenCalledWith(addNamespaceProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedNamespaces,
        addNamespaceProps,
        undefined,
      );
    });
  });
});
