import { describe, expect, it, vi } from 'vitest';

import { TShare } from '@/domain/entities/share.entity';

import * as shareListViewModel from '../shareList.view-model';

// Simple defaults; override in a test with vi.mocked(getMacroRegion).mockReturnValue(...) etc.
const defaultMacroRegion = 'GRA';
const defaultStatusDisplay = { labelKey: 'status:active', badgeColor: 'success' as const };

vi.mock('@ovh-ux/muk', () => ({
  getMacroRegion: vi.fn(() => defaultMacroRegion),
}));

vi.mock('@/pages/view-model/shareStatus.view-model', () => ({
  getShareStatusDisplay: vi.fn(() => defaultStatusDisplay),
}));

describe('shareList view model', () => {
  describe('selectSharesForList', () => {
    it('should return empty array when data is undefined', () => {
      expect(shareListViewModel.selectSharesForList(undefined)).toEqual([]);
    });

    it('should return empty array when data is empty', () => {
      expect(shareListViewModel.selectSharesForList([])).toEqual([]);
    });

    it('should return mapped rows when data has shares', () => {
      const share = {
        id: 'share-1',
        name: 'My Share',
        region: 'GRA9',
        protocol: 'NFS',
        size: 161061273600,
        status: 'available' as const,
        type: 'nfs',
        createdAt: '2026-01-30T09:35:49.615Z',
        description: '',
        isPublic: false,
        enabledActions: [] as const,
        mountPaths: [],
      } as TShare;

      const result = shareListViewModel.selectSharesForList([share]);

      expect(result).toHaveLength(1);
      const row = result[0]!;
      expect(row).toMatchObject({
        id: 'share-1',
        name: 'My Share',
        region: 'GRA9',
        regionDisplayKey: `regions:manager_components_region_${defaultMacroRegion}_micro`,
        protocol: 'NFS',
        size: 161061273600,
        status: 'available',
      });
      expect(row.statusDisplay).toEqual(defaultStatusDisplay);
      expect(row.actions.get('actions')).toHaveLength(1);
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
        expect(shareListViewModel.selectHasShares(data)).toBe(expected);
      },
    );
  });
});
