import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/integration.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  mockedAddIntegrations,
  mockedIntegrations,
} from '@/__tests__/helpers/mocks/integrations';
import { useAddIntegration } from './useAddIntegration.hook';

vi.mock('@/data/api/database/integration.api', () => ({
  getServiceIntegrations: vi.fn(),
  getServiceCapabilitiesIntegrations: vi.fn(),
  addIntegration: vi.fn(),
  deleteIntegration: vi.fn(),
}));

describe('useAddIntegration', () => {
  it('should call useAddIntegration on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.addIntegration).mockResolvedValue(mockedIntegrations);
    const { result } = renderHook(
      () => useAddIntegration({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const addIntegrationProps = {
      projectId,
      engine,
      serviceId,
      integration: mockedAddIntegrations,
    };
    result.current.addIntegration(addIntegrationProps);

    await waitFor(() => {
      expect(databaseAPI.addIntegration).toHaveBeenCalledWith(
        addIntegrationProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        mockedIntegrations,
        addIntegrationProps,
        undefined,
      );
    });
  });
});
