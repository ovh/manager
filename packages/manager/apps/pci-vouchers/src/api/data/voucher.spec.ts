import { describe, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { addVoucher, buyCredit } from '@/api/data/voucher';

vi.mock('@ovh-ux/manager-core-api', () => {
  const post = vi.fn(() => Promise.resolve({ data: {} }));
  return {
    v6: {
      post,
    },
  };
});

describe('voucher data', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should post voucher code when adding a voucher', async () => {
    expect(v6.post).not.toHaveBeenCalled();
    addVoucher('projectid123', 'voucherid123');
    expect(v6.post).toHaveBeenCalledWith('/cloud/project/projectid123/credit', {
      code: 'voucherid123',
    });
  });
  it('should post amount when buying credit', async () => {
    expect(v6.post).not.toHaveBeenCalled();
    const result = await buyCredit('projectid123', 25);
    expect(v6.post).toHaveBeenCalledWith(
      '/order/cloud/project/projectid123/credit',
      {
        amount: 25,
      },
    );
    expect(result.amount).toBe(25);
  });
});
