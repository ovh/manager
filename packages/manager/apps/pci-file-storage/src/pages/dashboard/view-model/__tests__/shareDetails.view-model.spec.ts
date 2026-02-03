import { describe, expect, it, vi } from 'vitest';

import { TShareDetailsView } from '@/adapters/shares/left/shareDetails.data';
import { mapShareToShareDetailsView } from '@/adapters/shares/left/shareDetails.mapper';
import { TShare } from '@/domain/entities/share.entity';

import { selectShareDetails } from '../shareDetails.view-model';

vi.mock('@/adapters/shares/left/shareDetails.mapper', () => ({
  mapShareToShareDetailsView: vi.fn(),
}));

describe('shareDetails view model', () => {
  describe('selectShareDetails', () => {
    it('should return undefined when share is undefined', () => {
      expect(selectShareDetails(undefined)).toBeUndefined();
      expect(mapShareToShareDetailsView).not.toHaveBeenCalled();
    });

    it('should return mapped view when share is defined', () => {
      const share = { id: 'share-1', region: 'GRA9' } as TShare;
      const expected = { id: 'share-1', name: 'My Share' } as TShareDetailsView;
      vi.mocked(mapShareToShareDetailsView).mockReturnValue(expected);

      const result = selectShareDetails(share);

      expect(result).toBe(expected);
      expect(mapShareToShareDetailsView).toHaveBeenCalledTimes(1);
      expect(mapShareToShareDetailsView).toHaveBeenCalledWith(share);
    });
  });
});
