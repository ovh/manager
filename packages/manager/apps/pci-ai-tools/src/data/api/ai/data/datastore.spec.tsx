import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  addDatastore,
  deleteDatastore,
  editDatastore,
  getDatastore,
  getDatastoreAuth,
  // getDatastoreContainer,
  getDatastores,
} from '@/data/api/ai/data/datastore.api';
import { mockedDatastoreInputGit } from '@/__tests__/helpers/mocks/volume/datastore';

describe('Datastore functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getDatastores', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getDatastores({
      projectId: 'projectId',
      region: 'region',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/data/region/region/alias',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call getDatastore', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getDatastore({
      projectId: 'projectId',
      region: 'region',
      alias: 'monAlias',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/data/region/region/alias/monAlias',
    );
  });

  it('should call addDatasore with mockedDatastoreInput', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addDatastore({
      projectId: 'projectId',
      region: 'region',
      datastore: mockedDatastoreInputGit,
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/data/region/region/alias',
      mockedDatastoreInputGit,
    );
  });

  it('should call editDatasore with mockedDatastoreInput', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await editDatastore({
      projectId: 'projectId',
      region: 'region',
      datastore: mockedDatastoreInputGit,
      alias: 'monAlias',
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/data/region/region/alias/monAlias',
      mockedDatastoreInputGit,
    );
  });

  it('should call deleteDatasore with aliasID', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteDatastore({
      projectId: 'projectId',
      region: 'region',
      alias: 'aliasID',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/data/region/region/alias/aliasID',
    );
  });

  it('should call getDatastoreAuth', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getDatastoreAuth({
      projectId: 'projectId',
      region: 'region',
      alias: 'aliasID',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/data/region/region/alias/aliasID/auth',
    );
  });

  // it('should call getDatastoreContainer', async () => {
  //   expect(apiClient.v6.get).not.toHaveBeenCalled();
  //   await getDatastoreContainer({
  //     projectId: 'projectId',
  //     region: 'region',
  //     alias: 'aliasID',
  //   });
  //   expect(apiClient.v6.get).toHaveBeenCalledWith(
  //     '/cloud/project/projectId/ai/data/region/region/alias/aliasID/containers',
  //   );
  // });
});
