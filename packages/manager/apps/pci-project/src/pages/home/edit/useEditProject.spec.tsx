import { getProjectQueryKey } from '@ovh-ux/manager-pci-common';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from '@/data/api/projects';
import { getDefaultProjectQueryKey } from '@/data/hooks/useProjects';
import queryClient from '@/queryClient';
import { createWrapper } from '@/wrapperRenders';
import { EditProjectParams, useEditProject } from './useEditProject';

const projectId = 'test-project-id';

const paramsBase: EditProjectParams = {
  description: 'desc',
  isDefault: false,
  isDescriptionChanged: false,
  isDefaultPropertyChanged: false,
};

describe('useEditProject', () => {
  const editProjectMock = vi.spyOn(api, 'editProject');
  const setAsDefaultProjectMock = vi.spyOn(api, 'setAsDefaultProject');
  const unFavProjectMock = vi.spyOn(api, 'unFavProject');
  const invalidateQueriesMock = vi.spyOn(queryClient, 'invalidateQueries');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls editProject when only description changes', async () => {
    editProjectMock.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(
      () => useEditProject(projectId, onSuccess, onError),
      {
        wrapper: createWrapper(),
      },
    );

    await act(async () => {
      await result.current.mutateAsync({
        ...paramsBase,
        isDescriptionChanged: true,
        description: 'new desc',
      });
    });

    expect(editProjectMock).toHaveBeenCalledWith({
      projectId,
      payload: { description: 'new desc' },
    });
    expect(setAsDefaultProjectMock).not.toHaveBeenCalled();
    expect(unFavProjectMock).not.toHaveBeenCalled();
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: getProjectQueryKey(projectId),
    });
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('calls setAsDefaultProject when only default changes to true', async () => {
    setAsDefaultProjectMock.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(
      () => useEditProject(projectId, onSuccess, onError),
      {
        wrapper: createWrapper(),
      },
    );

    await act(async () => {
      await result.current.mutateAsync({
        ...paramsBase,
        isDefaultPropertyChanged: true,
        isDefault: true,
      });
    });

    expect(setAsDefaultProjectMock).toHaveBeenCalledWith(projectId);
    expect(unFavProjectMock).not.toHaveBeenCalled();
    expect(editProjectMock).not.toHaveBeenCalled();
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: getDefaultProjectQueryKey,
    });
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('calls unFavProject when only default changes to false', async () => {
    unFavProjectMock.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(
      () => useEditProject(projectId, onSuccess, onError),
      {
        wrapper: createWrapper(),
      },
    );

    await act(async () => {
      await result.current.mutateAsync({
        ...paramsBase,
        isDefaultPropertyChanged: true,
        isDefault: false,
      });
    });

    expect(unFavProjectMock).toHaveBeenCalled();
    expect(setAsDefaultProjectMock).not.toHaveBeenCalled();
    expect(editProjectMock).not.toHaveBeenCalled();
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: getDefaultProjectQueryKey,
    });
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('calls both editProject and setAsDefaultProject when both change', async () => {
    editProjectMock.mockResolvedValue(undefined);
    setAsDefaultProjectMock.mockResolvedValue(undefined);
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(
      () => useEditProject(projectId, onSuccess, onError),
      {
        wrapper: createWrapper(),
      },
    );

    await act(async () => {
      await result.current.mutateAsync({
        ...paramsBase,
        isDescriptionChanged: true,
        description: 'desc2',
        isDefaultPropertyChanged: true,
        isDefault: true,
      });
    });

    expect(editProjectMock).toHaveBeenCalledWith({
      projectId,
      payload: { description: 'desc2' },
    });
    expect(setAsDefaultProjectMock).toHaveBeenCalledWith(projectId);
    expect(unFavProjectMock).not.toHaveBeenCalled();
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: getDefaultProjectQueryKey,
    });
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: getProjectQueryKey(projectId),
    });
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('does nothing if neither property changes', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(
      () => useEditProject(projectId, onSuccess, onError),
      {
        wrapper: createWrapper(),
      },
    );

    await act(async () => {
      await result.current.mutateAsync(paramsBase);
    });

    expect(editProjectMock).not.toHaveBeenCalled();
    expect(setAsDefaultProjectMock).not.toHaveBeenCalled();
    expect(unFavProjectMock).not.toHaveBeenCalled();
    expect(invalidateQueriesMock).not.toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('calls onError if mutation fails', async () => {
    const error = new Error('fail');
    editProjectMock.mockRejectedValue(error);
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(
      () => useEditProject(projectId, onSuccess, onError),
      {
        wrapper: createWrapper(),
      },
    );

    await act(async () => {
      return result.current
        .mutateAsync({
          ...paramsBase,
          isDescriptionChanged: true,
          description: 'fail',
        })
        .catch(() => {});
    });

    expect(onError).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
