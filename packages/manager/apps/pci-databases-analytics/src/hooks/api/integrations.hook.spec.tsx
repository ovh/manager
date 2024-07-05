import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import {
  useGetIntegrations,
  useGetCapabilitiesIntegrations,
  useAddIntegration,
  UseDeleteIntegration,
} from '@/hooks/api/integrations.api.hook';

import * as databaseAPI from '@/api/databases/integrations';
import { database } from '@/models/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  mockedAddIntegrations,
  mockedCapabilitiesIntegrations,
  mockedIntegrations,
} from '@/__tests__/helpers/mocks/integrations';

vi.mock('@/api/databases/integrations', () => ({
  getServiceIntegrations: vi.fn(),
  getServiceCapabilitiesIntegrations: vi.fn(),
  addIntegration: vi.fn(),
  deleteIntegration: vi.fn(),
}));

describe('useGetIntegrations', () => {
  it('should return service integrations data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getServiceIntegrations).mockResolvedValue([
      mockedIntegrations,
    ]);

    const { result } = renderHook(
      () => useGetIntegrations(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedIntegrations]);
      expect(databaseAPI.getServiceIntegrations).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});

describe('useGetCapabilitiesIntegrations', () => {
  it('should return integrations capabilities data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';

    vi.mocked(
      databaseAPI.getServiceCapabilitiesIntegrations,
    ).mockResolvedValue([mockedCapabilitiesIntegrations]);

    const { result } = renderHook(
      () => useGetCapabilitiesIntegrations(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedCapabilitiesIntegrations]);
      expect(
        databaseAPI.getServiceCapabilitiesIntegrations,
      ).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});

describe('useAddIntegration', () => {
  it('should call useAddIntegration on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.addIntegration).mockResolvedValue(mockedIntegrations);
    const { result } = renderHook(
      () => useAddIntegration({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const addIntegrationProps = {
      projectId,
      engine,
      serviceId,
      integration: mockedAddIntegrations,
    };
    result.current.addIntegration(addIntegrationProps);

    await waitFor(() => {
      expect(databaseAPI.addIntegration).toHaveBeenCalledWith(
        addIntegrationProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        mockedIntegrations,
        addIntegrationProps,
        undefined,
      );
    });
  });
});

describe('useDeleteIntegration', () => {
  it('should call useDeleteIntegration on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.deleteIntegration).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => UseDeleteIntegration({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const deleteIntegrationProps = {
      projectId,
      engine,
      serviceId,
      integrationId: 'integrationId',
    };
    result.current.deleteIntegration(deleteIntegrationProps);

    await waitFor(() => {
      expect(databaseAPI.deleteIntegration).toHaveBeenCalledWith(
        deleteIntegrationProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        undefined,
        deleteIntegrationProps,
        undefined,
      );
    });
  });
});
