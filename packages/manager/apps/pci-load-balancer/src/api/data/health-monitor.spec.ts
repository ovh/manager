import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  getHealthMonitor,
  deleteHealthMonitor,
  createHealthMonitor,
  editHealthMonitor,
  renameHealthMonitor,
  THealthMonitorFormState,
} from './health-monitor';

describe('Health Monitor API', () => {
  const projectId = 'test-project';
  const region = 'test-region';
  const poolId = 'test-pool';
  const healthMonitorId = 'test-health-monitor';

  it('should get health monitor', async () => {
    const mockData = [{ id: '1', name: 'test-monitor' }];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });

    const result = await getHealthMonitor(projectId, region, poolId);
    expect(result).toEqual(mockData);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor?poolId=${poolId}`,
    );
  });

  it('should delete health monitor', async () => {
    const mockData = { success: true };
    vi.mocked(v6.delete).mockResolvedValue({ data: mockData });

    const result = await deleteHealthMonitor(
      projectId,
      region,
      healthMonitorId,
    );
    expect(result).toEqual(mockData);
    expect(v6.delete).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor/${healthMonitorId}`,
    );
  });

  it('should create health monitor', async () => {
    const model: THealthMonitorFormState = {
      name: 'test-monitor',
      type: 'http',
      urlPath: '/health',
      expectedCode: 200,
      maxRetriesDown: 3,
      delay: 5,
      maxRetries: 3,
      timeout: 10,
    };
    const mockData = { id: '1', name: 'test-monitor' };
    (v6.post as any).mockResolvedValue({ data: mockData });

    const result = await createHealthMonitor(projectId, region, poolId, model);
    expect(result).toEqual({ data: mockData });
    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor`,
      expect.objectContaining({
        name: model.name,
        monitorType: model.type,
        delay: model.delay,
        timeout: model.timeout,
        poolId,
        httpConfiguration: expect.objectContaining({
          expectedCodes: `${model.expectedCode}`,
          urlPath: model.urlPath,
        }),
      }),
    );
  });

  it('should edit health monitor', async () => {
    const model: THealthMonitorFormState = {
      name: 'updated-monitor',
      urlPath: '/health',
      expectedCode: 200,
      maxRetriesDown: 3,
      delay: 5,
      maxRetries: 3,
      timeout: 10,
    };
    const mockData = { id: '1', name: 'updated-monitor' };
    vi.mocked(v6.put).mockResolvedValue({ data: mockData });

    const result = await editHealthMonitor(
      projectId,
      region,
      healthMonitorId,
      model,
    );
    expect(result).toEqual({ data: mockData });
    expect(v6.put).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor/${healthMonitorId}`,
      {
        name: model.name,
        delay: model.delay,
        timeout: model.timeout,
        maxRetries: 3,
        maxRetriesDown: 3,
        httpConfiguration: {
          expectedCodes: `${model.expectedCode}`,
          httpMethod: 'GET',
          httpVersion: '1.0',
          urlPath: model.urlPath,
        },
      },
    );
  });

  it('should rename health monitor', async () => {
    const newName = 'renamed-monitor';
    const mockData = { id: '1', name: newName };
    vi.mocked(v6.put).mockResolvedValue({ data: mockData });

    const result = await renameHealthMonitor(
      projectId,
      region,
      healthMonitorId,
      newName,
    );
    expect(result).toEqual({ data: mockData });
    expect(
      v6.put,
    ).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/loadbalancing/healthMonitor/${healthMonitorId}`,
      { name: newName },
    );
  });
});
