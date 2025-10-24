import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  getRegions,
  getFlavor,
  getAppImages,
  getEditor,
  getFramework,
  getQpuFlavors,
  getQpuFlavor,
  getQpuRegions,
} from './capabilities.api';

describe('Capabilities functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getRegions', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getRegions({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/capabilities/region',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
        },
      },
    );
  });

  it('should call getQpuRegions', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getQpuRegions({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/quantum/capabilities/region',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
        },
      },
    );
  });

  it('should call getFlavor', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getFlavor({
      projectId: 'projectId',
      region: 'regionId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/capabilities/region/regionId/flavor',
    );
  });

  it('should call getAppImages', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getAppImages({
      projectId: 'projectId',
      region: 'region',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/capabilities/region/region/app/image',
    );
  });

  it('should call getEditor', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getEditor({
      projectId: 'projectId',
      region: 'region',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/capabilities/region/region/notebook/editor',
    );
  });

  it('should call getFramework', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getFramework({
      projectId: 'projectId',
      region: 'region',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/capabilities/region/region/notebook/framework?type=undefined',
    );
  });

  it('should call getQpuFlavors', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getQpuFlavors({
      projectId: 'projectId',
      region: 'regionId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/quantum/capabilities/region/regionId/qpu',
    );
  });

  it('should call getQpuFlavor', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getQpuFlavor({
      projectId: 'projectId',
      region: 'regionId',
      qpuFlavorId: 'flavorId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/quantum/capabilities/region/regionId/qpu/flavorId',
    );
  });
});
