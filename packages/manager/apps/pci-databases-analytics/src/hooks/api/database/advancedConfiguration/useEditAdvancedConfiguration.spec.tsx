import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/advancedConfiguration.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useEditAdvancedConfiguration } from './useEditAdvancedConfiguration.hook';
// Mock the API functions
vi.mock('@/data/api/database/advancedConfiguration.api', () => ({
  editAdvancedConfiguration: vi.fn(),
}));

describe('useUpdateAdvancedConfiguration', () => {
  it('should call updateAdvancedConfiguration on mutation', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const mockAdvancedConfiguration = { key: 'value' };
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.editAdvancedConfiguration).mockResolvedValue(
      mockAdvancedConfiguration,
    );
    const { result } = renderHook(
      () => useEditAdvancedConfiguration({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const updateProps = {
      projectId,
      engine,
      serviceId,
      advancedConfiguration: mockAdvancedConfiguration,
    };
    result.current.updateAdvancedConfiguration(updateProps);

    await waitFor(() => {
      expect(databaseAPI.editAdvancedConfiguration).toHaveBeenCalledWith(
        updateProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        mockAdvancedConfiguration,
        updateProps,
        undefined,
      );
    });
  });
});
