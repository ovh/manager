import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getServerContainer, TServerContainer } from './container';

describe('getServerContainer', () => {
  const mockContainer: TServerContainer = {
    createdAt: '2023-01-01T00:00:00Z',
    encryption: { sseAlgorithm: 'AES256' },
    id: 'containerId',
    name: 'containerName',
    objects: [],
    objectsCount: 0,
    objectsSize: 0,
    ownerId: 123,
    region: 'region',
    s3StorageType: 'STANDARD',
    storedBytes: 0,
    storedObjects: 0,
    versioning: { status: 'enabled' },
    virtualHost: 'virtualHost',
    staticUrl: 'staticUrl',
    replication: { rules: [{ status: 'enabled' }] },
  };

  it('should get server container by id', async () => {
    vi.mocked(v6.get).mockResolvedValue({ data: mockContainer });

    const result = await getServerContainer(
      'projectId',
      'region',
      'name',
      'containerId',
    );

    expect(v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/storage/containerId',
    );
    expect(result).toEqual(mockContainer);
  });

  it('should get server container by name and region', async () => {
    vi.mocked(v6.get).mockResolvedValue({ data: mockContainer });

    const result = await getServerContainer(
      'projectId',
      'region',
      'containerName',
      '',
    );

    expect(v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/region/storage/containerName',
    );
    expect(result).toEqual(mockContainer);
  });
});
