/* eslint-disable max-lines-per-function */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOvhInstanceName } from '../instance.service';
import { mockedInstancesCatalogEntity } from '@/__mocks__/instance/constants';
import { TInstancesCatalog } from '@/domain/entities/instancesCatalog';

const CURRENT_DATE_MOCK = '2025_02_06 12:00';

vi.mock('date-fns', () => ({
  format: vi.fn(() => CURRENT_DATE_MOCK),
}));

describe('instance.service', () => {
  describe('getOvhInstanceName', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('returns flavor name and formatted date when regionalizedFlavor and flavor exist', () => {
      const result = getOvhInstanceName(
        mockedInstancesCatalogEntity,
        'd2-2_GRA-STAGING-A',
      );

      expect(result).toBe(`d2-2 ${CURRENT_DATE_MOCK}`);
    });

    it('returns null when regionalizedFlavorId is not in catalog', () => {
      const result = getOvhInstanceName(
        mockedInstancesCatalogEntity,
        'unknown-regionalized-flavor-id',
      );

      expect(result).toBeNull();
    });

    it('returns "instance" and date when regionalizedFlavor exists but flavor is missing', () => {
      const orphanRegionalizedFlavorId = 'orphan_GRA';
      const catalogWithOrphanRegionalizedFlavor: TInstancesCatalog = {
        ...mockedInstancesCatalogEntity,
        entities: {
          ...mockedInstancesCatalogEntity.entities,
          regionalizedFlavors: {
            byId: new Map([
              ...mockedInstancesCatalogEntity.entities.regionalizedFlavors.byId,
              [
                orphanRegionalizedFlavorId,
                {
                  id: orphanRegionalizedFlavorId,
                  regionId: 'GRA11',
                  flavorId: 'orphan',
                  hasStock: true,
                  quota: 0,
                  osTypes: ['linux'],
                  tags: null,
                },
              ],
            ]),
            allIds: [
              ...mockedInstancesCatalogEntity.entities.regionalizedFlavors
                .allIds,
              orphanRegionalizedFlavorId,
            ],
          },
        },
      };

      const result = getOvhInstanceName(
        catalogWithOrphanRegionalizedFlavor,
        orphanRegionalizedFlavorId,
      );

      expect(result).toBe(`instance ${CURRENT_DATE_MOCK}`);
    });
  });
});
