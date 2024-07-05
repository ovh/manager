import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useGetServices } from './useGetServices.hook';
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
