import { describe, expect, it, vi } from 'vitest';

import { TShare } from '@/domain/entities/share.entity';

import { selectShareDetails } from '../shareDetails.view-model';

vi.mock('@ovh-ux/muk', () => ({
  getMacroRegion: () => 'GRA',
}));

describe('shareDetails view model', () => {
  describe('selectShareDetails', () => {
    it('should return undefined when share is undefined', () => {
      expect(selectShareDetails(undefined)).toBeUndefined();
    });

    it('should return mapped view when share is defined', () => {
      const share: TShare = {
        id: 'share-1',
        name: 'My Share',
        region: 'GRA9',
        protocol: 'NFS',
        size: 161061273600,
        status: 'available',
        type: 'nfs',
        createdAt: '2026-01-30T09:35:49.615Z',
        description: '',
        isPublic: false,
        enabledActions: [],
        mountPaths: [],
      };

      const result = selectShareDetails(share);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        id: 'share-1',
        name: 'My Share',
        region: 'GRA9',
        protocol: 'NFS',
        size: 161061273600,
        status: 'available',
        regionDisplayKey: 'regions:manager_components_region_GRA_micro',
      });
      expect(result?.statusDisplay).toEqual({
        labelKey: 'status:active',
        badgeColor: 'success',
      });
      expect(result?.enabledActions).toEqual([]);
    });
  });
});
