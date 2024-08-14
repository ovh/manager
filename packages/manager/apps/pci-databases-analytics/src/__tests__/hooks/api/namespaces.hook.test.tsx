import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import {
  useGetNamespaces,
  useAddNamespace,
  useEditNamespace,
  useDeleteNamespace,
} from '@/hooks/api/namespaces.api.hooks';
import * as databaseAPI from '@/api/databases/namespaces';
import { database } from '@/models/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  mockedAddNamespace,
  mockedEditNamespace,
  mockedNamespaces,
} from '@/__tests__/helpers/mocks/namespaces';

vi.mock('@/api/databases/namespaces', () => ({
  getNamespaces: vi.fn(),
  addNamespace: vi.fn(),
  editNamespace: vi.fn(),
  deleteNamespace: vi.fn(),
}));

describe('useGetNamespaces', () => {
  it('should return Namespaces data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.m3db;
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getNamespaces).mockResolvedValue([mockedNamespaces]);

    const { result } = renderHook(
      () => useGetNamespaces(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedNamespaces]);
      expect(databaseAPI.getNamespaces).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});

describe('useAddConnectionPool', () => {
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
