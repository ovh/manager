import { ApiError } from '@ovh-ux/manager-core-api';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createWrapper } from '@/wrapperRenders';
import {
  createVolumeFromBackup,
  detachVolume,
  getVolume,
} from '@/data/api/volume';
import {
  useCreateVolumeFromBackup,
  useDetachVolume,
  useVolume,
} from './useVolume';

vi.mock('@/data/api/volume', () => ({
  getVolume: vi.fn(),
  createVolumeFromBackup: vi.fn(),
  detachVolume: vi.fn(),
}));

const mockVolume = {
  id: 'volume-1',
  attachedTo: [],
  creationDate: '2025-04-15T10:30:45Z',
  name: 'test-volume',
  description: 'Test volume for unit tests',
  size: 50,
  status: 'available',
  region: 'GRA7',
  bootable: false,
  planCode: 'volume.classic',
  availabilityZone: 'nova',
  type: 'classic',
};

const projectId = 'project-1';
const volumeId = 'volume-1';
const instanceId = 'instance-1';

describe('useVolume', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call getVolume with the correct parameters', async () => {
    vi.mocked(getVolume).mockResolvedValue(mockVolume);

    const { result } = renderHook(() => useVolume(projectId, volumeId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getVolume).toHaveBeenCalledWith(projectId, volumeId);
    expect(result.current.data).toEqual(mockVolume);
  });

  it('should not call getVolume if projectId or volumeId is undefined', async () => {
    renderHook(() => useVolume(undefined, volumeId), {
      wrapper: createWrapper(),
    });
    renderHook(() => useVolume(projectId, undefined), {
      wrapper: createWrapper(),
    });
    renderHook(() => useVolume(projectId, null), { wrapper: createWrapper() });

    expect(getVolume).not.toHaveBeenCalled();
  });
});

describe('useCreateVolumeFromBackup', () => {
  const onSuccess = vi.fn();
  const onError = vi.fn();

  const newVolumeData = {
    regionName: 'region-1',
    volumeBackupId: 'backup-1',
    volumeName: 'new-volume',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should create a volume from backup successfully', async () => {
    vi.mocked(createVolumeFromBackup).mockResolvedValue(mockVolume);

    const { result } = renderHook(
      () => useCreateVolumeFromBackup({ projectId, onSuccess, onError }),
      { wrapper: createWrapper() },
    );

    result.current.createVolumeFromBackup(newVolumeData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(createVolumeFromBackup).toHaveBeenCalledWith(
      projectId,
      newVolumeData.regionName,
      newVolumeData.volumeBackupId,
      newVolumeData.volumeName,
    );
    expect(onSuccess).toHaveBeenCalledWith(mockVolume);
  });

  it('should handle errors when creating a volume', async () => {
    const errorMessage = 'Failed to create volume';
    const error = new Error(errorMessage);
    vi.mocked(createVolumeFromBackup).mockRejectedValue(error);

    const { result } = renderHook(
      () => useCreateVolumeFromBackup({ projectId, onSuccess, onError }),
      { wrapper: createWrapper() },
    );

    result.current.createVolumeFromBackup(newVolumeData);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe(errorMessage);
    expect(onSuccess).not.toHaveBeenCalled();
  });
});

describe('useDetachVolume', () => {
  const onSuccess = vi.fn();
  const onError = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should detach a volume successfully', async () => {
    vi.mocked(detachVolume).mockResolvedValue(mockVolume);

    const { result } = renderHook(
      () =>
        useDetachVolume({
          projectId,
          volumeId,
          instanceId,
          onSuccess,
          onError,
        }),
      { wrapper: createWrapper() },
    );

    result.current.detachVolume();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(detachVolume).toHaveBeenCalledWith(projectId, volumeId, instanceId);
    expect(onSuccess).toHaveBeenCalledWith(mockVolume);
  });

  it('should handle errors when detaching a volume', async () => {
    const errorMessage = 'Failed to detach volume';
    const apiError = new Error(errorMessage) as ApiError;
    vi.mocked(detachVolume).mockRejectedValue(apiError);

    const { result } = renderHook(
      () =>
        useDetachVolume({
          projectId,
          volumeId,
          instanceId,
          onSuccess,
          onError,
        }),
      { wrapper: createWrapper() },
    );

    result.current.detachVolume();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe(errorMessage);
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
