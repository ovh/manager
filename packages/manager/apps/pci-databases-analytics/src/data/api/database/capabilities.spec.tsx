import { describe, expect, vi } from 'vitest';
import { apiClient } from '@/data/api/api.client';
import {
  getCapabilities,
  getEnginesCapabilities,
  getRegionsCapabilities,
} from './capabilities.api';

describe('capabilities api functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getCapabilities', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getCapabilities('projectId');
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/capabilities',
    );
  });

  it('should call getEnginesCapabilities', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getEnginesCapabilities('projectId');
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/capabilities/engines',
    );
  });

  it('should call getRegionsCapabilities', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getRegionsCapabilities('projectId');
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/capabilities/regions',
    );
  });
});
