import { renderHook, act, waitFor } from '@testing-library/react';
import { Mock, vi } from 'vitest';

import {
  useGetAllRegistries,
  useGetRegistryPlan,
  useGetRegistryAvailablePlans,
  useDeleteRegistry,
  useRenameRegistry,
  usePostRegistryCredentials,
  useUpdatePlan,
  sortRegistries,
  useSuspenseRegistry,
} from './useRegistry';
import {
  deleteRegistry,
  getAllRegistries,
  getRegistry,
  getRegistryPlan,
  getRegistryAvailablePlans,
  renameRegistry,
  postRegistryCredentials,
  updatePlan,
  TRegistry,
} from '../data/registry';
import { wrapper } from '../../wrapperRenders';

vi.mock('../data/registry');

describe('Hooks and utilities tests', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all registries', async () => {
    const mockRegistries = [
      {
        id: '1',
        name: 'Test Registry',
        region: 'EU',
        version: 2,
        search: 'Test Registry 1 EU 2',
      },
    ];
    (getAllRegistries as Mock).mockResolvedValue(mockRegistries);

    const { result } = renderHook(() => useGetAllRegistries('project-id'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(result.current.data).toEqual(mockRegistries);
    expect(getAllRegistries).toHaveBeenCalledWith('project-id');
  });

  it('should fetch a specific registry', async () => {
    const mockRegistry = { id: '1', name: 'Test Registry' };
    (getRegistry as Mock).mockResolvedValue(mockRegistry);

    const { result } = renderHook(
      () => useSuspenseRegistry('project-id', '1'),
      {
        wrapper,
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(result.current.data).toEqual(mockRegistry);
    expect(getRegistry).toHaveBeenCalledWith('project-id', '1');
  });

  it('should sort registries', () => {
    const registries = [
      { id: '2', name: 'B Registry' },
      { id: '1', name: 'A Registry' },
    ] as TRegistry[];

    const sorted = sortRegistries(registries, { id: 'name', desc: false });
    expect(sorted).toEqual([
      { id: '1', name: 'A Registry' },
      { id: '2', name: 'B Registry' },
    ]);
  });

  it('should delete a registry', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    (deleteRegistry as Mock).mockResolvedValue(null);

    const { result } = renderHook(
      () =>
        useDeleteRegistry({
          projectId: 'project-id',
          registryId: '1',
          onSuccess,
          onError,
        }),
      { wrapper },
    );

    await act(async () => result.current.deleteRegistry());

    expect(deleteRegistry).toHaveBeenCalledWith('project-id', '1');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should rename a registry', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    (renameRegistry as Mock).mockResolvedValue(null);

    const { result } = renderHook(
      () =>
        useRenameRegistry({
          projectId: 'project-id',
          registryId: '1',
          onSuccess,
          onError,
        }),
      { wrapper },
    );

    await act(async () => result.current.renameRegistry('New Name'));

    expect(renameRegistry).toHaveBeenCalledWith('project-id', '1', 'New Name');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should post registry credentials', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const mockCredentials = { username: 'test', password: '1234' };
    (postRegistryCredentials as Mock).mockResolvedValue(mockCredentials);

    const { result } = renderHook(
      () =>
        usePostRegistryCredentials({
          projectId: 'project-id',
          registryId: '1',
          onSuccess,
          onError,
        }),
      { wrapper },
    );

    await act(async () => result.current.generateCredentials());

    expect(postRegistryCredentials).toHaveBeenCalledWith('project-id', '1');
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it('should update a plan', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    (updatePlan as Mock).mockResolvedValue(null);

    const { result } = renderHook(
      () =>
        useUpdatePlan({
          projectId: 'project-id',
          registryId: '1',
          planId: 'plan-id',
          onSuccess,
          onError,
        }),
      { wrapper },
    );

    await act(async () => result.current.updatePlan());

    expect(updatePlan).toHaveBeenCalledWith('project-id', '1', 'plan-id');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should fetch registry plan', async () => {
    const mockPlan = { id: 'basic', name: 'Basic Plan' };
    (getRegistryPlan as Mock).mockResolvedValue(mockPlan);

    const { result } = renderHook(() => useGetRegistryPlan('project-id', '1'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(result.current.data).toEqual(mockPlan);
    expect(getRegistryPlan).toHaveBeenCalledWith('project-id', '1');
  });

  it('should fetch registry available plans', async () => {
    const mockPlans = [{ id: 'basic', name: 'Basic Plan' }];
    (getRegistryAvailablePlans as Mock).mockResolvedValue(mockPlans);

    const { result } = renderHook(
      () => useGetRegistryAvailablePlans('project-id', '1'),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(result.current.data).toEqual(mockPlans);
    expect(getRegistryAvailablePlans).toHaveBeenCalledWith('project-id', '1');
  });
});
