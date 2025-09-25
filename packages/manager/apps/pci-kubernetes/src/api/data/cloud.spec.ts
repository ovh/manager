import { describe, it, vi } from 'vitest';

import { v6 } from '@ovh-ux/manager-core-api';

import { getCloudSchema } from '@/api/data/cloud';

describe('Cloud API', () => {
  it('fetches cloud schema successfully', async () => {
    const mockData = {
      models: { exampleModel: { enum: ['value1', 'value2'] } },
    };
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getCloudSchema();
    expect(result).toEqual(mockData);
  });

  it('handles empty cloud schema response', async () => {
    const mockData = { models: {} };
    vi.mocked(v6.get).mockResolvedValue({ data: mockData });
    const result = await getCloudSchema();
    expect(result).toEqual(mockData);
  });

  it('handles error when fetching cloud schema', async () => {
    vi.mocked(v6.get).mockRejectedValue(new Error('Network Error'));
    await expect(getCloudSchema()).rejects.toThrow('Network Error');
  });
});
