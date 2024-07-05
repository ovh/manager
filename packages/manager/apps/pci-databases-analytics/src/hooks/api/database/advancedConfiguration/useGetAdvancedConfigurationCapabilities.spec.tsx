import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/advancedConfiguration.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useGetAdvancedConfigurationCapabilities } from './useGetAdvancedConfigurationCapabilities.hook';
// Mock the API functions
vi.mock('@/data/api/database/advancedConfiguration.api', () => ({
  getAdvancedConfigurationCapabilities: vi.fn(),
}));

describe('useGetAdvancedConfigurationCapabilities', () => {
  it('should return advanced configuration capabilities', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const mockCapabilities: database.capabilities.advancedConfiguration.Property[] = [
      {
        name: 'capability',
        type:
          database.capabilities.advancedConfiguration.property.TypeEnum.string,
        description: '',
      },
    ];

    vi.mocked(
      databaseAPI.getAdvancedConfigurationCapabilities,
    ).mockResolvedValue(mockCapabilities);

    const { result } = renderHook(
      () =>
        useGetAdvancedConfigurationCapabilities(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockCapabilities);
      expect(
        databaseAPI.getAdvancedConfigurationCapabilities,
      ).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
