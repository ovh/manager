import { describe, expect, it } from 'vitest';

import type { TShare } from '@/domain/entities/share.entity';

import { selectShareDeletionView } from '../deleteShare.view-model';

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

describe('deleteShare view model', () => {
  describe('selectShareDeletionView', () => {
    it.each([
      {
        description: 'should return empty shareName and canBeDeleted false when share is undefined',
        share: undefined,
        expected: { shareName: undefined, canBeDeleted: false },
      },
      {
        description:
          'should return shareName and canBeDeleted false when delete not in enabledActions',
        share: createShare({ name: 'Test Share', enabledActions: ['edit'] }),
        expected: { shareName: 'Test Share', canBeDeleted: false },
      },
      {
        description: 'should return shareName and canBeDeleted true when delete in enabledActions',
        share: createShare({ name: 'Deletable Share', enabledActions: ['delete'] }),
        expected: { shareName: 'Deletable Share', canBeDeleted: true },
      },
    ])('$description', ({ share, expected }) => {
      const result = selectShareDeletionView(share);

      expect(result).toEqual(expected);
    });
  });
});
