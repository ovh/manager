import { describe, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getProject } from '@/data/project';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
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
  it('should call cloud project apiv6 with project id', async () => {
    expect(v6.get).not.toHaveBeenCalled();
    getProject('foo');
    expect(v6.get).toHaveBeenCalledWith('/cloud/project/foo');
  });
});
