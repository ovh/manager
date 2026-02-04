import { describe, expect, it, vi } from 'vitest';

import { mapShareToShareListRow, shareEnabledActionsToMenuActions } from '../shareList.mapper';

vi.mock('@ovh-ux/muk', () => ({
  getMacroRegion: vi.fn((region: string) => (region === 'GRA9' ? 'GRA' : region)),
}));

describe('shareEnabledActionsToMenuActions', () => {
  it('should return only manage action when enabledActions is empty', () => {
    const result = shareEnabledActionsToMenuActions('share-1', []);
    expect(result.get('actions')).toEqual([
      { label: 'list:actions.manage', link: { path: './share-1' } },
    ]);
  });

  it('should return manage and delete when enabledActions includes delete', () => {
    const result = shareEnabledActionsToMenuActions('share-2', ['delete']);
    expect(result.get('actions')).toEqual([
      { label: 'list:actions.manage', link: { path: './share-2' } },
      {
        label: 'list:actions.delete',
        link: { path: './share-2/delete' },
        isCritical: true,
      },
    ]);
  });
});

describe('mapShareToShareListRow', () => {
  it('should map domain share to list row with region display key and actions', () => {
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
    };

    const result = mapShareToShareListRow(share);

    expect(result.id).toBe('share-1');
    expect(result.name).toBe('My Share');
    expect(result.region).toBe('GRA9');
    expect(result.regionDisplayKey).toBe('regions:manager_components_region_GRA_micro');
    expect(result.protocol).toBe('NFS');
    expect(result.size).toBe(161061273600);
    expect(result.status).toBe('available');
    expect(result.statusDisplay).toEqual({
      labelKey: 'list:status.active',
      badgeColor: 'success',
    });
    expect(result.actions.get('actions')).toEqual([
      { label: 'list:actions.manage', link: { path: './share-1' } },
    ]);
  });

  it('should include delete action when enabledActions has delete', () => {
    const share = {
      id: 'share-2',
      name: 'Another Share',
      region: 'GRA9',
      protocol: 'NFS',
      size: 53687091200,
      status: 'available' as const,
      type: 'nfs',
      createdAt: '2026-01-30T10:00:00.000Z',
      description: '',
      isPublic: false,
      enabledActions: ['delete'] as const,
    };

    const result = mapShareToShareListRow(share);

    expect(result.actions.get('actions')).toEqual([
      { label: 'list:actions.manage', link: { path: './share-2' } },
      {
        label: 'list:actions.delete',
        link: { path: './share-2/delete' },
        isCritical: true,
      },
    ]);
  });
});
