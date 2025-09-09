import { describe, it, expect, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { TRegion, useGetProjectRegions } from '@ovh-ux/manager-pci-common';
import { UseQueryResult } from '@tanstack/react-query';
import {
  useAllStorages,
  useMappedStorages,
  useStorages,
  useDeleteStorage,
  useStorage,
  useUpdateStorage,
  useCreateContainer,
  useAddUser,
  useUpdateStorageType,
} from './useStorages';
import {
  getStorages,
  deleteS3Container,
  deleteSwiftContainer,
  getStorageAccess,
  updateStorage,
  createSwiftStorage,
  updateStorageType,
  TStoragesAapiResult,
  TStorage,
  TStorageAccess,
} from '../data/storages';

import { wrapper } from '@/wrapperRenders';
import { addUser, deleteSwiftObject } from '../data/objects';
import { ObjectContainerMode, OBJECT_CONTAINER_OFFER_SWIFT } from '@/constants';

vi.mock('../data/storages');
vi.mock('../data/objects');

describe('useAllStorages', () => {
  it('fetches all storages', async () => {
    const projectId = 'test-project';
    vi.mocked(getStorages).mockResolvedValueOnce({
      resources: [],
    } as TStoragesAapiResult);

    const { result } = renderHook(() => useAllStorages(projectId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ resources: [] });
    expect(getStorages).toHaveBeenCalledWith(projectId);
    vi.mocked(getStorages).mockClear();
  });
});

describe('useMappedStorages', () => {
  it('maps storages with regions', async () => {
    const projectId = 'test-project';
    const storages = ({
      resources: [
        {
          region: 'region1',
          name: 'storage1',
          s3StorageType: 'storage',
          deploymentMode: ObjectContainerMode.MULTI_ZONES,
        },
      ],
    } as unknown) as TStoragesAapiResult;
    const regions = [
      { name: 'region1', type: ObjectContainerMode.MULTI_ZONES },
    ] as TRegion[];

    vi.mocked(getStorages).mockResolvedValueOnce(storages);
    vi.mocked(useGetProjectRegions).mockReturnValue({
      data: regions,
      isLoading: false,
    } as UseQueryResult<TRegion[]>);

    const { result } = renderHook(() => useMappedStorages(projectId), {
      wrapper,
    });
    await waitFor(() => expect(result.current.data?.length).toBeGreaterThan(0));

    expect(result.current.data).toEqual([
      {
        region: 'region1',
        name: 'storage1',
        s3StorageType: 'storage',
        offer: 'pci_projects_project_storages_containers_offer_s3',
        deploymentMode: ObjectContainerMode.MULTI_ZONES,
        containerCount: 0,
        usedSpace: 0,
      },
    ]);
  });
});

describe('useStorages', () => {
  it('returns paginated and sorted storages', async () => {
    const projectId = 'test-project';
    const pagination = { pageIndex: 0, pageSize: 10 };
    const sorting = { id: 'name', desc: false };
    const filters = [];
    const availability = { isLocalZoneAvailable: true, is3azAvailable: true };
    const storages = [
      {
        name: 'storage1',
        region: 'region1',
        s3StorageType: 'storage',
        deploymentMode: ObjectContainerMode.MULTI_ZONES,
        offer: 'pci_projects_project_storages_containers_offer_s3',
        mode:
          'pci_projects_project_storages_containers_deployment_mode_region-3-az',
        usedSpace: 0,
        containerCount: 0,
      },
    ] as TStorage[];
    vi.mocked(getStorages).mockResolvedValueOnce({
      resources: storages,
    } as TStoragesAapiResult);

    const regions = [
      { name: 'region1', type: ObjectContainerMode.MULTI_ZONES },
    ] as TRegion[];
    vi.mocked(useGetProjectRegions).mockReturnValue({
      data: regions,
      isLoading: false,
    } as UseQueryResult<TRegion[]>);

    const { result } = renderHook(
      () => useStorages(projectId, pagination, sorting, filters, availability),
      { wrapper },
    );

    await waitFor(() =>
      expect(result.current?.allStorages.resources?.length).toBeGreaterThan(0),
    );

    expect(result.current.paginatedStorages.rows).toEqual(storages);
  });
});

describe('useDeleteStorage', () => {
  it('deletes a storage', async () => {
    const projectId = 'test-project';
    const storage = ({
      id: 'storage1',
      s3StorageType: 'type1',
      region: 'region1',
      name: 'name1',
    } as unknown) as TStorage;
    const objects = [];
    vi.mocked(deleteS3Container).mockResolvedValueOnce({} as never);
    vi.mocked(getStorageAccess).mockResolvedValueOnce({
      token: 'token',
    } as TStorageAccess);
    vi.mocked(deleteSwiftObject).mockResolvedValueOnce({} as never);
    vi.mocked(deleteSwiftContainer).mockResolvedValueOnce({} as never);

    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () => useDeleteStorage({ projectId, onSuccess, onError }),
      { wrapper },
    );

    await act(async () => {
      result.current.deleteStorage({ storage, objects });
    });

    expect(deleteS3Container).toHaveBeenCalledWith(
      projectId,
      'region1',
      'type1',
      'name1',
    );
    expect(onSuccess).toHaveBeenCalled();
  });
});

