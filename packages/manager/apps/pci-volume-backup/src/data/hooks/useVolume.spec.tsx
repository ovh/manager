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
import {
  MOCKED_INSTANCE_ID,
  MOCKED_PROJECT_ID,
  MOCKED_VOLUME,
  MOCKED_VOLUME_ID,
} from '@/__tests__/mocks';

vi.mock('@/data/api/volume', () => ({
  getVolume: vi.fn(),
  createVolumeFromBackup: vi.fn(),
  detachVolume: vi.fn(),
}));

describe('useVolume', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should call getVolume with the correct parameters', async () => {
    vi.mocked(getVolume).mockResolvedValue(MOCKED_VOLUME);

    const { result } = renderHook(
      () => useVolume(MOCKED_PROJECT_ID, MOCKED_VOLUME_ID),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getVolume).toHaveBeenCalledWith(MOCKED_PROJECT_ID, MOCKED_VOLUME_ID);
    expect(result.current.data).toEqual(MOCKED_VOLUME);
  });

  it('should not call getVolume if MOCKED_PROJECT_ID or MOCKED_VOLUME_ID is undefined', async () => {
    renderHook(() => useVolume(undefined, MOCKED_VOLUME_ID), {
      wrapper: createWrapper(),
    });
    renderHook(() => useVolume(MOCKED_PROJECT_ID, undefined), {
      wrapper: createWrapper(),
    });
    renderHook(() => useVolume(MOCKED_PROJECT_ID, null), {
      wrapper: createWrapper(),
    });

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
    type: 'classic',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should create a volume from backup successfully', async () => {
    vi.mocked(createVolumeFromBackup).mockResolvedValue(MOCKED_VOLUME);

    const { result } = renderHook(
      () =>
        useCreateVolumeFromBackup({
          projectId: MOCKED_PROJECT_ID,
          onSuccess,
          onError,
        }),
      { wrapper: createWrapper() },
    );

    result.current.createVolumeFromBackup(newVolumeData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(createVolumeFromBackup).toHaveBeenCalledWith(
      MOCKED_PROJECT_ID,
      newVolumeData.regionName,
      newVolumeData.volumeBackupId,
      newVolumeData.volumeName,
      newVolumeData.type,
    );
    expect(onSuccess).toHaveBeenCalledWith(MOCKED_VOLUME);
  });

  it('should handle errors when creating a volume', async () => {
    const errorMessage = 'Failed to create volume';
    const error = new Error(errorMessage);
    vi.mocked(createVolumeFromBackup).mockRejectedValue(error);

    const { result } = renderHook(
      () =>
        useCreateVolumeFromBackup({
          projectId: MOCKED_PROJECT_ID,
          onSuccess,
          onError,
        }),
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
    vi.mocked(detachVolume).mockResolvedValue(MOCKED_VOLUME);

    const { result } = renderHook(
      () =>
        useDetachVolume({
          projectId: MOCKED_PROJECT_ID,
          volumeId: MOCKED_VOLUME_ID,
          instanceId: MOCKED_INSTANCE_ID,
          onSuccess,
          onError,
        }),
      { wrapper: createWrapper() },
    );

    result.current.detachVolume();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(detachVolume).toHaveBeenCalledWith(
      MOCKED_PROJECT_ID,
      MOCKED_VOLUME_ID,
      MOCKED_INSTANCE_ID,
    );
    expect(onSuccess).toHaveBeenCalledWith(MOCKED_VOLUME);
  });

  it('should handle errors when detaching a volume', async () => {
    const errorMessage = 'Failed to detach volume';
    const apiError = new Error(errorMessage) as ApiError;
    vi.mocked(detachVolume).mockRejectedValue(apiError);

    const { result } = renderHook(
      () =>
        useDetachVolume({
          projectId: MOCKED_PROJECT_ID,
          volumeId: MOCKED_VOLUME_ID,
          instanceId: MOCKED_INSTANCE_ID,
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
