import { describe, expect, it } from 'vitest';

import type { TShare } from '@/domain/entities/share.entity';
import { selectCanManageAcl } from '@/pages/dashboard/Acl/acl.view-model';

describe('acl view model', () => {
  describe('selectCanManageAcl', () => {
    it.each([
      { label: 'undefined share', share: undefined, expected: false },
      {
        label: 'empty enabledActions',
        share: { enabledActions: [] } as unknown as TShare,
        expected: false,
      },
      {
        label: 'enabledActions without acl_management',
        share: { enabledActions: ['edit', 'delete'] } as unknown as TShare,
        expected: false,
      },
      {
        label: 'enabledActions with acl_management',
        share: { enabledActions: ['edit', 'acl_management'] } as unknown as TShare,
        expected: true,
      },
      {
        label: 'only acl_management',
        share: { enabledActions: ['acl_management'] } as unknown as TShare,
        expected: true,
      },
    ])('should return $expected when $label', ({ share, expected }) => {
      expect(selectCanManageAcl(share)).toBe(expected);
    });
  });
});
