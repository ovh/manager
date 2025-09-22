import { describe, it, vi } from 'vitest';

import { v6 } from '@ovh-ux/manager-core-api';

import { getRegionInformations } from './informations-region';

describe('region-informations', () => {
  it('fetches region information successfully', async () => {
    const mockData = {
      name: 'region1',
      status: 'available',
      capabilities: ['feature1', 'feature2'],
    };
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getRegionInformations('project1', 'region1');
    expect(result).toEqual(mockData);
  });

  it('handles empty region response', async () => {
    const mockData = {};
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getRegionInformations('project1', 'region1');
    expect(result).toEqual(mockData);
  });

  it('handles error when fetching region information', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('Network Error'));
    await expect(getRegionInformations('project1', 'region1')).rejects.toThrow('Network Error');
  });
});
