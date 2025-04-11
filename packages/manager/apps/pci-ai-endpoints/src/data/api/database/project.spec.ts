import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getProject } from '@/data/api/database/project.api';

describe('getProject', () => {
  it('should call getProject with correct URL and return data', async () => {
    const projectId = 'dummy-project-id';
    const expectedData = { project: 'dummy' };

    vi.spyOn(v6, 'get').mockResolvedValueOnce({ data: expectedData });

    const data = await getProject(projectId);

    expect(v6.get).toHaveBeenCalledWith(`/cloud/project/${projectId}`);
    expect(data).toEqual(expectedData);
  });
});
