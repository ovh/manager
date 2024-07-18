import './instance';
import { describe, it, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getInstance, getInstances, Instance } from '@/api/data/instance';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn(),
  },
}));

describe('getInstances', () => {
  it('should return instances data when region is provided', async () => {
    const instances = [
      { id: '1', name: 'Instance 1' },
      { id: '2', name: 'Instance 2' },
    ] as Instance[];
    vi.mocked(v6.get).mockResolvedValue({ data: instances });

    const result = await getInstances('123', 'region1');

    expect(v6.get).toHaveBeenCalledWith('/cloud/project/123/instance', {
      params: { region: 'region1' },
    });
    expect(result).toEqual(instances);
  });
});

describe('getInstance', () => {
  it('should return instance data when instanceId is provided', async () => {
    const instance = { id: '1', name: 'Instance 1' } as Instance;
    vi.mocked(v6.get).mockResolvedValue({ data: instance });

    const result = await getInstance('123', '1');

    expect(v6.get).toHaveBeenCalledWith('/cloud/project/123/instance/1');
    expect(result).toEqual(instance);
  });
});
