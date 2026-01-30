import { describe, expect, it, vi } from 'vitest';

import { mapShareToShareListRow } from '../shareList.mapper';

vi.mock('@ovh-ux/muk', () => ({
  getMacroRegion: vi.fn((region: string) => (region === 'GRA9' ? 'GRA' : region)),
}));

describe('mapShareToShareListRow', () => {
  it('should map domain share to list row with region display key', () => {
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
    };

    const result = mapShareToShareListRow(share);

    expect(result).toEqual({
      id: 'share-1',
      name: 'My Share',
      region: 'GRA9',
      regionDisplayKey: 'regions:manager_components_region_GRA_micro',
      protocol: 'NFS',
      size: 161061273600,
      status: 'available',
      statusDisplay: { labelKey: 'list:status.active', badgeColor: 'success' },
    });
  });
});
