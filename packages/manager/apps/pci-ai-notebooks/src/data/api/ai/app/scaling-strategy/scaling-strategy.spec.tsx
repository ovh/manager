import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { scalingStrategy } from './scaling-strategy.api';

describe('scaling stategy functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call scalingStrategy with scalingStratInput', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await scalingStrategy({
      projectId: 'projectId',
      appId: 'appId',
      scalingStrat: {
        fixed: {
          replicas: 1,
        },
      },
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/app/appId/scalingstrategy',
      {
        fixed: {
          replicas: 1,
        },
      },
    );
  });
});
