import { describe, expect, it } from 'vitest';

import type { TShare } from '@/domain/entities/share.entity';

import { canShareBeDeleted } from '../share.service';

const createShare = (overrides: Partial<TShare> = {}): TShare =>
  ({
    id: 'share-1',
    name: 'My Share',
    region: 'GRA9',
    protocol: 'NFS',
    size: 100,
    status: 'available',
    type: 'nfs',
    createdAt: '2025-01-01',
    description: '',
    isPublic: false,
    enabledActions: [],
    mountPaths: [],
    ...overrides,
  }) as TShare;

describe('share.service', () => {
  describe('canShareBeDeleted', () => {
    it.each([
      {
        description: 'should return false when share is undefined',
        share: undefined,
        expected: false,
      },
      {
        description: 'should return false when enabledActions does not include delete',
        share: createShare({ enabledActions: ['edit', 'update_size'] }),
        expected: false,
      },
      {
        description: 'should return false when enabledActions is empty',
        share: createShare({ enabledActions: [] }),
        expected: false,
      },
      {
        description: 'should return true when enabledActions includes delete',
        share: createShare({ enabledActions: ['delete'] }),
        expected: true,
      },
      {
        description: 'should return true when enabledActions includes delete among others',
        share: createShare({ enabledActions: ['edit', 'delete', 'update_size'] }),
        expected: true,
      },
    ])('$description', ({ share, expected }) => {
      expect(canShareBeDeleted(share)).toBe(expected);
    });
  });
});
