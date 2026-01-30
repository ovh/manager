import { describe, expect, it } from 'vitest';

import { mapShareToShareListRow } from '../shareList.mapper';

describe('mapShareToShareListRow', () => {
  it('should map domain share to list row', () => {
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
      protocol: 'NFS',
      size: 161061273600,
      status: 'available',
    });
  });
});
