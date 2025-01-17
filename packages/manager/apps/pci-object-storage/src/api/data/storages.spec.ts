import { describe, it, expect, vi } from 'vitest';
import { aapi, v6 } from '@ovh-ux/manager-core-api';

import {
  getStorages,
  deleteSwiftContainer,
  deleteS3Container,
  getStorage,
  updateStorage,
  createSwiftStorage,
  createS3Storage,
  getStorageAccess,
  setContainerAsStatic,
} from './storages';

vi.mock('./storages', async () => {
  const mod = await vi.importActual<typeof import('./storages')>('./storages');
  return {
    ...mod,
  };
});

describe('storages API', () => {
  const projectId = 'test-project';
  const containerId = 'test-container';
  const region = 'test-region';
  const s3StorageType = 'test-s3';
  const storageId = 'test-storage';
  const containerName = 'test-container-name';
  const ownerId = 123;
  const encryption = 'AES256';
  const versioning = true;

  it('should get storages', async () => {
    const mockData = { resources: [], errors: [] };
    vi.mocked(aapi.get).mockResolvedValue({ data: mockData });

    const result = await getStorages(projectId);
    expect(result).toEqual(mockData);
    expect(aapi.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/storages`,
      {
        params: { archive: false, withObjects: false, serviceName: projectId },
      },
    );
  });

  it('should delete container', async () => {
    await deleteSwiftContainer(projectId, containerId);
    expect(v6.delete).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/storage/${containerId}`,
    );
  });

  it('should delete S3 container', async () => {
    await deleteS3Container(projectId, region, s3StorageType, containerName);
    expect(v6.delete).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/${s3StorageType}/${containerName}`,
    );
  });

  it('should get storage', async () => {
    const mockData = { id: storageId };
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });

    const result = await getStorage(
      projectId,
      region,
      s3StorageType,
      storageId,
    );
    expect(result).toEqual(mockData);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/${s3StorageType}/${storageId}`,
    );
  });

  it('should update storage', async () => {
    const mockData = { id: storageId };
    vi.mocked(v6.put).mockResolvedValue({ data: mockData });

    const result = await updateStorage({
      projectId,
      region,
      name: containerName,
      versioning: { status: 'enabled' },
      s3StorageType: 'storage',
    });
    expect(result).toEqual(mockData);
    expect(
      v6.put,
    ).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/storage/${containerName}`,
      { versioning: { status: 'enabled' } },
    );
  });

  it('should create Swift storage', async () => {
    const mockData = { id: storageId };
    vi.mocked(v6.post).mockResolvedValue({ data: mockData });

    const result = await createSwiftStorage({
      projectId,
      archive: false,
      containerName,
      region,
    });
    expect(result).toEqual(mockData);
    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/storage`,
      {
        archive: false,
        containerName,
        region,
      },
    );
  });

  it('should create S3 storage', async () => {
    const mockData = { id: storageId };
    vi.mocked(v6.post).mockResolvedValue({ data: mockData });

    const result = await createS3Storage({
      projectId,
      containerName,
      ownerId,
      region,
      encryption,
      versioning,
    });
    expect(result).toEqual(mockData);
    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/storage`,
      {
        name: containerName,
        ownerId,
        encryption: { sseAlgorithm: encryption },
        versioning: { status: 'enabled' },
      },
    );
  });

  it('should get storage access', async () => {
    const mockData = { endpoints: [], token: 'test-token' };
    vi.mocked(v6.post).mockResolvedValue({ data: mockData });
    // vi.mocked(getStorageAccess).

    const result = await getStorageAccess({ projectId });
    expect(result).toEqual(mockData);
    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/storage/access`,
    );
  });

  it('should set container as static', async () => {
    const mockData = { id: containerId };
    vi.mocked(v6.post).mockResolvedValue({ data: mockData });

    const result = await setContainerAsStatic({ projectId, containerId });
    expect(result).toEqual(mockData);
    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/storage/${containerId}/static`,
    );
  });
});
