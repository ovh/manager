import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import {
  useGetServices,
  useGetService,
  useAddService,
  useUpdateService,
  useDeleteService,
} from '@/hooks/api/services.api.hooks';
import * as databaseAPI from '@/api/databases/service';
import { database } from '@/models/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  mockedService,
  mockedServiceCreation,
  mockedServiceCreationWithEngine,
} from '@/__tests__/helpers/mocks/services';

vi.mock('@/api/databases/service', () => ({
  getServices: vi.fn(),
  getService: vi.fn(),
  addService: vi.fn(),
  updateService: vi.fn(),
  deleteService: vi.fn(),
}));

describe('useGetServices', () => {
  it('should return services data', async () => {
    const projectId = 'projectId';

    vi.mocked(databaseAPI.getServices).mockResolvedValue([mockedService]);

    const { result } = renderHook(() => useGetServices(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedService]);
      expect(databaseAPI.getServices).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});

describe('useGetService', () => {
  it('should return service data', async () => {
    const projectId = 'projectId';
    const serviceId = 'serviceId';
    vi.mocked(databaseAPI.getService).mockResolvedValue(mockedService);

    const { result } = renderHook(() => useGetService(projectId, serviceId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedService);
      expect(databaseAPI.getService).toHaveBeenCalledWith({
        projectId,
        serviceId,
      });
    });
  });
});

describe('useAddService', () => {
  it('should call useAddService on mutation with data', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.addService).mockResolvedValue(mockedService);
    const { result } = renderHook(() => useAddService({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    result.current.addService(mockedServiceCreationWithEngine);

    await waitFor(() => {
      expect(databaseAPI.addService).toHaveBeenCalledWith({
        projectId: undefined,
        engine: database.EngineEnum.mongodb,
        serviceInfo: mockedServiceCreation,
      });
      expect(onSuccess).toHaveBeenCalledWith(
        mockedService,
        mockedServiceCreationWithEngine,
        undefined,
      );
    });
  });
});

describe('useUpdateService', () => {
  it('should call useUpdateService on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.updateService).mockResolvedValue(mockedService);
    const { result } = renderHook(
      () => useUpdateService({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const updateServiceProps: databaseAPI.UpdateServiceProps = {
      projectId,
      engine,
      serviceId,
      data: mockedService,
    };
    result.current.updateService(updateServiceProps);

    await waitFor(() => {
      expect(databaseAPI.updateService).toHaveBeenCalledWith(
        updateServiceProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        mockedService,
        updateServiceProps,
        undefined,
      );
    });
  });
});

describe('useDeleteService', () => {
  it('should call useDeleteService on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.deleteService).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useDeleteService({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const deleteServiceProps = {
      projectId,
      engine,
      serviceId,
    };
    result.current.deleteService(deleteServiceProps);

    await waitFor(() => {
      expect(databaseAPI.deleteService).toHaveBeenCalledWith(
        deleteServiceProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        undefined,
        deleteServiceProps,
        undefined,
      );
    });
  });
});
