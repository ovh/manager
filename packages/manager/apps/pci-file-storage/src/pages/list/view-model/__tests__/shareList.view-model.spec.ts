import { describe, expect, it, vi } from 'vitest';

import { TShareListRow } from '@/adapters/shares/left/shareList.data';
import { mapShareToShareListRow } from '@/adapters/shares/left/shareList.mapper';
import { TShare } from '@/domain/entities/share.entity';

import { selectHasShares, selectSharesForList } from '../shareList.view-model';

vi.mock('@/adapters/shares/left/shareList.mapper', () => ({
  mapShareToShareListRow: vi.fn(),
}));

describe('shareList view model', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('selectSharesForList', () => {
    it.each([
      { data: undefined, expected: [] as TShareListRow[], mapperCalls: 0 },
      { data: [], expected: [] as TShareListRow[], mapperCalls: 0 },
      {
        data: [{ id: 'share-1' }] as TShare[],
        expected: [{ id: 'share-1' }] as TShareListRow[],
        mapperCalls: 1,
      },
    ])('should return expected list when data is $data', ({ data, expected, mapperCalls }) => {
      if (mapperCalls > 0) {
        vi.mocked(mapShareToShareListRow).mockReturnValue(expected?.[0] ?? ({} as TShareListRow));
      }

      const result = selectSharesForList(data);

      expect(result).toEqual(expected);
      expect(mapShareToShareListRow).toHaveBeenCalledTimes(mapperCalls);
      if (mapperCalls > 0) {
        const shares = data ?? [];
        expect(mapShareToShareListRow).toHaveBeenCalledWith(shares[0], 0, shares);
      }
    });
  });

  describe('selectHasShares', () => {
    it.each([
      { data: undefined, expected: false },
      { data: [], expected: false },
      { data: [{} as TShare], expected: true },
    ])(
      'should return $expected when data has length $(data?.length ?? "undefined")',
      ({ data, expected }) => {
        expect(selectHasShares(data)).toBe(expected);
      },
    );
  });
});
