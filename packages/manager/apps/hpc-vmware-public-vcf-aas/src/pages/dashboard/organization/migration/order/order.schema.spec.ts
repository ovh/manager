import { describe, expect, it } from 'vitest';
import { OrderFormSchema } from './order.schema';

describe('OrderFormSchema', () => {
  it('accepts a valid /32 host CIDR (the order express example)', () => {
    const result = OrderFormSchema.safeParse({
      initialWhitelistCidr: '203.0.113.7/32',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a valid subnet CIDR', () => {
    expect(
      OrderFormSchema.safeParse({ initialWhitelistCidr: '10.0.0.0/24' })
        .success,
    ).toBe(true);
  });

  it('rejects a bare IP without a CIDR mask', () => {
    expect(
      OrderFormSchema.safeParse({ initialWhitelistCidr: '203.0.113.7' })
        .success,
    ).toBe(false);
  });

  it('rejects an out-of-range octet', () => {
    expect(
      OrderFormSchema.safeParse({ initialWhitelistCidr: '999.0.0.1/32' })
        .success,
    ).toBe(false);
  });

  it('rejects an empty value with the required message', () => {
    const result = OrderFormSchema.safeParse({ initialWhitelistCidr: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'managed_vcd_migration_order_ip_error_required',
      );
    }
  });
});
