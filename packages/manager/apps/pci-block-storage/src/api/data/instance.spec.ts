import './instance';
import { describe, it, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getInstance, Instance } from '@/api/data/instance';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn(),
  },
}));

describe('getInstance', () => {
  it('should return instance data when instanceId is provided', async () => {
    const instance = { id: '1', name: 'Instance 1' } as Instance;
    vi.mocked(v6.get).mockResolvedValue({ data: instance });

    const result = await getInstance('123', '1');

    expect(v6.get).toHaveBeenCalledWith('/cloud/project/123/instance/1');
    expect(result).toEqual(instance);
  });
});
