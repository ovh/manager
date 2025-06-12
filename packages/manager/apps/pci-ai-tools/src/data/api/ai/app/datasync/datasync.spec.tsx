import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { dataSync } from './datasync.api';
import { mockedDataSyncSpec } from '@/__tests__/helpers/mocks/volume/datasync';

describe('label functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call dataSync with dataSyncInput', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await dataSync({
      projectId: 'projectId',
      appId: 'appId',
      dataSyncSpec: mockedDataSyncSpec,
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/app/appId/datasync',
      mockedDataSyncSpec,
    );
  });
});
