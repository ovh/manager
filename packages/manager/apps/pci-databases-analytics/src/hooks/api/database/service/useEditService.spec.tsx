import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useEditService } from './useEditService.hook';
import * as databaseAPI from '@/data/api/database/service.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';

vi.mock('@/data/api/database/service.api', () => ({
  getServices: vi.fn(),
  getService: vi.fn(),
  addService: vi.fn(),
  editService: vi.fn(),
  deleteService: vi.fn(),
}));

describe('useEditService', () => {
  it('should call useEditService on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.editService).mockResolvedValue(mockedService);
    const { result } = renderHook(
      () => useEditService({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const editServiceProps: databaseAPI.EditService = {
      projectId,
      engine,
      serviceId,
      data: mockedService,
    };
    result.current.editService(editServiceProps);

    await waitFor(() => {
      expect(databaseAPI.editService).toHaveBeenCalledWith(editServiceProps);
      expect(onSuccess).toHaveBeenCalledWith(mockedService);
    });
  });
});
