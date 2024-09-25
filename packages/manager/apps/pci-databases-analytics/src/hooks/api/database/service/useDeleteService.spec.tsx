import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useDeleteService } from './useDeleteService.hook';
import * as databaseAPI from '@/data/api/database/service.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';

vi.mock('@/data/api/database/service.api', () => ({
  deleteService: vi.fn(),
}));

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
      expect(onSuccess).toHaveBeenCalledWith();
    });
  });
});
