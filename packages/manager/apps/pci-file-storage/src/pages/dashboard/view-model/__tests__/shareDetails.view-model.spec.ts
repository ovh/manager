import { describe, expect, it, vi } from 'vitest';

import { TNetwork } from '@/domain/entities/network.entity';
import { TShare } from '@/domain/entities/share.entity';

import { selectNetworkDetails, selectShareDetails } from '../shareDetails.view-model';

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
        network: { id: 'network-1' },
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

  describe('selectNetworkDetails', () => {
    it('should return undefined when network is undefined', () => {
      expect(selectNetworkDetails(undefined)).toBeUndefined();
    });

    it('should return mapped view with name when network has name', () => {
      const network = {
        id: 'network-1',
        name: 'My Network',
        vlanId: 123,
        region: 'GRA9',
      } as TNetwork;

      const result = selectNetworkDetails(network);

      expect(result).toBeDefined();
      expect(result).toEqual({
        id: 'network-1',
        displayName: 'My Network',
      });
    });

    it('should return mapped view with vlanId when network has no name', () => {
      const network = {
        id: 'network-2',
        vlanId: 456,
        region: 'GRA9',
      } as TNetwork;

      const result = selectNetworkDetails(network);

      expect(result).toBeDefined();
      expect(result).toEqual({
        id: 'network-2',
        displayName: 456,
      });
    });

    it('should return mapped view with id when network has neither name nor vlanId', () => {
      const network = {
        id: 'network-3',
        region: 'GRA9',
      } as TNetwork;

      const result = selectNetworkDetails(network);

      expect(result).toBeDefined();
      expect(result).toEqual({
        id: 'network-3',
        displayName: 'network-3',
      });
    });
  });
});
