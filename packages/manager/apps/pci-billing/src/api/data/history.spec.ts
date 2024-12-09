import { describe, it, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getUsageHistory, getUsageHistoryPeriod } from './history';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn(() => ({ data: null })),
  },
}));

describe('history', () => {
  it('getUsageHistoryPeriod', async () => {
    getUsageHistoryPeriod('projectId', 'from', 'to');
    expect(v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/usage/history?from=from&to=to',
    );
  });
  it('getUsageHistory', async () => {
    getUsageHistory('projectId', 'usageId');
    expect(v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/usage/history?from=from&to=to',
    );
  });
});
