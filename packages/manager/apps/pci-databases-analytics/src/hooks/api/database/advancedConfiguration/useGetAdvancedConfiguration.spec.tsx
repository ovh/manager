import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/advancedConfiguration.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useGetAdvancedConfiguration } from './useGetAdvancedConfiguration.hook';
// Mock the API functions
vi.mock('@/data/api/database/advancedConfiguration.api', () => ({
  getAdvancedConfiguration: vi.fn(),
}));

describe('useGetAdvancedConfiguration', () => {
  it('should return advanced configuration data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const mockData = { key: 'value' };

    vi.mocked(databaseAPI.getAdvancedConfiguration).mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useGetAdvancedConfiguration(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockData);
      expect(databaseAPI.getAdvancedConfiguration).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
