import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOvhInstanceName } from '@/domain/services/instance.service';
import { selectOvhInstanceName } from '../instanceNameViewModel';
import { mockedInstancesCatalogEntity } from '@/__mocks__/instance/constants';

const MOCKED_INSTANCE_NAME = 'mocked-instance-name';

vi.mock('@/domain/services/instance.service', () => ({
  getOvhInstanceName: vi.fn(() => MOCKED_INSTANCE_NAME),
}));

describe('instanceNameViewModel', () => {
  describe('selectOvhInstanceName', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('returns null when regionalizedFlavorId is null', () => {
      const selector = selectOvhInstanceName(null);

      expect(selector(mockedInstancesCatalogEntity)).toBeNull();
      expect(getOvhInstanceName).not.toHaveBeenCalled();
    });

    it('returns null when catalog is undefined', () => {
      const selector = selectOvhInstanceName('d2-2_GRA-STAGING-A');

      expect(selector(undefined)).toBeNull();
      expect(getOvhInstanceName).not.toHaveBeenCalled();
    });

    it('returns null when both catalog and regionalizedFlavorId are null/undefined', () => {
      const selector = selectOvhInstanceName(null);

      expect(selector(undefined)).toBeNull();
      expect(getOvhInstanceName).not.toHaveBeenCalled();
    });

    it('delegates to getOvhInstanceName when catalog and regionalizedFlavorId are provided', () => {
      const selector = selectOvhInstanceName('d2-2_GRA-STAGING-A');

      expect(selector(mockedInstancesCatalogEntity)).toBe(MOCKED_INSTANCE_NAME);
      expect(getOvhInstanceName).toHaveBeenCalledWith(
        mockedInstancesCatalogEntity,
        'd2-2_GRA-STAGING-A',
      );
    });
  });
});
