import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/integration.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useDeleteIntegration } from './useDeleteIntegration.hook';

vi.mock('@/data/api/database/integration.api', () => ({
  getServiceIntegrations: vi.fn(),
  getServiceCapabilitiesIntegrations: vi.fn(),
  addIntegration: vi.fn(),
  deleteIntegration: vi.fn(),
}));

describe('useDeleteIntegration', () => {
  it('should call useDeleteIntegration on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.deleteIntegration).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useDeleteIntegration({ onError, onSuccess }),
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
