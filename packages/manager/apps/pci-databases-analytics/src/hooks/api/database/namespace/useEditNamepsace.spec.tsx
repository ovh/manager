import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useEditNamespace } from './useEditNamespace.hook';
import * as databaseAPI from '@/data/api/database/namespace.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  mockedEditNamespace,
  mockedNamespaces,
} from '@/__tests__/helpers/mocks/namespaces';

vi.mock('@/data/api/database/namespace.api', () => ({
  getNamespaces: vi.fn(),
  addNamespace: vi.fn(),
  editNamespace: vi.fn(),
  deleteNamespace: vi.fn(),
}));

describe('useEditNamepsace', () => {
  it('should call useEditNamespace on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.m3db;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.editNamespace).mockResolvedValue(mockedNamespaces);
    const { result } = renderHook(
      () => useEditNamespace({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const editNamespaceProps = {
      projectId,
      engine,
      serviceId,
      namespace: mockedEditNamespace,
    };
    result.current.editNamespace(editNamespaceProps);

    await waitFor(() => {
      expect(databaseAPI.editNamespace).toHaveBeenCalledWith(
        editNamespaceProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        mockedNamespaces,
        editNamespaceProps,
        undefined,
      );
    });
  });
});
