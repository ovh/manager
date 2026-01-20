import { describe } from 'vitest';
import {
  mockedInstancesCatalogEntity,
  mockedProjectId,
} from '@/__mocks__/instance/constants';
import { Deps } from '@/deps/deps';
import { isMicroRegionAvailable } from '../microRegionsViewModel';

const fakeDeps: Deps = {
  instancesCatalogPort: {
    selectInstancesCatalog: vi
      .fn()
      .mockReturnValue(mockedInstancesCatalogEntity),
  },
  instancePort: {
    createInstance: vi.fn(),
  },
};

describe('selectMicroRegionAvailability ViewModel', () => {
  type Data = {
    macroRegionId: string;
    available: boolean;
  };

  describe.each`
    macroRegionId        | available
    ${'GRA'}             | ${true}
    ${'GRA'}             | ${true}
    ${'BHS'}             | ${false}
    ${'EU-SOUTH-LZ-MIL'} | ${false}
    ${'PAR'}             | ${true}
  `('Given an input <$macroRegionId>', ({ macroRegionId, available }: Data) => {
    test(`Then, expect the region to be ${
      available ? 'available' : 'unavailable'
    }'`, () => {
      expect(
        isMicroRegionAvailable(fakeDeps)(mockedProjectId, macroRegionId),
      ).toStrictEqual(available);
    });
  });
});