describe('useStorage', () => {
  it('fetches a single storage', async () => {
    const projectId = 'test-project';
    const storageId = 'storage1';
    const storageRegion = 'region1';

    const storages = {
      resources: [
        {
          name: 'storage1',
          containerCount: 0,
          offer: 'pci_projects_project_storages_containers_offer_s3',
        },
      ],
    } as TStoragesAapiResult;
    vi.mocked(getStorages).mockResolvedValueOnce(storages);

    const { result } = renderHook(
      () => useStorage(projectId, storageId, storageRegion),
      {
        wrapper,
      },
    );

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.storage).toEqual({
      name: 'storage1',
      usedSpace: 0,
      s3StorageType: 'storage',
      region: 'region1',
      offer: 'pci_projects_project_storages_containers_offer_s3',
      mode:
        'pci_projects_project_storages_containers_deployment_mode_region-3-az',
      deploymentMode: 'region-3-az',
      containerCount: 0,
    });
  });
});

describe('useUpdateStorage', () => {
  it('updates a storage', async () => {
    const projectId = 'test-project';
    const region = 'region1';
    const name = 'name1';
    const s3StorageType = 'type1';
    const versioning = { status: 'Enabled' };
    vi.mocked(updateStorage).mockResolvedValueOnce({});

    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () =>
        useUpdateStorage({
          projectId,
          region,
          name,
          s3StorageType,
          onSuccess,
          onError,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.updateContainer({ versioning });
    });

    expect(updateStorage).toHaveBeenCalledWith({
      projectId,
      region,
      name,
      versioning,
      s3StorageType,
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});

describe('useCreateContainer', () => {
  it('creates a container', async () => {
    const projectId = 'test-project';
    const container = {
      offer: OBJECT_CONTAINER_OFFER_SWIFT,
      containerName: 'container1',
      region: 'region1',
    };
    const regions = [{ name: 'region1', type: 'type1' }] as TRegion[];
    vi.mocked(useGetProjectRegions).mockReturnValue({
      data: regions,
      isLoading: false,
    } as UseQueryResult<TRegion[]>);
    vi.mocked(createSwiftStorage).mockResolvedValueOnce({
      id: 'container1',
    } as TStorage);

    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () => useCreateContainer({ projectId, onSuccess, onError }),
      { wrapper },
    );

    await act(async () => {
      result.current.createContainer(container);
    });

    expect(createSwiftStorage).toHaveBeenCalledWith({
      projectId,
      archive: false,
      containerName: 'container1',
      region: 'region1',
    });
    expect(onSuccess).toHaveBeenCalledWith({ id: 'container1' });
  });
});

describe('useAddUser', () => {
  it('adds a user to a storage', async () => {
    const projectId = 'test-project';
    const storageId = 'storage1';
    const region = 'region1';
    const userId = 1;
    const role = 'admin';
    vi.mocked(addUser).mockResolvedValueOnce({});

    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () =>
        useAddUser({
          projectId,
          storageId,
          region,
          userId,
          role,
          onSuccess,
          onError,
        }),
      { wrapper },
    );

    await act(async () => {
      result.current.addUser();
    });

    expect(addUser).toHaveBeenCalledWith({
      projectId,
      region,
      storageId,
      userId,
      role,
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});

describe('useUpdateStorageType', () => {
  it('updates the storage type', async () => {
    const projectId = 'test-project';
    const containerId = 'container1';
    const containerType = 'public';
    vi.mocked(updateStorageType).mockResolvedValueOnce({});

    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () => useUpdateStorageType({ projectId, onSuccess, onError }),
      { wrapper },
    );

    await act(async () => {
      result.current.updateStorageType(containerId, containerType);
    });

    expect(updateStorageType).toHaveBeenCalledWith({
      projectId,
      containerId,
      containerType,
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});
