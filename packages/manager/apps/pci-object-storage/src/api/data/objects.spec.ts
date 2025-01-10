import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  deleteS3Object,
  deleteObject,
  addUser,
  addHighPerfObjects,
  addObjects,
} from './objects';
import * as storages from './storages';
import { TStorage } from './storages';

vi.mock('./storages', async () => {
  const mod = await vi.importActual('./storages');
  return {
    ...mod,
  };
});

describe('deleteS3Object', () => {
  it('should delete an S3 object', async () => {
    const mockResponse = { data: 'deleted' };
    vi.mocked(v6.delete).mockResolvedValue(mockResponse);

    const result = await deleteS3Object(
      'projectId',
      'containerId',
      'objectName',
      'containerRegion',
      's3StorageType',
    );

    expect(v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/containerRegion/s3StorageType/containerId/object/objectName',
    );
    expect(result).toBe(mockResponse.data);
  });
});

describe('deleteObject', () => {
  it('should delete an object', async () => {
    const mockResponse = { json: vi.fn().mockResolvedValue('deleted') };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await deleteObject(
      'projectId',
      'storageName',
      'objectName',
      'token',
      'region',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://storage.region.cloud.ovh.net/v1/AUTH_projectId/storageName/objectName',
      {
        method: 'DELETE',
        headers: {
          'X-Auth-Token': 'token',
        },
      },
    );
    expect(result).toBe('deleted');
  });
});

describe('addUser', () => {
  it('should add a user', async () => {
    const mockResponse = { data: 'user added' };
    vi.mocked(v6.post).mockResolvedValue(mockResponse);

    const result = await addUser({
      projectId: 'projectId',
      region: 'region',
      storageId: 'storageId',
      userId: 'userId',
      role: 'role',
    });

    expect(v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/region/storage/storageId/policy/userId',
      {
        roleName: 'role',
        objectKey: undefined,
      },
    );
    expect(result).toBe(mockResponse.data);
  });
});

describe('addHighPerfObjects', () => {
  it('should add high performance objects', async () => {
    const mockResponse = { data: { signedHeaders: {}, url: 'url' } };
    vi.mocked(v6.post).mockReset();
    vi.mocked(v6.post).mockResolvedValue(mockResponse);
    vi.mocked(v6.put).mockResolvedValue('uploaded');

    const files = [
      new File(['content'], 'file1.txt'),
      new File(['content'], 'file2.txt'),
    ];

    const result = await addHighPerfObjects(
      'projectId',
      'regionName',
      'containerName',
      'prefix',
      files,
      's3StorageType',
      'storageClass',
    );

    expect(v6.post).toHaveBeenCalledTimes(files.length);
    expect(v6.put).toHaveBeenCalledTimes(files.length);
    expect(result).toEqual(['uploaded', 'uploaded']);
  });
});

describe('addObjects', () => {
  it('should add objects', async () => {
    const mockResponse = { data: 'uploaded' };
    vi.mocked(v6.post).mockReset();
    vi.mocked(v6.put).mockReset();
    vi.mocked(v6.put).mockResolvedValue(mockResponse);
    vi.spyOn(storages, 'getStorageAccess').mockResolvedValue({
      token: 'token',
      endpoints: [
        {
          region: 'region',
          url: 'url',
        },
      ],
    });

    const files = [
      new File(['content'], 'file1.txt'),
      new File(['content'], 'file2.txt'),
    ];

    const result = await addObjects(
      'projectId',
      { name: 'container', region: 'region' } as TStorage,
      'prefix',
      files,
    );

    expect(v6.put).toHaveBeenCalledTimes(files.length);
    expect(result).toEqual([mockResponse, mockResponse]);
  });
});
