import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useAddService } from './useAddService.hook';
import * as databaseAPI from '@/data/api/database/service.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  mockedService,
  mockedServiceCreation,
  mockedServiceCreationWithEngine,
} from '@/__tests__/helpers/mocks/services';

vi.mock('@/data/api/database/service.api', () => ({
  getServices: vi.fn(),
  getService: vi.fn(),
  addService: vi.fn(),
  editService: vi.fn(),
  deleteService: vi.fn(),
}));

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
      expect(onSuccess).toHaveBeenCalledWith(mockedService);
    });
  });
});
