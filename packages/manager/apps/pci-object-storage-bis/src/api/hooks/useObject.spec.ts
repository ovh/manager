import { vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { getStorageAccess, TStorage, TStorageAccess } from '../data/storages';
import {
  addHighPerfObjects,
  addUser,
  deleteS3Object,
  deleteSwiftObject,
} from '../data/objects';

import { wrapper } from '@/wrapperRenders';
import { useAddObjects, useAddUser, useDeleteObject } from './useObject';
import { ReplicationStorageClass } from '@/constants';

vi.mock('@/api/data/objects');
vi.mock('../data/storages', () => ({
  getStorageAccess: vi.fn(),
}));

describe('useObject hooks', () => {
  describe('useDeleteObject', () => {
    it('should call deleteS3Object', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      const storage = {
        name: 'test',
        s3StorageType: ReplicationStorageClass.STANDARD,
        id: '1',
        region: 'us-east-1',
      } as TStorage;
      const projectId = 'project1';
      const objectName = 'object1';
      const region = 'us-east-1';

      vi.mocked(deleteS3Object).mockResolvedValueOnce({
        data: {},
      } as never);

      const { result } = renderHook(
        () =>
          useDeleteObject({
            projectId,
            storage,
            objectName,
            region,
            onError,
            onSuccess,
          }),
        { wrapper },
      );

      await act(async () => {
        result.current.deleteObject();
      });

      expect(deleteS3Object).toHaveBeenCalledWith({
        projectId,
        containerId: storage.name,
        objectName,
        containerRegion: region,
        s3StorageType: storage.s3StorageType,
      });
      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    it('should call deleteSwiftObject', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      const storage = {
        name: 'test',
        id: '1',
        region: 'us-east-1',
      } as TStorage;
      const projectId = 'project1';
      const objectName = 'object1';
      const region = 'us-east-1';

      vi.mocked(getStorageAccess).mockResolvedValue({
        token: 'token',
        endpoints: [
          {
            region,
            url: 'https://api.ovh.com',
          },
        ],
      } as TStorageAccess);

      const { result } = renderHook(
        () =>
          useDeleteObject({
            projectId,
            storage,
            objectName,
            region,
            onError,
            onSuccess,
          }),
        { wrapper },
      );

      await act(async () => {
        result.current.deleteObject();
      });

      expect(deleteSwiftObject).toHaveBeenCalledWith({
        storageName: storage.name,
        objectName,
        token: 'token',
        url: 'https://api.ovh.com',
      });
      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe('useAddUser', () => {
    it('should call addUser', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      const projectId = 'project1';
      const storageId = 'storage1';
      const objectName = 'object1';
      const region = 'us-east-1';
      const userId = 1;
      const role = 'admin';

      const { result } = renderHook(
        () =>
          useAddUser({
            projectId,
            storageId,
            objectName,
            region,
            userId,
            role,
            onError,
            onSuccess,
          }),
        { wrapper },
      );

      await act(async () => {
        await result.current.addUser();
      });

      expect(addUser).toHaveBeenCalledWith({
        projectId,
        region,
        objectName,
        storageId,
        userId,
        role,
      });
      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe('useAddObjects', () => {
    it('should call addHighPerfObjects', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      const projectId = 'project1';
      const container = {
        name: 'test',
        id: '1',
        s3StorageType: ReplicationStorageClass.STANDARD,
        region: 'region',
      } as TStorage;
      const files = [{ name: 'object1' }] as File[];
      const { result } = renderHook(
        () =>
          useAddObjects({
            projectId,
            container,
            prefix: '/prefix',
            files,
            storageClass: 'storageClass',
            onError,
            onSuccess,
          }),
        { wrapper },
      );
      await act(async () => {
        result.current.addObjects();
      });
      expect(addHighPerfObjects).toHaveBeenCalledWith(
        projectId,
        container.region,
        container.name,
        '/prefix',
        files,
        container.s3StorageType,
        'storageClass',
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
