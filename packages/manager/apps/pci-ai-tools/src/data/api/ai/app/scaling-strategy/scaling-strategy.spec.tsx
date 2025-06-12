import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { scalingStrategy } from './scaling-strategy.api';
import { mockedFixedScaling } from '@/__tests__/helpers/mocks/app/appHelper';

describe('scaling stategy functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call scalingStrategy with scalingStratInput', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await scalingStrategy({
      projectId: 'projectId',
      appId: 'appId',
      scalingStrat: mockedFixedScaling,
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/app/appId/scalingstrategy',
      {
        fixed: {
          replicas: 2,
        },
      },
    );
  });
});
