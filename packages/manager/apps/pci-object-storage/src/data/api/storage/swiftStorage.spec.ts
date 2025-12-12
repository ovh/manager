import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  addSwiftObject,
  deleteSwiftObject,
  deleteSwiftStorage,
  downloadObject,
  editSwiftStorage,
  getSwiftStorage,
} from './swiftStorage.api';
import storages from '@/types/Storages';
import { HeaderXAuthToken } from '..';
import { mockedFile } from '@/__tests__/helpers/mocks/file/file';

describe('Swift Storage API functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getSwiftStorage', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getSwiftStorage({
      projectId: 'projectId',
      containerId: 'containerId',
      noObjects: false,
      prefix: 'pref',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/storage/containerId',
      {
        headers: {
          Pragma: 'no-cache',
        },
        params: {
          noObjects: false,
          prefix: 'pref',
        },
      },
    );
  });

  it('should call editSwiftStorage', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await editSwiftStorage({
      projectId: 'projectId',
      containerId: 'containerId',
      data: {
        containerType: storages.TypeEnum.private,
      },
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/storage/containerId',
      {
        containerType: storages.TypeEnum.private,
      },
      undefined,
    );
  });

  it('should call deleteSwiftStorage', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteSwiftStorage({
      projectId: 'projectId',
      containerId: 'containerId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/storage/containerId',
      undefined,
    );
  });

  it('should call downloadObject', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await downloadObject({
      projectId: 'projectId',
      containerId: 'containerId',
      data: {
        expirationDate: '2024/08/04',
        objectName: 'myObject',
      },
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/storage/containerId/publicUrl',
      {
        expirationDate: '2024/08/04',
        objectName: 'myObject',
      },
      undefined,
    );
  });

  it('should call deleteSwiftObject', async () => {
    expect(apiClient.ws.delete).not.toHaveBeenCalled();
    await deleteSwiftObject({
      storageName: 'containerId',
      objectName: 'objectName',
      url: '/mynewurl',
      token: 'myToken',
    });
    expect(apiClient.ws.delete).toHaveBeenCalledWith(
      '/mynewurl/containerId/objectName',
      {
        method: 'DELETE',
        headers: {
          [HeaderXAuthToken]: 'myToken',
        },
      },
    );
  });

  it('should call addSwiftObject', async () => {
    expect(apiClient.ws.put).not.toHaveBeenCalled();
    await addSwiftObject({
      url: '/mynewurl',
      file: mockedFile,
      token: 'myToken',
    });
    expect(apiClient.ws.put).toHaveBeenCalledWith('/mynewurl', mockedFile, {
      headers: {
        'Content-Type': mockedFile.type,
        [HeaderXAuthToken]: 'myToken',
      },
    });
  });
});
