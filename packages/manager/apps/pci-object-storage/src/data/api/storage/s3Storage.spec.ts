import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  addS3Object,
  addS3UserPolicy,
  createS3Storage,
  deleteS3Object,
  deleteS3ObjectVersion,
  deleteS3Storage,
  getPresignUrlS3,
  getS3Object,
  getS3ObjectVersion,
  getS3ObjectVersions,
  getS3Objects,
  getS3Storage,
  updateS3Storage,
  updateS3ObjectStorageClass,
  restoreS3Object,
  bulkDeleteS3Objects,
  createStorageJob,
} from './s3Storage.api';
import { mockedUpdateS3Data } from '@/__tests__/helpers/mocks/s3/updateS3';
import storages from '@/types/Storages';
import { mockedTag } from '@/__tests__/helpers/mocks/tag/tag';
import { mockedFile } from '@/__tests__/helpers/mocks/file/file';

describe('S3 Storage functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getS3Storage', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getS3Storage({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
      limit: 100,
      marker: 'test',
      prefix: 'pref',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage/s3Name',
      {
        params: {
          limit: 100,
          marker: 'test',
          prefix: 'pref',
        },
      },
    );
  });

  it('should call deleteS3Storage', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteS3Storage({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage/s3Name',
      undefined,
    );
  });

  it('should call udpateS3Storage', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await updateS3Storage({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
      data: mockedUpdateS3Data,
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage/s3Name',
      {
        encryption: {
          sseAlgorithm: storages.EncryptionAlgorithmEnum.AES256,
        },
        tags: mockedTag,
      },
      undefined,
    );
  });

  it('should call addS3UserPolicy', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addS3UserPolicy({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
      userId: 123,
      data: {
        roleName: storages.PolicyRoleEnum.admin,
      },
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage/s3Name/policy/123',
      {
        roleName: storages.PolicyRoleEnum.admin,
      },
      undefined,
    );
  });

  it('should call createS3Storage', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await createS3Storage({
      projectId: 'projectId',
      region: 'BHS',
      data: {
        name: 'myNewS3',
        ownerId: 2113,
      },
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage',
      {
        name: 'myNewS3',
        ownerId: 2113,
      },
      undefined,
    );
  });

  it('should call getPresignUrlS3', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await getPresignUrlS3({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
      data: {
        expire: 48,
        method: storages.PresignedURLMethodEnum.GET,
        object: 'myObject',
        storageClass: storages.StorageClassEnum.STANDARD,
        versionId: 'versionId',
      },
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage/s3Name/presign',
      {
        expire: 48,
        method: storages.PresignedURLMethodEnum.GET,
        object: 'myObject',
        storageClass: storages.StorageClassEnum.STANDARD,
        versionId: 'versionId',
      },
      undefined,
    );
  });
  it('should call addS3Object', async () => {
    expect(apiClient.ws.put).not.toHaveBeenCalled();
    await addS3Object({
      url: '/mynewurl',
      file: mockedFile,
      method: storages.PresignedURLMethodEnum.GET,
      signedHeaders: {
        header1: 'header1',
      },
    });
    expect(apiClient.ws.put).toHaveBeenCalledWith('/mynewurl', mockedFile, {
      headers: {
        'Content-Type': 'text/plain',
        header1: 'header1',
      },
    });
  });

  it('should call getS3Objects', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getS3Objects({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
      keyMarker: 'test',
      versionIdMarker: 'versionId',
      withVersions: true,
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage/s3Name/object',
      {
        params: {
          keyMarker: 'test',
          versionIdMarker: 'versionId',
          withVersions: true,
        },
      },
    );
  });

  it('should call getS3Object', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getS3Object({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
      key: 'objectKey',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage/s3Name/object/objectKey',
      undefined,
    );
  });

  it('should call deleteS3Object', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteS3Object({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
      key: 'objectKey',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage/s3Name/object/objectKey',
      undefined,
    );
  });

  it('should call getS3ObjectVersions', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getS3ObjectVersions({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
      key: 'objectKey',
      limit: 100,
      versionIdMarker: 'versionId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage/s3Name/object/objectKey/version',
      {
        params: {
          limit: 100,
          versionIdMarker: 'versionId',
        },
      },
    );
  });

  it('should call getS3ObjectVersion', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getS3ObjectVersion({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
      key: 'objectKey',
      versionId: 'versionId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage/s3Name/object/objectKey/version/versionId',
      undefined,
    );
  });

  it('should call deleteS3ObjectVersion', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteS3ObjectVersion({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
      key: 'objectKey',
      versionId: 'versionId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage/s3Name/object/objectKey/version/versionId',
      undefined,
    );
  });

  it('should call updateS3ObjectStorageClass', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await updateS3ObjectStorageClass({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
      key: 'objectKey',
      storageClass: storages.StorageClassEnum.STANDARD,
      versionId: 'versionId',
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage/s3Name/object/objectKey/version/versionId/copy',
      {
        storageClass: storages.StorageClassEnum.STANDARD,
        targetBucket: 's3Name',
        targetKey: 'objectKey',
      },
      undefined,
    );
  });

  it('should call restoreS3Object', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await restoreS3Object({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
      key: 'objectKey',
      days: 7,
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage/s3Name/object/objectKey/restore',
      {
        days: 7,
      },
      undefined,
    );
  });

  it('should call bulkDeleteS3Objects', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await bulkDeleteS3Objects({
      projectId: 'projectId',
      region: 'BHS',
      name: 's3Name',
      objects: [{ key: 'objectKey', versionId: 'versionId' }],
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage/s3Name/bulkDeleteObjects',
      {
        objects: [
          {
            key: 'objectKey',
            versionId: 'versionId',
          },
        ],
      },
      undefined,
    );
  });

  it('should call createStorageJob', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await createStorageJob({
      projectId: 'projectId',
      region: 'BHS',
      name: 's3Name',
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/BHS/storage/s3Name/job/replication',
      undefined,
      undefined,
    );
  });
});
