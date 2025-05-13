import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  deleteS3Object,
  addUser,
  addHighPerfObjects,
  addObjects,
  deleteSwiftObject,
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

    const result = await deleteS3Object({
      projectId: 'projectId',
      containerId: 'containerId',
      objectName: 'objectName',
      containerRegion: 'containerRegion',
      s3StorageType: 's3StorageType',
    });

    expect(v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/containerRegion/s3StorageType/containerId/object/objectName',
    );
    expect(result).toBe(mockResponse);
  });
});

describe('deleteObject', () => {
  it('should delete an object', async () => {
    const mockResponse = { data: 'deleted' };
    vi.spyOn(axios, 'delete').mockResolvedValue(mockResponse);

    const result = await deleteSwiftObject({
      storageName: 'storageName',
      objectName: 'objectName',
      token: 'token',
      url: 'https://api.ovh.com',
    });

    expect(axios.delete).toHaveBeenCalledWith(
      'https://api.ovh.com/storageName/objectName',
      {
        method: 'DELETE',
        headers: {
          'X-Auth-Token': 'token',
        },
      },
    );
    expect(result).toBe(mockResponse);
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
      userId: 123,
      role: 'role',
    });

    expect(v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/region/storage/storageId/policy/123',
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
    vi.spyOn(axios, 'put').mockResolvedValue(mockResponse);
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
