import { v6 } from '@ovh-ux/manager-core-api';
import { describe, it, vi } from 'vitest';
import {
  getInstances,
  switchToMonthlyBilling,
  TInstance,
} from '@/api/data/instance';

describe('getInstances', () => {
  it('should return instances data when projectId is provided', async () => {
    const instances = ([
      { id: '1', monthlyBilling: { status: 'active' } },
      { id: '2', monthlyBilling: { status: 'inactive' } },
    ] as unknown) as TInstance[];
    vi.mocked(v6.get).mockResolvedValue({ data: instances });

    const result = await getInstances('123');

    expect(v6.get).toHaveBeenCalledWith('/cloud/project/123/instance');
    expect(result).toEqual(instances);
  });

  it('should handle empty instances response', async () => {
    const instances = [] as TInstance[];
    vi.mocked(v6.get).mockResolvedValue({ data: instances });

    const result = await getInstances('123');

    expect(v6.get).toHaveBeenCalledWith('/cloud/project/123/instance');
    expect(result).toEqual(instances);
  });

  it('should handle error when fetching instances', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('Network Error'));

    await expect(getInstances('123')).rejects.toThrow('Network Error');
  });
});

describe('switchToMonthlyBilling', () => {
  it('should switch to monthly billing successfully', async () => {
    vi.mocked(v6.post).mockResolvedValue({});

    await switchToMonthlyBilling('123', '1');

    expect(
      v6.post,
    ).toHaveBeenCalledWith(
      '/cloud/project/123/instance/1/activeMonthlyBilling',
      { instanceId: '1', serviceName: '123' },
    );
  });

  it('should handle error when switching to monthly billing', async () => {
    vi.mocked(v6.post).mockRejectedValue(new Error('Network Error'));

    await expect(switchToMonthlyBilling('123', '1')).rejects.toThrow(
      'Network Error',
    );
  });
});
