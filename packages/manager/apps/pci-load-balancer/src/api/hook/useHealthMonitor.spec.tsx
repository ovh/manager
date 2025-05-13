import { renderHook, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import {
  useGetHealthMonitor,
  useDeleteHealthMonitor,
  useCreateHealthMonitor,
  useEditHealthMonitor,
  useRenameHealthMonitor,
} from './useHealthMonitor';
import { wrapper } from '@/wrapperRenders';
import {
  createHealthMonitor,
  deleteHealthMonitor,
  editHealthMonitor,
  getHealthMonitor,
  renameHealthMonitor,
  THealthMonitor,
  THealthMonitorFormState,
} from '../data/health-monitor';

vi.mock('@/api/data/health-monitor');

describe('useHealthMonitor hooks', () => {
  const projectId = 'test-project';
  const region = 'test-region';
  const poolId = 'test-pool';
  const healthMonitorId = 'test-health-monitor';
  const model = { name: 'test-name' } as THealthMonitorFormState;

  it('should fetch health monitor', async () => {
    vi.mocked(getHealthMonitor).mockResolvedValue([
      { id: healthMonitorId } as THealthMonitor,
    ]);

    const { result } = renderHook(
      () => useGetHealthMonitor({ projectId, region, poolId }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ id: healthMonitorId });
    expect(getHealthMonitor).toHaveBeenCalledWith(projectId, region, poolId);
  });

  it('should delete health monitor', async () => {
    vi.mocked(deleteHealthMonitor).mockResolvedValue([
      { id: healthMonitorId } as THealthMonitor,
    ]);
    const onError = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () => useDeleteHealthMonitor({ projectId, region, onError, onSuccess }),
      { wrapper },
    );

    await act(async () => {
      result.current.deleteHealthMonitor(healthMonitorId);
    });

    expect(deleteHealthMonitor).toHaveBeenCalledWith(
      projectId,
      region,
      healthMonitorId,
    );
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should create health monitor', async () => {
    vi.mocked(createHealthMonitor).mockResolvedValue({} as never);
    const onError = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () =>
        useCreateHealthMonitor({
          projectId,
          region,
          poolId,
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.createHealthMonitor(model);
    });

    expect(createHealthMonitor).toHaveBeenCalledWith(
      projectId,
      region,
      poolId,
      model,
    );
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should edit health monitor', async () => {
    vi.mocked(editHealthMonitor).mockResolvedValue({} as never);
    const onError = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () =>
        useEditHealthMonitor({
          projectId,
          region,
          healthMonitorId,
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.editHealthMonitor(model);
    });

    expect(editHealthMonitor).toHaveBeenCalledWith(
      projectId,
      region,
      healthMonitorId,
      model,
    );
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should rename health monitor', async () => {
    vi.mocked(renameHealthMonitor).mockResolvedValue({} as never);
    const onError = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () =>
        useRenameHealthMonitor({
          projectId,
          region,
          healthMonitorId,
          onError,
          onSuccess,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.renameHealthMonitor('new-name');
    });

    expect(renameHealthMonitor).toHaveBeenCalledWith(
      projectId,
      region,
      healthMonitorId,
      'new-name',
    );
    expect(onSuccess).toHaveBeenCalled();
  });
});
