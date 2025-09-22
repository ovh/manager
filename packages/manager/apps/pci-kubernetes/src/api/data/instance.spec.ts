import { describe, it, vi } from 'vitest';

import { v6 } from '@ovh-ux/manager-core-api';

import { switchToMonthlyBilling } from '@/api/data/instance';

describe('switchToMonthlyBilling', () => {
  it('should switch to monthly billing successfully', async () => {
    vi.mocked(v6.post).mockResolvedValue({});

    await switchToMonthlyBilling('123', '1');

    expect(v6.post).toHaveBeenCalledWith('/cloud/project/123/instance/1/activeMonthlyBilling', {
      instanceId: '1',
      serviceName: '123',
    });
  });

  it('should handle error when switching to monthly billing', async () => {
    vi.mocked(v6.post).mockRejectedValue(new Error('Network Error'));

    await expect(switchToMonthlyBilling('123', '1')).rejects.toThrow('Network Error');
  });
});
