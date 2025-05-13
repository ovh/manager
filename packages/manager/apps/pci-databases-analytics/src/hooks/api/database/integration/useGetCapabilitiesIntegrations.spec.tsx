import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/integration.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedCapabilitiesIntegrations } from '@/__tests__/helpers/mocks/integrations';
import { useGetCapabilitiesIntegrations } from './useGetCapabilitiesIntegrations.hook';

vi.mock('@/data/api/database/integration.api', () => ({
  getServiceIntegrations: vi.fn(),
  getServiceCapabilitiesIntegrations: vi.fn(),
  addIntegration: vi.fn(),
  deleteIntegration: vi.fn(),
}));

describe('useGetCapabilitiesIntegrations', () => {
  it('should return integrations capabilities data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';

    vi.mocked(
      databaseAPI.getServiceCapabilitiesIntegrations,
    ).mockResolvedValue([mockedCapabilitiesIntegrations]);

    const { result } = renderHook(
      () => useGetCapabilitiesIntegrations(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedCapabilitiesIntegrations]);
      expect(
        databaseAPI.getServiceCapabilitiesIntegrations,
      ).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
