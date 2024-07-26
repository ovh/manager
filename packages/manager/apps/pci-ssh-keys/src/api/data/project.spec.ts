import { describe, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getProject } from '@/api/data/project';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => Promise.resolve({ data: {} }));
  return {
    v6: {
      get,
    },
  };
});

describe('project data', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('get a single project', async () => {
    expect(v6.get).not.toHaveBeenCalled();
    const projectId = '12345';
    getProject(projectId);
    expect(v6.get).toHaveBeenCalledWith(`/cloud/project/${projectId}`);
  });
});
