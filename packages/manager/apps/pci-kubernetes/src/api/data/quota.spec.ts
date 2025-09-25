import { describe, expect, it, vi } from 'vitest';

import { v6 } from '@ovh-ux/manager-core-api';

import { getProjectQuotaByRegion } from './quota';

vi.mocked(v6.get).mockClear();

describe('getProjectQuotaByRegion', () => {
  it('retrieves quota successfully', async () => {
    const mockData = { region: 'GRA', instance: { maxInstances: 10 } };
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });

    const result = await getProjectQuotaByRegion('project1', 'GRA');
    expect(v6.get).toHaveBeenCalledWith('/cloud/project/project1/region/GRA/quota');
    expect(result).toEqual(mockData);
  });

  it('handles error when retrieving quota', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('API Error'));

    await expect(getProjectQuotaByRegion('project1', 'GRA')).rejects.toThrow('API Error');
  });
});
