import { describe, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getBill } from '@/api/data/bill';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => Promise.resolve({ data: {} }));
  return {
    v6: {
      get,
    },
  };
});

describe('bill data', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should call me bill api', async () => {
    expect(v6.get).not.toHaveBeenCalled();
    getBill('123');
    expect(v6.get).toHaveBeenCalledWith(`/me/bill/123`);
  });
});
