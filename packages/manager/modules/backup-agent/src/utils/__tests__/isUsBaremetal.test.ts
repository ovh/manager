import { describe, expect, it } from 'vitest';

import { isUsBaremetal } from '@/utils/isUsBaremetal';

describe('isUsBaremetal test suite', () => {
  it.each(['vin1', 'VIN3', 'hil1', 'HIL2'])('returns true for US datacenter %s', (datacenter) => {
    expect(isUsBaremetal(datacenter)).toBe(true);
  });

  it.each(['rbx1', 'gra1', 'bhs1', 'sbg5'])(
    'returns false for non-US datacenter %s',
    (datacenter) => {
      expect(isUsBaremetal(datacenter)).toBe(false);
    },
  );
});
