import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  getArchiveContainers,
  deleteArchive,
  addUserToContainer,
  restoreArchive,
  startArchive,
  createArchiveContainer,
  flushArchive,
} from './archive';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
  },
}));

describe('Archive API Functions', () => {
  const projectId = 'project123';
  const region = 'regionA';
  const name = 'test-container';
  const storageId = 'storage123';
  const userId = 5678;
  const role = 'admin';
  const ownerId = 9999;
  const lockedUntilDays = 30;

  it('should fetch archive containers', async () => {
    const mockData = [
      {
        name,
        status: 'active',
        virtualHost: 'test.ovh.com',
        ownerId,
        objectsCount: 10,
        objectsSize: 5000,
        createdAt: '2024-01-01T00:00:00Z',
        automaticDeletionAt: null,
        lockedUntil: null,
      },
    ];
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });

    const data = await getArchiveContainers(projectId, region);

    expect(data).toEqual(mockData);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/coldArchive`,
    );
  });

  it('should delete an archive', async () => {
    vi.mocked(v6.delete).mockResolvedValue({ data: {} });

    await deleteArchive({ projectId, region, name });

    expect(v6.delete).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/coldArchive/${name}`,
    );
  });

  it('should add a user to a container', async () => {
    const mockResponse = { success: true };
    vi.mocked(v6.post).mockResolvedValue({ data: mockResponse });

    const data = await addUserToContainer({
      projectId,
      region,
      storageId,
      userId,
      role,
    });

    expect(data).toEqual(mockResponse);
    expect(
      v6.post,
    ).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/storage/${storageId}/policy/${userId}`,
      { roleName: role },
    );
  });

  it('should restore an archive', async () => {
    vi.mocked(v6.post).mockResolvedValue({ data: { success: true } });

    await restoreArchive({ projectId, region, name });

    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/coldArchive/${name}/restore`,
    );
  });

  it('should start an archive', async () => {
    vi.mocked(v6.post).mockResolvedValue({ data: { success: true } });

    await startArchive({ projectId, region, name, lockedUntilDays });

    expect(
      v6.post,
    ).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/coldArchive/${name}/archive`,
      { lockedUntilDays },
    );
  });

  it('should create an archive container', async () => {
    vi.mocked(v6.post).mockResolvedValue({ data: { success: true } });

    await createArchiveContainer({ projectId, region, ownerId, name });

    expect(
      v6.post,
    ).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/coldArchive`,
      { name, ownerId },
    );
  });

  it('should flush an archive', async () => {
    vi.mocked(v6.post).mockResolvedValue({ data: { success: true } });

    await flushArchive({ projectId, region, name });

    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/region/${region}/coldArchive/${name}/destroy`,
    );
  });
});
