import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useGetService } from '@/hooks/api/database/service/useGetService.hook';
import * as databaseAPI from '@/data/api/database/service.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';

vi.mock('@/data/api/database/service.api', () => ({
  getServices: vi.fn(),
  getService: vi.fn(),
  addService: vi.fn(),
  editService: vi.fn(),
  deleteService: vi.fn(),
}));

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
